import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Volume2, VolumeX, RotateCcw, Map, X, Navigation, Zap, CircleHelp, Sun, Moon, Plus, Minus } from 'lucide-react';
import { destinations, projects, resumeUrl, profile, skillGroups, type DestinationId } from './data';
import { IslandAudio } from './audio';
import { islandResidents } from './residentData';
import type { WorldController, WorldState } from './World';
import './Game.css';
const World = lazy(() => import('./World'));

export default function Game() {
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [panel, setPanel] = useState<DestinationId | 'map' | 'help' | 'residents' | null>(null);
  const [sound, setSound] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const [isNight, setIsNight] = useState(()=>{try{return localStorage.getItem('island-night')==='true';}catch{return false;}});
  useEffect(()=>{try{localStorage.setItem('island-night',String(isNight));}catch{/* Preferences are optional. */}},[isNight]);
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
      if(event.key.toLowerCase()==='n' && !live.current.panel){event.preventDefault();setIsNight(v=>!v);}
      if((event.key==='Enter'||event.code==='Space') && live.current.started && !live.current.panel && live.current.nearby){event.preventDefault();setPanel(live.current.nearby);}
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
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0, active: false });
  const [isBoostActive, setIsBoostActive] = useState(false);
  const pointerIdRef = useRef<number | null>(null);

  const handleJoystickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const maxR = rect.width / 2 - 14;
    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, maxR);
    const angle = Math.atan2(dy, dx);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;
    setJoystickPos({ x: clampedX, y: clampedY, active: true });
    controller.current?.setJoystick(clampedX / maxR, -clampedY / maxR, isBoostActive);
  };

  const handleJoystickPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const maxR = rect.width / 2 - 14;
    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, maxR);
    const angle = Math.atan2(dy, dx);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;
    setJoystickPos({ x: clampedX, y: clampedY, active: true });
    controller.current?.setJoystick(clampedX / maxR, -clampedY / maxR, isBoostActive);
  };

  const handleJoystickPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === e.pointerId) {
      pointerIdRef.current = null;
      setJoystickPos({ x: 0, y: 0, active: false });
      controller.current?.setJoystick(0, 0, isBoostActive);
    }
  };

  const handleBoostDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsBoostActive(true);
    controller.current?.input('boost', true);
  };

  const handleBoostUp = () => {
    setIsBoostActive(false);
    controller.current?.input('boost', false);
  };

  const update=(next:WorldState)=>{setState(next);if(next.collected>previousCount.current)audio.current?.collect();previousCount.current=next.collected;};
  const toggleSound=async()=>{try{setSound(await audio.current!.toggle());setSoundError(false);}catch{setSoundError(true);}};
  const visit=(id:DestinationId)=>{setStarted(true);controller.current?.travel(id);setPanel(null);};
  return <div className={`island-app ${isNight ? 'is-night' : ''}`}>
    <div className="world-view"><Suspense fallback={<div className="world-loading"><span />BUILDING A LITTLE WORLD...</div>}><World isNight={isNight} onReady={api=>{controller.current=api;api.pause(!live.current.started||!!live.current.panel);setLoaded(true);}} onState={update} onError={()=>{setFailed(true);setLoaded(true);}} /></Suspense></div>
    <div className="world-vignette" />
    <header className="game-header"><a href="#" onClick={event=>{event.preventDefault();setPanel('about');}} className="game-brand">pd<span>®</span><small>PARARDHA DHAR<br />A WORLD OF POSSIBILITIES</small></a><div className="game-top-actions"><button className="directory-button" aria-label="Explore the island" onClick={()=>setPanel('map')}><Map size={15} /><span>Explore the island</span></button><button className="game-icon" aria-label={isNight?'Switch to daylight (N)':'Switch to night mode (N)'} title={isNight?'Daylight mode (N)':'Night mode (N)'} aria-pressed={isNight} onClick={()=>setIsNight(!isNight)}>{isNight?<Sun size={18}/>:<Moon size={18}/>}</button><button className="game-icon" aria-label={sound?'Mute music':'Enable music'} aria-pressed={sound} onClick={()=>void toggleSound()}>{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}</button><button className="game-icon" aria-label="How to play" onClick={()=>setPanel('help')}><CircleHelp size={18}/></button></div></header>
    {!started && <div className="arrival"><p className="game-eyebrow"><span /> PERSONAL PORTFOLIO / PLAYABLE EDITION</p><h1>A little world.<br />A lot of <em>ideas.</em></h1><p className="arrival-description">I'm Parardha. Engineer, world builder,<br />and relentlessly curious human.<br />Take the scenic route through my work.</p><button className="enter-world" disabled={!loaded||failed} onClick={()=>setStarted(true)}>{failed?'3D unavailable':loaded?"Let's go for a drive":'Preparing your ride...'}<ArrowUpRight size={20}/></button><button className="skip-drive" onClick={()=>setPanel('map')}>Just here for the portfolio? <span>Take a shortcut ↗</span></button><div className="arrival-meta"><span>01 LITTLE ISLAND</span><span>04 PLACES TO DISCOVER</span><span>∞ CURIOSITY</span></div></div>}
    {started&&!panel&&<><button className="island-life" onClick={()=>setPanel('residents')}><span className="resident-dots"><i/><i/><i/></span><span><b>Life on the island</b><small>8 RESIDENTS AT WORK · MEET THE CREW ↗</small></span></button>{state.resident && <div className="resident-nearby" role="status"><span>{state.resident.name} / {state.resident.role}</span><strong>{state.resident.task}</strong></div>}<div className="quest-card"><span className="game-eyebrow">A SMALL SIDE QUEST</span><strong>{state.collected===16?'You found your spark.':'Follow your curiosity.'}</strong><p>{state.collected===16?'All 16 energy cells collected. Keep exploring!':'Collect the glowing cells around the island.'}</p><div><Zap size={16}/><b>{String(state.collected).padStart(2,'0')}</b><span>/ 16 ENERGY CELLS</span></div></div><div className="location-prompt">{state.nearby?<button onClick={()=>setPanel(state.nearby)}><span className="interaction-key">↵</span><strong>PARKED: {destinations.find(d=>d.id===state.nearby)?.name}</strong><span style={{fontSize:'10px',opacity:.75}}>PRESS ENTER TO EXPLORE</span><ArrowUpRight size={18}/></button>:<span>FOLLOW ROADS TO PARKING ZONES 01–04 TO EXPLORE</span>}</div><div className="drive-hud"><div className="speedometer"><strong>{String(Math.round(state.speed*7)).padStart(2,'0')}</strong><span>KM/H<br />JUST EXPLORING</span></div><button className="reset-button" onClick={()=>controller.current?.reset()}><RotateCcw size={14}/> Unstuck</button></div><div className="mini-map" aria-label="Island map"><div className="map-road"/>{destinations.map(d=><button key={d.id} style={{left:`${50+d.x*1.1}%`,top:`${50+d.z*1.1}%`,background:d.color}} aria-label={`Travel to ${d.name}`} onClick={()=>visit(d.id)}>{d.number}</button>)}<i style={{left:`${50+state.x*1.1}%`,top:`${50+state.z*1.1}%`}}/><div className="map-zoom"><button aria-label="Zoom out" onClick={()=>controller.current?.zoom(-.2)}><Minus size={14}/></button><button aria-label="Zoom in" onClick={()=>controller.current?.zoom(.2)}><Plus size={14}/></button></div></div><div className="touch-controls" aria-label="Touch Driving Controls"><div className={`touch-joystick-base ${joystickPos.active ? 'active' : ''}`} onPointerDown={handleJoystickPointerDown} onPointerMove={handleJoystickPointerMove} onPointerUp={handleJoystickPointerUp} onPointerCancel={handleJoystickPointerUp} onLostPointerCapture={handleJoystickPointerUp} role="group" aria-label="Touch Steering Thumbstick"><div className="joystick-guide-ring"/><div className="joystick-guide-ring outer"/><div className="joystick-crosshair-v"/><div className="joystick-crosshair-h"/><span className="joystick-cardinal n">▲</span><span className="joystick-cardinal s">▼</span><span className="joystick-cardinal w">◀</span><span className="joystick-cardinal e">▶</span><svg className="joystick-vector-svg" viewBox="-65 -65 130 130">{joystickPos.active&&(<><line x1="0" y1="0" x2={joystickPos.x} y2={joystickPos.y} className="joystick-vector-line"/><circle cx={joystickPos.x} cy={joystickPos.y} r="10" className="joystick-cursor-glow"/></>)}</svg><div className="touch-joystick-thumb" style={{transform:`translate(${joystickPos.x}px, ${joystickPos.y}px)`,transition:joystickPos.active?'none':'transform 0.22s cubic-bezier(0.18, 0.89, 0.32, 1.28)'}}><div className="thumb-cursor-ring"/><div className="thumb-inner-dot"/></div></div><div className="touch-actions-cluster">{state.nearby&&(<button className="touch-explore-btn" aria-label="Explore Nearest Destination" onClick={()=>setPanel(state.nearby)}><span className="explore-ping"/><ArrowUpRight size={18}/><span>ENTER</span></button>)}<button className={`touch-boost-btn ${isBoostActive ? 'active' : ''}`} aria-label="Boost Nitro" onPointerDown={handleBoostDown} onPointerUp={handleBoostUp} onPointerCancel={handleBoostUp} onLostPointerCapture={handleBoostUp}><Zap size={20}/><span>BOOST</span></button></div></div></> }
    <footer className="game-footer"><span>DESIGNED TO WANDER. BUILT TO DISCOVER.</span><span className="desktop-controls">W A S D / ARROWS <i>DRIVE</i> SHIFT <i>BOOST</i> ENTER <i>EXPLORE</i></span><span>© PARARDHA DHAR 2026</span></footer>
    {soundError&&<p className="audio-notice" role="status">Audio couldn't start. Try the music button again.</p>}
    {failed&&<div className="world-fallback"><Navigation size={38}/><p>Your browser couldn't start the 3D world.<br />You can still explore every part of my portfolio.</p><button onClick={()=>setPanel('map')}>Open portfolio directory</button></div>}
    {panel&&<div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)setPanel(null);}}><div className="portfolio-modal" ref={modal} role="dialog" aria-modal="true" aria-labelledby="panel-title"><button className="modal-close" aria-label="Close panel" onClick={()=>setPanel(null)}><X size={20}/></button>
      {panel==='residents'?<><p className="game-eyebrow">THE ISLAND CHARACTERS</p><h2 id="panel-title">Everyone has<br /><em>a little purpose.</em></h2><p>A fictional crew keeps this little world moving. Follow a resident to see their daily rounds, stop by their work area, and watch the island at work.</p><div className="resident-directory">{islandResidents.map(person=><div key={person.name}><span style={{background:person.color}}>{person.name.slice(0,1)}</span><div><h3>{person.name}<small>{person.role}</small></h3><p>{person.task}</p></div></div>)}</div></>:panel==='map'?<><p className="game-eyebrow">YOUR ISLAND DIRECTORY</p><h2 id="panel-title">Choose your<br /><em>own adventure.</em></h2><p>Drive there, or jump straight into the story.</p><div className="destination-list">{destinations.map(d=><div key={d.id}><span style={{background:d.color}}>{d.number}</span><button onClick={()=>setPanel(d.id)}><small>{d.category}</small><strong>{d.name}</strong></button><button className="travel-button" disabled={failed} aria-label={`Drive to ${d.name}`} onClick={()=>visit(d.id)}><Navigation size={19}/></button></div>)}</div></>:
      panel==='help'?<><p className="game-eyebrow">NO LICENSE REQUIRED</p><h2 id="panel-title">Take it<br /><em>for a spin.</em></h2><div className="help-list"><p><kbd>W A S D</kbd> or <kbd>↑ ← ↓ →</kbd><span>Accelerate, reverse and steer</span></p><p><kbd>SHIFT</kbd><span>A little extra speed</span></p><p><kbd>ENTER</kbd><span>Explore the nearest destination</span></p><p><kbd>M</kbd><span>Open the island directory</span></p><p><kbd>R</kbd><span>Return to the starting point</span></p></div><p>On a phone or tablet, use the thumbstick to drive and the boost button for extra speed. Find all 16 glowing cells, visit the four destinations, and take your time. Music is optional—switch it on using the speaker button.</p></>:
      panel==='about'?<><p className="game-eyebrow">01 / THE STUDIO</p><h2 id="panel-title">Engineer's mind.<br /><em>Explorer's heart.</em></h2><div className="about-profile"><img src="/photo.png" alt="Parardha Dhar"/><div><h3>Hi, I'm Parardha.</h3><p>{profile.introduction}</p><p>{profile.experience}</p></div></div><p className="leadership-note">{profile.leadership}</p><a className="modal-link" href={resumeUrl} target="_blank" rel="noreferrer">Read my resume <ArrowUpRight size={18}/></a></>:
      panel==='work'?<><p className="game-eyebrow">02 / PROJECT PARK</p><h2 id="panel-title">Some things<br /><em>I've put into the world.</em></h2><div className="game-projects">{projects.map(project=><a key={project.title} href={project.href} target={project.href.startsWith('http')?'_blank':undefined} rel="noreferrer">{project.image ? <img src={project.image} alt={project.title} loading="lazy"/> : <div className={`project-art art-${project.motif}`} aria-hidden="true"><div className="art-grid"/><span>{project.motif === 'flow' ? '↗' : project.motif === 'chat' ? 'g.' : '◈'}</span><b>{project.title.toUpperCase()}</b></div>}<small>{project.type}</small><h3>{project.title}<ArrowUpRight size={18}/></h3><p>{project.text}</p><span className="project-tags">{project.tags}</span></a>)}</div></>:
      panel==='tech'?<><p className="game-eyebrow">03 / THE LABORATORY</p><h2 id="panel-title">Always building.<br /><em>Always learning.</em></h2><div className="lab-groups">{skillGroups.map(([title,text])=><div key={title}><small>{title}</small><p>{text}</p></div>)}</div></>:
      <><p className="game-eyebrow">04 / HELLO STATION</p><h2 id="panel-title">Your next idea.<br /><em>Our next adventure.</em></h2><p>Have a project, an interesting problem, or just a good story? I'd love to hear it.</p><a className="contact-email" href="mailto:parardhadhar@gmail.com">parardhadhar@gmail.com <ArrowUpRight size={24}/></a><div className="contact-socials"><a href="https://github.com/parardhadhar" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://linkedin.com/in/parardhadhar" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={resumeUrl} target="_blank" rel="noreferrer">Resume ↗</a></div></>}
    </div></div>}
  </div>;
}
