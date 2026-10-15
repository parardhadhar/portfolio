import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export default function DraggableNote({children,className,style,label='Move sticky note'}:{children:ReactNode;className:string;style?:CSSProperties;label?:string}){
 const position=useRef({x:0,y:0}),drag=useRef<{x:number;y:number;originX:number;originY:number}|null>(null);
 const move=(element:HTMLElement,x:number,y:number)=>{
  const bounds=element.parentElement?.getBoundingClientRect();
  const limitX=Math.max(80,(bounds?.width||500)*.4),limitY=140;
  position.current={x:Math.max(-limitX,Math.min(limitX,x)),y:Math.max(-limitY,Math.min(limitY,y))};
  element.style.setProperty('--drag-x',`${position.current.x}px`);element.style.setProperty('--drag-y',`${position.current.y}px`);
 };
 return <div className={`${className} draggable-note`} style={style} tabIndex={0} role="group" aria-label={`${label}. Drag, or use arrow keys to move; Home to reset.`}
  onPointerDown={e=>{if(e.button!==0||(e.target as HTMLElement).closest('a,button,input,textarea'))return;e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,originX:position.current.x,originY:position.current.y};e.currentTarget.dataset.dragging='true';}}
  onPointerMove={e=>{const start=drag.current;if(!start)return;move(e.currentTarget,start.originX+e.clientX-start.x,start.originY+e.clientY-start.y);}}
  onPointerUp={e=>{drag.current=null;delete e.currentTarget.dataset.dragging;}}
  onPointerCancel={e=>{drag.current=null;delete e.currentTarget.dataset.dragging;}}
  onKeyDown={e=>{const steps:Record<string,[number,number]>={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,-15],ArrowDown:[0,15]};if(e.key==='Home'){e.preventDefault();move(e.currentTarget,0,0);}else if(steps[e.key]){e.preventDefault();const [x,y]=steps[e.key];move(e.currentTarget,position.current.x+x,position.current.y+y);}}}>{children}</div>;
}
