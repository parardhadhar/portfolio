import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { InlineDetail } from './InlineDetail';
import './ProjectArchive.css';

type Project={title:string;type:string;text:string};
const details=[{icon:'⚛',metric:'45%',label:'better defect detection',tone:'#f28c65'},{icon:'⌁',metric:'5',label:'attempts. built to recover.',tone:'#57b3d4'},{icon:'✦',metric:'AI',label:'one inbox. every customer.',tone:'#ed696e'},{icon:'✳',metric:'1,800+',label:'people connected',tone:'#a889e8'},{icon:'⌘',metric:'3D',label:'a world worth exploring',tone:'#b79b70'}];
export default function ProjectArchive({projects,onOpen}:{projects:Project[];onOpen:(i:number)=>void}){
 const [selected,setSelected]=useState<number|null>(null);
 const cards=[...projects,{title:'The Interactive Island',type:'PLAYABLE PORTFOLIO / THREE.JS',text:'A tiny world of my work.'}];
 return <section id="work" data-section className="fn-section fn-reveal project-archive"><div className="archive-heading"><span className="section-kicker">✷ SELECTED WORK</span><h2>Things I shipped, and<br/>the <span className="scribble">problems they solved.</span></h2><p>From atoms <InlineDetail kind="atom"/> to real systems <InlineDetail kind="code"/>.<br/>Pick a card from the box. There’s a story inside.</p></div>
  <div className="archive-scene" aria-label="Open presentation box containing five project cards"><div className="archive-glow"/>
   <svg className="archive-box-back" viewBox="0 0 1000 620" aria-hidden="true"><defs><linearGradient id="lid" x2="1" y2="1"><stop stopColor="#f4dfad"/><stop offset="1" stopColor="#d4b37c"/></linearGradient><linearGradient id="base" x2="1" y2="1"><stop stopColor="#edcf96"/><stop offset="1" stopColor="#c4a16b"/></linearGradient></defs><path d="M390 65 835 195 785 405 345 276Z" fill="url(#lid)" stroke="#bca06d" strokeWidth="5"/><path d="M402 88 817 209 774 383 363 263Z" fill="none" stroke="#b99d6b" strokeDasharray="2 3" opacity=".6"/><path d="M250 330 730 490 805 390 350 240Z" fill="url(#base)" stroke="#f6dfaf" strokeWidth="3"/><path d="M350 240 805 390 785 405 345 276Z" fill="#bfa06b"/></svg>
   <div className="archive-card-slots">{cards.map((p,i)=><button key={p.title} className={`archive-project archive-project-${i} ${selected===i?'lifted':''}`} style={{'--slot':i,'--tone':details[i].tone} as CSSProperties} aria-label={`Open ${p.title}`} onMouseEnter={()=>setSelected(i)} onFocus={()=>setSelected(i)} onMouseLeave={()=>setSelected(null)} onClick={()=>i<projects.length?onOpen(i):location.assign('/?experience=island')}><span className="archive-card-icon">{details[i].icon}</span><small>0{i+1}</small><div><span>{p.title}</span><strong>{details[i].metric}</strong><em>{details[i].label}</em><b>{p.type}</b></div><ArrowUpRight size={13}/></button>)}</div>
   <svg className="archive-box-front" viewBox="0 0 1000 620" aria-hidden="true"><defs><linearGradient id="front" x2="1" y2="1"><stop stopColor="#dabc86"/><stop offset="1" stopColor="#c49e68"/></linearGradient></defs><path d="M250 330 730 490 730 545 255 385Z" fill="url(#front)" stroke="#e5ca96" strokeWidth="2"/><path d="M730 490 805 390 805 450 730 545Z" fill="#c5a26b"/><path d="M250 330 730 490 805 390" fill="none" stroke="#fae4b5" strokeWidth="4"/><text x="399" y="274" transform="skewY(18.3)" fontSize="16" fill="#886d42" fontFamily="Arial,sans-serif" letterSpacing="2">THINGS I BUILT</text></svg>
  </div>
  <div className="archive-picker">{cards.map((p,i)=><button key={p.title} onMouseEnter={()=>setSelected(i)} onMouseLeave={()=>setSelected(null)} onFocus={()=>setSelected(i)} onClick={()=>i<projects.length?onOpen(i):location.assign('/?experience=island')} style={{'--tone':details[i].tone} as CSSProperties}><span>0{i+1}</span><div><strong>{p.title}</strong><small>{i===0?'IISc · Internship':i===1?'Automation':i===2?'AI product':i===3?'Community':'Play the experience'}</small></div></button>)}</div>
 </section>;
}
