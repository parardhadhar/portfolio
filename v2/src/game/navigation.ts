import type { Collider } from './physics';
export interface Point2 { x: number; z: number }
export function walkable(x:number,z:number,colliders:readonly Collider[],radius=.5) {
  if(Math.hypot(x,z)>40.5)return false;
  return !colliders.some(o=>'r' in o?Math.hypot(x-o.x,z-o.z)<o.r+radius:Math.hypot(x-Math.max(o.x-o.halfX,Math.min(x,o.x+o.halfX)),z-Math.max(o.z-o.halfZ,Math.min(z,o.z+o.halfZ)))<radius);
}
// Small A* grid for residents: routes are planned once per task, never per frame.
export function findWalkingPath(from:Point2,to:Point2,colliders:readonly Collider[]):Point2[] {
 const key=(x:number,z:number)=>`${x},${z}`;
 const nearest=(p:Point2)=>{
  const x=Math.round(p.x),z=Math.round(p.z);
  for(let r=0;r<6;r++)for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++)if(Math.max(Math.abs(dx),Math.abs(dz))===r&&walkable(x+dx,z+dz,colliders,.65))return {x:x+dx,z:z+dz};
  return null;
 };
 const start=nearest(from),end=nearest(to);if(!start||!end)return [];
 const open=[{...start,g:0,f:Math.hypot(start.x-end.x,start.z-end.z)}];
 const scores=new Map<string,number>([[key(start.x,start.z),0]]);const parents=new Map<string,string>();const closed=new Set<string>();
 let steps=0;
 while(open.length&&steps++<6000){
  open.sort((a,b)=>b.f-a.f);const current=open.pop()!;const id=key(current.x,current.z);if(closed.has(id))continue;
  if(current.x===end.x&&current.z===end.z){const path:Point2[]=[];let next:string|undefined=id;while(next){const [x,z]=next.split(',').map(Number);path.push({x,z});next=parents.get(next);}return path.reverse();}
  closed.add(id);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
   const x=current.x+dx,z=current.z+dz,nid=key(x,z);
   if(closed.has(nid)||!walkable(x,z,colliders,.65)||!walkable(current.x+dx*.5,current.z+dz*.5,colliders,.65))continue;
   if(dx&&dz&&(!walkable(current.x+dx,current.z,colliders,.65)||!walkable(current.x,current.z+dz,colliders,.65)))continue;
   const g=current.g+Math.hypot(dx,dz);if(g>=(scores.get(nid)??Infinity))continue;
   scores.set(nid,g);parents.set(nid,id);open.push({x,z,g,f:g+Math.hypot(x-end.x,z-end.z)});
  }
 }
 return [];
}
