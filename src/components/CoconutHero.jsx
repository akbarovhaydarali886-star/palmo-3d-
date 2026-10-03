import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HandDrawnButton from './HandDrawnButton';

gsap.registerPlugin(ScrollTrigger);

export default function CoconutHero() {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const canvasMountRef = useRef(null);

  // Overlay DOM element refs for direct 60fps manipulation (zero React re-renders!)
  const stage1Ref = useRef(null);
  const stage2Ref = useRef(null);
  const stage3Ref = useRef(null);
  const stage4Ref = useRef(null);
  const progressContainerRef = useRef(null);
  const progressTextPrefixRef = useRef(null);
  const progressTextNumRef = useRef(null);
  const progressBarRef = useRef(null);
  const crackGlowRef = useRef(null);
  const scallopWaveRef = useRef(null);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Performance optimization
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Realistic Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffe386, 1.3);
    dirLight2.position.set(-4, -2, 3);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Root Transformation Groups
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const coconutGroup = new THREE.Group();
    masterGroup.add(coconutGroup);
    // Align coconut so -X points UP (+Y in world), +X points DOWN (-Y in world)
    coconutGroup.rotation.z = Math.PI / 2;

    const canGroup = new THREE.Group();
    masterGroup.add(canGroup);
    canGroup.scale.set(0.0001, 0.0001, 0.0001); // hidden initially

    let coconutLeftMesh = null;
    let coconutRightMesh = null;
    let coconutMilkMesh = null;
    let strawMesh = null;
    let isDisposed = false;

    // Yellow Straw inside coconut bowl
    const strawGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1, 16);
    const strawMat = new THREE.MeshStandardMaterial({
      color: 0xffe386,
      roughness: 0.3,
      metalness: 0.1,
    });
    strawMesh = new THREE.Mesh(strawGeo, strawMat);
    strawMesh.rotation.z = -Math.PI / 5;
    strawMesh.position.set(0, 0.45, 0.2);
    strawMesh.visible = false;
    masterGroup.add(strawMesh);

    // Load Can Texture
    const textureLoader = new THREE.TextureLoader();
    const canTexture = textureLoader.load('/model/tex/coconutWhite.webp', () => {
      renderer.render(scene, camera);
    });
    canTexture.colorSpace = THREE.SRGBColorSpace;
    canTexture.flipY = true;
    canTexture.generateMipmaps = true;

    // Load Can GLB
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/model/can1.glb',
      (gltf) => {
        if (isDisposed) return;
        const canModel = gltf.scene;
        canModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            if (
              child.name === 'Shell' ||
              child.material?.name === 'Etiquette' ||
              !child.name.toLowerCase().includes('metal')
            ) {
              child.material = new THREE.MeshStandardMaterial({
                map: canTexture,
                roughness: 0.32,
                metalness: 0.18,
              });
            } else {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xd8d8d8,
                metalness: 0.85,
                roughness: 0.22,
              });
            }
          }
        });

        const box = new THREE.Box3().setFromObject(canModel);
        const center = box.getCenter(new THREE.Vector3());
        canModel.position.sub(center);
        canModel.scale.set(0.52, 0.52, 0.52);
        canGroup.add(canModel);
      }
    );

    // Load Coconut GLB
    gltfLoader.load(
      '/model/coconut.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.name.includes('left')) coconutLeftMesh = child;
            if (child.name.includes('right')) coconutRightMesh = child;
            if (child.name.includes('milk') || child.name.includes('Circle')) {
              coconutMilkMesh = child;
              child.material = new THREE.MeshStandardMaterial({
                color: 0xf6f3ee,
                roughness: 0.12,
                metalness: 0.08,
              });
            } else if (child.material) {
              child.material.roughness = 0.75;
              child.material.metalness = 0.05;
            }
          }
        });

        // Offset center of mass
        model.position.set(0.046, 0, 0);
        // Scale to prominent hero dimensions (takes ~45% of viewport height)
        model.scale.set(11.5, 11.5, 11.5);
        coconutGroup.add(model);
      }
    );

    // Mouse tilt tracking
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const handleMouseMove = (e) => {
      mouseTargetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseTargetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation progress state (scrubbed smoothly via GSAP)
    const animState = {
      progress: 0,
      shake: 0,
    };

    // GSAP ScrollTrigger Pinned Scrub Timeline
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: viewportRef.current,
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
        animState.progress = p;

        // ---------------- DIRECT DOM UPDATES (NO REACT RE-RENDERS) ----------------
        // 1. Stage 1: "PARADISE IN EVERY SIP." (p: 0.0 -> 0.22)
        if (stage1Ref.current) {
          const op1 = p <= 0.2 ? Math.max(0, 1 - p * 4.8) : 0;
          stage1Ref.current.style.opacity = op1;
          stage1Ref.current.style.pointerEvents = op1 > 0.1 ? 'auto' : 'none';
          stage1Ref.current.style.transform = `translateY(${-p * 60}px)`;
        }

        // 2. Stage 2: "THE REAL SOURCE OF EVERY SIP." & Orbiting Badges (p: 0.22 -> 0.50)
        if (stage2Ref.current) {
          let op2 = 0;
          if (p > 0.22 && p <= 0.36) op2 = (p - 0.22) / 0.14;
          else if (p > 0.36 && p <= 0.48) op2 = 1;
          else if (p > 0.48 && p <= 0.54) op2 = 1 - (p - 0.48) / 0.06;
          stage2Ref.current.style.opacity = op2;
          stage2Ref.current.style.pointerEvents = op2 > 0.1 ? 'auto' : 'none';
        }

        // 3. Stage 3: "COCONUT" & Emerging Can & 360 Spin (p: 0.54 -> 0.78)
        if (stage3Ref.current) {
          let op3 = 0;
          if (p > 0.56 && p <= 0.65) op3 = (p - 0.56) / 0.09;
          else if (p > 0.65 && p <= 0.75) op3 = 1;
          else if (p > 0.75 && p <= 0.82) op3 = 1 - (p - 0.75) / 0.07;
          stage3Ref.current.style.opacity = op3;
          stage3Ref.current.style.pointerEvents = op3 > 0.1 ? 'auto' : 'none';
        }

        // 4. Stage 4: "KEEP PALMO SIPPING.." (p: 0.75 -> 1.0)
        if (stage4Ref.current) {
          const op4 = p >= 0.75 ? Math.min(1, (p - 0.75) * 5) : 0;
          stage4Ref.current.style.opacity = op4;
        }

        // 5. Progress Indicator Bar ("SHAKING 005" -> "062" -> "CANNED 100")
        if (progressContainerRef.current) {
          const isVisible = p >= 0.38 && p <= 0.88;
          progressContainerRef.current.style.opacity = isVisible ? '1' : '0';

          if (p < 0.48) {
            if (progressTextPrefixRef.current) progressTextPrefixRef.current.textContent = 'SHAKING';
            if (progressTextNumRef.current) progressTextNumRef.current.textContent = '005';
            if (progressBarRef.current) progressBarRef.current.style.width = '8%';
          } else if (p < 0.68) {
            const num = Math.round(5 + ((p - 0.48) / 0.2) * 57);
            if (progressTextPrefixRef.current) progressTextPrefixRef.current.textContent = 'SHAKING';
            if (progressTextNumRef.current) progressTextNumRef.current.textContent = String(num).padStart(3, '0');
            if (progressBarRef.current) progressBarRef.current.style.width = `${Math.round(num * 0.95)}%`;
          } else {
            if (progressTextPrefixRef.current) progressTextPrefixRef.current.textContent = 'CANNED';
            if (progressTextNumRef.current) progressTextNumRef.current.textContent = '100';
            if (progressBarRef.current) progressBarRef.current.style.width = '100%';
          }
        }

        // 6. Glowing Crack Light
        if (crackGlowRef.current) {
          const isCrack = p > 0.42 && p < 0.58;
          crackGlowRef.current.style.opacity = isCrack ? '1' : '0';
        }

        // 7. Scalloped Wave rising from bottom into #pure-coconut
        if (scallopWaveRef.current) {
          if (p >= 0.72) {
            const waveProgress = (p - 0.72) / 0.28; // 0 to 1
            const translateY = (1 - waveProgress) * 100;
            scallopWaveRef.current.style.transform = `translateY(${translateY}%)`;
            scallopWaveRef.current.style.opacity = '1';
          } else {
            scallopWaveRef.current.style.transform = 'translateY(100%)';
            scallopWaveRef.current.style.opacity = '0';
          }
        }
      },
    });

    // Three.js Render Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const p = animState.progress;

      // Smooth Mouse Tilt Interpolation
      currentTiltX += (mouseTargetX * 0.2 - currentTiltX) * 0.05;
      currentTiltY += (mouseTargetY * 0.15 - currentTiltY) * 0.05;

      // Gentle floating bob
      const idleBob = Math.sin(elapsedTime * 1.6) * 0.035;

      // STAGE 1: p from 0.0 to 0.22 (Closed Floating Coconut with Mouse Parallax)
      if (p <= 0.22) {
        coconutGroup.visible = true;
        canGroup.visible = false;
        if (strawMesh) strawMesh.visible = false;

        coconutGroup.position.set(currentTiltX * 0.4, idleBob, 0);
        coconutGroup.rotation.set(
          currentTiltY + idleBob * 0.3,
          currentTiltX * 0.5 + p * 0.5,
          Math.PI / 2 - 0.15
        );

        if (coconutLeftMesh) {
          coconutLeftMesh.position.set(0, 0, 0);
          coconutLeftMesh.rotation.set(0, 0, 0);
        }
        if (coconutRightMesh) {
          coconutRightMesh.position.set(0, 0, 0);
          coconutRightMesh.rotation.set(0, 0, 0);
        }
      }
      // STAGE 2: p from 0.22 to 0.50 (Coconut Cracks Open -> Coconut Bowl with Straw)
      else if (p > 0.22 && p <= 0.50) {
        const normP = (p - 0.22) / 0.28; // 0 to 1
        coconutGroup.visible = true;
        canGroup.visible = false;

        // Bowl tilts towards camera so user can look down into coconut water
        coconutGroup.position.set(currentTiltX * 0.4, idleBob - normP * 0.15, 0);
        coconutGroup.rotation.set(
          currentTiltY + normP * 0.65, // tilt down towards viewer
          currentTiltX * 0.4,
          Math.PI / 2
        );

        // Top half (coconut_left.001) lifts UP and tilts open
        if (coconutLeftMesh) {
          coconutLeftMesh.position.x = -normP * 0.08; // moves UP in world space
          coconutLeftMesh.rotation.y = normP * 0.45;  // tilts open
        }

        // Straw emerges inside bowl
        if (strawMesh) {
          strawMesh.visible = normP > 0.3;
          strawMesh.position.set(0.18 + currentTiltX * 0.4, idleBob + 0.15 - normP * 0.15, 0.1);
        }
      }
      // STAGE 3: p from 0.50 to 0.78 (Shake -> Shells Fly Apart -> Can Emerges & 360 Spin)
      else if (p > 0.50 && p <= 0.78) {
        const normP = (p - 0.50) / 0.28; // 0 to 1

        if (strawMesh) strawMesh.visible = false;

        if (normP < 0.35) {
          // Shaking & Shells separate
          const shakePhase = normP / 0.35;
          const shakeMag = (1 - shakePhase) * 0.08;
          coconutGroup.visible = true;
          coconutGroup.position.set(
            (Math.random() - 0.5) * shakeMag,
            idleBob + (Math.random() - 0.5) * shakeMag,
            0
          );

          if (coconutLeftMesh) coconutLeftMesh.position.x = -0.08 - shakePhase * 0.35;
          if (coconutRightMesh) coconutRightMesh.position.x = shakePhase * 0.35;

          // Can emerges from center
          canGroup.visible = true;
          const canScale = shakePhase;
          canGroup.scale.set(canScale, canScale, canScale);
          canGroup.position.set(0, idleBob, 0);
        } else {
          // Shells gone, Palmo Can in center rotating 360° on scroll!
          coconutGroup.visible = false;
          canGroup.visible = true;
          canGroup.scale.set(1, 1, 1);

          const spinP = (normP - 0.35) / 0.65;
          // Smooth 360 rotation revealing nutrition facts, barcode, 15% OFF star
          canGroup.rotation.y = spinP * Math.PI * 2.2 + currentTiltX * 0.5;
          canGroup.rotation.x = currentTiltY * 0.3;
          canGroup.position.set(currentTiltX * 0.3, idleBob, 0);
        }
      }
      // STAGE 4: p > 0.78 (Can Descends into Rising Scalloped Section)
      else {
        coconutGroup.visible = false;
        canGroup.visible = true;
        const normP = (p - 0.78) / 0.22; // 0 to 1
        canGroup.scale.set(1, 1, 1);
        canGroup.position.set(currentTiltX * 0.2, idleBob - normP * 0.6, 0);
        canGroup.rotation.y = Math.PI * 2.2 + normP * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      trigger.kill();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[520vh] bg-background">
      {/* GSAP Pinned Viewport Container */}
      <div
        ref={viewportRef}
        className="w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none select-none relative"
      >
        {/* Three.js Canvas Mount */}
        <div ref={canvasMountRef} className="absolute inset-0 size-full z-10 pointer-events-auto" />

        {/* ----------------- STAGE 1 OVERLAY ("PARADISE IN EVERY SIP.") ----------------- */}
        <div
          ref={stage1Ref}
          className="absolute inset-0 size-full flex items-center justify-between paddx pointer-events-none will-change-[opacity,transform] z-20"
        >
          {/* Left Title: PARADISE IN EVERY SIP. */}
          <div className="w-[30vw] max-md:w-full flex flex-col items-start pt-[6vw] max-md:pt-[18vw]">
            <h1 className="font-khand text180 max-md:text-[14vw] font-bold text-foreground leading-[85%] uppercase tracking-[-0.04em]">
              PARADISE IN
              <br />
              EVERY SIP.
            </h1>

            {/* Hand-drawn Arrow + Two Callout Lines */}
            <div className="mt-[2.5vw] max-md:mt-4 flex items-start gap-[1vw] max-md:gap-2">
              <svg className="w-[2.8vw] h-[3.8vw] max-md:w-8 max-md:h-10 stroke-foreground fill-none" viewBox="0 0 50 80">
                <path d="M 10 10 Q 35 40 25 70" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 15 55 L 25 70 L 38 60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex flex-col pt-[1.2vw] max-md:pt-2 font-patrick-hand text-[1.35vw] max-md:text-base text-foreground font-bold leading-tight select-none">
                <span>Rich In Electrolytes</span>
                <span>No Added Sugar</span>
              </div>
            </div>
          </div>

          {/* Gyro Sensor Pill (Bottom Left matching media_1791042894999.png) */}
          <div className="absolute bottom-[3vh] left-[3vw] z-30 flex items-center gap-[0.6vw] max-md:gap-2 rounded-full bg-[#FFE386] border border-[#e5c967] px-[1vw] py-[0.4vw] max-md:px-3 max-md:py-1.5 shadow-sm text-foreground select-none pointer-events-auto">
            <span className="text-[1.1vw] max-md:text-sm">📱</span>
            <span className="font-khand font-bold text-[1.1vw] max-md:text-xs uppercase tracking-wide">
              GYRO SENSOR
            </span>
            <span className="text-foreground/40 font-light">|</span>
            <span className="font-sans text-[0.85vw] max-md:text-[10px] font-medium text-foreground/85">
              Use Mobile To Experience Gyro Sensor
            </span>
            <button
              type="button"
              onClick={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              className="ml-[0.4vw] text-foreground/60 hover:text-foreground font-bold text-sm cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Right Subtext & Discover Button */}
          <div className="w-[28vw] max-md:hidden flex flex-col items-start relative z-10">
            {/* Palm Leaf Graphic Background */}
            <div className="absolute -top-[6vw] -right-[2vw] size-[18vw] opacity-30 pointer-events-none z-0">
              <svg viewBox="0 0 554 588" fill="none" className="size-full fill-[#FFE386]">
                <path d="M276.9 249.3L245 358.5L218.1 349.7L239.4 377.9L201 509.5C167.8 469.1 154.5 411.9 170.6 356.9C186.6 302 228 262.8 276.9 249.3Z" />
              </svg>
            </div>

            <p className="font-sans text-[1.2vw] font-medium text-foreground/80 leading-relaxed relative z-10 mb-[2vw]">
              Quench Your Thirst With Pure Coconut Bliss, Packed With Natural Electrolytes And Zero Added Sugar, For A Cool Sip Every Time.
            </p>
            <div className="relative z-10 pointer-events-auto">
              <HandDrawnButton as="a" href="#flavours" title="Discover Flavors" />
            </div>
          </div>
        </div>

        {/* ----------------- STAGE 2 OVERLAY ("THE REAL SOURCE OF EVERY SIP.") ----------------- */}
        <div
          ref={stage2Ref}
          style={{ opacity: 0 }}
          className="absolute inset-0 size-full paddx flex items-center justify-between pointer-events-none will-change-[opacity] z-20"
        >
          {/* Left: THE REAL */}
          <div className="w-[30vw] max-md:w-full flex flex-col items-start">
            <h2 className="font-khand text180 max-md:text-[14vw] font-bold text-foreground leading-[85%] uppercase tracking-[-0.04em]">
              THE REAL
            </h2>
            <p className="font-sans text-[1.2vw] max-md:text-sm text-foreground/80 mt-[2vw] max-w-[24vw] max-md:max-w-[70vw] font-medium leading-relaxed">
              For Centuries, Coconuts Have Carried Their Own Perfectly Balanced Source Of Refreshment.
            </p>
          </div>

          {/* Right: SOURCE OF EVERY SIP. */}
          <div className="w-[30vw] max-md:hidden flex flex-col items-end text-right">
            <h2 className="font-khand text180 max-md:text-[14vw] font-bold text-foreground leading-[85%] uppercase tracking-[-0.04em]">
              SOURCE OF
              <br />
              EVERY SIP.
            </h2>
          </div>

          {/* 3 Orbiting Badges Around Coconut Bowl */}
          {/* Badge 1: 0GM Of Sugar */}
          <div className="absolute left-[24vw] max-md:left-[6vw] bottom-[28vh] size-[10vw] max-md:size-[24vw] rounded-full bg-[#463721] border-4 border-[#FFE386] flex flex-col items-center justify-center text-center p-[1vw] shadow-2xl z-30 animate-pulse">
            <span className="font-khand text-[2.4vw] max-md:text-2xl font-bold text-[#FFE386] leading-none">
              0GM
            </span>
            <span className="font-patrick-hand text-[1vw] max-md:text-xs text-[#FAF6F0] font-medium uppercase mt-0.5">
              Of Sugar
            </span>
          </div>

          {/* Badge 2: 100% Natural Hydration */}
          <div className="absolute right-[22vw] max-md:right-[6vw] top-[24vh] size-[11vw] max-md:size-[26vw] rounded-full bg-[#463721] border-4 border-[#FFE386] flex flex-col items-center justify-center text-center p-[1vw] shadow-2xl z-30 animate-pulse">
            <span className="font-khand text-[2.6vw] max-md:text-2xl font-bold text-[#FFE386] leading-none">
              100%
            </span>
            <span className="font-patrick-hand text-[1vw] max-md:text-xs text-[#FAF6F0] font-medium uppercase mt-0.5">
              Natural Hydration
            </span>
          </div>

          {/* Badge 3: 45KCL Per 200Ml */}
          <div className="absolute left-[50%] -translate-x-1/2 top-[14vh] size-[8.5vw] max-md:size-[20vw] rounded-full bg-[#FFE386] border-4 border-[#463721] flex flex-col items-center justify-center text-center p-[0.8vw] shadow-2xl z-30">
            <span className="font-khand text-[2vw] max-md:text-xl font-bold text-[#463721] leading-none">
              45KCL
            </span>
            <span className="font-patrick-hand text-[0.85vw] max-md:text-[10px] text-[#463721] font-bold uppercase mt-0.5">
              Per 200Ml
            </span>
          </div>
        </div>

        {/* Vertical Glowing Crack Line Overlay */}
        <div
          ref={crackGlowRef}
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 size-full z-15 flex items-center justify-center will-change-[opacity]"
        >
          <svg viewBox="0 0 200 400" className="w-[12vw] h-[28vw] overflow-visible">
            <path
              d="M 100 20 L 105 90 L 95 160 L 108 230 L 92 310 L 100 380"
              stroke="#FFFFFF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_#ffffff]"
            />
          </svg>
        </div>

        {/* ----------------- STAGE 3 OVERLAY ("COCONUT" & Can Rotation) ----------------- */}
        <div
          ref={stage3Ref}
          style={{ opacity: 0 }}
          className="absolute inset-0 size-full paddx flex items-center justify-between pointer-events-none will-change-[opacity] z-20"
        >
          {/* Left: COCONUT */}
          <div className="w-[28vw] max-md:w-full flex flex-col items-start">
            <h2 className="font-khand text180 max-md:text-[14vw] font-bold text-foreground leading-[85%] uppercase tracking-[-0.04em]">
              COCONUT
            </h2>
            <p className="font-sans text-[1.1vw] max-md:text-sm text-foreground/80 mt-[2vw] max-w-[24vw] max-md:max-w-[70vw] font-medium leading-relaxed">
              One green coconut, opened and pressed within a day of harvest. 100% raw, with 500mg of potassium.
            </p>
          </div>

          {/* Right: Six flavours */}
          <div className="w-[28vw] max-md:hidden flex flex-col items-start pl-[2vw]">
            <p className="font-sans text-[1.1vw] text-foreground/80 mb-[2vw] font-medium leading-relaxed">
              Six flavours, each one pressed with real fruit. Mango, lychee, guava and three more worth meeting.
            </p>
            <div className="pointer-events-auto">
              <HandDrawnButton as="a" href="#flavours" title="Explore Flavors" />
            </div>
          </div>
        </div>

        {/* ----------------- STAGE 4 OVERLAY ("KEEP PALMO SIPPING..") ----------------- */}
        <div
          ref={stage4Ref}
          style={{ opacity: 0 }}
          className="absolute inset-0 size-full flex items-center justify-center pointer-events-none will-change-[opacity] z-5"
        >
          <h2 className="font-khand text-[15vw] max-md:text-[18vw] font-bold uppercase tracking-[-0.04em] text-foreground/90 whitespace-nowrap text-center select-none">
            KEEP PALMO SIPPING..
          </h2>
        </div>

        {/* Diagonal Ray Line */}
        <div className="pointer-events-none absolute inset-0 size-full z-8 overflow-hidden">
          <div className="absolute top-0 left-[10vw] w-[140vw] h-[2px] bg-[#FFE386] origin-top-left rotate-[28deg] opacity-70" />
        </div>

        {/* Bottom Left Progress Bar Indicator */}
        <div
          ref={progressContainerRef}
          style={{ opacity: 0 }}
          className="absolute bottom-[4vh] left-[4vw] z-30 flex flex-col gap-[0.4vw] max-md:gap-1 pointer-events-none will-change-[opacity]"
        >
          <div className="flex items-baseline justify-between w-[18vw] max-md:w-[50vw]">
            <span
              ref={progressTextPrefixRef}
              className="font-khand text-[1.4vw] max-md:text-sm font-bold uppercase tracking-wider text-foreground"
            >
              SHAKING
            </span>
            <span
              ref={progressTextNumRef}
              className="font-khand text-[1.4vw] max-md:text-sm font-bold tracking-wider text-foreground"
            >
              005
            </span>
          </div>
          <div className="w-[18vw] max-md:w-[50vw] h-[0.35vw] max-md:h-1.5 rounded-full bg-foreground/20 overflow-hidden">
            <div
              ref={progressBarRef}
              style={{ width: '5%' }}
              className="h-full bg-foreground transition-all duration-100 rounded-full"
            />
          </div>
        </div>

        {/* Rising Scalloped Dark Wave Border */}
        <div
          ref={scallopWaveRef}
          style={{ transform: 'translateY(100%)', opacity: 0 }}
          className="absolute inset-x-0 bottom-0 w-full h-[55vh] z-25 pointer-events-none will-change-transform flex flex-col justify-end"
        >
          <svg viewBox="0 0 1440 180" fill="none" preserveAspectRatio="none" className="w-full h-[8vw] max-md:h-[18vw] fill-[#463721]">
            <path d="M0,180 L0,80 C120,-30 240,-30 360,80 C480,-30 600,-30 720,80 C840,-30 960,-30 1080,80 C1200,-30 1320,-30 1440,80 L1440,180 Z" />
          </svg>
          <div className="w-full h-full bg-[#463721]" />
        </div>

      </div>
    </div>
  );
}
