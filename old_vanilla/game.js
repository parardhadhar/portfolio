/* ============================================================
   CINEMATIC PORTFOLIO — game.js
   First-Person Museum with:
   - AABB Collider system (wall + pillar)
   - WASD movement with head bob
   - Holographic pedestal stations with spotlights
   - Unreal Engine screenshot gallery on Environment station
   - Film grain + vignette post-process
   - Floating ambient dust particles
   - Mouse cursor released when info panel is open
   ============================================================ */

'use strict';

/* =========================================================
   STATION DATA
   ========================================================= */
var STATIONS = [
    {
        id:'origin', pos:[0, -50], col:0xD4AF37, lbl:'CHAPTER I — THE ORIGIN', title:'WHO AM I',
        body:`<p><strong>Parardha Dhar</strong> — CS undergrad at <strong>VIT Bhopal University</strong> bridging two worlds: crafting hyper-realistic game environments in <strong>Unreal Engine 5</strong> and engineering intelligent systems with <strong>Machine Learning</strong>.</p>
<p>📧 <a href="mailto:parardhadhar@gmail.com" target="_blank">parardhadhar@gmail.com</a></p>
<p>💼 <a href="https://linkedin.com/in/parardhadhar" target="_blank">LinkedIn Profile</a></p>
<p>📄 <a href="Parardha_Dhar_CV_0.pdf" target="_blank">Download CV / Resume</a></p>
<div class="tags"><span>CS ENGINEERING</span><span>VIT BHOPAL</span><span>2024-2028</span></div>`,
        images:[]
    },
    {
        id:'worlds', pos:[70, -20], col:0xFFD700, lbl:'CHAPTER II — THE WORLDS', title:'UNREAL ENGINE ENVIRONMENTS',
        body:`<p>Hyper-realistic worlds built with <strong>Unreal Engine 5</strong> — Lumen Global Illumination, Nanite geometry, Quixel Megascans, and Niagara VFX.</p>
<p>Featuring a photorealistic <strong>Beach Paradise</strong> and an atmospheric <strong>Crystal Cave</strong> environment.</p>
<p>🖼️ Click an image below to view full size ↓</p>
<div class="tags"><span>LUMEN GI</span><span>NANITE</span><span>MEGASCANS</span><span>NIAGARA VFX</span><span>UE5</span></div>`,
        images:['BeachUnreal/ScreenShot00000.png','BeachUnreal/ScreenShot00001.png','BeachUnreal/ScreenShot00002.png','CaveUnreal/ScreenShot00000.png','CaveUnreal/ScreenShot00001.png','CaveUnreal/ScreenShot00002.png']
    },
    {
        id:'ml', pos:[-70, -20], col:0xB76E79, lbl:'CHAPTER III — THE NEURAL NETWORK', title:'ML & AI PROJECTS',
        body:`<p>🧠 <strong>PhishGuard</strong> — Real-time phishing URL detector, 92% accuracy</p>
<p>🎮 <strong>Sentinel Verse</strong> — WebGL cybersecurity sim with AI decision trees</p>
<p>🎵 <strong>Music Mood Matcher</strong> — Emotion-based music recommender via facial recognition</p>
<p>✍️ <strong>AI Handwriting Generator</strong> — Neural handwriting synthesis net</p>
<p>🔗 <a href="https://github.com/parardhadhar" target="_blank">View all projects on GitHub →</a></p>
<div class="tags"><span>PYTHON</span><span>TENSORFLOW</span><span>PYTORCH</span><span>SCIKIT-LEARN</span><span>REACT</span></div>`,
        images:[]
    },
    {
        id:'exp', pos:[60, -78], col:0xFFE4C4, lbl:'CHAPTER IV — THE JOURNEY', title:'WORK EXPERIENCE',
        body:`<p>🎮 <strong>UE5 Environmental Artist</strong> — Independent (2025–Present)</p>
<p>⚽ <strong>Software Engineering Virtual Exp.</strong> — Electronic Arts / Forage (2025)</p>
<p>🔬 <strong>AI & Web Research Lead</strong> — VIT Bhopal University (2024–Present)</p>
<p>💻 <strong>Open-Source Contributor</strong> — GitHub Community (2024–Present)</p>
<div class="tags"><span>EA SPORTS</span><span>RESEARCH LEAD</span><span>OPEN SOURCE</span></div>`,
        images:[]
    },
    {
        id:'skills', pos:[-60, -78], col:0xE5E4E2, lbl:'CHAPTER V — THE ARSENAL', title:'SKILLS & TOOLS',
        body:`<p>🎮 <strong>Game Dev:</strong> Unreal Engine 5, Unity, C++, Blueprints, Niagara VFX, Lumen, Nanite</p>
<p>🤖 <strong>ML / AI:</strong> Python, TensorFlow, PyTorch, Scikit-learn, NLP, Computer Vision</p>
<p>🌐 <strong>Web Dev:</strong> React, Next.js, Node.js, Flask, MongoDB, Firebase, REST APIs</p>
<p>🎨 <strong>Creative:</strong> Blender, Quixel Megascans, Houdini (basic), Photoshop</p>
<div class="tags"><span>DEEPLEARNING.AI</span><span>GOOGLE CLOUD</span><span>EA SIMULATION</span></div>`,
        images:[]
    },
    {
        id:'contact', pos:[0, -110], col:0xCD7F32, lbl:'CHAPTER VI — THE SIGNAL', title:'GET IN TOUCH',
        body:`<p>Looking for an <strong>Unreal Engine Artist</strong>, <strong>ML Developer</strong>, or <strong>Full-Stack Engineer</strong> who bridges the gap between silicon and story?</p>
<p style="margin-top:12px">📧 <a href="mailto:parardhadhar@gmail.com">parardhadhar@gmail.com</a></p>
<p>💼 <a href="https://linkedin.com/in/parardhadhar" target="_blank">linkedin.com/in/parardhadhar</a></p>
<p>🐱 <a href="https://github.com/parardhadhar" target="_blank">github.com/parardhadhar</a></p>
<p>📄 <a href="Parardha_Dhar_CV_0.pdf" target="_blank">Download Resume / CV (PDF)</a></p>`,
        images:[]
    }
];

/* =========================================================
   AABB COLLIDER TABLE
   Each entry: { cx, cz, hw, hd } (center & half-widths)
   ========================================================= */
var COLLIDERS = [];

/* =========================================================
   GLOBALS
   ========================================================= */
var scene, camera, renderer, composer, clock;
var keys = {};

var droneGroup;                 // The hover ship
var droneSpeed = 0;             // Current forward speed
var droneRot = Math.PI;         // Current Y rotation (pointing towards stations initially)

var WORLD_HALF = 145;           // museum boundary

var stationGroups = [];
var floaters = [];
var dustParticles;
var activeStation = null;
var grainCtx;
var gameStarted = false;
var infoPanelOpen = false;

// Living museum elements
var followLight;      // PointLight attached to camera
var floatingOrbs = []; // { mesh, light, phase, radius, speed, orbitY }
var beamMeshes = [];   // Station beacon beams for pulsing
var ceilLights = [];   // Ceiling accent strip lights
var bots = [];         // Roaming geometric drones
var ceilLights = [];   // Ceiling accent strip lights

/* =========================================================
   BOOT SEQUENCE
   ========================================================= */
var bootLines = [
    '> SYSTEM BOOT — Neural Interface v4.2.0',
    '> Calibrating holographic projectors... <span style="color:#00F5FF">[DONE]</span>',
    '> Generating brutalist architecture... <span style="color:#00F5FF">[DONE]</span>',
    '> Rendering reflective marble floor... <span style="color:#00F5FF">[DONE]</span>',
    '> Loading Unreal Engine 5 screenshots... <span style="color:#2ECC71">[DONE]</span>',
    '> Initialising collision boundaries... <span style="color:#2ECC71">[DONE]</span>',
    '> Ambient particles online... <span style="color:#2ECC71">[DONE]</span>',
    '> Operator: <span style="color:#FFD700">PARARDHA DHAR</span>',
    '> <span style="color:#00F5FF">✦ GALLERY SYSTEMS ONLINE ✦</span>',
];
var bIdx = 0;
function boot() {
    if (bIdx >= bootLines.length) {
        document.getElementById('pfill').style.width = '100%';
        setTimeout(() => {
            var loader = document.getElementById('loader');
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            setTimeout(() => { loader.style.display = 'none'; }, 900);
            document.getElementById('start').style.display = 'flex';
            initScene();
        }, 500);
        return;
    }
    document.getElementById('pfill').style.width = ((bIdx + 1) / bootLines.length * 100) + '%';
    document.getElementById('term').innerHTML = bootLines.slice(0, bIdx + 1).join('<br>') + '<span class="blink"></span>';
    bIdx++;
    setTimeout(boot, 120 + Math.random() * 180);
}
setTimeout(boot, 400);

/* =========================================================
   CONTROLS (WASD ONLY - NO MOUSE LOCK)
   ========================================================= */
document.getElementById('go').addEventListener('click', () => {
    gameStarted = true;
    document.getElementById('start').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    document.getElementById('minimap').style.display = 'block';
});

document.addEventListener('keydown', e => {
    keys[e.code] = true;
    
    // F key to interact
    if (e.code === 'KeyF' && gameStarted) {
        if (!infoPanelOpen && activeStation) {
            var s = STATIONS.find(x => x.id === activeStation);
            if (s) openInfoPanel(s);
        } else if (infoPanelOpen) {
            closeInfoPanel();
        }
    }
});
document.addEventListener('keyup', e => { keys[e.code] = false; });

function openInfoPanel(s) {
    infoPanelOpen = true;
    document.getElementById('ilbl').textContent = s.lbl;
    document.getElementById('ititle').textContent = s.title;
    document.getElementById('ibody').innerHTML = s.body;
    var iimgs = document.getElementById('iimgs');
    iimgs.innerHTML = '';
    if (s.images && s.images.length) {
        s.images.forEach(src => {
            var img = document.createElement('img');
            img.src = src; img.alt = 'UE5 Project';
            img.addEventListener('click', () => { openLightbox(src); });
            iimgs.appendChild(img);
        });
    }
    document.getElementById('info').classList.add('show');
}

function closeInfoPanel() {
    infoPanelOpen = false;
    activeStation = null;
    document.getElementById('info').classList.remove('show');
}

// Close info panel button
document.getElementById('info-close').addEventListener('click', (e) => {
    e.stopPropagation();
    closeInfoPanel();
});

/* =========================================================
   SCREEN-SPACE — LIGHTBOX
   ========================================================= */
var lightbox = document.createElement('div');
lightbox.id = 'lightbox';
var lbImg = document.createElement('img');
lightbox.appendChild(lbImg);
document.body.appendChild(lightbox);
lightbox.addEventListener('click', () => lightbox.classList.remove('show'));

function openLightbox(src) {
    lbImg.src = src;
    lightbox.classList.add('show');
}

/* =========================================================
   HOVER DRONE
   ========================================================= */
function buildDrone() {
    droneGroup = new THREE.Group();
    // A sleek, elegant golden artifact
    var shipGeo = new THREE.OctahedronGeometry(1.5, 0);
    // Brilliant glowing gold
    var shipMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, wireframe: true });
    var ship = new THREE.Mesh(shipGeo, shipMat);
    ship.rotation.x = Math.PI / 4;
    ship.rotation.y = Math.PI / 4;
    
    // Solid pristine white core
    var core = new THREE.Mesh(new THREE.TetrahedronGeometry(1.3, 0), new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1, metalness: 0.8 }));
    core.rotation.x = Math.PI / 4; core.rotation.y = Math.PI / 4;

    // Warm golden glow
    var glowLight = new THREE.PointLight(0xD4AF37, 1.2, 25, 2);
    
    droneGroup.add(ship);
    droneGroup.add(core);
    droneGroup.add(glowLight);
    
    droneGroup.position.set(0, 4, 35);
    scene.add(droneGroup);
}

/* =========================================================
   INIT THREE.JS SCENE
   ========================================================= */
function initScene() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    // Warm, pristine bright background
    scene.background = new THREE.Color(0xF4F6F9);
    scene.fog = new THREE.FogExp2(0xF4F6F9, 0.0035);

    camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 800);

    renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance" });
    renderer.setSize(innerWidth, innerHeight);
    // Cap pixel ratio to 1.5, heavily boosts FPS on retina/4K displays
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    document.body.insertBefore(renderer.domElement, document.body.firstChild);

    // === POST-PROCESSING (BLOOM) ===
    var renderScene = new THREE.RenderPass(scene, camera);
    // Render bloom at half resolution for massive 4x GPU performance gain
    var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), 1.8, 0.8, 0.85);
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    window.addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
        composer.setSize(innerWidth, innerHeight);
    });

    buildDrone();
    buildEnvironment();
    buildStations();
    buildLivingLights();
    buildBots();
    buildDustParticles();
    initGrain();
    animate();
}

/* =========================================================
   ENVIRONMENT — LUXURY GALLERY Pivot
   ========================================================= */
function buildEnvironment() {
    // Elegant warm lighting for the white surfaces
    scene.add(new THREE.AmbientLight(0xFFF5E6, 1.3));
    
    // Sunlight simulation
    var sun = new THREE.DirectionalLight(0xfffaed, 0.8);
    sun.position.set(50, 100, 20);
    scene.add(sun);

    // === PRISTINE GLOSSY FLOOR ===
    var floorTex = buildFloorTexture();
    var floor = new THREE.Mesh(
        new THREE.PlaneGeometry(WORLD_HALF * 3, WORLD_HALF * 3),
        new THREE.MeshStandardMaterial({ 
            map: floorTex,
            roughness: 0.08, 
            metalness: 0.3, 
            color: 0xFFFFFF 
        })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // === CLEAN GALLERY CEILING ===
    var ceil = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_HALF*3, WORLD_HALF*3),
        new THREE.MeshStandardMaterial({ color: 0xFAFAFA, roughness: 0.9 }));
    ceil.rotation.x = Math.PI/2; ceil.position.y = 85; scene.add(ceil);

    // === STUDIO WALLS with Gold Trim ===
    var wallData = [
        [0, 50, -WORLD_HALF, WORLD_HALF*2.1, 100, 4],
        [0, 50,  WORLD_HALF, WORLD_HALF*2.1, 100, 4],
        [ WORLD_HALF, 50, 0, 4, 100, WORLD_HALF*2.1],
        [-WORLD_HALF, 50, 0, 4, 100, WORLD_HALF*2.1],
    ];
    wallData.forEach(([x,y,z,w,h,d]) => {
        var wall = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), new THREE.MeshStandardMaterial({ color: 0xFDFDFD, roughness: 0.6 }));
        wall.position.set(x,y,z); scene.add(wall);
        COLLIDERS.push({ cx:x, cz:z, hw:w/2+1.5, hd:d/2+1.5 });
        
        // Baseboard Gold
        var t1 = new THREE.Mesh(new THREE.BoxGeometry(w, 0.8, d+0.8), new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.8, roughness: 0.2 }));
        t1.position.set(x, 1, z); scene.add(t1);
        
        // Upper accent Platinum
        var t2 = new THREE.Mesh(new THREE.BoxGeometry(w, 0.4, d+0.4), new THREE.MeshStandardMaterial({ color: 0xE5E4E2, metalness: 0.6, roughness: 0.3 }));
        t2.position.set(x, 32, z); scene.add(t2);
    });

    // === ELEGANT PILLARS ===
    var edgeColArr = [0xD4AF37, 0xE5E4E2, 0xB76E79, 0xFFE4C4, 0xCD7F32];
    for (var i = 0; i < 15; i++) {
        var px = (Math.random()-0.5)*(WORLD_HALF*1.7);
        var pz = (Math.random()-0.5)*(WORLD_HALF*1.7);
        var tooClose = STATIONS.some(s => dist2D(px,pz,s.pos[0],s.pos[1]) < 25);
        if (tooClose || (Math.abs(px)<25 && pz>0 && pz<60)) continue;
        var ec = edgeColArr[i % edgeColArr.length];
        
        // Minimalist Alabaster pillar
        var pillar = new THREE.Mesh(new THREE.BoxGeometry(9,82,9), new THREE.MeshStandardMaterial({ color: 0xFCFCFC, roughness: 0.2 }));
        pillar.position.set(px,41,pz); scene.add(pillar);
        
        // Soft glowing bands
        var bot = new THREE.Mesh(new THREE.BoxGeometry(9.6,1.5,9.6), new THREE.MeshBasicMaterial({ color: ec }));
        bot.position.set(px,2,pz); scene.add(bot);
        var top = new THREE.Mesh(new THREE.BoxGeometry(9.6,1.5,9.6), new THREE.MeshBasicMaterial({ color: ec }));
        top.position.set(px,83,pz); scene.add(top);
        
        COLLIDERS.push({ cx:px, cz:pz, hw:6, hd:6 });
    }
}

// --- ELEGANT GOLD GRID TEXTURE ---
function buildFloorTexture() {
    var c = document.createElement('canvas'); c.width=1024; c.height=1024;
    var ctx = c.getContext('2d');
    // Pure white marble-like base
    ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,1024,1024);
    
    // Sub-grid subtle gold
    ctx.strokeStyle='rgba(212, 175, 55, 0.15)'; ctx.lineWidth=1;
    for (var g=32; g<1024; g+=32) {
        ctx.beginPath(); ctx.moveTo(g,0); ctx.lineTo(g,1024); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,g); ctx.lineTo(1024,g); ctx.stroke();
    }
    // Primary grid lines Gold
    ctx.strokeStyle='rgba(212, 175, 55, 0.4)'; ctx.lineWidth=5;
    for (var m=128; m<=1024; m+=128) {
        ctx.beginPath(); ctx.moveTo(m,0); ctx.lineTo(m,1024); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,m); ctx.lineTo(1024,m); ctx.stroke();
    }
    // Intersections glow soft gold
    ctx.shadowBlur=15; ctx.shadowColor='#D4AF37'; ctx.fillStyle='#D4AF37';
    for (var xi=0; xi<=1024; xi+=128)
        for (var yi=0; yi<=1024; yi+=128) {
            ctx.beginPath(); ctx.arc(xi,yi,5,0,Math.PI*2); ctx.fill();
        }
    ctx.shadowBlur=0;
    var tex=new THREE.CanvasTexture(c);
    tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
    tex.repeat.set(16,16);
    return tex;
}

/* =========================================================
   HOLOGRAPHIC STATIONS
   ========================================================= */
function buildStations() {
    STATIONS.forEach((s, idx) => {
        var g = new THREE.Group();
        g.position.set(s.pos[0], 0, s.pos[1]);
        g.userData.station = s;

        // Giant glowing Holographic Ring (Station gate)
        var ring = new THREE.Mesh(
            new THREE.TorusGeometry(12, 0.8, 16, 64),
            new THREE.MeshBasicMaterial({ color: s.col, transparent: true, opacity: 0.9 })
        );
        ring.position.y = 12; 
        g.add(ring);

        // Inner decorative rings
        var inner1 = new THREE.Mesh(new THREE.TorusGeometry(10, 0.2, 8, 32), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        inner1.position.y = 12; inner1.rotation.x = Math.PI/2; g.add(inner1);
        var inner2 = new THREE.Mesh(new THREE.TorusGeometry(10.5, 0.1, 8, 32), new THREE.MeshBasicMaterial({ color: s.col }));
        inner2.position.y = 12; g.add(inner2);

    // Create giant beacon beam
    var beamGeo = new THREE.CylinderGeometry(11, 11, 100, 16, 1, true);
    var beamMat = new THREE.MeshBasicMaterial({ color: s.col, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
    var beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 50; g.add(beam);
    beamMeshes.push(beam);

        // Intense Bloom Light Inside Ring
        var pLight = new THREE.PointLight(s.col, 3, 60, 2);
        pLight.position.y = 12; g.add(pLight);

        // Spotlight from ceiling
        var spotTarget = new THREE.Object3D(); spotTarget.position.set(0, 12, 0); g.add(spotTarget);
        var spot = new THREE.SpotLight(s.col, 12, 120, Math.PI / 4, 0.4, 1.2);
        spot.position.set(0, 80, 0); spot.target = spotTarget; spot.castShadow = true; g.add(spot);
        spot.shadow.mapSize.width = 512; spot.shadow.mapSize.height = 512;

        // Large faint outer identification ring
        var outerRingMat = new THREE.MeshBasicMaterial({ color: s.col, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
        var outerRing = new THREE.Mesh(new THREE.TorusGeometry(18, 0.5, 8, 40), outerRingMat);
        outerRing.rotation.x = Math.PI / 2; outerRing.position.y = 0.3; g.add(outerRing);

        // Floating hologram shape inside ring
        var fGeo = idx % 3 === 0
            ? new THREE.IcosahedronGeometry(3.2, 0)
            : idx % 3 === 1
                ? new THREE.TorusKnotGeometry(2.5, 0.6, 64, 16)
                : new THREE.OctahedronGeometry(3.5, 0);
        var fMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: (idx === 2) });
        var floater = new THREE.Mesh(fGeo, fMat);
        floater.position.y = 12; g.add(floater);
        floaters.push({ mesh: floater, base: 12, phase: idx * 1.05, speed: 1.5 + idx * 0.1 });

        // Particle core
        var pArr = [];
        for (var k = 0; k < 40; k++) {
            var p = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.3, 0.3),
                new THREE.MeshBasicMaterial({ color: s.col })
            );
            p.userData = { r: 5 + Math.random() * 6, a: Math.random() * Math.PI * 2, y: Math.random() * 24, spd: 1.2 + Math.random() * 1.2 };
            g.add(p); pArr.push(p);
        }
        g.userData.particles = pArr;

        scene.add(g);
        stationGroups.push(g);

        // Register station core as collider to prevent flying straight through the middle structure
        // Actually, we want them to fly THROUGH the ring, so no huge collider.
        COLLIDERS.push({ cx: s.pos[0], cz: s.pos[1], hw: 3, hd: 3 });
    });
}

// Tiny canvas text sprite
function makeTextLabel(text, col) {
    var c = document.createElement('canvas'); c.width = 512; c.height = 112;
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 112);
    var hex = '#' + col.toString(16).padStart(6, '0');
    ctx.fillStyle = hex; ctx.globalAlpha = 0.85;
    ctx.fillRect(0, 36, 512, 40);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px "Space Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 56);
    var tex = new THREE.CanvasTexture(c);
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    return sp;
}

/* =========================================================
   LIVING MUSEUM LIGHTS — flashlight + orbs + ceiling strips
   ========================================================= */
function buildLivingLights() {
    // 1. Player follow-light (flashlight)
    followLight = new THREE.PointLight(0xDDEEFF, 2.0, 35, 2);
    followLight.position.set(0, 0, -1); // slightly in front
    camera.add(followLight);
    scene.add(camera); // camera must be in scene to attach lights

    // 2. Floating Light Orbs — 10 glowing spheres drifting around the museum
    var orbColors = [0x00F5FF,0xFFD700,0x9B59B6,0x2ECC71,0xFF4E8A,0x3498DB,0xE67E22,0xFF6B35,0x1ABC9C,0xF39C12];
    for (var i = 0; i < 10; i++) {
        var col = orbColors[i];
        // Visible glowing sphere
        var orbMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.55, 10, 10),
            new THREE.MeshBasicMaterial({ color: col })
        );
        // PointLight attached to orb
        var orbLight = new THREE.PointLight(col, 1.8, 28, 2);
        var orbGroup = new THREE.Group();
        orbGroup.add(orbMesh);
        orbGroup.add(orbLight);
        // Random start position
        orbGroup.position.set(
            (Math.random() - 0.5) * WORLD_HALF * 1.4,
            12 + Math.random() * 20,
            (Math.random() - 0.5) * WORLD_HALF * 1.4
        );
        scene.add(orbGroup);
        floatingOrbs.push({
            group: orbGroup,
            phase: Math.random() * Math.PI * 2,
            speed: 0.15 + Math.random() * 0.25,
            radius: 15 + Math.random() * 40,
            baseY: orbGroup.position.y,
            originX: orbGroup.position.x,
            originZ: orbGroup.position.z
        });
    }

    // 3. Ceiling accent strip lights — thin bright panels in a grid
    var stripColors = [0x00AADD, 0x8844EE, 0x00DD66];
    for (var j = 0; j < 18; j++) {
        var sc = stripColors[j % stripColors.length];
        var strip = new THREE.Mesh(
            new THREE.BoxGeometry(30, 0.4, 1.5),
            new THREE.MeshBasicMaterial({ color: sc })
        );
        var sx = (Math.random() - 0.5) * WORLD_HALF * 1.6;
        var sz = (Math.random() - 0.5) * WORLD_HALF * 1.6;
        strip.position.set(sx, 83, sz);
        strip.rotation.y = Math.random() * Math.PI;
        scene.add(strip);
        var cStrip = new THREE.PointLight(sc, 0.8, 60, 2);
        cStrip.position.set(sx, 80, sz);
        scene.add(cStrip);
        ceilLights.push({ light: cStrip, strip: strip, phase: Math.random() * Math.PI * 2 });
    }
}

/* =========================================================
   ROAMING NPCS (Floating geometry drones)
   ========================================================= */
function buildBots() {
    var botColors = [0x00D0FF, 0x9B59B6, 0xFFC300, 0x27AE60];
    for (var i = 0; i < 6; i++) {
        var bc = botColors[i % botColors.length];
        var group = new THREE.Group();
        
        // Main floating diamond
        var body = new THREE.Mesh(
            new THREE.OctahedronGeometry(2),
            new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true })
        );
        
        // Inner glowing core
        var core = new THREE.Mesh(
            new THREE.OctahedronGeometry(1.2),
            new THREE.MeshBasicMaterial({ color: bc })
        );
        group.add(body);
        group.add(core);
        
        var pl = new THREE.PointLight(bc, 1.5, 30, 2);
        group.add(pl);
        
        // Safe spawn away from center
        var bx = (Math.random() - 0.5) * WORLD_HALF * 1.4;
        var bz = (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 50);
        group.position.set(bx, 12, bz);
        scene.add(group);
        
        bots.push({
            group: group,
            body: body,
            core: core,
            originX: bx,
            originZ: bz,
            phase: Math.random() * Math.PI * 2,
            speed: 0.1 + Math.random() * 0.15,
            radius: 20 + Math.random() * 30
        });
    }
}

function buildDustParticles() {
    var count = 600;
    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(count * 3);
    for (var i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * WORLD_HALF * 2;
        positions[i + 1] = Math.random() * 70;
        positions[i + 2] = (Math.random() - 0.5) * WORLD_HALF * 2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var mat = new THREE.PointsMaterial({ color: 0x7AAFD8, size: 0.3, transparent: true, opacity: 0.25, depthWrite: false });
    dustParticles = new THREE.Points(geo, mat);
    scene.add(dustParticles);
}

/* =========================================================
   FILM GRAIN
   ========================================================= */
function initGrain() {
    var canvas = document.getElementById('grain');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.04;z-index:9997;mix-blend-mode:screen;';
    canvas.width = 256; canvas.height = 256;
    grainCtx = canvas.getContext('2d');
    drawGrain();
}
function drawGrain() {
    var img = grainCtx.createImageData(256, 256);
    for (var i = 0; i < img.data.length; i += 4) {
        var v = Math.random() * 255 | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
    }
    grainCtx.putImageData(img, 0, 0);
}

/* =========================================================
   MINIMAP
   ========================================================= */
function drawMinimap() {
    var cv = document.getElementById('mmap'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(8,12,20,0.88)'; ctx.fillRect(0, 0, W, H);
    var sc = W / (WORLD_HALF * 2), ox = W / 2, oy = H / 2;

    STATIONS.forEach(s => {
        ctx.beginPath(); ctx.arc(s.pos[0] * sc + ox, s.pos[1] * sc + oy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#' + s.col.toString(16).padStart(6, '0'); ctx.fill();
    });

    var cx = droneGroup.position.x * sc + ox;
    var cz = droneGroup.position.z * sc + oy;
    ctx.save(); ctx.translate(cx, cz); ctx.rotate(-droneRot); // Use droneRot for minimap orientation
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(-4, 5); ctx.lineTo(4, 5); ctx.closePath(); ctx.fill();
    ctx.restore();
}

/* =========================================================
   STATION PROXIMITY CHECK
   ========================================================= */
function checkProximity() {
    if (!gameStarted) return;
    var cx = droneGroup.position.x, cz = droneGroup.position.z;
    var nearest = null, nearestD = Infinity;

    stationGroups.forEach(g => {
        var d = dist2D(cx, cz, g.position.x, g.position.z);
        if (d < nearestD) { nearestD = d; nearest = g; }
    });

    var hint = document.getElementById('hint');
    var prompt = document.getElementById('interact-prompt');

    if (nearest && nearestD < 20) {
        var s = nearest.userData.station;
        if (!infoPanelOpen && activeStation !== s.id) {
            // New active station discovered!
            activeStation = s.id;
        }
        
        if (!infoPanelOpen) {
            prompt.style.opacity = '1';
        } else {
            prompt.style.opacity = '0';
        }
        hint.style.opacity = '0';
    } else if (nearest && nearestD < 38) {
        prompt.style.opacity = '0';
        hint.style.opacity = '1';
        hint.textContent = '● ' + nearest.userData.station.title + ' — walk closer';
    } else {
        prompt.style.opacity = '0';
        hint.style.opacity = '0';
        // Auto-close if they walk away
        if (nearestD > 42 && activeStation !== null) {
            closeInfoPanel();
            activeStation = null;
        }
    }
}

/* =========================================================
   AABB COLLISION RESOLUTION
   ========================================================= */
function applyCollisions(nextX, nextZ) {
    var radius = 2.8; // player capsule radius
    COLLIDERS.forEach(col => {
        var dx = nextX - col.cx;
        var dz = nextZ - col.cz;
        var overX = col.hw + radius - Math.abs(dx);
        var overZ = col.hd + radius - Math.abs(dz);
        if (overX > 0 && overZ > 0) {
            // Push out along the axis of smaller overlap
            if (overX < overZ) { nextX += (dx < 0 ? -overX : overX); }
            else               { nextZ += (dz < 0 ? -overZ : overZ); }
        }
    });
    // Clamp to museum bounds
    nextX = Math.max(-WORLD_HALF + 3, Math.min(WORLD_HALF - 3, nextX));
    nextZ = Math.max(-WORLD_HALF + 3, Math.min(WORLD_HALF - 3, nextZ));
    return [nextX, nextZ];
}

/* =========================================================
   MAIN LOOP
   ========================================================= */
function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.getElapsedTime();

    // ---- Drone Movement & Physics ----
    if (gameStarted) {
        var fwd = (keys['ArrowUp'] || keys['KeyW']) ? 1 : 0;
        var bwd = (keys['ArrowDown'] || keys['KeyS']) ? 1 : 0;
        var lft = (keys['ArrowLeft'] || keys['KeyA']) ? 1 : 0;
        var rgt = (keys['ArrowRight'] || keys['KeyD']) ? 1 : 0;

        // Rotation
        if (lft) droneRot += 3.5 * dt;
        if (rgt) droneRot -= 3.5 * dt;

        // Acceleration
        var accel = (fwd - bwd) * 140 * dt;
        droneSpeed += accel;
        // Friction
        droneSpeed *= 0.92;

        // Apply Velocity
        var nx = droneGroup.position.x + Math.sin(droneRot) * droneSpeed * dt;
        var nz = droneGroup.position.z + Math.cos(droneRot) * droneSpeed * dt;
        var resolved = applyCollisions(nx, nz);
        
        droneGroup.position.x = resolved[0];
        droneGroup.position.z = resolved[1];
        // Bobbing ship
        droneGroup.position.y = 4 + Math.sin(t * 4) * 0.5;
        
        // Tilt ship based on turning
        var tilt = (rgt - lft) * 0.4;
        droneGroup.children[0].rotation.z = THREE.MathUtils.lerp(droneGroup.children[0].rotation.z, tilt, 0.1);
        droneGroup.children[1].rotation.z = THREE.MathUtils.lerp(droneGroup.children[1].rotation.z, tilt, 0.1);

        // ---- Third Person Trailing Camera ----
        // Target camera position (behind and above the drone)
        var camOffsetDist = 18;
        var camHeight = 10;
        var targetCamX = droneGroup.position.x - Math.sin(droneRot) * camOffsetDist;
        var targetCamZ = droneGroup.position.z - Math.cos(droneRot) * camOffsetDist;
        var targetCamY = droneGroup.position.y + camHeight;
        
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 4 * dt);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 4 * dt);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 4 * dt);
        
        // Look slightly ahead of the drone
        var lookTarget = new THREE.Vector3(
            droneGroup.position.x + Math.sin(droneRot) * 10,
            droneGroup.position.y,
            droneGroup.position.z + Math.cos(droneRot) * 10
        );
        camera.lookAt(lookTarget);
    }

    // ---- HUD coords ----
    document.getElementById('pos').textContent = 'X: ' + Math.round(droneGroup.position.x) + ' · Z: ' + Math.round(droneGroup.position.z);

    // ---- Floater animations ----
    floaters.forEach(f => {
        f.mesh.rotation.x += 0.4 * dt;
        f.mesh.rotation.y += 0.7 * dt;
        f.mesh.position.y = f.base + Math.sin(t * f.speed + f.phase) * 1.6;
    });

    // ---- Station particle rain ----
    stationGroups.forEach(g => {
        g.userData.particles.forEach(p => {
            p.userData.y -= p.userData.spd * 10 * dt;
            if (p.userData.y < 0) { p.userData.y = 18; p.userData.a += 0.3; }
            p.position.set(
                Math.cos(p.userData.a) * p.userData.r,
                p.userData.y,
                Math.sin(p.userData.a) * p.userData.r
            );
            p.rotation.y += dt * 1.5;
        });
    });

    // ---- Floating Orbs ----
    floatingOrbs.forEach(o => {
        var t2 = t * o.speed + o.phase;
        o.group.position.x = o.originX + Math.sin(t2) * o.radius * 0.5;
        o.group.position.z = o.originZ + Math.cos(t2 * 0.7) * o.radius * 0.5;
        o.group.position.y = o.baseY + Math.sin(t2 * 1.3) * 5;
    });

    // ---- Station beam pulse ----
    beamMeshes.forEach((m, i) => {
        m.material.opacity = 0.04 + Math.abs(Math.sin(t * 1.5 + i * 0.8)) * 0.10;
    });

    // ---- Ceiling light breathe ----
    ceilLights.forEach(c => {
        var pulse = 0.5 + Math.sin(t * 0.8 + c.phase) * 0.3;
        c.light.intensity = pulse;
    });

    // ---- NPC Bots roaming ----
    bots.forEach(b => {
        var p = t * b.speed + b.phase;
        b.group.position.x = b.originX + Math.sin(p) * b.radius;
        b.group.position.z = b.originZ + Math.cos(p * 0.6) * b.radius;
        b.group.position.y = 12 + Math.sin(p * 2.5) * 3;
        b.body.rotation.y += dt;
        b.body.rotation.x += dt * 0.5;
        b.core.rotation.y -= dt * 1.2;
    });

    checkProximity();
    drawMinimap();
    if (composer) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
}

/* =========================================================
   UTIL
   ========================================================= */
function dist2D(ax, az, bx, bz) {
    var dx = ax - bx, dz = az - bz;
    return Math.sqrt(dx * dx + dz * dz);
}
