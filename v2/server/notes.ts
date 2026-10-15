import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { dirname, resolve } from 'node:path';

export type VisitorNote={id:string;name:string;role:string;message:string;color:string;createdAt:string;github?:string};
type Options={storagePath?:string;remoteRequired?:boolean;rateWindow?:number};
const colors=['butter','mint','lilac','sky','peach'];

export function createNotesHandler(options:Options={}){
 const file=options.storagePath||resolve(process.cwd(),'.local/visitor-notes.json');
 const rates=new Map<string,number>();let queue:Promise<unknown>=Promise.resolve();
 const remoteUrl=process.env.UPSTASH_REDIS_REST_URL,remoteToken=process.env.UPSTASH_REDIS_REST_TOKEN;
 const redis=async(command:(string|number)[])=>{const response=await fetch(remoteUrl!,{method:'POST',headers:{Authorization:`Bearer ${remoteToken}`,'Content-Type':'application/json'},body:JSON.stringify(command)});if(!response.ok)throw Error('Note storage is unavailable.');const data=await response.json() as {result:unknown;error?:string};if(data.error)throw Error('Note storage is unavailable.');return data.result;};
 const load=async():Promise<VisitorNote[]>=>{
  if(remoteUrl&&remoteToken){const result=await redis(['LRANGE','portfolio:visitor-notes',0,199]) as string[];return result.map(n=>JSON.parse(n) as VisitorNote);}
  if(options.remoteRequired)throw Error('The public note wall is being connected. Please try again soon.');
  try{return JSON.parse(await readFile(file,'utf8')) as VisitorNote[];}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return [];throw e;}
 };
 const save=async(note:VisitorNote)=>{
  if(remoteUrl&&remoteToken){await redis(['LPUSH','portfolio:visitor-notes',JSON.stringify(note)]);await redis(['LTRIM','portfolio:visitor-notes',0,199]);return;}
  const work=queue.then(async()=>{const notes=await load();await mkdir(dirname(file),{recursive:true});const temp=`${file}.${randomUUID()}.tmp`;await writeFile(temp,JSON.stringify([note,...notes].slice(0,200)),{encoding:'utf8',mode:0o600});await rename(temp,file);});queue=work.catch(()=>{});await work;
 };
 return async(req:IncomingMessage,res:ServerResponse)=>{
  const send=(status:number,data:unknown)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  try{
   if(req.method==='GET'){send(200,{notes:await load()});return;}
   if(req.method!=='POST'){res.setHeader('Allow','GET, POST');send(405,{error:'This action is not available.'});return;}
   if(!req.headers['content-type']?.includes('application/json')){send(415,{error:'Please send your note using the form.'});return;}
   // The form is same-origin. Reject browser submissions from other websites.
   if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host){send(403,{error:'Please submit your note from this portfolio.'});return;}
   let size=0;const chunks:Buffer[]=[];
   for await(const chunk of req){const data=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk as string);size+=data.length;if(size>8192){send(413,{error:'That note is a little too long.'});return;}chunks.push(data);}
   let input:Record<string,unknown>;try{input=JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string,unknown>;}catch{send(400,{error:'Please check your note and try again.'});return;}
   if(!input||typeof input!=='object'||Array.isArray(input)){send(400,{error:'Please complete the note form.'});return;}
   if(input.website){send(400,{error:'Please try again.'});return;}
   const name=typeof input.name==='string'?input.name.trim():'',role=typeof input.role==='string'?input.role.trim():'',message=typeof input.message==='string'?input.message.trim():'';
   const github=typeof input.github==='string'?input.github.trim():'';
   if(github&&!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(github)){send(400,{error:'Please check the GitHub username, or leave it blank.'});return;}
   if(!name||name.length>60||message.length<3||message.length>280||role.length>80){send(400,{error:'Add your name and a note between 3 and 280 characters.'});return;}
   const client=String(req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown').split(',')[0].trim();
   const key=createHash('sha256').update(client).digest('hex').slice(0,24),now=Date.now(),windowMs=options.rateWindow??60000;
   if(remoteUrl&&remoteToken&&windowMs>0){const allowed=await redis(['SET',`portfolio:note-rate:${key}`,'1','NX','EX',Math.ceil(windowMs/1000)]);if(!allowed){send(429,{error:'Thanks for stopping by. Give the next note a minute.'});return;}}
   else if(windowMs>0){if(now-(rates.get(key)||0)<windowMs){send(429,{error:'Thanks for stopping by. Give the next note a minute.'});return;}rates.set(key,now);if(rates.size>1000)for(const[k,time]of rates)if(now-time>windowMs)rates.delete(k);}
   const note:VisitorNote={id:randomUUID(),name,role,message,color:colors.includes(String(input.color))?String(input.color):'butter',createdAt:new Date().toISOString(),...(github?{github}:{})};
   await save(note);send(201,{note});
  }catch(error){send(503,{error:error instanceof Error&&error.message.startsWith('The public')?error.message:'The wall is taking a short break. Your note wasn’t posted. Please try again.'});}
 };
}

