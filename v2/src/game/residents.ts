import * as THREE from 'three';
import { findWalkingPath, type Point2 } from './navigation';
import type { Collider } from './physics';

import { islandResidents } from './residentData';

export interface ResidentInfo {name:string;role:string;task:string}
interface Resources {scene:THREE.Scene;colliders:Collider[];geometries:THREE.BufferGeometry[];materials:THREE.Material[];textures:THREE.Texture[]}
export function createResidents({scene,colliders,geometries,materials,textures}:Resources){
 const cache=new Map<string,THREE.MeshStandardMaterial>();
 const material=(color:string)=>{let m=cache.get(color);if(!m){m=new THREE.MeshStandardMaterial({color,roughness:.8});cache.set(color,m);materials.push(m);}return m;};
 const cubeGeo=new THREE.BoxGeometry(1,1,1);geometries.push(cubeGeo);
 const headGeo=new THREE.SphereGeometry(1,10,8);geometries.push(headGeo);
 const mesh=(parent:THREE.Object3D,color:string,x:number,y:number,z:number,w:number,h:number,d:number,round=false)=>{const m=new THREE.Mesh(round?headGeo:cubeGeo,material(color));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const people=islandResidents.map((resident,index)=>{
  const root=new THREE.Group();const start=resident.route[index%resident.route.length];root.position.set(start.x,.8,start.z);scene.add(root);
  const skin=['#d6a27b','#a86b4c','#e1b58d','#c28e69'][index%4];
  const torso=new THREE.Group();root.add(torso);
  mesh(torso,resident.color,0,1.12,0,.52,.62,.32);
  mesh(torso,skin,0,1.68,0,.25,.28,.24,true);
  mesh(torso,'#443e38',0,1.86,-.04,.24,.12,.23,true);
  // A visible cap, glasses, satchel or tools makes each profession legible.
  if(index===0||index===5){mesh(torso,'#dec99c',0,1.91,0,.36,.045,.32);mesh(torso,'#cfb17c',0,1.97,0,.24,.12,.23);}
  if(index===1||index===6){mesh(torso,'#e4e9dc',0,1.06,.01,.56,.7,.34);mesh(torso,'#3e5759',0,1.73,.23,.35,.09,.03);}
  if(index===2){mesh(torso,'#8a674d',0,1.1,-.24,.46,.48,.2);mesh(torso,'#dfc599',.38,1.03,.2,.35,.35,.35);mesh(torso,'#c29468',.38,1.03,.38,.07,.35,.01);}
  if(index===4){mesh(torso,'#d6c391',0,1.95,0,.3,.12,.27,true);mesh(torso,'#4d7560',0,1.07,.18,.38,.52,.04);}
  const arms=[-1,1].map(side=>{const pivot=new THREE.Group();pivot.position.set(side*.36,1.32,0);torso.add(pivot);mesh(pivot,resident.color,0,-.18,0,.15,.4,.16);mesh(pivot,skin,0,-.43,0,.14,.14,.15,true);return pivot;});
  const legs=[-1,1].map(side=>{const pivot=new THREE.Group();pivot.position.set(side*.16,.8,0);root.add(pivot);mesh(pivot,'#46575b',0,-.26,0,.19,.53,.22);mesh(pivot,'#394844',0,-.51,.06,.22,.13,.33);return pivot;});
  if(index===0||index===5){mesh(arms[1],'#7aafac',0,-.47,.18,.26,.28,.24);const spout=mesh(arms[1],'#7aafac',.22,-.46,.18,.35,.06,.08);spout.rotation.z=.4;}
  if(index===1||index===3||index===6)mesh(arms[0],'#4d6669',0,-.39,.2,.29,.38,.04);
  if(index===4)mesh(arms[1],'#bdc5c2',0,-.5,.12,.1,.3,.08);
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const context=canvas.getContext('2d')!;
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;textures.push(texture);
  const labelMaterial=new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false});materials.push(labelMaterial);
  const label=new THREE.Sprite(labelMaterial);label.position.set(0,2.7,0);label.scale.set(5.3,1.325,1);root.add(label);
  const walking=false;
  const paint=(task:string)=>{context.clearRect(0,0,512,128);context.fillStyle='#f7f5ebed';context.beginPath();context.roundRect(0,0,512,128,18);context.fill();context.fillStyle=resident.color;context.fillRect(0,0,7,128);context.textAlign='center';context.fillStyle='#344339';context.font='600 48px Arial';context.fillText(resident.name.toUpperCase(),256,55);context.fillStyle='#64775c';context.font='25px Arial';context.fillText(task.startsWith('Walking')||task.startsWith('Delivering')?'ON THE MOVE':resident.role.toUpperCase(),256,98);texture.needsUpdate=true;};
  paint(resident.task);
  const waterGeometry=new THREE.BufferGeometry();const drops=new Float32Array(12*3);waterGeometry.setAttribute('position',new THREE.BufferAttribute(drops,3));geometries.push(waterGeometry);
  const waterMaterial=new THREE.PointsMaterial({color:'#82cde3',size:.055,transparent:true,opacity:.85});materials.push(waterMaterial);
  const water=new THREE.Points(waterGeometry,waterMaterial);water.position.set(.6,.9,.3);root.add(water);
  return {resident,index,root,torso,arms,legs,label,water,drops,waterGeometry,walking,paint,phase:index%resident.route.length,wait:index*.8,path:[] as Point2[],waypoint:0};
 });
 let nearby:ResidentInfo|null=null;
 return {
  update(dt:number,time:number,rover:Point2,reduced:boolean){
   nearby=null;let closest=5;
   people.forEach(person=>{
    const {resident,root,index}=person;
    const carDistance=Math.hypot(root.position.x-rover.x,root.position.z-rover.z);
    person.label.visible=carDistance<9;
    if(carDistance<closest){closest=carDistance;nearby={name:resident.name,role:resident.role,task:person.walking?'On the way to the next task':resident.task};}
    let moved=false;
    if(person.wait>0){person.wait-=dt;if(person.wait<=0){person.phase=(person.phase+1)%resident.route.length;const goal=resident.route[person.phase];person.path=findWalkingPath({x:root.position.x,z:root.position.z},goal,colliders);person.waypoint=0;if(!person.path.length)person.wait=2;}}
    else if(person.path.length){const target=person.path[person.waypoint];const dx=target.x-root.position.x,dz=target.z-root.position.z;const distance=Math.hypot(dx,dz);
     if(distance<.12){person.waypoint++;if(person.waypoint>=person.path.length){person.path=[];person.wait=resident.seconds;}}
     else if(carDistance>2.5){const step=Math.min(distance,dt*(index===2?1.9:1.15));root.position.x+=dx/distance*step;root.position.z+=dz/distance*step;const desired=Math.atan2(dx,dz);const change=Math.atan2(Math.sin(desired-root.rotation.y),Math.cos(desired-root.rotation.y));root.rotation.y+=change*Math.min(1,dt*10);moved=true;}
    }else person.wait=resident.seconds;
    if(moved!==person.walking){person.walking=moved;person.paint(moved?(index===2?'Delivering a parcel':'Walking to the next task'):resident.task);}
    const cycle=time*(index===2?8:6)+index;
    person.legs.forEach((leg,i)=>leg.rotation.x=reduced?0:moved?Math.sin(cycle+i*Math.PI)*.55:0);
    person.arms.forEach((arm,i)=>{arm.rotation.x=reduced?0:moved?Math.sin(cycle+i*Math.PI)*-.38:Math.sin(time*2+index)*.15-.4;arm.rotation.z=moved?0:(i===1?-.3:.2);});
    person.torso.position.y=reduced?0:moved?Math.abs(Math.sin(cycle))*.045:Math.sin(time*1.5+index)*.015;
    person.water.visible=!moved&&(index===0||index===5);
    if(person.water.visible&&!reduced){for(let i=0;i<12;i++){const age=(time*1.3+i/12)%1;person.drops[i*3]=age*.55;person.drops[i*3+1]=-age*age*.9;person.drops[i*3+2]=Math.sin(i)*.05;}person.waterGeometry.attributes.position.needsUpdate=true;}
   });
  },
  nearby:()=>nearby,
  colliders:():Collider[]=>people.map(person=>({x:person.root.position.x,z:person.root.position.z,r:.3})),
 };
}
