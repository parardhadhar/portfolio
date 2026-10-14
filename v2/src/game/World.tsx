import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { destinations, type DestinationId } from './data';
import { moveRover, type Collider } from './physics';
import { createResidents, type ResidentInfo } from './residents';
export interface WorldState { speed: number; collected: number; nearby: DestinationId | null; x: number; z: number; resident?: ResidentInfo | null }
export interface WorldController { pause: (value: boolean) => void; reset: () => void; input: (key: string, down: boolean) => void; travel: (id: DestinationId) => void; setNight: (night: boolean) => void; zoom: (delta:number) => void; setJoystick: (x: number, y: number, boost: boolean) => void }
interface Props { onReady: (controller: WorldController) => void; onState: (state: WorldState) => void; onError: () => void; isNight?: boolean }

export default function World({ onReady, onState, onError, isNight = false }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<WorldController | null>(null);
  const nightValue=useRef(isNight);
  const callbacks = useRef({onReady,onState,onError});
  useEffect(()=>{callbacks.current={onReady,onState,onError};},[onReady,onState,onError]);
  useEffect(()=>{nightValue.current=isNight;controllerRef.current?.setNight(isNight);},[isNight]);
  useEffect(()=>{
    const host=root.current;if(!host)return;
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch{callbacks.current.onError();return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio, matchMedia('(max-width: 700px)').matches ? 1.5 : 2));renderer.setClearColor('#c4dbd0');renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.outputColorSpace=THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','A 3D island portfolio world');renderer.domElement.setAttribute('role','img');
    const scene=new THREE.Scene();scene.background=new THREE.Color('#c4dbd0');scene.fog=new THREE.FogExp2('#c4dbd0',.007);
    const camera=new THREE.OrthographicCamera(-50,50,32,-32,.1,300);
    const geometries:THREE.BufferGeometry[]=[];const materials:THREE.Material[]=[];const textures:THREE.Texture[]=[];
    const materialCache=new Map<string,THREE.MeshStandardMaterial>();
    const mat=(color:string,metalness=0,roughness=.78)=>{const id=color+metalness+roughness;let m=materialCache.get(id);if(!m){m=new THREE.MeshStandardMaterial({color,roughness,metalness});materials.push(m);materialCache.set(id,m);}return m;};
    const matCustom=(opts:{color:string;roughness?:number;metalness?:number;transparent?:boolean;opacity?:number;side?:THREE.Side;depthWrite?:boolean})=>{const m=new THREE.MeshStandardMaterial({color:opts.color,roughness:opts.roughness??0.78,metalness:opts.metalness??0,transparent:opts.transparent??false,opacity:opts.opacity??1,side:opts.side??THREE.FrontSide,depthWrite:opts.depthWrite??true});materials.push(m);return m;};
    const geo=(g:THREE.BufferGeometry)=>{geometries.push(g);return g;};
    const add=(g:THREE.BufferGeometry,color:string,parent:THREE.Object3D=scene,x=0,y=0,z=0)=>{const mesh=new THREE.Mesh(geo(g),mat(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
    const addM=(g:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D=scene,x=0,y=0,z=0)=>{const mesh=new THREE.Mesh(geo(g),m);mesh.position.set(x,y,z);parent.add(mesh);return mesh;};
    const box=(w:number,h:number,d:number,color:string,parent:THREE.Object3D=scene,x=0,y=0,z=0,r=.1)=>{const g=new RoundedBoxGeometry(w,h,d,1,r);geometries.push(g);const mesh=new THREE.Mesh(g,mat(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
    const cylinder=(r1:number,r2:number,h:number,color:string,parent:THREE.Object3D=scene,x=0,y=0,z=0,seg=12)=>add(new THREE.CylinderGeometry(r1,r2,h,seg),color,parent,x,y,z);
    const sphere=(r:number,color:string,parent:THREE.Object3D=scene,x=0,y=0,z=0)=>add(new THREE.IcosahedronGeometry(r,1),color,parent,x,y,z);
    const label=(text:string,x:number,y:number,z:number,width:number,color='#393d34',bg:string|null=null,parent:THREE.Object3D=scene,fsize=78)=>{
      const cv=document.createElement('canvas');cv.width=1024;cv.height=256;const ctx=cv.getContext('2d')!;
      if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,1024,256);}
      ctx.fillStyle=color;ctx.font=`bold ${fsize}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,128);
      const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();textures.push(tex);
      const m=new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false});materials.push(m);
      const g=new THREE.PlaneGeometry(width,width/4);geometries.push(g);const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);parent.add(mesh);return mesh;
    };

    // LIGHTS
    const hemiLight=new THREE.HemisphereLight('#e8f5ff','#80b885',2.0);scene.add(hemiLight);
    const sun=new THREE.DirectionalLight('#ffe8a8',3.2);sun.position.set(-30,58,30);sun.castShadow=true;sun.shadow.mapSize.set(matchMedia('(max-width: 700px)').matches?1024:2048,matchMedia('(max-width: 700px)').matches?1024:2048);sun.shadow.camera.left=-65;sun.shadow.camera.right=65;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;sun.shadow.radius=3;sun.shadow.normalBias=.045;sun.shadow.bias=-.0001;scene.add(sun);
    const fillLight=new THREE.DirectionalLight('#a8d8ff',.7);fillLight.position.set(30,20,-20);scene.add(fillLight);

    // OCEAN
    const wMat=matCustom({color:'#52a89e',roughness:.32});
    const waterTime={value:0};
    wMat.onBeforeCompile=shader=>{shader.uniforms.uIslandTime=waterTime;shader.vertexShader='uniform float uIslandTime;\n'+shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n transformed.z += sin(position.x * .22 + uIslandTime) * .13 + cos(position.y * .18 + uIslandTime * .7) * .12;');};
    const wGeo=new THREE.PlaneGeometry(600,600,90,90);const wPos=wGeo.attributes.position;
    for(let i=0;i<wPos.count;i++){wPos.setZ(i,Math.sin(wPos.getX(i)*.09)*Math.cos(wPos.getY(i)*.09)*.14);}
    wGeo.computeVertexNormals();const ocean=addM(wGeo,wMat);ocean.rotation.x=-Math.PI/2;ocean.position.y=-3.3;

    // ISLAND BASE (bigger ~45 radius)
    add(new THREE.CylinderGeometry(48,50,1.1,96),'#85b098',scene,0,-1.8,0);
    add(new THREE.CylinderGeometry(46,47.8,1.9,96),'#c8a97a',scene,0,-.6,0);
    add(new THREE.CylinderGeometry(45.5,45.5,.22,96),'#e8dcb8',scene,0,.52,0);
    // Beach rim
    const beachRing=add(new THREE.RingGeometry(39,45.5,80),'#e5d8b0');beachRing.rotation.x=-Math.PI/2;beachRing.position.y=.54;
    // Inner grass plateau
    add(new THREE.CylinderGeometry(38.5,39,.2,80),'#a6c492',scene,0,.62,0);
    // ROADS
    const roadRing=add(new THREE.RingGeometry(24.5,30,128),'#cec4a5');roadRing.rotation.x=-Math.PI/2;roadRing.position.y=.76;roadRing.receiveShadow=true;
    const centerStripe=add(new THREE.RingGeometry(27.1,27.3,128),'#ede5c8');centerStripe.rotation.x=-Math.PI/2;centerStripe.position.y=.77;

    // CROSSROADS
    box(5.5,.04,60,'#cec4a5',scene,0,.76,0,.01);box(60,.04,5.5,'#cec4a5',scene,0,.77,0,.01);
    for(let i=-24;i<=24;i+=5){if(Math.abs(i)>4){box(.16,.015,1.8,'#ede5c8',scene,0,.8,i,.01);box(1.8,.015,.16,'#ede5c8',scene,i,.8,0,.01);}}

    // CENTRAL ROUNDABOUT PLAZA (Level road height with central curb island - NO CLIPPING HILL)
    const roundRoad=add(new THREE.RingGeometry(3.8,9.2,48),'#cec4a5');roundRoad.rotation.x=-Math.PI/2;roundRoad.position.y=.76;roundRoad.receiveShadow=true;
    const roundStripe=add(new THREE.RingGeometry(6.4,6.6,48),'#ede5c8');roundStripe.rotation.x=-Math.PI/2;roundStripe.position.y=.77;
    add(new THREE.CylinderGeometry(3.6,3.8,.22,36),'#c4baa0',scene,0,.80,0);
    add(new THREE.CylinderGeometry(3.5,3.5,.08,36),'#9abf84',scene,0,.91,0);
    cylinder(1.4,1.6,.4,'#b09e86',scene,0,1.1,0,16);sphere(.62,'#6a8e58',scene,0,1.5,0);
    for(let f=0;f<8;f++){const fa=f/8*Math.PI*2;sphere(.2,['#e8a460','#e06060','#e8d460','#c86898'][f%4],scene,Math.sin(fa)*2.4,.96,Math.cos(fa)*2.4);}
    cylinder(.12,.14,3.2,'#8b7058',scene,0,2.2,0,8);
    box(3.4,.52,.12,'#ede5d0',scene,0,3.5,.1,.02);label('← STUDIO      WORK →',0,3.5,.2,2.7,'#5a4e3c');
    box(.12,.52,3.4,'#ede5d0',scene,.1,2.85,0,.02);label('HELLO ↑       ↓ LAB',.2,2.85,0,2.7,'#5a4e3c');

    // 4 ACCESS DRIVEWAYS DIRECT TO STATIONS (Paved connections from main roads to each parking bay)
    box(5.2,.04,15,'#cec4a5',scene,-16,.76,7.5,.01);for(let z=2;z<=13;z+=3.5)box(.15,.015,1.5,'#ede5c8',scene,-16,.78,z,.01);
    box(5.2,.04,15,'#cec4a5',scene,15,.76,7.5,.01);for(let z=2;z<=13;z+=3.5)box(.15,.015,1.5,'#ede5c8',scene,15,.78,z,.01);
    box(5.2,.04,11,'#cec4a5',scene,14,.76,-5.5,.01);for(let z=-2;z>=-9;z-=3.5)box(.15,.015,1.5,'#ede5c8',scene,14,.78,z,.01);
    box(5.2,.04,11,'#cec4a5',scene,-15,.76,-5.5,.01);for(let z=-2;z>=-9;z-=3.5)box(.15,.015,1.5,'#ede5c8',scene,-15,.78,z,.01);

    const obstacles:Collider[]=[];
    obstacles.push({x:0,z:0,r:3.8});// Solid collider for center roundabout island
    const decorative:THREE.Object3D[]=[];
    const waterMeshes:THREE.Mesh[]=[];

    // STREAMS — CatmullRom paths
    const sMat=matCustom({color:'#5fc4ba',transparent:true,opacity:.68,roughness:.15,depthWrite:false});
    const streamPts=[new THREE.Vector3(0,-.2,-36),new THREE.Vector3(3,.1,-28),new THREE.Vector3(5,.3,-20),new THREE.Vector3(8,.45,-12),new THREE.Vector3(10,.5,-5)];
    const sCurve=new THREE.CatmullRomCurve3(streamPts);
    for(let t=0;t<=1;t+=.025){
      const pt=sCurve.getPoint(t);const g=new THREE.PlaneGeometry(2.6,.6);geometries.push(g);
      const m=new THREE.Mesh(g,sMat);m.position.set(pt.x,pt.y+.62,pt.z);m.rotation.x=-Math.PI/2;scene.add(m);waterMeshes.push(m);
    }
    const s2Pts=[new THREE.Vector3(-5,-.2,-30),new THREE.Vector3(-9,.1,-22),new THREE.Vector3(-12,.3,-14),new THREE.Vector3(-13.5,.45,-7),new THREE.Vector3(-14,.5,-2)];
    const s2Curve=new THREE.CatmullRomCurve3(s2Pts);
    for(let t=0;t<=1;t+=.03){
      const pt=s2Curve.getPoint(t);const g=new THREE.PlaneGeometry(2.0,.5);geometries.push(g);
      const m=new THREE.Mesh(g,sMat);m.position.set(pt.x,pt.y+.62,pt.z);m.rotation.x=-Math.PI/2;scene.add(m);waterMeshes.push(m);
    }

    // POND near lab
    const pondM=matCustom({color:'#4ea8a2',transparent:true,opacity:.72,roughness:.2,depthWrite:false});
    const pond=addM(new THREE.CylinderGeometry(2.8,2.9,.08,36),pondM,scene,24,.82,-26);void pond;
    add(new THREE.CylinderGeometry(3,3.2,.25,36),'#c4a87a',scene,24,.62,-26);
    // Lily pads
    let seed=113;const rng=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    for(let i=0;i<9;i++){const a=rng()*Math.PI*2;const r=.6+rng()*1.9;add(new THREE.CylinderGeometry(.55+rng()*.2,.58,.05,12),'#5e9e50',scene,24+Math.cos(a)*r,.9,-26+Math.sin(a)*r);}

    // WATERFALL on NE cliff
    const wfM=matCustom({color:'#7ee0d8',transparent:true,opacity:.55,roughness:.1,depthWrite:false});
    for(let i=0;i<10;i++){const g=new THREE.PlaneGeometry(.42,3.2);geometries.push(g);const m=new THREE.Mesh(g,wfM);m.position.set(28.2+i*.42,-.2,-10.8);scene.add(m);waterMeshes.push(m);}
    add(new THREE.CylinderGeometry(2.8,3.2,.1,24),'#5ab8b4',scene,30,-1.55,-12);// splash pool

    // BRIDGES
    const bridge=(bx:number,bz:number,rotY:number,len:number)=>{
      const g=new THREE.Group();g.position.set(bx,.8,bz);g.rotation.y=rotY;scene.add(g);
      box(len,.2,3,'#c4a87a',g,0,0,0,.06);
      for(let i=-(len*.5-1);i<len*.5;i+=2.8){cylinder(.12,.12,.95,'#a8906a',g,i,.57,-1.25,6);cylinder(.12,.12,.95,'#a8906a',g,i,.57,1.25,6);}
      box(len,.08,.15,'#b89060',g,0,.95,-1.25,.02);box(len,.08,.15,'#b89060',g,0,.95,1.25,.02);
    };
    bridge(-2,.7,0,6.5);// over main stream
    bridge(-11.5,.7,0,5.5);// west stream
    bridge(9,.7,Math.PI/2,6);// cross-stream east

    // ELEVATED CLIFFS
    // cliffs (no extra geometry needed a    // NE cliff
    const cl1=new THREE.Group();cl1.position.set(28,0,-10);scene.add(cl1);add(new THREE.CylinderGeometry(5.5,7,3.8,14),'#b4a48a',cl1,0,1.4,0);add(new THREE.CylinderGeometry(5,5.4,.9,14),'#a0bd8c',cl1,0,3.4,0);
    obstacles.push({x:28,z:-10,r:7.5});// Solid mountain collider: car bounces off, cannot drive underneath
    // SW cliff
    const cl2=new THREE.Group();cl2.position.set(-28,0,10);scene.add(cl2);add(new THREE.CylinderGeometry(5,6.8,3.2,14),'#b4a48a',cl2,0,1.2,0);add(new THREE.CylinderGeometry(4.5,5,.85,14),'#a0bd8c',cl2,0,2.78,0);
    obstacles.push({x:-28,z:10,r:7.2});// Solid mountain collider
    obstacles.push({x:24,z:-26,r:3.05});// Pond collider

    // FLORA
    const tree=(x:number,z:number,sc=1,v=0)=>{
      const g=new THREE.Group();g.position.set(x,.32,z);g.scale.setScalar(sc);scene.add(g);
      cylinder(.15,.25,2,'#8b7860',g,0,.9,0);
      if(v===0){sphere(1.2,'#6d9060',g,0,2.3,0);sphere(.82,'#88ab72',g,.52,2.8,0);sphere(.85,'#7a9e68',g,-.55,2.25,.1);}
      else if(v===1){for(let i=0;i<4;i++)add(new THREE.CylinderGeometry(1.35-i*.3,1.5-i*.28,.65,8),['#5a7d50','#628456','#6d9060','#4f6e48'][i],g,0,1.85+i*.82,0);}
      else{sphere(1.4,'#728f5e',g,0,2.6,0);sphere(1.0,'#8aab70',g,.7,3.0,0);sphere(1.02,'#5e8050',g,-.6,2.9,-.2);sphere(.82,'#8aab70',g,0,3.6,0);}
      obstacles.push({x,z,r:.7*sc});
    };
    const bush=(x:number,z:number,scale=1)=>{const g=new THREE.Group();g.scale.setScalar(scale);g.position.set(x,.5,z);scene.add(g);for(let k=0;k<3;k++)sphere(.52+rng()*.28,['#7a9e65','#94b878','#6a8e58'][k],g,(k-1)*.42,rng()*.2,k%2===0?.32:-.32);};
    const flower=(x:number,z:number)=>{const g=new THREE.Group();g.position.set(x,.32,z);scene.add(g);cylinder(.04,.04,.65,'#7a9460',g,0,.32,0,6);sphere(.22,['#e8a460','#e06060','#e8d460','#c86898','#f5f5f5'][Math.floor(rng()*5)],g,0,.68,0);};

    // Ring of perimeter trees (bigger island uses more)
    for(let i=0;i<62;i++){const a=i/62*Math.PI*2;const r=37+rng()*5;const tx=Math.sin(a)*r;const tz=Math.cos(a)*r;if(i%4===0){const rk=sphere(.55+rng()*.8,'#c0b29a',scene,tx,.67,tz);rk.scale.y=.58;obstacles.push({x:tx,z:tz,r:.65});}else tree(tx,tz,.7+rng()*.6,Math.floor(rng()*3));}
    // Interior trees (placed in open fields, off all roads and spurs)
    [[-8,-6],[-10,7],[9,-7],[9,7],[-24,4],[24,-5],[-7,-19],[7,19],[-18,-18],[18,18],[21,-7],[-21,7],[-7,-22],[7,22]].forEach(([tx,tz])=>tree(tx,tz,.78+rng()*.38,Math.floor(rng()*3)));

    // Stream bank grasses
    for(let i=0;i<36;i++){const t=rng();const pt=sCurve.getPoint(t);const ox=(rng()-.5)*3.2;const oz=(rng()-.5)*3.2;const g=new THREE.Group();g.position.set(pt.x+ox,.56,pt.z+oz);scene.add(g);for(let k=0;k<3;k++){const lf=box(.1,.65+rng()*.4,.14,'#8a9e64',g,(k-1)*.18,.3,0,.01);lf.rotation.z=(k-1)*(-.3-rng()*.2);}}

    // Flowers scattered
    for(let i=0;i<70;i++){const a=rng()*Math.PI*2;const r=4+rng()*34;const fx=Math.sin(a)*r;const fz=Math.cos(a)*r;if(Math.hypot(fx,fz)<43)flower(fx,fz);}

    // Bushes
    [[-5,10],[-6,12],[5,-12],[6,-14],[21,9],[21,10],[-21,-8],[-20,-10],[-3,20],[3,-22]].forEach(([bx,bz])=>bush(bx,bz,.8+rng()*.4));

    // Mushrooms near pond
    [[16.5,-14.5],[18,-16.5],[15,-16],[17,-15]].forEach(([mx,mz])=>{const g=new THREE.Group();g.position.set(mx,.42,mz);scene.add(g);cylinder(.1,.12,.42,'#e8d5b0',g,0,.2,0,8);add(new THREE.SphereGeometry(.36,8,5,0,Math.PI*2,0,Math.PI/2),['#d85858','#e8c458','#7a58d8'][Math.floor(rng()*3)],g,0,.44,0);});

    // Rocks on beach
    [[33,-6],[33,5],[-33,-7],[-31,12],[-5,-34],[5,-33]].forEach(([rx,rz])=>{const rk=sphere(.8+rng()*.7,'#b8a88a',scene,rx,.65,rz);rk.scale.y=.58;rk.scale.z=1.15+rng()*.4;obstacles.push({x:rx,z:rz,r:1.15});});

    // LAMPPOSTS along roads
    const streetLights:THREE.PointLight[]=[];
    const streetGlobes:THREE.Mesh[]=[];
    [[-12.5,.4],[12.5,.4],[-12.5,-.4],[12.5,-.4],[-.4,-12.5],[.4,-12.5],[-.4,12.5],[.4,12.5],[-25,0],[25,0],[0,-25],[0,25]].forEach(([lx,lz])=>{
      const g=new THREE.Group();g.position.set(lx,.8,lz);scene.add(g);obstacles.push({x:lx,z:lz,r:.12});
      cylinder(.07,.09,3.2,'#8c7e6c',g,0,1.55,0,6);const arm=box(.7,.1,.1,'#8c7e6c',g,.38,3.2,0,.02);void arm;
      const globe=sphere(.22,'#fffcdc',g,.72,3.25,0);globe.castShadow=false;streetGlobes.push(globe);
      const pt=new THREE.PointLight('#fff5a0',.7,6.5);pt.position.set(lx+.72,4.1,lz);scene.add(pt);streetLights.push(pt);
    });

    // Park benches near studio
    [[-14,.35,8],[-14,.35,9.8],[-18,.35,8.5]].forEach(([bx,by,bz])=>{
      const g=new THREE.Group();g.position.set(bx,by,bz);scene.add(g);
      box(2.2,.18,.65,'#c8a880',g,0,.28,0,.04);[-.88,.88].forEach(lx2=>cylinder(.07,.09,.52,'#9a806a',g,lx2,.12,0,6));box(2.3,.1,.1,'#c8a880',g,0,.52,.3,.02);obstacles.push({x:bx,z:bz,halfX:1.12,halfZ:.35});
    });

    // Fence along NE cliff
    for(let i=-5;i<=5;i++){const fx=29+Math.cos(i*.35)*.5;const fz=-10+i*1.3;cylinder(.065,.065,1.3,'#b0987a',scene,fx,.85,fz,6);if(i<5)box(1.4,.07,.07,'#b0987a',scene,fx+.68,.96+Math.sin(i*.12)*.04,fz,.01);}

    // Cobblestone-look path circles along N-S road
    for(let i=-20;i<=20;i+=2.5){const s=sphere(.14,'#ccc0a8',scene,.35+rng()*.1,.76,i);s.scale.set(.9,0.3,.8);}

    // BUILDINGS

    // 01 STUDIO
    const studio=new THREE.Group();studio.position.set(-16,.32,12);scene.add(studio);
    box(9.5,.52,8.5,'#b09078',studio,0,.24,0,.2);box(8,4.5,6,'#d08a6a',studio,0,2.65,-.55,.15);box(8.8,.38,6.8,'#e8b490',studio,0,5.1,-.55,.1);
    box(4.6,.42,2,'#c07858',studio,-1.6,5.3,-.55,.05);// chimney base
    cylinder(.35,.42,2,'#b06848',studio,-1.6,6.4,-.55,8);// chimney
    box(5,.22,.15,'#344b45',studio,0,2.7,1.8,.02);for(let i=-2;i<=2;i++)box(.12,2.3,.18,'#f0d8b8',studio,i*1.12,2.7,1.96,.01);
    box(.15,1.6,2.2,'#344b45',studio,4.1,2.5,-.5,.02);
    cylinder(.85,.85,.38,'#eedec0',studio,2.2,5.48,-1);sphere(.8,'#90a879',studio,2.2,6.16,-1);sphere(.52,'#7aaa60',studio,3.1,5.32,-1);
    for(let s=0;s<3;s++)box(3.2,.2,1.1,'#dbc09a',studio,0,s*.2+.15,2.6+s*.35,.05);
    label('THE STUDIO',0,6.0,2.0,6.5,'#564638',null,studio);
    cylinder(.08,.08,2.2,'#8b7060',studio,-4.5,1,.8,6);box(3.2,.52,.12,'#dcc8a8',studio,-4.5,2.2,.8,.03);label('ABOUT ME',-4.5,2.2,.93,3,'#564638',null,studio,50);
    obstacles.push({x:-16,z:11.45,halfX:4.05,halfZ:3.05});

    // 02 PROJECT PARK
    const gallery=new THREE.Group();gallery.position.set(15,.32,11);scene.add(gallery);
    box(13,.4,9,'#bab2d2',gallery,0,.18,0,.4);
    for(let i=0;i<4;i++){const pg=new THREE.Group();pg.position.set((i-1.5)*3,0,-.4);gallery.add(pg);box(.18,2.5,.18,'#6e6a74',pg,0,1.42,0);box(2.7,2.2,.48,['#9d9ccc','#e8ad85','#a4b78a','#d4a0b0'][i],pg,0,3.15,0,.15);box(2.25,1.7,.06,'#343b3d',pg,0,3.15,.28,.03);label(['\u003c/\u003e','AI','3D','ML'][i],0,3.15,.34,2,'#e9edc8',null,pg,64);}
    box(13.5,.17,1.6,'#aaa2be',gallery,0,4.95,-3.8,.04);// roof overhang
    box(12.5,.08,8.8,'#aaa2be',gallery,0,4.9,0,.04);// roof flat
    label('PROJECT PARK',0,5.8,.6,8.5,'#5c526d',null,gallery);
    for(let i=0;i<4;i++)obstacles.push({x:15+(i-1.5)*3,z:10.6,halfX:1.4,halfZ:.28});

    // 03 LAB
    const lab=new THREE.Group();lab.position.set(14,.32,-15);scene.add(lab);
    add(new THREE.CylinderGeometry(4.8,5.1,.42,32),'#b0be9c',lab,0,.12,0);add(new THREE.CylinderGeometry(3.6,3.6,3,28),'#c8d0a8',lab,0,1.65,0);
    const dome=add(new THREE.SphereGeometry(3.6,32,16,0,Math.PI*2,0,Math.PI/2),'#96a87e',lab,0,2.95,0);dome.castShadow=true;
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const wg=new THREE.CircleGeometry(.48,8);geometries.push(wg);const wm=new THREE.MeshStandardMaterial({color:'#344b45',roughness:.3});materials.push(wm);const wms=new THREE.Mesh(wg,wm);wms.position.set(14+Math.cos(a)*3,2.6,-15+Math.sin(a)*3);wms.lookAt(14,2.6,-15);scene.add(wms);}
    box(1.3,2.1,.22,'#4c6357',lab,0,1.6,3.5);box(5.8,.2,.2,'#e8e8c8',lab,0,3.1,0);
    label('THE LAB',0,6.7,0,5.5,'#3d5546',null,lab);
    const dsh1=new THREE.Group();dsh1.position.set(-4,1.4,-2);lab.add(dsh1);cylinder(.1,.16,2.4,'#6c7b69',dsh1,0,.9,0);const b1=add(new THREE.ConeGeometry(1.15,.48,22),'#e4e6d4',dsh1,0,2.2,0);b1.rotation.z=.8;decorative.push(dsh1);
    const dsh2=new THREE.Group();dsh2.position.set(-5,1.1,1.5);lab.add(dsh2);cylinder(.1,.13,1.9,'#6c7b69',dsh2,0,.7,0);const b2=add(new THREE.ConeGeometry(.8,.38,18),'#e4e6d4',dsh2,0,1.75,0);b2.rotation.z=1.05;decorative.push(dsh2);
    obstacles.push({x:14,z:-15,r:3.65},{x:10,z:-17,r:.35},{x:9,z:-13.5,r:.3});

    // 04 HELLO STATION
    const hello=new THREE.Group();hello.position.set(-15,.32,-14);scene.add(hello);
    box(9.5,.4,8.5,'#ddc898',hello,0,.18,0,.5);box(3.8,4.2,3.2,'#edbd70',hello,0,2.45,0,.4);box(3.2,.28,.15,'#755e49',hello,0,3.05,.76,.02);
    box(.52,1.2,.38,'#d76f57',hello,1.95,3.6,0,.03);box(1.3,.14,.75,'#d86040',hello,2.62,4.15,0,.03);
    for(let s=0;s<3;s++)box(2.9,.2,1.1,'#d4b47a',hello,0,.12+s*.2,4.5+s*.38,.05);
    label('SAY HELLO',0,5.85,1.0,7.2,'#76523b',null,hello);label('@',0,2.2,1.58,2.1,'#fff4cf',null,hello);
    cylinder(.22,.3,9,'#dac09a',hello,-3.8,4.4,-1);for(let i=0;i<5;i++)cylinder(.22,.22,.48,'#b87755',hello,-3.8,1+i*1.75,-1);sphere(.48,'#e59868',hello,-3.8,9,-1);box(3.2,.14,.14,'#e2c8a0',hello,-3.8,9.3,-1,.02);
    obstacles.push({x:-15,z:-14,halfX:1.95,halfZ:1.65},{x:-18.8,z:-15,r:.3});

    // DESTINATION PARKING BAYS & BEACONS (Dedicated spots so visitors clearly understand where to drive)
    const markers:THREE.Object3D[]=[];
    const beacons:THREE.Mesh[]=[];
    destinations.forEach(d=>{
      const g=new THREE.Group();g.position.set(d.x,.4,d.z+5.4);scene.add(g);

      // Dark asphalt parking pad with stall border lines
      box(6.2,.06,6.2,'#2d352e',g,0,.36,0,.04);
      box(.16,.02,5.8,'#f5eed8',g,-2.8,.40,0,.01);// left stripe
      box(.16,.02,5.8,'#f5eed8',g,2.8,.40,0,.01);// right stripe
      box(5.8,.14,.26,'#d0c4aa',g,0,.46,d.z>0?2.8:-2.8,.03);// wheel stop curb

      // Ground painted label on the parking spot
      const groundLabel=label(`[ ${d.number} ]  PARK HERE`,0,.42,0,2.3,'#f2e6cb',null,g);
      groundLabel.rotation.x=-Math.PI/2;

      // Pulsing interactive ground target rings
      const outerRing=add(new THREE.TorusGeometry(2.3,.09,8,48),d.color,g);outerRing.rotation.x=-Math.PI/2;outerRing.position.y=.43;markers.push(outerRing);
      const innerTarget=add(new THREE.RingGeometry(.3,1.1,32),d.color,g);innerTarget.rotation.x=-Math.PI/2;innerTarget.position.y=.41;

      // Vertical holographic light pillar / beacon beam visible from across island
      const bMat=matCustom({color:d.color,transparent:true,opacity:.26,roughness:.1,depthWrite:false});
      const bGeo=new THREE.CylinderGeometry(1.2,1.5,8,20,1,true);geometries.push(bGeo);
      const beacon=new THREE.Mesh(bGeo,bMat);beacon.position.set(0,4.4,0);g.add(beacon);beacons.push(beacon);

      // Overhead floating destination signboard
      box(4.6,.9,.16,d.color,g,0,5.2,0,.04);
      label(d.name.toUpperCase(),0,5.2,.12,2.8,'#ffffff',null,g);
      label(`ZONE ${d.number}`,0,4.4,.12,1.6,'#e8dfc8',null,g);

      // Flagpole with waving flag
      cylinder(.06,.06,3.6,'#737c67',g,-2.5,1.75,0,6);
      const flagGeo=new THREE.PlaneGeometry(1.5,.85);geometries.push(flagGeo);
      const flagM=new THREE.MeshStandardMaterial({color:d.color,roughness:.55,side:THREE.DoubleSide});materials.push(flagM);
      const flag=new THREE.Mesh(flagGeo,flagM);flag.position.set(-1.65,3.0,.05);g.add(flag);decorative.push(flag);
    });

    // ISLAND LAWN TITLE
    const titleMesh=label('PARARDHA\'S ISLAND',0,.76,15.5,22,'#897a62');titleMesh.rotation.x=-Math.PI/2;
    const subMesh=label('MAKE  •  EXPLORE  •  DISCOVER',0,.77,18.5,14,'#a89878');subMesh.rotation.x=-Math.PI/2;

    // ROVER
    const rover=new THREE.Group();scene.add(rover);const body=new THREE.Group();rover.add(body);
    box(1.75,.54,2.85,'#e07848',body,0,.96,0,.18);box(1.52,.77,1.32,'#f2b880',body,0,1.52,-.18,.16);
    box(1.28,.5,.08,'#455f59',body,0,1.58,.56,.04);box(1.28,.5,.08,'#455f59',body,0,1.58,-.92,.04);
    box(.08,.44,.9,'#455f59',body,-.8,1.58,-.18,.03);box(.08,.44,.9,'#455f59',body,.8,1.58,-.18,.03);
    box(2.0,.24,.22,'#e6cfaa',body,0,.84,1.48,.03);box(2.0,.24,.22,'#565e50',body,0,.84,-1.48,.03);
    const headlights:THREE.SpotLight[]=[];
    const headGlobes:THREE.Mesh[]=[];
    [-.6,.6].forEach(lx=>{
      const hMesh=box(.35,.28,.12,'#fff0b5',body,lx,1.1,1.42,.04);headGlobes.push(hMesh);
      box(.27,.21,.1,'#a64038',body,lx,1.06,-1.42,.02);
      const spot=new THREE.SpotLight('#fff3c4',3.2,22,Math.PI/4.5,.45);
      spot.position.set(lx,1.1,1.42);
      const tgt=new THREE.Object3D();tgt.position.set(lx,.2,8);body.add(tgt);
      spot.target=tgt;spot.visible=false;body.add(spot);headlights.push(spot);
    });
    box(1.18,.14,.9,'#546450',body,0,1.98,-.18,.02);cylinder(.038,.044,1.25,'#3d4e42',body,.7,2.2,-.7,6);sphere(.1,'#cde68a',body,.7,2.87,-.7);
    const wheels:THREE.Mesh[]=[];[-1.08,1.08].forEach(wx=>[-.95,.95].forEach(wz=>{const wh=cylinder(.44,.44,.34,'#3c453d',rover,wx,.62,wz,18);wh.rotation.z=Math.PI/2;wheels.push(wh);cylinder(.21,.21,.36,'#c2bdaa',rover,wx,.62,wz,12).rotation.z=Math.PI/2;}));
    const rovShadow=add(new THREE.CircleGeometry(1.6,32),'#b0a580',rover,0,.038,0);rovShadow.rotation.x=-Math.PI/2;rovShadow.castShadow=false;
    const dusts:THREE.Mesh[]=[];for(let i=0;i<16;i++){const d=sphere(.17,'#ece0c2');d.visible=false;dusts.push(d);}

    // ENERGY CELLS – 16 on two radii
    const cells:{mesh:THREE.Group;x:number;z:number;found:boolean}[]=[];
    for(let i=0;i<16;i++){
      let angle=i/16*Math.PI*2;const r=27.2;
      let cx=Math.sin(angle)*r,cz=Math.cos(angle)*r;
      const blocked=(x:number,z:number)=>obstacles.some(o=>'r' in o?Math.hypot(x-o.x,z-o.z)<o.r+2.1:Math.abs(x-o.x)<o.halfX+2.1&&Math.abs(z-o.z)<o.halfZ+2.1);
      for(let attempt=0;attempt<40&&blocked(cx,cz);attempt++){angle+=.035;cx=Math.sin(angle)*r;cz=Math.cos(angle)*r;}
      const g=new THREE.Group();g.position.set(cx,1.65,cz);scene.add(g);
      add(new THREE.OctahedronGeometry(.6),'#d4a940',g);
      const halo=add(new THREE.TorusGeometry(.9,.04,6,30),'#f8e8a0',g);halo.rotation.x=Math.PI/2;
      cells.push({mesh:g,x:cx,z:cz,found:false});
    }

    // CLOUDS – 10, drifting
    const clouds:THREE.Group[]=[];
    for(let i=0;i<10;i++){
      const cloud=new THREE.Group();const a=i/10*Math.PI*2;cloud.position.set(Math.cos(a)*72,10.5+rng()*5.5,Math.sin(a)*70);scene.add(cloud);
      for(let j=0;j<4;j++){const puff=sphere(2.4+rng()*1.4,'#eef4e0',cloud,(j-1.5)*2.6+rng()*.5,rng()*.6,rng()*.5);puff.scale.y=.48;puff.castShadow=false;}
      clouds.push(cloud);
    }

    // FIREFLIES (Floating ambient night lights)
    const fireflies:THREE.Mesh[]=[];
    const ffGeo=new THREE.SphereGeometry(.14,6,6);geometries.push(ffGeo);
    const ffMat=new THREE.MeshBasicMaterial({color:'#e2ff73',transparent:true,opacity:0});materials.push(ffMat);
    for(let i=0;i<32;i++){
      const m=new THREE.Mesh(ffGeo,ffMat);
      const fa=Math.random()*Math.PI*2;const fr=6+Math.random()*30;
      m.position.set(Math.sin(fa)*fr,1.0+Math.random()*2.2,Math.cos(fa)*fr);
      scene.add(m);fireflies.push(m);
    }

    // A small kinetic sculpture garden beside the coast.
    const turbines:THREE.Group[]=[];
    [[-29,-23],[-23,-29]].forEach(([tx,tz])=>{
      cylinder(.16,.35,6,'#e6dfc9',scene,tx,3.6,tz,12);
      const hub=new THREE.Group();hub.position.set(tx,6.6,tz);scene.add(hub);
      sphere(.32,'#d9af73',hub);
      for(let k=0;k<3;k++){const blade=new THREE.Group();blade.rotation.z=k*Math.PI*2/3;hub.add(blade);box(.28,2.7,.12,'#f3ebd6',blade,0,1.5,.08,.05);}
      turbines.push(hub);obstacles.push({x:tx,z:tz,r:.36});
    });
    // An autonomous parcel drone follows a loop above the four destinations.
    const drone=new THREE.Group();scene.add(drone);box(1.05,.3,.7,'#586966',drone,0,0,0,.13);box(.5,.4,.5,'#dca46f',drone,0,-.4,0,.07);
    const rotors:THREE.Mesh[]=[];
    [-.8,.8].forEach(dx=>[-.6,.6].forEach(dz=>{box(.12,.08,1.4,'#4b605a',drone,dx,0,0,.02);const rotor=box(.95,.03,.12,'#c4dbd0',drone,dx,.2,dz,.02);rotors.push(rotor);}));
    // Visible foam accents on the shore, animated as whole rings rather than thousands of vertices.
    const foamRings:THREE.Mesh[]=[];
    for(let i=0;i<3;i++){
      const fm=new THREE.MeshBasicMaterial({color:'#eff7df',transparent:true,opacity:.14,side:THREE.DoubleSide,depthWrite:false});materials.push(fm);
      const ring=addM(new THREE.RingGeometry(49+i*2,49.18+i*2,100),fm);ring.rotation.x=-Math.PI/2;ring.position.y=-2.9+i*.04;foamRings.push(ring);
    }
    const sparks:THREE.Points[]=[];
    const sparkMaterial=new THREE.PointsMaterial({color:'#ffdf83',size:.15,transparent:true,opacity:0,depthWrite:false});materials.push(sparkMaterial);
    const sparkPositions=new Float32Array(36*3);const sparkVelocities=new Float32Array(36*3);
    for(let i=0;i<36;i++){const angle=i/36*Math.PI*2;sparkVelocities[i*3]=Math.sin(angle)*(1.2+rng()*2);sparkVelocities[i*3+1]=2+rng()*3;sparkVelocities[i*3+2]=Math.cos(angle)*(1.2+rng()*2);}
    const sparkGeometry=new THREE.BufferGeometry();sparkGeometry.setAttribute('position',new THREE.BufferAttribute(sparkPositions,3));geometries.push(sparkGeometry);
    const spark=new THREE.Points(sparkGeometry,sparkMaterial);scene.add(spark);sparks.push(spark);let sparkAge=10;
    const releaseSpark=(x:number,z:number)=>{sparkAge=0;spark.position.set(x,1.6,z);sparkPositions.fill(0);sparkGeometry.attributes.position.needsUpdate=true;};
    // An understated star field appears at night.
    const starPositions=new Float32Array(180*3);
    for(let i=0;i<180;i++){starPositions[i*3]=(rng()-.5)*180;starPositions[i*3+1]=35+rng()*45;starPositions[i*3+2]=(rng()-.5)*180;}
    const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(starPositions,3));geometries.push(starGeo);
    const starMat=new THREE.PointsMaterial({color:'#d8e8ff',size:.15,transparent:true,opacity:0,depthWrite:false});materials.push(starMat);scene.add(new THREE.Points(starGeo,starMat));

    // NIGHT MODE APPLIER
    let currentNight = nightValue.current;
    let lightingBlend=nightValue.current?1:0;
    const daySky=new THREE.Color('#c4dbd0'),nightSky=new THREE.Color('#0d1726');
    const applyNight = (night: boolean) => {
      currentNight = night;
      const bg = night ? '#0d1726' : '#c4dbd0';
      scene.background = new THREE.Color(bg);
      if(scene.fog)scene.fog.color.set(bg);
      renderer.setClearColor(bg);

      (wMat as THREE.MeshStandardMaterial).color.set(night ? '#0b2742' : '#52a89e');
      hemiLight.color.set(night ? '#1e293b' : '#e8f5ff');
      hemiLight.groundColor.set(night ? '#0f172a' : '#80b885');
      hemiLight.intensity = night ? 0.75 : 2.0;

      sun.color.set(night ? '#8bb8e8' : '#ffe8a8');
      sun.intensity = night ? 0.95 : 3.2;

      fillLight.color.set(night ? '#2d4d73' : '#a8d8ff');
      fillLight.intensity = night ? 0.4 : 0.7;

      streetLights.forEach(pt => { pt.intensity = night ? 2.8 : 0.7; });
      streetGlobes.forEach(sg => {
        const sm = sg.material as THREE.MeshStandardMaterial;
        sm.emissive = new THREE.Color(night ? '#ffe88a' : '#000000');
        sm.emissiveIntensity = night ? 2.5 : 0;
      });

      headlights.forEach(hl => { hl.visible = night; });
      headGlobes.forEach(hg => {
        const hm = hg.material as THREE.MeshStandardMaterial;
        hm.emissive = new THREE.Color(night ? '#fff3c4' : '#000000');
        hm.emissiveIntensity = night ? 2.8 : 0;
      });

      ffMat.opacity = night ? 0.95 : 0;
    };

    // Work areas help explain the residents' routines at a glance.
    [-8,-5].forEach(gx=>{box(1.7,.25,2.7,'#9e795c',scene,gx,.85,15.6,.04);box(1.4,.05,2.4,'#655b42',scene,gx,1,15.6,.02);for(let j=0;j<6;j++)sphere(.16,['#e7ad6a','#d67b89','#a5bc73'][j%3],scene,gx+(j%2-.5)*.6,1.2,14.8+Math.floor(j/2)*.65);obstacles.push({x:gx,z:15.6,halfX:.86,halfZ:1.36});});
    box(2.1,.18,.9,'#c6a47c',scene,-5.2,1.65,5.1,.04);[-6,-4.4].forEach(tx=>box(.12,.8,.7,'#657e69',scene,tx,1.1,5.1,.02));
    box(.5,.3,.35,'#7b9293',scene,-5.2,1.9,5.1,.05);obstacles.push({x:-5.2,z:5.1,halfX:1.06,halfZ:.46});
    box(1.8,.1,.9,'#c9d0be',scene,8,1.6,-13.4,.04);box(.08,1.2,.7,'#728e82',scene,7.3,1,-13.4,.02);box(.08,1.2,.7,'#728e82',scene,8.7,1,-13.4,.02);
    for(let i=0;i<3;i++)cylinder(.11,.11,.28,'#a3c6cf',scene,7.5+i*.4,1.8,-13.4,10);
    obstacles.push({x:8,z:-13.4,halfX:.92,halfZ:.47});
    const residents=createResidents({scene,colliders:obstacles,geometries,materials,textures});

    // GAME STATE
    let px=0,pz=5.6,angle=Math.PI,speed=0,collected=0,paused=true,hasStarted=false,disposed=false,frame=0,last=performance.now(),lastReport=0;
    let joyX=0,joyY=0,joyBoost=false,zoomFactor=1;
    const keys=new Set<string>();const look=new THREE.Vector3(-14,0,1);const wanted=new THREE.Vector3();const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const report=()=>{const nearby=destinations.find(d=>Math.hypot(px-d.x,pz-(d.z+5.4))<4.8)?.id??null;callbacks.current.onState({speed:Math.abs(speed),collected,nearby,x:px,z:pz,resident:residents.nearby()});};
    const reset2=()=>{px=0;pz=5.6;angle=Math.PI;speed=0;joyX=0;joyY=0;joyBoost=false;keys.clear();report();};
    const controls:WorldController={
      pause:v=>{paused=v;if(!v)hasStarted=true;keys.clear();speed=0;joyX=0;joyY=0;},
      reset:reset2,
      input:(key,down)=>{if(down)keys.add(key);else keys.delete(key);},
      travel:id=>{const d=destinations.find(dd=>dd.id===id);if(d){px=d.x;pz=d.z+5.4;angle=Math.PI;speed=0;keys.clear();joyX=0;joyY=0;report();}},
      setNight:applyNight,
      zoom:delta=>{zoomFactor=THREE.MathUtils.clamp(zoomFactor+delta,.65,2.1);},
      setJoystick:(x,y,boost)=>{joyX=x;joyY=y;joyBoost=boost;},
    };
    controllerRef.current = controls;
    applyNight(nightValue.current);

    const keymap:Record<string,string>={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right',shift:'boost'};
    const onDown=(e:KeyboardEvent)=>{if(paused)return;const t=e.target as HTMLElement;if(t.closest('input,textarea,[contenteditable="true"]'))return;const k=keymap[e.key.toLowerCase()];if(k){e.preventDefault();keys.add(k);}};
    const onUp=(e:KeyboardEvent)=>{const k=keymap[e.key.toLowerCase()];if(k)keys.delete(k);};
    const blur=()=>{keys.clear();speed=0;joyX=0;joyY=0;};window.addEventListener('keydown',onDown);window.addEventListener('keyup',onUp);window.addEventListener('blur',blur);
    const resize=()=>{const w=host.clientWidth;const h=host.clientHeight;const asp=w/h;const ext=w<700?50:34;camera.left=-ext*asp;camera.right=ext*asp;camera.top=ext;camera.bottom=-ext;camera.updateProjectionMatrix();renderer.setSize(w,h);};const obs=new ResizeObserver(resize);obs.observe(host);resize();

    const tick=(now:number)=>{
      if(disposed)return;const dt=Math.min((now-last)/1000,.04);last=now;
      if(!paused){
        const keyThr=(keys.has('up')?1:0)-(keys.has('down')?1:0);
        const thr=Math.abs(joyY)>0.05?joyY:keyThr;
        const boost=keys.has('boost')||joyBoost;
        speed+=thr*(boost?21:13)*dt;speed*=Math.exp(-(thr?1.0:3.4)*dt);speed=THREE.MathUtils.clamp(speed,-5,boost?14:9);
        const keySteer=(keys.has('left')?1:0)-(keys.has('right')?1:0);
        const steer=Math.abs(joyX)>0.05?-joyX:keySteer;
        const desiredAngle=angle+steer*dt*2.4*Math.min(Math.abs(speed)/2.8,1)*Math.sign(speed||1);
        const result=moveRover({x:px,z:pz,angle},speed*dt,desiredAngle,[...obstacles,...residents.colliders()]);
        px=result.x;pz=result.z;angle=result.angle;
        if(result.impact>.02)speed*=Math.max(.12,1-result.impact*.82);
        cells.forEach(c=>{if(!c.found&&Math.hypot(px-c.x,pz-c.z)<2.2){c.found=true;c.mesh.visible=false;collected++;releaseSpark(c.x,c.z);report();}});
      }
      rover.position.set(px,.65,pz);rover.rotation.y=angle;
      body.rotation.z=THREE.MathUtils.damp(body.rotation.z,((keys.has('left')?1:0)-(keys.has('right')?1:0))*speed*.013,8,dt);
      wheels.forEach(wh=>wh.rotation.x+=speed*dt*2);
      residents.update(dt,now*.001,{x:px,z:pz},reduced.matches);
      waterTime.value=reduced.matches?0:now*.00055;
      lightingBlend=THREE.MathUtils.damp(lightingBlend,currentNight?1:0,2.2,dt);
      (scene.background as THREE.Color).lerpColors(daySky,nightSky,lightingBlend);
      if(scene.fog)scene.fog.color.copy(scene.background as THREE.Color);
      hemiLight.intensity=THREE.MathUtils.lerp(2,.85,lightingBlend);
      sun.intensity=THREE.MathUtils.lerp(3.2,1.1,lightingBlend);
      starMat.opacity=lightingBlend*.85;
      sparkAge+=dt;
      if(sparkAge<1.2){for(let i=0;i<36;i++){sparkPositions[i*3]=sparkVelocities[i*3]*sparkAge;sparkPositions[i*3+1]=sparkVelocities[i*3+1]*sparkAge-3*sparkAge*sparkAge;sparkPositions[i*3+2]=sparkVelocities[i*3+2]*sparkAge;}sparkGeometry.attributes.position.needsUpdate=true;sparkMaterial.opacity=1-sparkAge/1.2;}else sparkMaterial.opacity=0;
      if(!reduced.matches){
        const flight=now*.00012;drone.position.set(Math.sin(flight)*20,9+Math.sin(flight*2)*.7,Math.cos(flight)*20);drone.rotation.y=flight+Math.PI/2;drone.rotation.z=Math.sin(flight)*.07;
        rotors.forEach(rotor=>rotor.rotation.y=now*.025);
        turbines.forEach((hub,i)=>hub.rotation.z=now*.0007+i);
        foamRings.forEach((ring,i)=>{const cycle=(now*.00012+i/3)%1;ring.scale.setScalar(1+cycle*.025);(ring.material as THREE.MeshBasicMaterial).opacity=Math.sin(cycle*Math.PI)*.2;});

        cells.forEach((c,i)=>{c.mesh.position.y=1.65+Math.sin(now*.002+i)*.22;c.mesh.rotation.y=now*.0013;});
        decorative.forEach((item,i)=>{if(i%2===0)item.rotation.y=now*.0004;else(item as THREE.Mesh).rotation.z=Math.sin(now*.003+i)*.1;});
        markers.forEach((m,i)=>m.scale.setScalar(1+Math.sin(now*.002+i)*.06));
        beacons.forEach((b,i)=>{(b.material as THREE.MeshStandardMaterial).opacity=.24+Math.sin(now*.003+i)*.08;b.rotation.y=now*.0008;});
        waterMeshes.forEach((m,i)=>{(m.material as THREE.MeshStandardMaterial).opacity=.65+Math.sin(now*.004+i*.4)*.06;});
        clouds.forEach((cloud,i)=>{cloud.position.x+=Math.sin(now*.00014+i)*.004;cloud.position.z+=Math.cos(now*.00012+i)*.003;});
        if(currentNight && fireflies.length>0){
          fireflies.forEach((ff,i)=>{ff.position.y+=Math.sin(now*.002+i)*.004;ff.position.x+=Math.cos(now*.0015+i)*.003;});
        }
      }
      dusts.forEach((d2,i)=>{d2.visible=!paused&&Math.abs(speed)>3;const t2=((now*.001+i*.08)%1);d2.position.set(px-Math.sin(angle)*(1.6+t2*2.2)+(i%3-1)*.3,.52+t2*.42,pz-Math.cos(angle)*(1.6+t2*2.2));d2.scale.setScalar(.5+t2*2.2);});
      wanted.set(hasStarted?px*.8:-14,0,hasStarted?pz*.8:1);look.lerp(wanted,1-Math.exp(-dt*2.4));camera.position.set(look.x+44,54,look.z+48);camera.lookAt(look);camera.zoom=THREE.MathUtils.damp(camera.zoom,(hasStarted?1.32:.88)*zoomFactor,2,dt);camera.updateProjectionMatrix();
      renderer.render(scene,camera);if(now-lastReport>100){report();lastReport=now;}frame=requestAnimationFrame(tick);
    };
    const vis=()=>{blur();if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}};document.addEventListener('visibilitychange',vis);
    const lost=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frame);callbacks.current.onError();};renderer.domElement.addEventListener('webglcontextlost',lost);
    frame=requestAnimationFrame(tick);callbacks.current.onReady(controls);report();
    return()=>{disposed=true;cancelAnimationFrame(frame);obs.disconnect();window.removeEventListener('keydown',onDown);window.removeEventListener('keyup',onUp);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',vis);renderer.domElement.removeEventListener('webglcontextlost',lost);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div className="world-canvas" ref={root}/>;
}
