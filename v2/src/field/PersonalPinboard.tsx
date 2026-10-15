import { useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { ArrowUpRight, Mountain, Music2 } from 'lucide-react';
import './PersonalPinboard.css';
import BoardingPasses from './BoardingPasses';
import { InlineDetail } from './InlineDetail';
const photos=[
 {file:'cafe.png',title:'A little pause between projects.',href:'',alt:'Parardha in a checked shirt outside a cafe'},
 {file:'cinema.png',title:'Big-screen kind of evening.',href:'',alt:'Parardha sitting in a cinema'},
 {file:'concert.png',title:'Off duty. Fully present.',href:'',alt:'Parardha at an outdoor evening event'},
 {file:'portrait.png',title:'The person behind the tabs.',href:'',alt:'A close-up portrait of Parardha wearing glasses'},
 {file:'building.png',title:'Behind the scenes at VRGC.',href:'',alt:'Parardha coding at his laptop with the VRGC website on a monitor'},
 {file:'iisc.png',title:'A new chapter. IISc Bangalore.',href:'',alt:'Parardha standing outside the IISc Bangalore main building'},
];
function Movable({children,className,rotation=0}:{children:React.ReactNode;className:string;rotation?:number}){
 const [offset,setOffset]=useState({x:0,y:0});const start=useRef<{x:number;y:number;ox:number;oy:number}|null>(null);
 const down=(e:PointerEvent<HTMLDivElement>)=>{if((e.target as HTMLElement).closest('a,button'))return;start.current={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y};e.currentTarget.setPointerCapture(e.pointerId);};
 return <div className={`memory-item ${className}`} style={{'--rotation':`${rotation}deg`,transform:`translate(${offset.x}px,${offset.y}px) rotate(${rotation}deg)`} as CSSProperties} onPointerDown={down} onPointerMove={e=>{if(start.current)setOffset({x:Math.max(-55,Math.min(55,start.current.ox+e.clientX-start.current.x)),y:Math.max(-45,Math.min(45,start.current.oy+e.clientY-start.current.y))});}} onPointerUp={()=>{start.current=null;}} onPointerCancel={()=>{start.current=null;}}>{children}</div>;
}
export default function PersonalPinboard(){return <><div className="memory-board"><Movable className="memory-note" rotation={2}><i className="memory-pin"/><small>OFF THE CLOCK / ALWAYS CURIOUS</small><h3>Hi, I’m Parardha.<br/>More than my tabs.</h3><p>From Siliguri <InlineDetail kind="mountain"/>, in the Darjeeling region. Studying Computer Science at VIT Bhopal. Intern at IISc Bangalore.</p><p><Music2 size={15}/> Music, singing, and a little guitar.<br/><Mountain size={15}/> Mountain roots. A restless curiosity.</p><p>I make things <InlineDetail kind="code"/>, ask “why?”, and take the scenic route whenever I can.</p><a href="https://www.instagram.com/parardha.er/" target="_blank" rel="noreferrer">Find me @parardha.er <ArrowUpRight size={14}/></a><span className="signature">Parardha.</span></Movable>{photos.map((p,i)=><Movable key={p.file} className={`memory-photo memory-${i}`} rotation={[-5,5,-3,4,-6,3][i]}><i className="memory-pin"/><img src={`/personal/${p.file}`} alt={p.alt} loading="lazy" draggable={false}/><span>{p.title}</span><a href={`https://www.instagram.com/parardha.er/${p.href}`} target="_blank" rel="noreferrer" aria-label={`View original post: ${p.title}`}>↗</a></Movable>)}<Movable className="memory-ticket" rotation={-4}><small>✳ ADMIT EVERY CURIOUS MIND</small><strong>VRGC</strong><span>Founder & President · VIT Bhopal</span><a href="https://vrgc.live" target="_blank" rel="noreferrer">Meet the community ↗</a></Movable><Movable className="memory-island" rotation={5}><Mountain size={30}/><strong>A world within<br/>this world.</strong><a href="/?experience=island">Drive my 3D island ↗</a><small>PS. Try typing “curiosity” somewhere quiet.</small></Movable><BoardingPasses/></div><p className="memory-caption">Real moments from <a href="https://www.instagram.com/parardha.er/" target="_blank" rel="noreferrer">@parardha.er</a>. Drag a photo. Make yourself at home.</p></>;}
