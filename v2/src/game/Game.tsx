import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Volume2, VolumeX, RotateCcw, Map, X, Navigation, Zap, CircleHelp } from 'lucide-react';
import { destinations, projects, type DestinationId } from './data';
import { IslandAudio } from './audio';
import type { WorldController, WorldState } from './World';
import './Game.css';
const World = lazy(() => import('./World'));

export default function Game() {
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [panel, setPanel] = useState<DestinationId | 'map' | 'help' | null>(null);
  const [sound, setSound] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const [state, setState] = useState<WorldState>({ speed: 0, collected: 0, nearby: null, x: 0, z: 5 });
  const controller = useRef<WorldController | null>(null);
  const audio = useRef<IslandAudio | null>(null);
  const previousCount = useRef(0);
  const modal = useRef<HTMLDivElement>(null);
  const live = useRef({started, panel, nearby: state.nearby});
  useEffect(() => { live.current = {started,panel,nearby:state.nearby}; }, [started,panel,state.nearby]);
  useEffect(() => { controller.current?.pause(!started || !!panel); }, [started,panel]);
  useEffect(() => {
    audio.current = new IslandAudio();
    const onKey=(event: KeyboardEvent)=>{
      const target=event.target as HTMLElement;
      if(target.closest('input,textarea,[contenteditable="true"]')) return;
      if(event.key==='Escape')setPanel(null);
      if(event.key.toLowerCase()==='m'){event.preventDefault();setPanel(previous=>previous==='map'?null:'map');}
      if(event.key==='Enter' && live.current.started && !live.current.panel && live.current.nearby)setPanel(live.current.nearby);
      if(event.key.toLowerCase()==='r' && !live.current.panel)controller.current?.reset();
    };
    window.addEventListener('keydown',onKey); return()=>{window.removeEventListener('keydown',onKey);audio.current?.dispose();};
  },[]);
  useEffect(()=>{
    if(!panel)return;
    const previous=document.activeElement as HTMLElement|null;
    const dialog=modal.current; dialog?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')setPanel(null);if(event.key==='Tab'&&dialog){const controls=Array.from(dialog.querySelectorAll<HTMLElement>('a[href],button'));const first=controls[0];const last=controls[controls.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}};
    document.addEventListener('keydown',onKey);return()=>{document.removeEventListener('keydown',onKey);previous?.focus();};
  },[panel]);
  const update=(next:WorldState)=>{setState(next);if(next.collected>previousCount.current)audio.current?.collect();previousCount.current=next.collected;};
  const toggleSound=async()=>{try{setSound(await audio.current!.toggle());setSoundError(false);}catch{setSoundError(true);}};
  const visit=(id:DestinationId)=>{setStarted(true);controller.current?.travel(id);setPanel(null);};
  return <div className="island-app">
    <div className="world-view"><Suspense fallback={<div className="world-loading"><span />BUILDING A LITTLE WORLD…</div>}><World onReady={api=>{controller.current=api;api.pause(!live.current.started||!!live.current.panel);setLoaded(true);}} onState={update} onError={()=>{setFailed(true);setLoaded(true);}} /></Suspense></div>
    <div className="world-vignette" />
    <header className="game-header"><a href="#" onClick={event=>{event.preventDefault();setPanel('about');}} className="game-brand">pd<span>®</span><small>PARARDHA DHAR<br />A WORLD OF POSSIBILITIES</small></a><div className="game-top-actions"><button className="directory-button" onClick={()=>setPanel('map')}><Map size={15} /><span>Explore the island</span></button><button className="game-icon" aria-label={sound?'Mute music':'Enable music'} aria-pressed={sound} onClick={()=>void toggleSound()}>{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}</button><button className="game-icon" aria-label="How to play" onClick={()=>setPanel('help')}><CircleHelp size={18}/></button></div></header>
    {!started && <div className="arrival"><p className="game-eyebrow"><span /> PERSONAL PORTFOLIO / PLAYABLE EDITION</p><h1>A little world.<br />A lot of <em>ideas.</em></h1><p className="arrival-description">I’m Parardha. Engineer, world builder,<br />and relentlessly curious human.<br />Take the scenic route through my work.</p><button className="enter-world" disabled={!loaded||failed} onClick={()=>setStarted(true)}>{failed?'3D unavailable':loaded?'Let’s go for a drive':'Preparing your ride…'}<ArrowUpRight size={20}/></button><button className="skip-drive" onClick={()=>setPanel('map')}>Just here for the portfolio? <span>Take a shortcut ↗</span></button><div className="arrival-meta"><span>01 LITTLE ISLAND</span><span>04 PLACES TO DISCOVER</span><span>∞ CURIOSITY</span></div></div>}
    {started&&!panel&&<><div className="quest-card"><span className="game-eyebrow">A SMALL SIDE QUEST</span><strong>{state.collected===12?'You found your spark.':'Follow your curiosity.'}</strong><p>{state.collected===12?'All 12 energy cells collected. Keep exploring!':'Collect the glowing cells around the island.'}</p><div><Zap size={16}/><b>{String(state.collected).padStart(2,'0')}</b><span>/ 12 ENERGY CELLS</span></div></div><div className="location-prompt">{state.nearby?<button onClick={()=>setPanel(state.nearby)}><span className="interaction-key">↵</span> Explore {destinations.find(d=>d.id===state.nearby)?.name}<ArrowUpRight size={18}/></button>:<span>DRIVE UP TO A FLAG TO DISCOVER MORE</span>}</div><div className="drive-hud"><div className="speedometer"><strong>{String(Math.round(state.speed*7)).padStart(2,'0')}</strong><span>KM/H<br />JUST EXPLORING</span></div><button className="reset-button" onClick={()=>controller.current?.reset()}><RotateCcw size={14}/> Unstuck</button></div><div className="mini-map" aria-label="Island map"><div className="map-road"/>{destinations.map(d=><button key={d.id} style={{left:`${50+d.x*1.1}%`,top:`${50+d.z*1.1}%`,background:d.color}} aria-label={`Travel to ${d.name}`} onClick={()=>visit(d.id)}>{d.number}</button>)}<i style={{left:`${50+state.x*1.1}%`,top:`${50+state.z*1.1}%`}}/></div><div className="touch-controls" aria-label="Driving controls">{[['left',ArrowLeft],['up',ArrowUp],['down',ArrowDown],['right',ArrowRight]].map(([direction,Icon])=>{const key=direction as string;const ControlIcon=Icon as typeof ArrowUp;return <button key={key} aria-label={`Drive ${key}`} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);controller.current?.input(key,true);}} onPointerUp={()=>controller.current?.input(key,false)} onPointerCancel={()=>controller.current?.input(key,false)} onLostPointerCapture={()=>controller.current?.input(key,false)}><ControlIcon size={22}/></button>;})}<button className="boost-control" aria-label="Boost" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);controller.current?.input('boost',true);}} onPointerUp={()=>controller.current?.input('boost',false)} onPointerCancel={()=>controller.current?.input('boost',false)} onLostPointerCapture={()=>controller.current?.input('boost',false)}><Zap size={22}/></button></div></>}
    <footer className="game-footer"><span>DESIGNED TO WANDER. BUILT TO DISCOVER.</span><span className="desktop-controls">W A S D / ARROWS <i>DRIVE</i> SHIFT <i>BOOST</i> ENTER <i>EXPLORE</i></span><span>© PARARDHA DHAR 2026</span></footer>
    {soundError&&<p className="audio-notice" role="status">Audio couldn’t start. Try the music button again.</p>}
    {failed&&<div className="world-fallback"><Navigation size={38}/><p>Your browser couldn’t start the 3D world.<br />You can still explore every part of my portfolio.</p><button onClick={()=>setPanel('map')}>Open portfolio directory</button></div>}
    {panel&&<div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)setPanel(null);}}><div className="portfolio-modal" ref={modal} role="dialog" aria-modal="true" aria-labelledby="panel-title"><button className="modal-close" aria-label="Close panel" onClick={()=>setPanel(null)}><X size={20}/></button>
      {panel==='map'?<><p className="game-eyebrow">YOUR ISLAND DIRECTORY</p><h2 id="panel-title">Choose your<br /><em>own adventure.</em></h2><p>Drive there, or jump straight into the story.</p><div className="destination-list">{destinations.map(d=><div key={d.id}><span style={{background:d.color}}>{d.number}</span><button onClick={()=>setPanel(d.id)}><small>{d.category}</small><strong>{d.name}</strong></button><button className="travel-button" disabled={failed} aria-label={`Drive to ${d.name}`} onClick={()=>visit(d.id)}><Navigation size={19}/></button></div>)}</div></>:
      panel==='help'?<><p className="game-eyebrow">NO LICENSE REQUIRED</p><h2 id="panel-title">Take it<br /><em>for a spin.</em></h2><div className="help-list"><p><kbd>W A S D</kbd> or <kbd>↑ ← ↓ →</kbd><span>Accelerate, reverse and steer</span></p><p><kbd>SHIFT</kbd><span>A little extra speed</span></p><p><kbd>ENTER</kbd><span>Explore the nearest destination</span></p><p><kbd>M</kbd><span>Open the island directory</span></p><p><kbd>R</kbd><span>Return to the starting point</span></p></div><p>On a phone or tablet, use the arrow buttons. Find all 12 glowing cells, visit the four destinations, and take your time. Music is optional—switch it on using the speaker button.</p></>:
      panel==='about'?<><p className="game-eyebrow">01 / THE STUDIO</p><h2 id="panel-title">Engineer’s mind.<br /><em>Explorer’s heart.</em></h2><div className="about-profile"><img src="/photo.png" alt="Parardha Dhar"/><div><h3>Hi, I’m Parardha.</h3><p>A software engineer and AI enthusiast studying Computer Science at VIT Bhopal University. I work across full-stack development, intelligent systems, and immersive environments in Unreal Engine.</p><p>I like building things that feel considered—from the architecture underneath to the experience on the surface.</p></div></div><a className="modal-link" href="/Parardha_Dhar_CV_0.pdf" target="_blank" rel="noreferrer">Read my resume <ArrowUpRight size={18}/></a></>:
      panel==='work'?<><p className="game-eyebrow">02 / PROJECT PARK</p><h2 id="panel-title">Some things<br /><em>I’ve put into the world.</em></h2><div className="game-projects">{projects.map(project=><a key={project.title} href={project.href} target={project.href.startsWith('http')?'_blank':undefined} rel="noreferrer"><img src={project.image} alt={project.title} loading="lazy"/><small>{project.type}</small><h3>{project.title}<ArrowUpRight size={18}/></h3><p>{project.text}</p></a>)}</div></>:
      panel==='tech'?<><p className="game-eyebrow">03 / THE LABORATORY</p><h2 id="panel-title">Always building.<br /><em>Always learning.</em></h2><div className="lab-groups">{[['INTELLIGENT SYSTEMS','Python · TensorFlow · OpenCV · MediaPipe · scikit-learn · LangChain'],['DIGITAL PRODUCTS','React · Next.js · TypeScript · Node.js · Supabase · Firebase'],['IMMERSIVE WORLDS','Unreal Engine 5 · C++ · Blueprints · Lumen · Nanite · Niagara'],['THE FOUNDATIONS','B.Tech, Computer Science & Engineering · VIT Bhopal University · 2024–2028 · CGPA 8.68']].map(([title,text])=><div key={title}><small>{title}</small><p>{text}</p></div>)}</div></>:
      <><p className="game-eyebrow">04 / HELLO STATION</p><h2 id="panel-title">Your next idea.<br /><em>Our next adventure.</em></h2><p>Have a project, an interesting problem, or just a good story? I’d love to hear it.</p><a className="contact-email" href="mailto:parardhadhar@gmail.com">parardhadhar@gmail.com <ArrowUpRight size={24}/></a><div className="contact-socials"><a href="https://github.com/parardhadhar" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://linkedin.com/in/parardhadhar" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="/Parardha_Dhar_CV_0.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div></>}
    </div></div>}
  </div>;
}
