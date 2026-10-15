import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createNotesHandler } from '../server/notes.ts';

test('visitor notes persist on the server and are shared across requests',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'portfolio-notes-'));
 const file=join(dir,'notes.json');const server=createServer(createNotesHandler({storagePath:file,rateWindow:0}));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}`;
 const post=body=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 try{
  assert.deepEqual((await(await fetch(url)).json()).notes,[]);
  const response=await post({name:'Visitor',role:'Maker',message:'A real note from a visitor.',color:'mint',github:'octocat'});
  assert.equal(response.status,201);const saved=(await response.json()).note;assert.equal(saved.github,'octocat');
  const otherBrowser=await(await fetch(url)).json();assert.equal(otherBrowser.notes[0].id,saved.id);
  assert.equal(JSON.parse(await readFile(file,'utf8'))[0].message,'A real note from a visitor.');
  // A fresh handler reads the same persistent store after a server restart.
  const restarted=createServer(createNotesHandler({storagePath:file,rateWindow:0}));
  await new Promise(resolve=>restarted.listen(0,'127.0.0.1',resolve));
  const restored=await(await fetch(`http://127.0.0.1:${restarted.address().port}`)).json();assert.equal(restored.notes[0].id,saved.id);
  await new Promise(resolve=>restarted.close(resolve));
  assert.equal((await post({name:'',message:'hello'})).status,400);
  assert.equal((await post({name:'Spam',message:'a'.repeat(281)})).status,400);
  assert.equal((await post({name:'Bot',message:'spam',website:'filled'})).status,400);
  assert.equal((await post({name:'Visitor',message:'A valid note.',github:'../../malformed'})).status,400);
  const cross=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://another-site.example'},body:JSON.stringify({name:'Other',message:'No cross-site writes'})});assert.equal(cross.status,403);
  const writes=await Promise.all(Array.from({length:4},(_,i)=>post({name:`Maker ${i}`,message:`Concurrent note ${i}`})));
  assert.ok(writes.every(r=>r.status===201));assert.equal((await(await fetch(url)).json()).notes.length,5);
 }finally{await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});}
});

test('note submissions are rate limited without exposing visitor addresses',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'portfolio-note-rate-'));const file=join(dir,'notes.json');
 const server=createServer(createNotesHandler({storagePath:file}));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}`;
 try{const options={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Visitor',message:'A kind hello.'})};assert.equal((await fetch(url,options)).status,201);assert.equal((await fetch(url,options)).status,429);assert.ok(!(await readFile(file,'utf8')).includes('127.0.0.1'));}
 finally{await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});}
});

