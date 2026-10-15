import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight, X, Sun, Moon, Volume2, VolumeX, ArrowLeft, ArrowRight, Copy, Check, Microscope, Code2, Mountain, Sparkles, MapPin } from 'lucide-react';

import { projects, resumeUrl, skillGroups } from '../game/data';
import './FieldNotes.css';
import WorldCompanion from './WorldCompanion';
import Freelance from './Freelance';
import Gramophone from './Gramophone';
import PersonalPinboard from './PersonalPinboard';
import JourneyMap from './JourneyMap';
import ProjectArchive from './ProjectArchive';
import VisitorWall from './VisitorWall';
import WorkingProcess from './WorkingProcess';
import CharacterSprite from './CharacterSprite';
import ImmersiveMotion, { MotionSeam } from './ImmersiveMotion';
import { InlineDetail, RichText } from './InlineDetail';
import './ExperiencePolish.css';
import './PaperChapters.css';
import DraggableNote from './DraggableNote';
import PixelTechIcon from './PixelTechIcon';
import BannerPlane from './BannerPlane';

const trail = [
  {title:'A question worth asking.',place:'VIT Bhopal',date:'2024 → 2028',icon:'01',text:'Computer Science & Engineering. Learning the foundations, then going beyond the syllabus to find out what I can build with them.',tags:'B.Tech · GPA 8.45 / 10'},
  {title:'Make room for imagination.',place:'VRGC',date:'COMMUNITY',icon:'02',text:'I founded the Virtual Reality and Gaming Club at VIT Bhopal. A place for people who want to turn “what if?” into something you can walk through.',tags:'Founder & President · Virtual Reality and Gaming Club'},
  {title:'From pixels to discoveries.',place:'IISc Bangalore',date:'JUN — JUL 2026',icon:'03',text:'As an Intern, I built TEM AI Studio: diffusion denoising, defect detection, FFT analysis and Burgers vectors in one research workflow.',tags:'PyTorch · OpenCV · FastAPI · Electron'},
  {title:'Build it. Ship it. Learn.',place:'Independent work',date:'ONGOING',icon:'04',text:'From reliable webhook pipelines to an AI-assisted CRM, I like the whole journey: understanding a problem, building the system, and getting it into people’s hands.',tags:'FlowHook · Grahak · VRGC Community Hub'},
  {title:'Where my curiosity comes from.',place:'Siliguri · Darjeeling',date:'HOME',icon:'05',text:'I’m from Siliguri, in the Darjeeling region. Mountains on the horizon, a world of possibilities ahead. This little valley is a nod to home, and to the curiosity I carry into everything I build.',tags:'Siliguri · Darjeeling · West Bengal'},
];
const orderedProjects = [{...projects[3],title:'AI Crystallography',type:'TEM AI STUDIO / IISc INTERNSHIP'},projects[0],projects[1],projects[2]];
const tools = [
 ['Py','Python','My first choice for research, scientific computing, and getting an idea into a working experiment.'],
 ['Pt','PyTorch','Diffusion denoising and machine-learning pipelines for scientific imaging.'],
 ['Cv','OpenCV','From image processing to FFT analysis and geometry in electron micrographs.'],
 ['Ts','TypeScript','Reliable interfaces and backend services, with fewer surprises between the two.'],
 ['Re','React','Interfaces that make complex tools feel understandable.'],
 ['Fa','FastAPI','Bringing model inference and scientific workflows to usable APIs.'],
 ['Pg','PostgreSQL','Persisting the state that matters, from customers to execution traces.'],
 ['Rd','Redis','Background work, queues, retries, and dependable event processing.'],
 ['3D','Three.js','Interactive environments and little worlds worth exploring.'],
 ['Dk','Docker','Making projects reproducible beyond my own machine.'],
];
type Sheet = {kind:'project'; index:number} | {kind:'place'; index:number} | null;

function TextReveal({text}:{text:string}){
 return <RichText text={text} animated/>;
}

function Lattice({large=false}:{large?:boolean}) {
  return <div className={`fn-lattice ${large?'large':''}`} aria-label="Illustrative atomic lattice with a highlighted defect">
    <div className="lattice-scan" />
    {Array.from({length:96},(_,i)=><i key={i} style={{'--i':i,'--x':`${(i%12)*8.1+4}%`,'--y':`${Math.floor(i/12)*12+7}%`} as CSSProperties}/>)}
    <div className="defect-box"><span>DISLOCATION</span></div>
  </div>;
}

export default function FieldNotes(){
 const [night,setNight]=useState(()=>localStorage.getItem('field-theme')!=='day');
 const [themeMoving,setThemeMoving]=useState(false);
 const [themeOrigin,setThemeOrigin]=useState({x:0,y:0,radius:0,night:false});
 const themeTimers=useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(()=>()=>themeTimers.current.forEach(clearTimeout),[]);
 const changeTheme=(button:HTMLButtonElement)=>{
  if(themeMoving)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){setNight(value=>!value);return;}
  const rect=button.getBoundingClientRect(),x=rect.left+rect.width/2,y=rect.top+rect.height/2;
  const radius=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  setThemeOrigin({x,y,radius,night:!night});
  setThemeMoving(true);
  themeTimers.current.forEach(clearTimeout);
  themeTimers.current=[setTimeout(()=>setNight(value=>!value),520),setTimeout(()=>setThemeMoving(false),1250)];
 };
 const [music,setMusic]=useState(false);const audio=useRef<HTMLAudioElement|null>(null);
 const [sheet,setSheet]=useState<Sheet>(null);
 const [unwrapped,setUnwrapped]=useState(false);const [tool,setTool]=useState(0);const [copied,setCopied]=useState(false);const [active,setActive]=useState('home');
 const [collected,setCollected]=useState<string[]>([]);const hero=useRef<HTMLElement>(null);const dialog=useRef<HTMLDialogElement>(null);
 const lastFocus=useRef<HTMLElement|null>(null);
 const discover=(id:string)=>setCollected(prev=>prev.includes(id)?prev:[...prev,id]);
 const openSheet=(value:Sheet)=>{lastFocus.current=document.activeElement as HTMLElement;setSheet(value);if(value)discover(value.kind+value.index);};
 const closeSheet=()=>{dialog.current?.close();setSheet(null);lastFocus.current?.focus();};
 const toggleMusic=async()=>{const track=audio.current;if(!track)return;if(!track.paused){track.pause();setMusic(false);return;}try{await track.play();setMusic(true);}catch{setMusic(false);}}; const copyEmail=async()=>{try{await navigator.clipboard.writeText('parardhadhar@gmail.com');setCopied(true);setTimeout(()=>setCopied(false),2200);}catch{location.href='mailto:parardhadhar@gmail.com';}};
 useEffect(()=>{document.documentElement.dataset.fieldTheme=night?'night':'day';localStorage.setItem('field-theme',night?'night':'day');},[night]);
 useEffect(()=>{if(sheet)dialog.current?.showModal();else dialog.current?.close();},[sheet]);
 useEffect(()=>{
  const obs=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('in-view');e.target.setAttribute('data-revealed','true');if(e.target.hasAttribute('data-section'))setActive(e.target.id);}}},{threshold:.08});
  document.querySelectorAll('.fn-reveal,[data-section]').forEach(el=>obs.observe(el));
  let frame=0;const scroll=()=>{if(frame)return;frame=requestAnimationFrame(()=>{if(hero.current)hero.current.style.setProperty('--scroll',`${Math.min(window.scrollY*.18,180)}px`);frame=0;});};
  window.addEventListener('scroll',scroll,{passive:true});
  return()=>{obs.disconnect();window.removeEventListener('scroll',scroll);cancelAnimationFrame(frame);};
 },[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.target as HTMLElement).closest('input,textarea,button,a')||e.ctrlKey||e.metaKey||e.altKey||sheet)return;
  const href:{[key:string]:string}={m:'mailto:parardhadhar@gmail.com',g:'https://github.com/parardhadhar',l:'https://www.linkedin.com/in/parardhadhar',r:resumeUrl};
  if(e.shiftKey&&href[e.key.toLowerCase()]){e.preventDefault();if(e.key.toLowerCase()==='m')location.href=href.m;else window.open(href[e.key.toLowerCase()],'_blank','noopener,noreferrer');}
 };window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[sheet]);
 return <div className="field-notes"><ImmersiveMotion/>{themeMoving&&<div className="theme-curtain" data-target={themeOrigin.night?'night':'day'} aria-hidden="true" style={{'--theme-x':`${themeOrigin.x}px`,'--theme-y':`${themeOrigin.y}px`,'--theme-radius':`${themeOrigin.radius}px`} as CSSProperties}><div className="theme-celestial"><Sun/><Moon/><i/><i/><i/></div></div>}<audio ref={audio} src="/valley-ambient.wav" loop preload="none"/><WorldCompanion night={night} active={active} collected={collected}/>
  <a className="fn-skip" href="#work">Skip to selected work</a>
  <header className="fn-topbar"><a href="#home" className="fn-brand" aria-label="Parardha Dhar home"><img src="/media/avatar-v1.webp" alt="Parardha Dhar"/></a><div className="fn-top-right"><span className="field-edition">FIELD NOTES / VOL. 01</span><button className="fn-round" onClick={event=>changeTheme(event.currentTarget)} disabled={themeMoving} aria-label={night?'Switch to day mode':'Switch to night mode'}>{night?<Sun size={17}/>:<Moon size={17}/>}<span>{night?'Day':'Night'}</span></button></div></header>
  <section ref={hero} id="home" data-section className="fn-hero" aria-label="Welcome to Parardha’s valley">
   <div className="valley-art"/><div className="scenery-layers" aria-hidden="true"><i className="scenery scenery-cedar"/><i className="scenery scenery-canopy"/><i className="scenery scenery-cloud-one"/><i className="scenery scenery-cloud-two"/></div><div className="valley-shade"/><div className="hero-stars" aria-hidden="true"/>
   <div className="fn-hero-copy"><p className="fn-eyebrow"><span className="hello-wave">✋</span> hey, I’m Parardha</p><h1>A curious mind.<br/>A world of <em>possibilities.</em></h1><p className="hero-description">Software engineer. AI researcher.<br className="mobile-br"/> Serial “what if?” person.</p><a className="hero-work-link" href="#work">Come see what I’m building <ArrowDown size={17}/></a></div>
   <BannerPlane/>
   <button className="landmark campus" onClick={()=>openSheet({kind:'place',index:0})}><span className="landmark-icon">V</span><strong>VIT Bhopal</strong><small>THE BEGINNING</small><i/></button>
   <button className="landmark workshop" onClick={()=>{document.getElementById('work')?.scrollIntoView({behavior:'smooth'});}}><span className="landmark-icon coral"><Code2 size={17}/></span><strong>The workshop</strong><small>SELECTED WORK</small><i/></button>
   <button className="landmark research" onClick={()=>openSheet({kind:'place',index:2})}><span className="landmark-icon mint"><Microscope size={17}/></span><strong>IISc Bangalore</strong><small>INTERNSHIP</small><i/></button>
   <button className="landmark maker" onClick={()=>document.getElementById('about')?.scrollIntoView({behavior:'smooth'})}><img src="/media/avatar-v1.webp" alt=""/><strong>That’s me</strong><i/></button>
   <button className={`valley-radio ${music?'is-playing':''}`} onClick={toggleMusic} aria-pressed={music}>{music?<Volume2 size={17}/>:<VolumeX size={17}/>} {music?'A little atmosphere':'Play some music'}<span className="sound-bars"><i/><i/><i/></span></button>
   <Gramophone playing={music} onToggle={toggleMusic}/><div className="hero-character"><span>the person behind the pixels</span><button aria-label="Say hello to Parardha in the valley" onClick={()=>discover('hello')}><CharacterSprite pose="wave"/></button></div><button className="landmark hometown" onClick={()=>openSheet({kind:'place',index:4})}><span className="landmark-icon mint"><Mountain size={17}/></span><strong>Siliguri · Darjeeling</strong><small>HOME</small><i/></button><a href="#story" className="fn-scroll"><span className="mouse-shape"/>scroll to wander in</a>
   <div className="hero-caption"><span>EST. IN CURIOSITY</span><span>BUILT WITH A LITTLE WONDER</span></div>
  </section>
  <main>
   <section id="story" data-section className="fn-story fn-section fn-reveal"><span className="section-kicker">✳ THE THREAD THAT CONNECTS IT ALL</span><h2>I like the space <span className="inline-charm"><Sparkles/></span> between<br/><span className="scribble">“what if”</span> and <span className="serif-word">“it works.”</span></h2><p className="story-body"><TextReveal text="One day, I’m finding defects in an atomic lattice. The next, I’m making a webhook survive its fifth retry. Different problems. Same instinct:"/> <strong>understand it deeply, then build something useful.</strong></p><div className="story-notes"><DraggableNote className="sticky sticky-yellow"><span>01 / RESEARCH</span><strong>Zoom in.<br/>Find the signal.</strong><small>IISc Bangalore · Internship</small></DraggableNote><DraggableNote className="sticky sticky-lilac"><span>02 / ENGINEERING</span><strong>Make the complex<br/>feel simple.</strong><small>Full stack · AI · Automation</small></DraggableNote><DraggableNote className="sticky sticky-green"><span>03 / COMMUNITY</span><strong>Good ideas deserve<br/>good company.</strong><small>Founder & President · VRGC</small></DraggableNote></div><span className="hand-note">different hats, same curious head ↗</span></section>
   <div className="story-marquee" aria-hidden="true">{[0,1].map(i=><span key={i}>curious by default. <em>building by instinct.</em> curious by default. <em>building by instinct.</em> </span>)}</div><MotionSeam/><JourneyMap/>
   <ProjectArchive projects={orderedProjects} onOpen={index=>openSheet({kind:'project',index})}/><MotionSeam variant={1}/>
   <Freelance/><section id="research" data-section className="fn-research fn-section fn-reveal" aria-labelledby="research-heading"><div className="research-art"><Lattice large/><img className="iisc-memory" src="/media/iisc-v1.webp" alt="My internship at IISc Bangalore" loading="lazy"/><div className="research-art-caption"><span>FIG. 01 / FINDING THE INVISIBLE</span><small>Illustrative lattice · not experimental output</small></div><span className="research-stamp">IISc<br/><small>BANGALORE</small></span></div><div className="research-copy"><span className="section-kicker">THE PROJECT CLOSEST TO MY HEART</span><h2 id="research-heading">Small atoms <span className="inline-charm mint">⚛</span>.<br/><span className="scribble">A big leap.</span></h2><p><RichText text="TEM AI Studio brings machine learning and materials science together. From a noisy electron micrograph to a clearer picture of what’s happening inside."/></p><div className="research-numbers"><div><strong>&lt;15<span> sec</span></strong><small>Defect calculation<br/>from 2+ hours</small></div><div><strong>45<span>%</span></strong><small>Improvement in downstream<br/>defect detection accuracy</small></div><div><strong>50<span>+ MP</span></strong><small>Micrograph<br/>analysis</small></div></div><a className="fn-pill" href="https://github.com/parardhadhar/AI-Crystallography-Engine" target="_blank" rel="noreferrer">Inside the research <ArrowUpRight size={17}/></a></div></section>
   <section id="toolkit" data-section className={`fn-toolkit fn-section fn-reveal ${unwrapped?'gift-open':' '}`}><div className="section-heading"><span className="section-kicker">⌘ MY TOOLKIT</span><h2>A few tools <InlineDetail kind="code"/>.<br/><span className="scribble">Endless possibilities.</span></h2><p>Tools are the means. Making something useful is the point.</p></div><div className="gift-tools" inert={!unwrapped}><div className="tool-keyboard" role="group" aria-label="Explore my technology toolkit">{tools.map(([,name],i)=><button key={name} className={`tool-key tool-${i} ${tool===i?'is-active':''}`} onClick={()=>setTool(i)} onFocus={()=>setTool(i)} onMouseEnter={()=>setTool(i)} aria-pressed={tool===i}><span><PixelTechIcon name={name}/></span><small>{name}</small></button>)}</div><div className="tool-description" aria-live="polite"><strong>{tools[tool][1]}</strong><span>{tools[tool][2]}</span></div></div><button className="gift-trigger" onClick={()=>setUnwrapped(!unwrapped)} aria-expanded={unwrapped} aria-label={unwrapped?'Close the toolkit gift':'Unwrap my toolkit'}><span className="gift-box" aria-hidden="true"><i className="gift-lid"/></span><span>{unwrapped?'A few tools. A world of possibilities. Tap to wrap up.':'A little something for the curious. Tap to unwrap ↗'}</span></button><details className="toolkit-details"><summary>View the full toolkit & qualifications <span>+</span></summary>{skillGroups.map(([name,value])=><div key={name}><strong>{name}</strong><p>{value}</p></div>)}</details></section>
   <section id="community" data-section className="fn-section club-memories"><span className="section-kicker">✳ VRGC / THE PEOPLE BEHIND THE PIXELS</span><h2>A little <InlineDetail kind="people"/> community.<br/><span className="scribble">A lot of possibility.</span></h2><p>Building the Virtual Reality and Gaming Club at VIT Bhopal — and finding people who make every idea better.</p><div className="club-photo-grid"><figure><img src="/media/vrgc-team-v1.webp" alt="The VRGC team together in a VIT Bhopal computer lab" loading="lazy" decoding="async"/><figcaption>The people who make it happen.</figcaption></figure><figure><img src="/media/vrgc-campus-v1.webp" alt="Friends from VRGC together on the VIT Bhopal campus" loading="lazy" decoding="async"/><figcaption>Good ideas. Even better company.</figcaption></figure></div></section><section id="about" data-section className="fn-about fn-section fn-reveal"><div className="section-heading"><span className="section-kicker">✺ THE PERSON, NOT JUST THE PROJECTS</span><h2>Serious about the work <span className="inline-charm"><Code2/></span>.<br/><span className="scribble">Curious about everything.</span></h2><p>A small collection of things that make me, me.</p></div><PersonalPinboard/></section><WorkingProcess/><MotionSeam variant={2}/><VisitorWall/>
   <section id="contact" data-section className="fn-contact fn-section fn-reveal"><span className="section-kicker">↗ THE NEXT CHAPTER</span><h2>Got a good <span className="scribble">“what if?”</span><br/>Let’s make it happen.</h2><p>Open to engineering roles <InlineDetail kind="code"/>, ambitious projects <InlineDetail kind="rocket"/>,<br/>and conversations that lead somewhere interesting.</p><div className="contact-keys"><a className="contact-key key-yellow" href="mailto:parardhadhar@gmail.com"><kbd>M</kbd><span>Email me</span><ArrowUpRight size={16}/></a><a className="contact-key key-charcoal" href="https://github.com/parardhadhar" target="_blank" rel="noreferrer"><kbd>G</kbd><span>GitHub</span><ArrowUpRight size={16}/></a><a className="contact-key key-blue" href="https://www.linkedin.com/in/parardhadhar" target="_blank" rel="noreferrer"><kbd>L</kbd><span>LinkedIn</span><ArrowUpRight size={16}/></a><a className="contact-key key-cream" href={resumeUrl} target="_blank" rel="noreferrer"><kbd>R</kbd><span>Résumé</span><ArrowUpRight size={16}/></a></div><span className="hand-note">psst. Shift + M, G, L & R work on your keyboard too.</span><button className="copy-email" onClick={copyEmail}>{copied?<Check size={17}/>:<Copy size={17}/>} {copied?'Copied!':'parardhadhar@gmail.com'}</button><footer><span>PARARDHA DHAR © {new Date().getFullYear()}</span><span>Made of curiosity, code & a little wonder.</span><a href="#home">Back to the valley ↑</a></footer></section>
  </main>
  <nav className="fn-dock" aria-label="Main navigation">{[['home','Home'],['journey','Journey'],['work','Work'],['about','About'],['contact','Contact']].map(([id,label])=><a key={id} href={`#${id}`} className={active===id?'active':''}>{id==='home'&&<img src="/media/avatar-v1.webp" alt=""/>}{label}</a>)}<a className="dock-resume" href={resumeUrl} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={14}/></a></nav>
  {collected.length>0&&<span className="discovery-count" aria-live="polite"><Sparkles size={13}/> {collected.length} discoveries</span>}
  <dialog ref={dialog} className="fn-dialog" onCancel={()=>{setSheet(null);lastFocus.current?.focus();}} onClick={e=>{if(e.target===e.currentTarget)closeSheet();}} aria-labelledby="sheet-title"><div className="sheet-content"><button className="sheet-close" onClick={closeSheet} aria-label="Close details"><X size={23}/></button>{sheet?.kind==='project'?<><span className="section-kicker">FIELD NOTES / PROJECT 0{sheet.index+1}</span><h2 id="sheet-title">{orderedProjects[sheet.index].title}</h2><span className="sheet-type">{orderedProjects[sheet.index].type}</span>{sheet.index===0?<Lattice/>:<div className="sheet-project-icon"><Code2 size={52}/></div>}<p>{orderedProjects[sheet.index].text}</p>{sheet.index===0&&<p>Built during my June–July 2026 internship at IISc Bangalore. The workflow reduced manual defect calculation from over two hours to under 15 seconds per micrograph.</p>}<div className="sheet-tags">{orderedProjects[sheet.index].tags.split(' · ').map(tag=><span key={tag}>{tag}</span>)}</div><a className="fn-pill" href={orderedProjects[sheet.index].href} target="_blank" rel="noreferrer">{sheet.index===0||sheet.index===1?'Explore the repository':'Visit the project'} <ArrowUpRight size={17}/></a><div className="sheet-pagination"><button onClick={()=>setSheet({kind:'project',index:(sheet.index+3)%4})}><ArrowLeft size={16}/> Previous</button><button onClick={()=>setSheet({kind:'project',index:(sheet.index+1)%4})}>Next project <ArrowRight size={16}/></button></div></>:sheet?.kind==='place'?<><span className="section-kicker">A STOP ALONG THE WAY</span><MapPin size={35}/><h2 id="sheet-title">{trail[sheet.index].place}</h2><div className={`place-illustration place-${sheet.index}`} style={{backgroundImage:`url(/media/valley-${night?'night':'day'}-v1.webp)`}} role="img" aria-label={`Illustrated interpretation of ${trail[sheet.index].place}`}/><p>{trail[sheet.index].text}</p><small className="place-art-note">A storybook interpretation of a real place.</small><div className="sheet-tags"><span>{trail[sheet.index].tags}</span></div><button className="fn-pill" onClick={()=>{closeSheet();document.getElementById('journey')?.scrollIntoView({behavior:'smooth'});}}>Follow the journey <ArrowDown size={17}/></button></>:null}</div></dialog>
 </div>;
}
