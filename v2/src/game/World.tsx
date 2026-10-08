import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { destinations, type DestinationId } from './data';
export interface WorldState { speed: number; collected: number; nearby: DestinationId | null; x: number; z: number }
export interface WorldController { pause: (value: boolean) => void; reset: () => void; input: (key: string, down: boolean) => void; travel: (id: DestinationId) => void }
interface Props { onReady: (controller: WorldController) => void; onState: (state: WorldState) => void; onError: () => void }

export default function World({ onReady, onState, onError }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const callbacks = useRef({onReady,onState,onError});
  useEffect(()=>{callbacks.current={onReady,onState,onError};},[onReady,onState,onError]);
  useEffect(()=>{
    const host=root.current;if(!host)return;
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch{callbacks.current.onError();return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor('#dce5d8');renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.outputColorSpace=THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','A three-dimensional island with a drivable rover and four portfolio destinations');renderer.domElement.setAttribute('role','img');
    const scene=new THREE.Scene();scene.background=new THREE.Color('#dce5d8');scene.fog=new THREE.Fog('#dce5d8',95,190);
    const camera=new THREE.OrthographicCamera(-50,50,32,-32,.1,240);
    const geometries:THREE.BufferGeometry[]=[];const materials:THREE.Material[]=[];const textures:THREE.Texture[]=[];
    const materialCache=new Map<string,THREE.MeshStandardMaterial>();
    const mat=(color:string,metalness=0)=>{const id=color+metalness;let m=materialCache.get(id);if(!m){m=new THREE.MeshStandardMaterial({color,roughness:.78,metalness});materials.push(m);materialCache.set(id,m);}return m;};
    const add=(geo:THREE.BufferGeometry,color:string,parent:THREE.Object3D=scene,x=0,y=0,z=0)=>{geometries.push(geo);const mesh=new THREE.Mesh(geo,mat(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
    const box=(w:number,h:number,d:number,color:string,parent:THREE.Object3D=scene,x=0,y=0,z=0,r=.1)=>add(new RoundedBoxGeometry(w,h,d,1,r),color,parent,x,y,z);
    const cylinder=(r1:number,r2:number,h:number,color:string,parent:THREE.Object3D=scene,x=0,y=0,z=0,segments=12)=>add(new THREE.CylinderGeometry(r1,r2,h,segments),color,parent,x,y,z);
    const sphere=(radius:number,color:string,parent:THREE.Object3D=scene,x=0,y=0,z=0)=>add(new THREE.IcosahedronGeometry(radius,1),color,parent,x,y,z);
    const label=(text:string,x:number,y:number,z:number,width:number,color='#393d34',bg:string|null=null,parent:THREE.Object3D=scene)=>{
      const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d')!;
      if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,1024,256);}ctx.fillStyle=color;ctx.font='bold 78px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,128);
      const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();textures.push(tex);
      const m=new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false});materials.push(m);const geo=new THREE.PlaneGeometry(width,width/4);geometries.push(geo);const mesh=new THREE.Mesh(geo,m);mesh.position.set(x,y,z);parent.add(mesh);return mesh;
    };
    scene.add(new THREE.HemisphereLight('#fff8e9','#7f9881',1.8));const sunlight=new THREE.DirectionalLight('#fff0d9',3);sunlight.position.set(-24,48,26);sunlight.castShadow=true;sunlight.shadow.mapSize.set(2048,2048);sunlight.shadow.camera.left=-45;sunlight.shadow.camera.right=45;sunlight.shadow.camera.top=45;sunlight.shadow.camera.bottom=-45;sunlight.shadow.normalBias=.08;sunlight.shadow.bias=-.0001;scene.add(sunlight);
    // Layered island, shallow water and a miniature road network.
    const water=add(new THREE.PlaneGeometry(400,400),'#b5cabe',scene,0,-2.7,0);water.rotation.x=-Math.PI/2;water.receiveShadow=false;
    cylinder(37.5,39,1.2,'#b9cbb4',scene,0,-1.8,0,80);
    cylinder(35.8,37.4,1.8,'#c6b496',scene,0,-.8,0,80);
    cylinder(35.7,35.7,.25,'#eee3c9',scene,0,.2,0,80);
    const road=add(new THREE.RingGeometry(21.2,26,96),'#d4c8b1',scene,0,.34,0);road.rotation.x=-Math.PI/2;road.receiveShadow=true;
    const stripe=add(new THREE.RingGeometry(23.45,23.55,96),'#f6f0dc',scene,0,.35,0);stripe.rotation.x=-Math.PI/2;
    box(5,.04,48,'#d4c8b1',scene,0,.35,0,.01);box(49,.04,5,'#d4c8b1',scene,0,.36,0,.01);
    for(let i=-20;i<=20;i+=4){box(.13,.015,1.1,'#f6f0dc',scene,0,.4,i,.01);box(1.1,.015,.13,'#f6f0dc',scene,i,.4,0,.01);}
    const obstacles:{x:number;z:number;r:number}[]=[];
    const decorative:THREE.Object3D[]=[];
    // Handmade low-poly flora; seeded placement keeps the island reproducible.
    let seed=71;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    const tree=(x:number,z:number,scale=1)=>{const group=new THREE.Group();group.position.set(x,.32,z);group.scale.setScalar(scale);scene.add(group);cylinder(.15,.24,1.8,'#8b7861',group,0,.8,0);sphere(1.1,'#7a9773',group,0,2.1,0);sphere(.75,'#a5b48a',group,.45,2.6,0);sphere(.8,'#91a680',group,-.6,2.15,.1);obstacles.push({x,z,r:.65*scale});};
    for(let i=0;i<42;i++){const angle=i/42*Math.PI*2;const r=29+random()*4;const x=Math.sin(angle)*r;const z=Math.cos(angle)*r; if(i%3===0){const rock=sphere(.5+random()*.7,'#c1b39a',scene,x,.65,z);rock.scale.y=.6;}else tree(x,z,.7+random()*.5);}
    [[-8,-6],[-9,7],[8,-6],[8,7],[-23,3],[23,-5]].forEach(([x,z])=>tree(x,z,.8));
    for(let i=0;i<28;i++){const angle=random()*Math.PI*2;const r=28+random()*6;const group=new THREE.Group();group.position.set(Math.cos(angle)*r,.4,Math.sin(angle)*r);scene.add(group);for(let k=0;k<3;k++){const leaf=box(.12,.7+random()*.4,.16,'#919a64',group,(k-1)*.18,.35,0,.01);leaf.rotation.z=(k-1)*-.4;}}
    // Studio: terracotta atelier with a broad window, steps and a tiny roof garden.
    const studio=new THREE.Group();studio.position.set(-16,.32,12);scene.add(studio);
    box(8,.45,7,'#c59f83',studio,0,.2,0,.2);box(6,3.7,4.5,'#d98f6e',studio,0,2.1,-.7,.15);box(6.5,.3,5,'#e9b493',studio,0,4.1,-.7,.1);box(4.5,2,.15,'#364b45',studio,0,2.35,1.62,.02);
    for(let i=-1;i<=1;i++)box(.12,2.1,.18,'#f4d7b9',studio,i*1.45,2.35,1.75,.01);
    label('THE STUDIO',0,4.7,1.4,5,'#564638',null,studio);box(3,.2,1,'#eee1c8',studio,0,.4,3,.02);cylinder(.8,.8,.35,'#eedec1',studio,2,4.45,-1);sphere(.75,'#90a879',studio,2,5.1,-1);
    obstacles.push({x:-16,z:11,r:3.6});
    // Project park: open-air gallery of colourful screens.
    const gallery=new THREE.Group();gallery.position.set(15,.32,11);scene.add(gallery);box(10,.35,7,'#c8c0d9',gallery,0,.15,0,.4);
    for(let i=0;i<3;i++){const g=new THREE.Group();g.position.set((i-1)*3,0,-.4);gallery.add(g);box(.17,2.2,.17,'#6e6a74',g,0,1.2,0);box(2.65,2,.4,['#9d9ccc','#e8ad85','#a4b78a'][i],g,0,2.8,0,.15);box(2.2,1.55,.05,'#343b3d',g,0,2.8,.24,.03);label(['</>','AI','3D'][i],0,2.8,.29,1.9,'#e9edc8',null,g);}
    label('PROJECT PARK',0,4.8,0,7,'#5c526d',null,gallery);obstacles.push({x:15,z:10,r:4});
    // Laboratory: domed observatory and a slowly turning satellite dish.
    const lab=new THREE.Group();lab.position.set(14,.32,-15);scene.add(lab);cylinder(4,4.2,.35,'#bcc4a1',lab,0,.1,0);cylinder(2.8,2.8,2.4,'#d3d8ae',lab,0,1.4,0,24);
    const dome=add(new THREE.SphereGeometry(2.85,24,12,0,Math.PI*2,0,Math.PI/2),'#9cae8d',lab,0,2.5,0);dome.castShadow=true;
    box(1.1,1.8,.2,'#4c6357',lab,0,1.3,2.8);box(5,.18,.18,'#e9eaca',lab,0,2.6,0);label('THE LAB',0,5.9,0,5,'#3d5546',null,lab);
    const dish=new THREE.Group();dish.position.set(-3.4,1.2,-1.5);lab.add(dish);cylinder(.1,.15,2,'#6c7b69',dish,0,.7,0);const bowl=add(new THREE.ConeGeometry(1,.4,20),'#e6e8d7',dish,0,1.9,0);bowl.rotation.z=.8;decorative.push(dish);obstacles.push({x:14,z:-15,r:3.5});
    // Hello station: a playful oversized mailbox and a striped signal tower.
    const hello=new THREE.Group();hello.position.set(-15,.32,-14);scene.add(hello);box(8,.35,7,'#deca9d',hello,0,.15,0,.5);box(3,3.5,2.5,'#edbd70',hello,0,2,0,.4);box(2.5,.2,.12,'#755e49',hello,0,2.5,1.3,.02);box(.45,.9,.3,'#d76f57',hello,1.7,3,0,.03);label('SAY HELLO',0,4.8,.8,6,'#76523b',null,hello);label('@',0,1.5,1.3,1.8,'#fff4cf',null,hello);
    cylinder(.2,.25,7,'#e2c9a6',hello,-3,3.5,-1);for(let i=0;i<4;i++)cylinder(.205,.205,.4,'#bf7755',hello,-3,1+i*1.5,-1);sphere(.4,'#e59868',hello,-3,7.2,-1);obstacles.push({x:-15,z:-14,r:2.9});
    // Destination markers are deliberately beside each building, reachable from the road.
    const markers:THREE.Object3D[]=[];
    destinations.forEach(d=>{const group=new THREE.Group();group.position.set(d.x,.4,d.z+5.4);scene.add(group);const ring=add(new THREE.TorusGeometry(1.8,.07,6,48),d.color,group);ring.rotation.x=-Math.PI/2;markers.push(ring);cylinder(.045,.045,2.3,'#737c67',group,-2,1,0,6);box(1.1,.65,.06,d.color,group,-1.45,1.8,0,.02);label(d.number,-1.45,1.8,.045,.75,'#424638',null,group);});
    // Landscape lettering and the island's little navigation sign.
    const title=label('PARARDHA’S ISLAND',0,.42,7.5,17,'#978c75');title.rotation.x=-Math.PI/2;
    const sub=label('MAKE • EXPLORE • REPEAT',0,.43,10.5,11,'#afa286');sub.rotation.x=-Math.PI/2;
    cylinder(.12,.18,3.6,'#9a856b',scene,0,1.8,-6);box(5.3,.75,.2,'#f3e9d1',scene,0,3.2,-6,.04);label('← STUDIO     WORK →',0,3.2,-5.88,4.6,'#766d57');
    // Little rover, modelled from simple solids, with independent wheels and suspension.
    const rover=new THREE.Group();scene.add(rover);const body=new THREE.Group();rover.add(body);
    box(1.7,.5,2.7,'#e78656',body,0,.95,0,.18);box(1.45,.7,1.25,'#f2b881',body,0,1.45,-.2,.16);box(1.2,.44,.08,'#465f59',body,0,1.52,.49,.04);box(1.2,.44,.08,'#465f59',body,0,1.52,-.86,.04);
    box(.08,.4,.85,'#465f59',body,-.74,1.52,-.2,.03);box(.08,.4,.85,'#465f59',body,.74,1.52,-.2,.03);box(1.9,.2,.2,'#e6cfaa',body,0,.8,1.4,.03);box(1.9,.2,.2,'#585e50',body,0,.8,-1.4,.03);
    [-.55,.55].forEach(x=>{box(.32,.25,.12,'#fff0b9',body,x,1.05,1.36,.04);box(.25,.18,.1,'#a64038',body,x,1,-1.37,.02);});
    box(1.1,.12,.85,'#556553',body,0,1.9,-.2,.02);cylinder(.035,.04,1.15,'#3d4e42',body,.65,2.1,-.65,6);sphere(.09,'#cde68b',body,.65,2.69,-.65);
    const wheels:THREE.Mesh[]=[];[-1,1].forEach(x=>[-.87,.87].forEach(z=>{const wheel=cylinder(.4,.4,.3,'#3c453d',rover,x,.6,z,16);wheel.rotation.z=Math.PI/2;wheels.push(wheel);const hub=cylinder(.18,.18,.32,'#c3beaa',rover,x,.6,z,12);hub.rotation.z=Math.PI/2;}));
    const shadow=add(new THREE.CircleGeometry(1.65,32),'#b8ad92',rover,0,.04,0);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;shadow.receiveShadow=false;
    const dusts:THREE.Mesh[]=[];for(let i=0;i<12;i++){const dust=sphere(.14,'#eee3c9');dust.visible=false;dusts.push(dust);}
    const cells:{mesh:THREE.Group;x:number;z:number;found:boolean}[]=[];
    for(let i=0;i<12;i++){const angle=(i/12)*Math.PI*2;const x=Math.sin(angle)*23.6;const z=Math.cos(angle)*23.6;const group=new THREE.Group();group.position.set(x,1.5,z);scene.add(group);add(new THREE.OctahedronGeometry(.56),'#d4a942',group);const halo=add(new THREE.TorusGeometry(.83,.035,5,24),'#f9e8a6',group);halo.rotation.x=Math.PI/2;cells.push({mesh:group,x,z,found:false});}
    // Clouds beyond the shoreline add depth without obscuring the play area.
    const clouds:THREE.Group[]=[];for(let i=0;i<7;i++){const cloud=new THREE.Group();const a=i/7*Math.PI*2;cloud.position.set(Math.cos(a)*58,8+random()*4,Math.sin(a)*55);scene.add(cloud);for(let j=0;j<3;j++){const puff=sphere(2+random(),'#edf0df',cloud,(j-1)*2.5,random(),0);puff.scale.y=.5;puff.castShadow=false;}clouds.push(cloud);}
    let x=0,z=5,angle=Math.PI,speed=0,collected=0,paused=true,hasStarted=false,disposed=false,frame=0,last=performance.now(),lastReport=0;
    const keys=new Set<string>();const look=new THREE.Vector3(-14,0,1);const wanted=new THREE.Vector3();const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const report=()=>{const nearby=destinations.find(d=>Math.hypot(x-d.x,z-(d.z+5.4))<4)?.id??null;callbacks.current.onState({speed:Math.abs(speed),collected,nearby,x,z});};
    const reset=()=>{x=0;z=5;angle=Math.PI;speed=0;keys.clear();report();};
    const controls:WorldController={pause:value=>{paused=value;if(!value)hasStarted=true;keys.clear();speed=0;},reset,input:(key,down)=>{if(down)keys.add(key);else keys.delete(key);},travel:id=>{const d=destinations.find(d=>d.id===id);if(d){x=d.x;z=d.z+5.4;angle=Math.PI;speed=0;keys.clear();report();}}};
    const map:Record<string,string>={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right',shift:'boost'};
    const onDown=(event:KeyboardEvent)=>{if(paused)return;const target=event.target as HTMLElement;if(target.closest('input,textarea,[contenteditable="true"]'))return;const key=map[event.key.toLowerCase()];if(key){event.preventDefault();keys.add(key);}};
    const onUp=(event:KeyboardEvent)=>{const key=map[event.key.toLowerCase()];if(key)keys.delete(key);};
    const blur=()=>{keys.clear();speed=0;};window.addEventListener('keydown',onDown);window.addEventListener('keyup',onUp);window.addEventListener('blur',blur);
    const resize=()=>{const w=host.clientWidth;const h=host.clientHeight;const aspect=w/h;const extent=w<700?44:30;camera.left=-extent*aspect;camera.right=extent*aspect;camera.top=extent;camera.bottom=-extent;camera.updateProjectionMatrix();renderer.setSize(w,h);};const observer=new ResizeObserver(resize);observer.observe(host);resize();
    const tick=(now:number)=>{
      if(disposed)return;const dt=Math.min((now-last)/1000,.04);last=now;
      if(!paused){const throttle=(keys.has('up')?1:0)-(keys.has('down')?1:0);const boost=keys.has('boost');const max=boost?13:8;speed+=throttle*12*dt;speed*=Math.exp(-(throttle?1.0:3.4)*dt);speed=THREE.MathUtils.clamp(speed,-5,max);
        const steering=(keys.has('left')?1:0)-(keys.has('right')?1:0);angle+=steering*dt*2.2*Math.min(Math.abs(speed)/3,1)*Math.sign(speed||1);
        const nx=x+Math.sin(angle)*speed*dt;const nz=z+Math.cos(angle)*speed*dt;
        if(Math.hypot(nx,nz)>34.3||obstacles.some(o=>Math.hypot(nx-o.x,nz-o.z)<o.r+.9)){speed*=-.3;}else{x=nx;z=nz;}
        cells.forEach(cell=>{if(!cell.found&&Math.hypot(x-cell.x,z-cell.z)<1.9){cell.found=true;cell.mesh.visible=false;collected++;report();}});
      }
      rover.position.set(x,.37,z);rover.rotation.y=angle;body.rotation.z=THREE.MathUtils.damp(body.rotation.z,((keys.has('left')?1:0)-(keys.has('right')?1:0))*speed*.012,8,dt);wheels.forEach(wheel=>wheel.rotation.x+=speed*dt*2);
      if(!reduced.matches){cells.forEach((cell,i)=>{cell.mesh.position.y=1.5+Math.sin(now*.002+i)*.18;cell.mesh.rotation.y=now*.001;});decorative.forEach(item=>item.rotation.y=now*.0004);markers.forEach((marker,i)=>marker.scale.setScalar(1+Math.sin(now*.002+i)*.05));}
      dusts.forEach((dust,i)=>{dust.visible=!paused&&Math.abs(speed)>3;const t=((now*.001+i*.1)%1);dust.position.set(x-Math.sin(angle)*(1.5+t*2)+(i%3-1)*.25,.48+t*.35,z-Math.cos(angle)*(1.5+t*2));dust.scale.setScalar(.5+t*2);});
      wanted.set(hasStarted?x*.8:-14,0,hasStarted?z*.8:1);look.lerp(wanted,1-Math.exp(-dt*2.4));camera.position.set(look.x+40,49,look.z+43);camera.lookAt(look);camera.zoom=THREE.MathUtils.damp(camera.zoom,hasStarted?1.4:.95,2,dt);camera.updateProjectionMatrix();
      renderer.render(scene,camera);if(now-lastReport>100){report();lastReport=now;}frame=requestAnimationFrame(tick);
    };
    const visibility=()=>{blur();if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}};document.addEventListener('visibilitychange',visibility);
    const lost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(frame);callbacks.current.onError();};renderer.domElement.addEventListener('webglcontextlost',lost);
    frame=requestAnimationFrame(tick);callbacks.current.onReady(controls);report();
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('keydown',onDown);window.removeEventListener('keyup',onUp);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);renderer.domElement.removeEventListener('webglcontextlost',lost);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div className="world-canvas" ref={root}/>;
}
