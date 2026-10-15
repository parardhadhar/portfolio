import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import './WorldCompanion.css';
import CharacterSprite from './CharacterSprite';

const missions = [
  ['dawn', 'Chase the light', 'Visit both day and night.'],
  ['reader', 'Open a field dossier', 'Explore any selected project.'],
  ['wanderer', 'Follow your curiosity', 'Reach the personal pinboard.'],
  ['sprite', 'Meet the locals', 'Find a creature hiding in the valley.'],
  ['hello', 'A little hello', 'Tap your travelling companion.'],
] as const;

export default function WorldCompanion({night,active,collected}:{night:boolean;active:string;collected:string[]}) {
 const [done,setDone]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('field-missions')||'[]');}catch{return [];}});
 const [journal,setJournal]=useState(false);
 const [greeting,setGreeting]=useState(false);
 const [toast,setToast]=useState('');
 const [seen,setSeen]=useState<boolean|null>(null);
 const [secret,setSecret]=useState(false);
 useEffect(()=>{
  let sequence='';let timer:ReturnType<typeof setTimeout>;
  const key=(e:KeyboardEvent)=>{
   if((e.target as HTMLElement).closest('input,textarea,[contenteditable=true]')||e.ctrlKey||e.metaKey||e.altKey)return;
   sequence=(sequence+e.key.toLowerCase()).slice(-9);
   if(sequence==='curiosity'){setSecret(true);clearTimeout(timer);timer=setTimeout(()=>setSecret(false),4500);}
   if(e.key==='Escape')setSecret(false);
  };
  window.addEventListener('keydown',key);return()=>{window.removeEventListener('keydown',key);clearTimeout(timer);};
 },[]);
 const earn=(id:string)=>setDone(prev=>prev.includes(id)?prev:[...prev,id]);
 useEffect(()=>{localStorage.setItem('field-missions',JSON.stringify(done));if(done.length)setToast(missions.find(m=>m[0]===done[done.length-1])?.[1]||'');},[done]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(timer);},[toast]);
 useEffect(()=>{if(seen===null)setSeen(night);else if(seen!==night)earn('dawn');},[night,seen]);
 useEffect(()=>{if(collected.some(id=>id.startsWith('project')))earn('reader');if(collected.includes('hello'))earn('hello');},[collected]);
 useEffect(()=>{if(active==='about')earn('wanderer');},[active]);
 const activity=greeting?'wave':active==='work'||active==='toolkit'?'code':active==='research'?'study':active==='journey'?'walk':active==='about'||active==='contact'?'wave':'wonder';
 const label={code:'Shipping a little magic.',study:'Looking for the invisible.',walk:'One curious step at a time.',wave:'Hey, fellow curious human!',wonder:night?'Counting possibilities, and stars.':'A good day for a new idea.'}[activity];
 return <>
  <div className={`world-weather ${night?'is-night':'is-day'}`} aria-hidden="true"><span className="celestial"/>{Array.from({length:12},(_,i)=><i key={i} style={{'--n':i} as CSSProperties}/>)}</div>
  <div className="valley-locals">{[0,1,2].map(i=><button key={i} className={`local-sprite local-${i} ${done.includes('sprite')?'befriended':''}`} aria-label={`Discover ${night?'a firefly spirit':'a meadow butterfly'} ${i+1}`} onClick={()=>earn('sprite')}>{night?<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="24" rx="5" ry="9" fill="#e4db88"/><ellipse cx="12" cy="18" rx="8" ry="4" transform="rotate(-30 12 18)" fill="#e5eecc88"/><ellipse cx="28" cy="18" rx="8" ry="4" transform="rotate(30 28 18)" fill="#e5eecc88"/><circle cx="20" cy="14" r="4" fill="#53684a"/></svg>:<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M19 20C-5-8-5 32 18 25 3 40 29 43 20 22" fill="#e6b869"/><path d="M21 20C45-8 45 32 22 25 37 40 11 43 20 22" fill="#9ab7be"/><path d="M20 15v16m0-15-4-6m4 6 4-6" fill="none" stroke="#4d4936" strokeWidth="2"/></svg>}</button>)}</div>
  <aside className={`companion-station ${active==='home'?'at-home':''}`} aria-label="Parardha’s animated companion">
   <span className="companion-caption" key={label}>{label}</span>
   <button className={`little-maker activity-${activity}`} aria-label="Say hello to Parardha’s companion" onClick={()=>{earn('hello');setGreeting(true);setTimeout(()=>setGreeting(false),2600);}}>
    <CharacterSprite pose={activity==='code'?'code':activity==='study'?'study':activity==='walk'?'walk':'wave'}/>
   </button>
  </aside>
  <button className="mission-toggle" aria-expanded={journal} aria-controls="mission-journal" onClick={()=>setJournal(!journal)}><span>✳</span> Field missions <b>{done.length}/5</b></button>
  {journal&&<aside id="mission-journal" className="mission-journal"><button className="journal-close" onClick={()=>setJournal(false)} aria-label="Close missions">×</button><small>THE EXPLORER’S JOURNAL</small><h3>Take the scenic route.</h3><p>Five small detours. A little more wonder.</p><ul>{missions.map(([id,title,hint])=><li key={id} className={done.includes(id)?'complete':''}><span>{done.includes(id)?'✓':'○'}</span><div><strong>{title}</strong><small>{hint}</small></div></li>)}</ul>{done.length===5&&<div className="explorer-reward">✺ Honorary curious mind.<br/><small>You found the magic in the details.</small></div>}{done.length>0&&<button className="journal-reset" onClick={()=>{setDone([]);setSeen(night);setToast('' );}}>Start a fresh journal ↻</button>}</aside>}
  <div className={`mission-toast ${toast?'visible':''}`} role="status">✧ Discovery unlocked · {toast}</div>
  {secret&&<div className="secret-sky" role="status"><span>✺</span><strong>The best things begin with “what if?”</strong><small>YOU FOUND THE SECRET OBSERVATORY · ESC TO RETURN</small></div>}
 </>;
}
