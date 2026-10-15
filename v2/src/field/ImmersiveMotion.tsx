import { useEffect, useRef } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import './ImmersiveMotion.css';

export function MotionSeam({variant=0}:{variant?:number}){
 return <div className={`motion-seam seam-${variant}`} aria-hidden="true"><i/><span>{variant%2?<Compass/>:<Sparkles/>}</span><i/><b>✳</b><small>{variant%2?'THE NEXT LITTLE ADVENTURE':'FOLLOW YOUR CURIOSITY'}</small></div>;
}

export default function ImmersiveMotion(){
 const bar=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,pointerFrame=0;const root=document.querySelector('.field-notes') as HTMLElement|null;
  if(!root)return;
  const targets=[...root.querySelectorAll<HTMLElement>('.fn-hero h1,.fn-section h2,.story-body,.research-copy>p,.studio-heading>p,.fn-contact>p,.process-intro>p,.section-heading>p,.process-step strong,.process-step p')];
  const originals=new Map<Text,string>();const replacements:{span:HTMLElement;text:Text}[]=[];
  // Preserve the authored markup, inline illustrations and accessible reading order.
  targets.forEach(target=>{
   if(target.dataset.motionSplit)return;
   const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.textContent?.trim()&&!(node.parentElement?.closest('.text-detail,.inline-charm,.motion-word'))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
   const nodes:Text[]=[];while(walker.nextNode())nodes.push(walker.currentNode as Text);
   const count=nodes.reduce((sum,n)=>sum+(n.textContent?.trim().split(/\s+/).length||0),0);let word=0;
   nodes.forEach(node=>{originals.set(node,node.data);const span=document.createElement('span');span.className='motion-text-run';node.data.split(/(\s+)/).forEach(part=>{if(!part.trim()){span.append(document.createTextNode(part));return;}const token=document.createElement('span');token.className='motion-word';token.textContent=part;token.style.setProperty('--word-threshold',String((word++/Math.max(1,count-1))*.6));span.append(token);});node.replaceWith(span);replacements.push({span,text:node});});
   target.dataset.motionSplit='true';target.style.setProperty('--read',preference.matches?'1':'0');
  });
  const parallax=[...root.querySelectorAll<HTMLElement>('.research-art,.gift-trigger,.memory-board,.archive-scene,.studio-carousel')];
  const entrance=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(!entry.isIntersecting||preference.matches)return;
    const words=entry.target.querySelectorAll<HTMLElement>('.motion-word');
    words.forEach((word,index)=>word.animate([
     {opacity:.05,transform:'translateY(30px) rotateX(35deg)'},
     {opacity:1,transform:'translateY(0) rotateX(0deg)'}
    ],{duration:850,delay:Math.min(index*38,650),easing:'cubic-bezier(.16,1,.3,1)'}));
   });
  },{threshold:.15});
  targets.filter(el=>!el.closest('.fn-hero')).forEach(el=>entrance.observe(el));
  const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{
   entry.target.classList.toggle('motion-offscreen',!entry.isIntersecting);
   if(entry.target.matches('.fn-story,.club-memories,.process-section,.visitor-wall'))entry.target.classList.toggle('paper-enter',entry.isIntersecting);
  }),{rootMargin:'80px'});
  root.querySelectorAll('.fn-section,.fn-hero').forEach(el=>visibility.observe(el));
  const update=()=>{
   frame=0;const height=innerHeight,scroll=scrollY,total=document.documentElement.scrollHeight-height;
   bar.current?.style.setProperty('--page-progress',String(total>0?scroll/total:0));
   if(preference.matches){targets.forEach(el=>el.style.setProperty('--read','1'));return;}
   // Measure together before writing: alternating reads/writes forces repeated layout.
   const measurements=[...targets,...parallax].map(el=>({el,rect:el.getBoundingClientRect()}));
   measurements.forEach(({el,rect})=>{if(rect.bottom < -150||rect.top>height+150)return;const read=Math.max(0,Math.min(1,(height*.98-rect.top)/(height*.32+rect.height*.12)));el.style.setProperty('--read',read.toFixed(3));el.style.setProperty('--drift',`${Math.max(-18,Math.min(18,(rect.top+rect.height/2-height/2)*.025))}px`);});
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const pointerSurfaces=[...root.querySelectorAll<HTMLElement>('.scenery-layers,.archive-scene')];
  const pointer=(event:PointerEvent)=>{if(event.pointerType!=='mouse'||preference.matches||pointerFrame)return;const x=(event.clientX/innerWidth-.5)*14,y=(event.clientY/innerHeight-.5)*10;pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;pointerSurfaces.filter(el=>!el.closest('.motion-offscreen')).forEach(el=>{el.style.setProperty('--pointer-x',`${x}px`);el.style.setProperty('--pointer-y',`${y}px`);});});};
  const initial=setTimeout(update,100);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('pointermove',pointer,{passive:true});preference.addEventListener('change',schedule);update();
  return()=>{clearTimeout(initial);cancelAnimationFrame(frame);cancelAnimationFrame(pointerFrame);entrance.disconnect();visibility.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.removeEventListener('pointermove',pointer);preference.removeEventListener('change',schedule);replacements.forEach(({span,text})=>{text.data=originals.get(text)||'';span.replaceWith(text);});targets.forEach(el=>delete el.dataset.motionSplit);};
 },[]);
 return <><div className="reading-progress" ref={bar} aria-hidden="true"/><div className="ambient-orbits" aria-hidden="true"><span/><span/><Compass/></div></>;
}



