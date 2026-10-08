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
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor('#c4dbd0');renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.outputColorSpace=THREE.SRGBColorSpace;
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
    scene.add(new THREE.HemisphereLight('#e8f5ff','#80b885',2.0));
    const sun=new THREE.DirectionalLight('#ffe8a8',3.2);sun.position.set(-30,58,30);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-65;sun.shadow.camera.right=65;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;sun.shadow.normalBias=.08;sun.shadow.bias=-.0001;scene.add(sun);
    scene.add(Object.assign(new THREE.DirectionalLight('#a8d8ff',.7),{position:new THREE.Vector3(30,20,-20)}));

    // OCEAN
    const wMat=matCustom({color:'#52a89e',transparent:true,opacity:.72,roughness:.2});
    const wGeo=new THREE.PlaneGeometry(600,600,90,90);const wPos=wGeo.attributes.position;
    for(let i=0;i<wPos.count;i++){wPos.setY(i,Math.sin(wPos.getX(i)*.09)*Math.cos(wPos.getZ(i)*.09)*.14);}
    wGeo.computeVertexNormals();const ocean=addM(wGeo,wMat);ocean.rotation.x=-Math.PI/2;ocean.position.y=-3.3;

    // ISLAND BASE (bigger ~45 radius)
    add(new THREE.CylinderGeometry(48,50,1.1,96),'#85b098',scene,0,-1.8,0);
    add(new THREE.CylinderGeometry(46,47.8,1.9,96),'#c8a97a',scene,0,-.6,0);
    add(new THREE.CylinderGeometry(45.5,45.5,.22,96),'#e8dcb8',scene,0,.52,0);
    // Beach rim
    const beachRing=add(new THREE.RingGeometry(39,45.5,80),'#e5d8b0');beachRing.rotation.x=-Math.PI/2;beachRing.position.y=.54;
    // Inner grass plateau
    add(new THREE.CylinderGeometry(38.5,39,.2,80),'#a6c492',scene,0,.62,0);
    // Central raised hill
    add(new THREE.CylinderGeometry(11,15,2.4,36),'#9ebb8a',scene,0,.52,0);
    add(new THREE.CylinderGeometry(10.5,11,.55,36),'#b0cc9c',scene,0,1.74,0);

    // ROADS
    const roadRing=add(new THREE.RingGeometry(24.5,30,128),'#cec4a5');roadRing.rotation.x=-Math.PI/2;roadRing.position.y=.76;roadRing.receiveShadow=true;
    const centerStripe=add(new THREE.RingGeometry(27.1,27.3,128),'#ede5c8');centerStripe.rotation.x=-Math.PI/2;centerStripe.position.y=.77;
    box(5.5,.04,60,'#cec4a5',scene,0,.76,0,.01);box(60,.04,5.5,'#cec4a5',scene,0,.77,0,.01);
    for(let i=-24;i<=24;i+=5){box(.16,.015,1.8,'#ede5c8',scene,0,.8,i,.01);box(1.8,.015,.16,'#ede5c8',scene,i,.8,0,.01);}

    const obstacles:{x:number;z:number;r:number}[]=[];
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
    const pond=addM(new THREE.CylinderGeometry(5,5.3,.08,36),pondM,scene,17,-.25,-18);void pond;
    add(new THREE.CylinderGeometry(5.2,5.5,.25,36),'#c4a87a',scene,17,.62,-18);
    // Lily pads
    let seed=113;const rng=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    for(let i=0;i<9;i++){const a=rng()*Math.PI*2;const r=1.2+rng()*3.2;add(new THREE.CylinderGeometry(.55+rng()*.2,.58,.05,12),'#5e9e50',scene,17+Math.cos(a)*r,.1,-18+Math.sin(a)*r);}

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
    // cliffs (no extra geometry needed at center)
    // NE cliff
    const cl1=new THREE.Group();cl1.position.set(28,0,-10);scene.add(cl1);add(new THREE.CylinderGeometry(5.5,7,3.8,14),'#b4a48a',cl1,0,1.4,0);add(new THREE.CylinderGeometry(5,5.4,.9,14),'#a0bd8c',cl1,0,3.4,0);
    // SW cliff
    const cl2=new THREE.Group();cl2.position.set(-28,0,10);scene.add(cl2);add(new THREE.CylinderGeometry(5,6.8,3.2,14),'#b4a48a',cl2,0,1.2,0);add(new THREE.CylinderGeometry(4.5,5,.85,14),'#a0bd8c',cl2,0,2.78,0);

    // FLORA
    const tree=(x:number,z:number,sc=1,v=0)=>{
      const g=new THREE.Group();g.position.set(x,.32,z);g.scale.setScalar(sc);scene.add(g);
      cylinder(.15,.25,2,'#8b7860',g,0,.9,0);
      if(v===0){sphere(1.2,'#6d9060',g,0,2.3,0);sphere(.82,'#88ab72',g,.52,2.8,0);sphere(.85,'#7a9e68',g,-.55,2.25,.1);}
      else if(v===1){for(let i=0;i<4;i++)add(new THREE.CylinderGeometry(1.35-i*.3,1.5-i*.28,.65,8),['#5a7d50','#628456','#6d9060','#4f6e48'][i],g,0,1.85+i*.82,0);}
      else{sphere(1.4,'#728f5e',g,0,2.6,0);sphere(1.0,'#8aab70',g,.7,3.0,0);sphere(1.02,'#5e8050',g,-.6,2.9,-.2);sphere(.82,'#8aab70',g,0,3.6,0);}
      obstacles.push({x,z,r:.7*sc});
    };
    const bush=(x:number,z:number,_s=1)=>{const g=new THREE.Group();g.position.set(x,.5,z);scene.add(g);for(let k=0;k<3;k++)sphere(.52+rng()*.28,['#7a9e65','#94b878','#6a8e58'][k],g,(k-1)*.42,rng()*.2,k%2===0?.32:-.32);};
    const flower=(x:number,z:number)=>{const g=new THREE.Group();g.position.set(x,.32,z);scene.add(g);cylinder(.04,.04,.65,'#7a9460',g,0,.32,0,6);sphere(.22,['#e8a460','#e06060','#e8d460','#c86898','#f5f5f5'][Math.floor(rng()*5)],g,0,.68,0);};

    // Ring of perimeter trees (bigger island uses more)
    for(let i=0;i<62;i++){const a=i/62*Math.PI*2;const r=37+rng()*5;const tx=Math.sin(a)*r;const tz=Math.cos(a)*r;if(i%4===0){const rk=sphere(.55+rng()*.8,'#c0b29a',scene,tx,.67,tz);rk.scale.y=.58;}else tree(tx,tz,.7+rng()*.6,Math.floor(rng()*3));}
    // Interior trees
    [[-8,-6],[-10,7],[9,-7],[9,7],[-24,4],[24,-5],[-4,-19],[4,19],[-18,-18],[18,18],[21,0],[-21,0],[0,-20],[0,20]].forEach(([tx,tz])=>tree(tx,tz,.78+rng()*.38,Math.floor(rng()*3)));

    // Stream bank grasses
    for(let i=0;i<36;i++){const t=rng();const pt=sCurve.getPoint(t);const ox=(rng()-.5)*3.2;const oz=(rng()-.5)*3.2;const g=new THREE.Group();g.position.set(pt.x+ox,.56,pt.z+oz);scene.add(g);for(let k=0;k<3;k++){const lf=box(.1,.65+rng()*.4,.14,'#8a9e64',g,(k-1)*.18,.3,0,.01);lf.rotation.z=(k-1)*(-.3-rng()*.2);}}

    // Flowers scattered
    for(let i=0;i<70;i++){const a=rng()*Math.PI*2;const r=4+rng()*34;const fx=Math.sin(a)*r;const fz=Math.cos(a)*r;if(Math.hypot(fx,fz)<43)flower(fx,fz);}

    // Bushes
    [[-5,10],[-6,12],[5,-12],[6,-14],[21,9],[21,10],[-21,-8],[-20,-10],[-3,20],[3,-22]].forEach(([bx,bz])=>bush(bx,bz,.8+rng()*.4));

    // Mushrooms near pond
    [[16.5,-14.5],[18,-16.5],[15,-16],[17,-15]].forEach(([mx,mz])=>{const g=new THREE.Group();g.position.set(mx,.42,mz);scene.add(g);cylinder(.1,.12,.42,'#e8d5b0',g,0,.2,0,8);add(new THREE.SphereGeometry(.36,8,5,0,Math.PI*2,0,Math.PI/2),['#d85858','#e8c458','#7a58d8'][Math.floor(rng()*3)],g,0,.44,0);});

    // Rocks on beach
    [[33,-6],[33,5],[-33,-7],[-31,12],[-5,-34],[5,-33]].forEach(([rx,rz])=>{const rk=sphere(.8+rng()*.7,'#b8a88a',scene,rx,.65,rz);rk.scale.y=.58;rk.scale.z=1.15+rng()*.4;});

    // LAMPPOSTS along roads
    [[-12.5,.4],[12.5,.4],[-12.5,-.4],[12.5,-.4],[-.4,-12.5],[.4,-12.5],[-.4,12.5],[.4,12.5],[-25,0],[25,0],[0,-25],[0,25]].forEach(([lx,lz])=>{
      const g=new THREE.Group();g.position.set(lx,.8,lz);scene.add(g);
      cylinder(.07,.09,3.2,'#8c7e6c',g,0,1.55,0,6);const arm=box(.7,.1,.1,'#8c7e6c',g,.38,3.2,0,.02);void arm;
      const globe=sphere(.22,'#fffcdc',g,.72,3.25,0);globe.castShadow=false;
      const pt=new THREE.PointLight('#fff5a0',.7,6.5);pt.position.set(lx+.72,4.1,lz);scene.add(pt);
    });

    // Park benches near studio
    [[-14,.35,8],[-14,.35,9.8],[-18,.35,8.5]].forEach(([bx,by,bz])=>{
      const g=new THREE.Group();g.position.set(bx,by,bz);scene.add(g);
      box(2.2,.18,.65,'#c8a880',g,0,.28,0,.04);[-.88,.88].forEach(lx2=>cylinder(.07,.09,.52,'#9a806a',g,lx2,.12,0,6));box(2.3,.1,.1,'#c8a880',g,0,.52,.3,.02);
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
    obstacles.push({x:-16,z:11,r:4.2});

    // 02 PROJECT PARK
    const gallery=new THREE.Group();gallery.position.set(15,.32,11);scene.add(gallery);
    box(13,.4,9,'#bab2d2',gallery,0,.18,0,.4);
    for(let i=0;i<4;i++){const pg=new THREE.Group();pg.position.set((i-1.5)*3,0,-.4);gallery.add(pg);box(.18,2.5,.18,'#6e6a74',pg,0,1.42,0);box(2.7,2.2,.48,['#9d9ccc','#e8ad85','#a4b78a','#d4a0b0'][i],pg,0,3.15,0,.15);box(2.25,1.7,.06,'#343b3d',pg,0,3.15,.28,.03);label(['\u003c/\u003e','AI','3D','ML'][i],0,3.15,.34,2,'#e9edc8',null,pg,64);}
    box(13.5,.17,1.6,'#aaa2be',gallery,0,4.95,-3.8,.04);// roof overhang
    box(12.5,.08,8.8,'#aaa2be',gallery,0,4.9,0,.04);// roof flat
    label('PROJECT PARK',0,5.8,.6,8.5,'#5c526d',null,gallery);
    obstacles.push({x:15,z:10,r:4.8});

    // 03 LAB
    const lab=new THREE.Group();lab.position.set(14,.32,-15);scene.add(lab);
    add(new THREE.CylinderGeometry(4.8,5.1,.42,32),'#b0be9c',lab,0,.12,0);add(new THREE.CylinderGeometry(3.6,3.6,3,28),'#c8d0a8',lab,0,1.65,0);
    const dome=add(new THREE.SphereGeometry(3.6,32,16,0,Math.PI*2,0,Math.PI/2),'#96a87e',lab,0,2.95,0);dome.castShadow=true;
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const wg=new THREE.CircleGeometry(.48,8);geometries.push(wg);const wm=new THREE.MeshStandardMaterial({color:'#344b45',roughness:.3});materials.push(wm);const wms=new THREE.Mesh(wg,wm);wms.position.set(14+Math.cos(a)*3,2.6,-15+Math.sin(a)*3);wms.lookAt(14,2.6,-15);scene.add(wms);}
    box(1.3,2.1,.22,'#4c6357',lab,0,1.6,3.5);box(5.8,.2,.2,'#e8e8c8',lab,0,3.1,0);
    label('THE LAB',0,6.7,0,5.5,'#3d5546',null,lab);
    const dsh1=new THREE.Group();dsh1.position.set(-4,1.4,-2);lab.add(dsh1);cylinder(.1,.16,2.4,'#6c7b69',dsh1,0,.9,0);const b1=add(new THREE.ConeGeometry(1.15,.48,22),'#e4e6d4',dsh1,0,2.2,0);b1.rotation.z=.8;decorative.push(dsh1);
    const dsh2=new THREE.Group();dsh2.position.set(-5,1.1,1.5);lab.add(dsh2);cylinder(.1,.13,1.9,'#6c7b69',dsh2,0,.7,0);const b2=add(new THREE.ConeGeometry(.8,.38,18),'#e4e6d4',dsh2,0,1.75,0);b2.rotation.z=1.05;decorative.push(dsh2);
    obstacles.push({x:14,z:-15,r:4.2});

    // 04 HELLO STATION
    const hello=new THREE.Group();hello.position.set(-15,.32,-14);scene.add(hello);
    box(9.5,.4,8.5,'#ddc898',hello,0,.18,0,.5);box(3.8,4.2,3.2,'#edbd70',hello,0,2.45,0,.4);box(3.2,.28,.15,'#755e49',hello,0,3.05,.76,.02);
    box(.52,1.2,.38,'#d76f57',hello,1.95,3.6,0,.03);box(1.3,.14,.75,'#d86040',hello,2.62,4.15,0,.03);
    for(let s=0;s<3;s++)box(2.9,.2,1.1,'#d4b47a',hello,0,.12+s*.2,4.5+s*.38,.05);
    label('SAY HELLO',0,5.85,1.0,7.2,'#76523b',null,hello);label('@',0,2.2,1.58,2.1,'#fff4cf',null,hello);
    cylinder(.22,.3,9,'#dac09a',hello,-3.8,4.4,-1);for(let i=0;i<5;i++)cylinder(.22,.22,.48,'#b87755',hello,-3.8,1+i*1.75,-1);sphere(.48,'#e59868',hello,-3.8,9,-1);box(3.2,.14,.14,'#e2c8a0',hello,-3.8,9.3,-1,.02);
    obstacles.push({x:-15,z:-14,r:3.4});

    // DESTINATION MARKERS
    const markers:THREE.Object3D[]=[];
    destinations.forEach(d=>{
      const g=new THREE.Group();g.position.set(d.x,.4,d.z+5.4);scene.add(g);
      const ring=add(new THREE.TorusGeometry(2.1,.09,8,56),d.color,g);ring.rotation.x=-Math.PI/2;markers.push(ring);
      cylinder(.058,.058,3,'#737c67',g,-2.3,1.45,0,6);
      const flagGeo=new THREE.PlaneGeometry(1.5,.85);geometries.push(flagGeo);
      const flagM=new THREE.MeshStandardMaterial({color:d.color,roughness:.55,side:THREE.DoubleSide});materials.push(flagM);
      const flag=new THREE.Mesh(flagGeo,flagM);flag.position.set(-1.55,2.45,.05);g.add(flag);decorative.push(flag);
      box(1.25,.72,.07,d.color,g,-1.7,2.05,0,.02);label(d.number,-1.7,2.05,.08,.88,'#424638',null,g);
    });

    // ISLAND TITLE
    const titleMesh=label('PARARDHA\'S ISLAND',0,.48,7.5,22,'#897a62');titleMesh.rotation.x=-Math.PI/2;
    const subMesh=label('MAKE  •  EXPLORE  •  DISCOVER',0,.49,11,14,'#a89878');subMesh.rotation.x=-Math.PI/2;
    cylinder(.14,.22,4.5,'#9a856b',scene,0,2.1,-5.5);box(6,.82,.24,'#f3e9d1',scene,0,4.5,-5.5,.04);label('← STUDIO     WORK →',0,4.5,-5.25,5,'#766d57');

    // ROVER
    const rover=new THREE.Group();scene.add(rover);const body=new THREE.Group();rover.add(body);
    box(1.75,.54,2.85,'#e07848',body,0,.96,0,.18);box(1.52,.77,1.32,'#f2b880',body,0,1.52,-.18,.16);
    box(1.28,.5,.08,'#455f59',body,0,1.58,.56,.04);box(1.28,.5,.08,'#455f59',body,0,1.58,-.92,.04);
    box(.08,.44,.9,'#455f59',body,-.8,1.58,-.18,.03);box(.08,.44,.9,'#455f59',body,.8,1.58,-.18,.03);
    box(2.0,.24,.22,'#e6cfaa',body,0,.84,1.48,.03);box(2.0,.24,.22,'#565e50',body,0,.84,-1.48,.03);
    [-.6,.6].forEach(lx=>{box(.35,.28,.12,'#fff0b5',body,lx,1.1,1.42,.04);box(.27,.21,.1,'#a64038',body,lx,1.06,-1.42,.02);});
    box(1.18,.14,.9,'#546450',body,0,1.98,-.18,.02);cylinder(.038,.044,1.25,'#3d4e42',body,.7,2.2,-.7,6);sphere(.1,'#cde68a',body,.7,2.87,-.7);
    const wheels:THREE.Mesh[]=[];[-1.08,1.08].forEach(wx=>[-.95,.95].forEach(wz=>{const wh=cylinder(.44,.44,.34,'#3c453d',rover,wx,.62,wz,18);wh.rotation.z=Math.PI/2;wheels.push(wh);cylinder(.21,.21,.36,'#c2bdaa',rover,wx,.62,wz,12).rotation.z=Math.PI/2;}));
    const rovShadow=add(new THREE.CircleGeometry(1.85,32),'#b0a580',rover,0,.038,0);rovShadow.rotation.x=-Math.PI/2;rovShadow.castShadow=false;
    const dusts:THREE.Mesh[]=[];for(let i=0;i<16;i++){const d=sphere(.17,'#ece0c2');d.visible=false;dusts.push(d);}

    // ENERGY CELLS – 16 on two radii
    const cells:{mesh:THREE.Group;x:number;z:number;found:boolean}[]=[];
    for(let i=0;i<16;i++){
      const angle=i/16*Math.PI*2;const r=i%2===0?27:15;
      const cx=Math.sin(angle)*r;const cz=Math.cos(angle)*r;
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

    // GAME STATE
    let px=0,pz=5,angle=Math.PI,speed=0,collected=0,paused=true,hasStarted=false,disposed=false,frame=0,last=performance.now(),lastReport=0;
    const keys=new Set<string>();const look=new THREE.Vector3(-14,0,1);const wanted=new THREE.Vector3();const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const report=()=>{const nearby=destinations.find(d=>Math.hypot(px-d.x,pz-(d.z+5.4))<4.8)?.id??null;callbacks.current.onState({speed:Math.abs(speed),collected,nearby,x:px,z:pz});};
    const reset2=()=>{px=0;pz=5;angle=Math.PI;speed=0;keys.clear();report();};
    const controls:WorldController={pause:v=>{paused=v;if(!v)hasStarted=true;keys.clear();speed=0;},reset:reset2,input:(key,down)=>{if(down)keys.add(key);else keys.delete(key);},travel:id=>{const d=destinations.find(dd=>dd.id===id);if(d){px=d.x;pz=d.z+5.4;angle=Math.PI;speed=0;keys.clear();report();}}};
    const keymap:Record<string,string>={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right',shift:'boost'};
    const onDown=(e:KeyboardEvent)=>{if(paused)return;const t=e.target as HTMLElement;if(t.closest('input,textarea,[contenteditable="true"]'))return;const k=keymap[e.key.toLowerCase()];if(k){e.preventDefault();keys.add(k);}};
    const onUp=(e:KeyboardEvent)=>{const k=keymap[e.key.toLowerCase()];if(k)keys.delete(k);};
    const blur=()=>{keys.clear();speed=0;};window.addEventListener('keydown',onDown);window.addEventListener('keyup',onUp);window.addEventListener('blur',blur);
    const resize=()=>{const w=host.clientWidth;const h=host.clientHeight;const asp=w/h;const ext=w<700?50:34;camera.left=-ext*asp;camera.right=ext*asp;camera.top=ext;camera.bottom=-ext;camera.updateProjectionMatrix();renderer.setSize(w,h);};const obs=new ResizeObserver(resize);obs.observe(host);resize();

    const tick=(now:number)=>{
      if(disposed)return;const dt=Math.min((now-last)/1000,.04);last=now;
      if(!paused){
        const thr=(keys.has('up')?1:0)-(keys.has('down')?1:0);const boost=keys.has('boost');
        speed+=thr*13*dt;speed*=Math.exp(-(thr?1.0:3.4)*dt);speed=THREE.MathUtils.clamp(speed,-5,boost?14:9);
        const steer=(keys.has('left')?1:0)-(keys.has('right')?1:0);angle+=steer*dt*2.2*Math.min(Math.abs(speed)/3,1)*Math.sign(speed||1);
        const nx=px+Math.sin(angle)*speed*dt;const nz=pz+Math.cos(angle)*speed*dt;
        if(Math.hypot(nx,nz)>44||obstacles.some(o=>Math.hypot(nx-o.x,nz-o.z)<o.r+.9)){speed*=-.3;}else{px=nx;pz=nz;}
        cells.forEach(c=>{if(!c.found&&Math.hypot(px-c.x,pz-c.z)<2.2){c.found=true;c.mesh.visible=false;collected++;report();}});
      }
      rover.position.set(px,.37,pz);rover.rotation.y=angle;
      body.rotation.z=THREE.MathUtils.damp(body.rotation.z,((keys.has('left')?1:0)-(keys.has('right')?1:0))*speed*.013,8,dt);
      wheels.forEach(wh=>wh.rotation.x+=speed*dt*2);
      if(!reduced.matches){
        cells.forEach((c,i)=>{c.mesh.position.y=1.65+Math.sin(now*.002+i)*.22;c.mesh.rotation.y=now*.0013;});
        decorative.forEach((item,i)=>{if(i%2===0)item.rotation.y=now*.0004;else(item as THREE.Mesh).rotation.z=Math.sin(now*.003+i)*.1;});
        markers.forEach((m,i)=>m.scale.setScalar(1+Math.sin(now*.002+i)*.06));
        waterMeshes.forEach((m,i)=>{(m.material as THREE.MeshStandardMaterial).opacity=.65+Math.sin(now*.004+i*.4)*.06;});
        clouds.forEach((cloud,i)=>{cloud.position.x+=Math.sin(now*.00014+i)*.004;cloud.position.z+=Math.cos(now*.00012+i)*.003;});
      }
      dusts.forEach((d2,i)=>{d2.visible=!paused&&Math.abs(speed)>3;const t2=((now*.001+i*.08)%1);d2.position.set(px-Math.sin(angle)*(1.6+t2*2.2)+(i%3-1)*.3,.52+t2*.42,pz-Math.cos(angle)*(1.6+t2*2.2));d2.scale.setScalar(.5+t2*2.2);});
      wanted.set(hasStarted?px*.8:-14,0,hasStarted?pz*.8:1);look.lerp(wanted,1-Math.exp(-dt*2.4));camera.position.set(look.x+44,54,look.z+48);camera.lookAt(look);camera.zoom=THREE.MathUtils.damp(camera.zoom,hasStarted?1.32:.88,2,dt);camera.updateProjectionMatrix();
      renderer.render(scene,camera);if(now-lastReport>100){report();lastReport=now;}frame=requestAnimationFrame(tick);
    };
    const vis=()=>{blur();if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}};document.addEventListener('visibilitychange',vis);
    const lost=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frame);callbacks.current.onError();};renderer.domElement.addEventListener('webglcontextlost',lost);
    frame=requestAnimationFrame(tick);callbacks.current.onReady(controls);report();
    return()=>{disposed=true;cancelAnimationFrame(frame);obs.disconnect();window.removeEventListener('keydown',onDown);window.removeEventListener('keyup',onUp);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',vis);renderer.domElement.removeEventListener('webglcontextlost',lost);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div className="world-canvas" ref={root}/>;
}
