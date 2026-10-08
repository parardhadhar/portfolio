import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const rows = [
  ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'BACK'],
  ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'DEL'],
  ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER'],
  ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '↑'],
  ['CTRL', 'ALT', 'CMD', 'SPACE', 'FN', '←', '↓', '→'],
];
const widths = (label: string) => label === 'SPACE' ? 5.2 : ['SHIFT', 'ENTER', 'CAPS'].includes(label) ? 1.55 : 1;

export default function KeyboardScene({ onKey }: { onKey: (key: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const callback = useRef(onKey);
  const pressRef = useRef<(key: string) => void>(() => {});
  const [fallback, setFallback] = useState(false);
  useEffect(() => { callback.current = onKey; }, [onKey]);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch { queueMicrotask(() => setFallback(true)); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-9, 9, 5, -5, .1, 100);
    camera.position.set(0, 12, 14); camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xe6ddff, 0x454158, 3));
    const light = new THREE.DirectionalLight(0xffffff, 4); light.position.set(-4, 10, 6); light.castShadow = true; light.shadow.mapSize.set(1024, 1024); light.shadow.camera.left = -10; light.shadow.camera.right = 10; light.shadow.camera.top = 7; light.shadow.camera.bottom = -7; light.shadow.bias = -.001; scene.add(light);
    const purple = new THREE.PointLight(0x9567ff, 80, 25); purple.position.set(5, 4, -5); scene.add(purple);
    const board = new THREE.Group(); scene.add(board); board.rotation.y = -.13; board.rotation.z = -.04;
    const materials: THREE.Material[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const textures: THREE.Texture[] = [];
    const mesh = (w: number, h: number, d: number, color: number, radius = .12) => {
      const geo = new RoundedBoxGeometry(w, h, d, 2, radius); geometries.push(geo);
      const material = new THREE.MeshStandardMaterial({ color, roughness: .38, metalness: .18 }); materials.push(material);
      const object = new THREE.Mesh(geo, material); object.castShadow = true; object.receiveShadow = true; return object;
    };
    const chassis = mesh(14.1, .65, 6.4, 0x75717d, .2); chassis.position.y = -.15; board.add(chassis);
    const plate = mesh(13.85, .16, 6.14, 0x25232c); plate.position.y = .21; board.add(plate);
    const keys: { group: THREE.Group; cap: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>; label: string; color: number; until: number }[] = [];
    rows.forEach((row, rowIndex) => {
      const total = row.reduce((sum, label) => sum + widths(label), 0) + (row.length - 1) * .13;
      let x = -total / 2;
      row.forEach(label => {
        const width = widths(label); const group = new THREE.Group(); group.position.set(x + width / 2, .48, rowIndex * 1.13 - 2.26); x += width + .13;
        const color = ['ESC', 'ENTER', 'SPACE'].includes(label) ? 0x9f82f5 : label.length > 1 ? 0x8e899b : 0xe4dfec;
        const cap = mesh(width, .48, .97, color, .09); cap.userData.key = label; group.add(cap);
        const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 128;
        const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#26212f'; ctx.font = `600 ${label.length > 1 ? 21 : 36}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label === 'SPACE' ? 'MAKE / CREATE' : label, 128, 64);
        const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture);
        const geo = new THREE.PlaneGeometry(width * .9, .65); geometries.push(geo);
        const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }); materials.push(mat);
        const legend = new THREE.Mesh(geo, mat); legend.rotation.x = -Math.PI / 2; legend.position.y = .246; group.add(legend);
        board.add(group); keys.push({group, cap, label, color, until: 0});
      });
    });
    const groundGeo = new THREE.PlaneGeometry(200, 200); geometries.push(groundGeo);
    const groundMat = new THREE.ShadowMaterial({opacity:.24}); materials.push(groundMat);
    const ground = new THREE.Mesh(groundGeo,groundMat); ground.rotation.x=-Math.PI/2; ground.position.y=-.53; ground.receiveShadow=true; scene.add(ground);
    let frame = 0; let visible = false; let disposed = false; let targetX = 0; let targetY = -.13; let lastTime = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const render = (now: number) => {
      if (disposed || !visible || document.hidden) { frame = 0; return; }
      const delta = Math.min((now-lastTime)/1000, .05); lastTime=now;
      board.rotation.x = THREE.MathUtils.damp(board.rotation.x, reduced.matches ? 0 : targetX, 6, delta);
      board.rotation.y = THREE.MathUtils.damp(board.rotation.y, reduced.matches ? -.13 : targetY, 6, delta);
      keys.forEach(key => { const pressed = now < key.until; key.group.position.y = reduced.matches ? (pressed ? .28 : .48) : THREE.MathUtils.damp(key.group.position.y, pressed ? .28 : .48, 24, delta); key.cap.material.color.setHex(pressed ? 0xb8ff70 : key.color); });
      renderer.render(scene,camera); frame = requestAnimationFrame(render);
    };
    const start = () => { if (!frame && visible && !document.hidden && !disposed) { lastTime=performance.now(); frame=requestAnimationFrame(render); } };
    const press = (label: string) => { const key=keys.find(key=>key.label===label); if(!key) return; key.until=performance.now()+180; callback.current(label); start(); };
    pressRef.current=press;
    const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
    const hit = (event: PointerEvent) => { const rect=renderer.domElement.getBoundingClientRect(); pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1); raycaster.setFromCamera(pointer,camera); return raycaster.intersectObjects(keys.map(key=>key.cap))[0]; };
    const move = (event: PointerEvent) => { if(event.pointerType==='mouse') { const rect=container.getBoundingClientRect(); targetY=-.13+((event.clientX-rect.left)/rect.width-.5)*.2; targetX=((event.clientY-rect.top)/rect.height-.5)*.08; } renderer.domElement.style.cursor=hit(event)?'pointer':'default'; };
    let down: {x:number;y:number} | null=null;
    const pointerDown=(event:PointerEvent)=>{down={x:event.clientX,y:event.clientY};};
    const pointerUp=(event:PointerEvent)=>{if(down && Math.hypot(event.clientX-down.x,event.clientY-down.y)<12){const found=hit(event);if(found)press(found.object.userData.key);}down=null;};
    const reset=()=>{targetX=0;targetY=-.13;down=null;};
    const keydown=(event:KeyboardEvent)=>{ const target=event.target as HTMLElement; if(!visible || event.repeat || event.ctrlKey || event.metaKey || event.altKey || target.closest('input,textarea,select,button,a,[contenteditable="true"]'))return; const label=event.key===' '?'SPACE':event.key==='Backspace'?'BACK':event.key==='Escape'?'ESC':event.key.toUpperCase(); if(keys.some(key=>key.label===label)){if(['SPACE','BACK'].includes(label))event.preventDefault();press(label);} };
    const resize=()=>{const width=container.clientWidth;const height=container.clientHeight;renderer.setSize(width,height);const aspect=width/height;const halfW=8.9;camera.left=-halfW;camera.right=halfW;camera.top=halfW/aspect;camera.bottom=-halfW/aspect;camera.updateProjectionMatrix();};
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);resize();
    const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.08});intersection.observe(container);
    document.addEventListener('visibilitychange',start); window.addEventListener('keydown',keydown);
    const surface=renderer.domElement;surface.addEventListener('pointermove',move);surface.addEventListener('pointerdown',pointerDown);surface.addEventListener('pointerup',pointerUp);surface.addEventListener('pointerleave',reset);surface.addEventListener('pointercancel',reset);
    return()=>{disposed=true;cancelAnimationFrame(frame);intersection.disconnect();resizeObserver.disconnect();window.removeEventListener('keydown',keydown);document.removeEventListener('visibilitychange',start);surface.removeEventListener('pointermove',move);surface.removeEventListener('pointerdown',pointerDown);surface.removeEventListener('pointerup',pointerUp);surface.removeEventListener('pointerleave',reset);surface.removeEventListener('pointercancel',reset);textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();surface.remove();pressRef.current=()=>{};};
  }, []);
  return <><div className="keyboard-canvas" ref={host} role="img" aria-label="Interactive 3D mechanical keyboard with lilac and ivory keys" />
    <div className={fallback ? 'keyboard-fallback' : 'keyboard-accessible'} aria-label="Keyboard controls">{rows.flat().map(label=><button key={label} type="button" onClick={()=>fallback?onKey(label):pressRef.current(label)}>{label}</button>)}</div>
  </>;
}
