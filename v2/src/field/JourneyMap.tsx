import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Crosshair, Heart, MapPin, Minus, Navigation, Plus } from 'lucide-react';
import type { CSSProperties } from 'react';
import CharacterSprite from './CharacterSprite';
import { InlineDetail, RichText } from './InlineDetail';
import './JourneyMap.css';

const heartRoute='M1400 780C1120 200 400 320 400 970C400 1590 1400 2400 1400 2400C1400 2400 2400 1590 2400 970C2400 320 1680 200 1400 780Z';
function heartPoint(progress:number){
 const curves=[[[1400,780],[1120,200],[400,320],[400,970]],[[400,970],[400,1590],[1400,2400],[1400,2400]],[[1400,2400],[1400,2400],[2400,1590],[2400,970]],[[2400,970],[2400,320],[1680,200],[1400,780]]];
 const position=Math.min(.99999,Math.max(0,progress))*4,index=Math.floor(position),t=position-index,u=1-t,p=curves[index];
 return{x:u*u*u*p[0][0]+3*u*u*t*p[1][0]+3*u*t*t*p[2][0]+t*t*t*p[3][0],y:u*u*u*p[0][1]+3*u*u*t*p[1][1]+3*u*t*t*p[2][1]+t*t*t*p[3][1]};
}
const stops=[
 {name:'Siliguri · Darjeeling',city:'SILIGURI',date:'WHERE IT BEGAN',title:'Mountain roots. Open horizons.',text:'I’m from Siliguri, in the Darjeeling region. Growing up with mountains on the horizon gave me a lasting instinct to look a little further. This is where the journey begins.',x:1830,y:450,color:'#94ba9d',icon:'△',photos:['personal/may.webp','media/cafe-v1.webp'],query:'Siliguri Darjeeling West Bengal',label:'Home'},
 {name:'VIT Bhopal',city:'BHOPAL',date:'2024 → 2028',title:'A question worth asking.',text:'Computer Science & Engineering at VIT Bhopal. Learning the foundations, then going beyond the syllabus to find out what I can build with them.',x:1050,y:1200,color:'#e7a16f',icon:'V',photos:['media/portrait-v1.webp','media/building-v1.webp'],query:'VIT Bhopal University',label:'B.Tech · GPA 8.45 / 10'},
 {name:'VRGC',city:'VIT BHOPAL',date:'FOUNDER & PRESIDENT',title:'Make room for imagination.',text:'I founded the Virtual Reality and Gaming Club at VIT Bhopal. A place for people who want to turn “what if?” into something you can walk through. Then I built the community a home on the web.',x:1190,y:1290,color:'#ba9be4',icon:'✳',photos:['media/vrgc-team-v1.webp','media/vrgc-campus-v1.webp'],query:'VIT Bhopal University',label:'Community · VR · Game development'},
 {name:'IISc Bangalore',city:'BENGALURU',date:'JUN — JUL 2026 · INTERN',title:'Small atoms. A big new chapter.',text:'As an Intern at IISc Bangalore, I built TEM AI Studio: diffusion denoising, defect detection, FFT analysis and Burgers vectors in one workflow. A chance to turn curiosity into a useful scientific tool.',x:1080,y:2390,color:'#7faee4',icon:'⚛',photos:['media/iisc-v1.webp','media/portrait-v1.webp'],query:'Indian Institute of Science Bengaluru',label:'PyTorch · OpenCV · FastAPI · Electron'},
 {name:'Independent work',city:'THE NEXT CHAPTER',date:'BUILDING, ALWAYS',title:'Build it. Ship it. Learn.',text:'From reliable webhook pipelines to an AI-assisted CRM, I like the whole journey: understanding a problem, building the system, and getting it into people’s hands. Still learning. Still making things.',x:1450,y:2070,color:'#d6bc71',icon:'⌘',photos:['media/building-v1.webp','media/cafe-v1.webp'],query:'Bhopal India',label:'FlowHook · Grahak · VRGC Community Hub'},
].map((stop,index)=>({...stop,...heartPoint(index/4*.94)}));
const streets=Array.from({length:320},(_,i)=>({x:160+(i%20)*135,y:120+Math.floor(i/20)*180,w:73+(i%3)*12,h:105+(i%4)*9}));

const streetBlocks=streets.map((b,i)=><rect key={i} {...b} width={b.w} height={b.h} rx="5"/>);

export default function JourneyMap(){
 const section=useRef<HTMLElement>(null);const [progress,setProgress]=useState(0);const [zoom,setZoom]=useState(1.15);const [overview,setOverview]=useState(false);
 const lastScroll=useRef(0);
 useEffect(()=>{
  const update=()=>{const el=section.current;if(!el)return;const top=el.getBoundingClientRect().top;const next=Math.max(0,Math.min(1,-top/Math.max(1,el.offsetHeight-innerHeight)));if(next>0&&next<1&&Math.abs(scrollY-lastScroll.current)>2)setOverview(false);lastScroll.current=scrollY;setProgress(previous=>Math.abs(previous-next)>.0001?next:previous);};
  update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};
 },[]);
 const position=progress*(stops.length-1),index=Math.min(stops.length-1,Math.round(position));
 const {x,y}=heartPoint(progress*.94),ahead=heartPoint(progress*.94+.001);
 // Introduce the complete heart, then smoothly move into navigation as scrolling begins.
 const reveal=Math.min(1,progress/.08),follow=overview?0:reveal*reveal*(3-2*reveal);
 const cameraZoom=.3+(zoom-.3)*follow;
 const cameraX=1400+(x-1400)*follow,cameraY=1400+(y-1400)*follow;
 const stop=stops[index],angle=Math.atan2(ahead.y-y,ahead.x-x)*180/Math.PI+90;
 const go=(i:number)=>{const el=section.current;if(!el)return;const top=el.getBoundingClientRect().top+scrollY;window.scrollTo({top:top+(Math.max(0,Math.min(stops.length-1,i))/(stops.length-1))*(el.offsetHeight-innerHeight),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 return <section id="journey" ref={section} data-section className="journey-scroll" aria-label="Scroll through my journey map">
  <div className="journey-sticky"><div className="journey-map-surface" aria-hidden="true">
   <svg className="journey-map-svg" viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice"><defs><pattern id="minor-roads" width="135" height="180" patternUnits="userSpaceOnUse"><path d="M0 0H135V180H0Z" fill="none" className="minor-street" strokeWidth="9"/></pattern><radialGradient id="park"><stop stopColor="#435f43"/><stop offset="1" stopColor="#2e4637"/></radialGradient></defs>
    <g transform={`translate(930 440) scale(${cameraZoom}) translate(${-cameraX} ${-cameraY})`} className="map-camera" data-camera-zoom={cameraZoom.toFixed(3)}>
     <rect x="-1200" y="-1000" width="6000" height="6000" className="map-base"/>
     <g className="map-blocks">{streetBlocks}</g>
     <rect x="0" y="0" width="3400" height="3400" fill="url(#minor-roads)"/>
     <path d="M450 20Q700 250 510 600T650 1200 510 2000 740 2900" className="map-river" fill="none" strokeWidth="90"/>
     <path d="M50 800 3100 1500M1900 0 900 3000M0 2200 3000 600" className="map-highway-shadow" fill="none" strokeWidth="31"/>
     <path d="M50 800 3100 1500M1900 0 900 3000M0 2200 3000 600" className="map-highway" fill="none" strokeWidth="16"/>
     <g fill="url(#park)"><ellipse cx="1740" cy="360" rx="160" ry="90"/><ellipse cx="1240" cy="1510" rx="140" ry="120"/><ellipse cx="860" cy="2330" rx="140" ry="180"/><ellipse cx="1510" cy="2180" rx="150" ry="100"/></g>
     <g className="map-labels">{[0,1,3].map(i=><text key={i} x={stops[i].x-140} y={stops[i].y+170}>{stops[i].city}</text>)}</g>
     <path d={heartRoute} stroke="#142b4e" strokeWidth="32" fill="#729d8512" strokeLinejoin="round"/><path className="map-route-flow" d={heartRoute} stroke="#79aaf5" strokeWidth="16" fill="none" strokeLinejoin="round"/>
     <g className="map-heart-caption"><text x="1400" y="1220" textAnchor="middle">A LITTLE JOURNEY.</text><text x="1400" y="1290" textAnchor="middle">A LOT OF HEART.</text><path d="m1400 1480-45-42c-65-55 10-105 45-48 35-57 110-7 45 48Z" fill="#d2a68c"/></g>
     {stops.map((s,i)=><g key={s.name} transform={`translate(${s.x} ${s.y-40}) scale(${1.9-follow*.9})`} opacity={i===index?1:.65}><path d="M0 0C-80-90-60-130 0-130S80-90 0 0Z" fill={s.color} stroke="#ece6d4" strokeWidth="5"/><circle cy="-80" r="31" fill="#20251f"/><text y="-69" textAnchor="middle" fontSize="31" fill={s.color}>{s.icon}</text><text x="65" y="-57" className="map-place-label">{s.name}</text></g>)}
     <g transform={`translate(${x} ${y}) scale(${2.4-follow*1.4})`}><circle className="map-position-halo" r="53" fill="#4b9dff22" stroke="#6bb8ff55" strokeWidth="2"/><circle r="21" fill="#fff"/><path d="m0-13 11 27-11-7-11 7Z" fill="#4081ec" transform={`rotate(${angle})`}/></g>
    </g>
   </svg></div>
   <div className="map-vignette"/><div className="journey-map-title"><span>↝ THE JOURNEY</span><p>Scroll to travel <InlineDetail kind="compass"/></p></div>
   <article className="map-story-card" style={{'--stop-color':stop.color} as CSSProperties} key={index}><header><span className="map-story-icon">{stop.icon}</span><div><strong>{stop.name}</strong><small>{stop.date}</small></div><b>0{index+1} / 05</b></header><div className="map-story-body"><h2><RichText text={stop.title} animated/></h2><p><RichText text={stop.text}/></p><small className="map-story-tags">{stop.label}</small><div className="map-gallery"><span>POSTCARDS ALONG THE WAY</span><div>{stop.photos.map((photo,i)=><img key={photo} src={`/${photo}`} alt={`${stop.name} — personal photograph ${i+1}`} loading="lazy" decoding="async"/>)}</div></div><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.query)}`} target="_blank" rel="noreferrer"><MapPin size={13}/> Open this place in Google Maps ↗</a></div></article>
   <div className="map-compass" aria-hidden="true"><span>N</span><Navigation size={25}/><span>S</span></div>
   <div className="map-controls"><button aria-label={overview?'Follow the journey pointer':'Show the heart-shaped map'} onClick={()=>{setOverview(!overview);setZoom(1.15);}}>{overview?<Navigation size={19}/>:<Heart size={19}/>}</button><button aria-label="Recenter journey map" onClick={()=>{setOverview(false);setZoom(1.15);}}><Crosshair size={19}/></button><button aria-label="Zoom in on journey" onClick={()=>setZoom(z=>Math.min(1.6,z+.15))}><Plus size={19}/></button><button aria-label="Zoom out of journey" onClick={()=>setZoom(z=>Math.max(.2,z-.15))}><Minus size={19}/></button></div>
   <div className="map-traveller"><CharacterSprite pose="walk"/></div>
   <nav className="map-progress" aria-label="Journey stops"><button onClick={()=>go(index-1)} disabled={index===0} aria-label="Previous journey stop"><ArrowLeft size={15}/></button><div className="map-progress-dots">{stops.map((s,i)=><button key={s.name} aria-label={`Travel to ${s.name}`} aria-current={i===index?'step':undefined} onClick={()=>go(i)} style={{'--stop-color':s.color} as CSSProperties}/>)}</div><span>{stop.date} · {stop.city}</span><button onClick={()=>go(index+1)} disabled={index===stops.length-1} aria-label="Next journey stop"><ArrowRight size={15}/></button></nav>
   <span className="map-caption">An illustrated map of my journey · locations open in Google Maps</span>
  </div>
 </section>;
}


