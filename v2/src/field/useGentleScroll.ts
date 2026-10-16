import { useEffect } from 'react';

// Ease mouse-wheel steps without changing touch, keyboard, or nested panel scrolling.
export default function useGentleScroll(){
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,target=scrollY,last=0;
  const stop=()=>{cancelAnimationFrame(frame);frame=0;target=scrollY;};
  const tick=()=>{const gap=target-scrollY;if(Math.abs(gap)<.7){window.scrollTo({top:target,behavior:'instant'});frame=0;return;}window.scrollTo({top:scrollY+gap*.16,behavior:'instant'});frame=requestAnimationFrame(tick);};
  const wheel=(event:WheelEvent)=>{
   if(reduced.matches||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||(!event.deltaMode&&Math.abs(event.deltaY)<45))return;
   let el=event.target instanceof Element?event.target:null;
   while(el&&el!==document.body){const style=getComputedStyle(el);if(el.matches('dialog,textarea,input,select')||(/auto|scroll/.test(style.overflowY)&&el.scrollHeight>el.clientHeight+2))return;el=el.parentElement;}
   event.preventDefault();const now=performance.now();if(!frame||now-last>180)target=scrollY;last=now;
   const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
   target=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,target+Math.max(-200,Math.min(200,delta*.65))));
   if(!frame)frame=requestAnimationFrame(tick);
  };
  window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('touchstart',stop,{passive:true});window.addEventListener('keydown',stop);window.addEventListener('pointerdown',stop);
  return()=>{stop();window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',stop);window.removeEventListener('keydown',stop);window.removeEventListener('pointerdown',stop);};
 },[]);
}
