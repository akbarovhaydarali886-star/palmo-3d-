import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HandDrawnButton from './HandDrawnButton';

gsap.registerPlugin(ScrollTrigger);

export default function CoconutHero() {
  const containerRef = useRef(null);
  const canvasMountRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic progress values for UI
  const [stageProgressText, setStageProgressText] = useState('SHAKING 005');
  const [stageProgressPercent, setStageProgressPercent] = useState(5);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffe386, 1.2);
    dirLight2.position.set(-3, -2, 2);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // Root Group for coconut & can
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const coconutGroup = new THREE.Group();
    masterGroup.add(coconutGroup);

    const canGroup = new THREE.Group();
    masterGroup.add(canGroup);
    canGroup.scale.set(0.001, 0.001, 0.001); // starts hidden

    let coconutLeftMesh = null;
    let coconutRightMesh = null;
    let coconutMilkMesh = null;
    let strawMesh = null;
    let canModel = null;
    let isDisposed = false;

    // Load Can Texture
    const textureLoader = new THREE.TextureLoader();
    const canTexture = textureLoader.load('/model/tex/coconutWhite.webp', () => {
      renderer.render(scene, camera);
    });
    canTexture.colorSpace = THREE.SRGBColorSpace;
    canTexture.flipY = true;
    canTexture.generateMipmaps = true;

    // Create Straw
    const strawGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.9, 16);
    const strawMat = new THREE.MeshStandardMaterial({
      color: 0xffe386,
      roughness: 0.3,
      metalness: 0.1,
    });
    strawMesh = new THREE.Mesh(strawGeo, strawMat);
    strawMesh.rotation.z = Math.PI / 4;
    strawMesh.position.set(0.18, 0.15, 0.1);
    strawMesh.visible = false;
    coconutGroup.add(strawMesh);

    // Procedural Fallback Can
    function createProceduralCan() {
      const g = new THREE.Group();
      const bodyGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.7, 48, 1, true);
      const bodyMat = new THREE.MeshStandardMaterial({
        map: canTexture,
        roughness: 0.32,
        metalness: 0.2,
      });
      g.add(new THREE.Mesh(bodyGeo, bodyMat));

      const metalMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.85, roughness: 0.22 });
      const topTaper = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.12, 48), metalMat);
      topTaper.position.y = 0.91;
      g.add(topTaper);
      const bottomTaper = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.42, 0.12, 48), metalMat);
      bottomTaper.position.y = -0.91;
      g.add(bottomTaper);
      return g;
    }

    // Load Can GLB
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/model/can1.glb',
      (gltf) => {
        if (isDisposed) return;
        canModel = gltf.scene;
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
      },
      undefined,
      () => {
        if (isDisposed) return;
        canModel = createProceduralCan();
        canGroup.add(canModel);
      }
    );

    // Procedural Fallback Coconut
    function createProceduralCoconut() {
      const g = new THREE.Group();
      const huskMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.85 });
      const meatMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.4 });
      const waterMat = new THREE.MeshStandardMaterial({ color: 0xe0f7fa, roughness: 0.1, transparent: true, opacity: 0.85 });

      // Top shell
      const topShell = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), huskMat);
      topShell.name = 'coconut_left.001';
      g.add(topShell);

      // Bottom shell
      const botShell = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), huskMat);
      botShell.name = 'coconut_right.001';
      g.add(botShell);

      // Water surface inside bottom shell
      const water = new THREE.Mesh(new THREE.CircleGeometry(0.65, 32), waterMat);
      water.rotation.x = -Math.PI / 2;
      water.position.y = 0;
      water.name = 'milk';
      g.add(water);

      return g;
    }

    // Load Coconut GLB
    gltfLoader.load(
      '/model/coconut.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            if (child.name.includes('left')) coconutLeftMesh = child;
            if (child.name.includes('right')) coconutRightMesh = child;
            if (child.name.includes('milk') || child.name.includes('Circle')) {
              coconutMilkMesh = child;
              // Make milk look glistened with water reflection
              child.material = new THREE.MeshStandardMaterial({
                color: 0xf4f0e6,
                roughness: 0.15,
                metalness: 0.1,
              });
            }
          }
        });

        // Center and scale coconut
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Coconut model scale in units
        model.scale.set(5.2, 5.2, 5.2);
        // Default horizontal orientation
        model.rotation.z = Math.PI / 2;
        coconutGroup.add(model);
      },
      undefined,
      () => {
        if (isDisposed) return;
        const fallback = createProceduralCoconut();
        coconutLeftMesh = fallback.getObjectByName('coconut_left.001');
        coconutRightMesh = fallback.getObjectByName('coconut_right.001');
        coconutMilkMesh = fallback.getObjectByName('milk');
        fallback.scale.set(1.5, 1.5, 1.5);
        coconutGroup.add(fallback);
      }
    );

    // Mouse tilt interaction
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseTargetX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseTargetY = (e.clientY - rect.top) / rect.height - 0.5;
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

    // Render loop state references
    const animState = {
      progress: 0,
      shakeIntensity: 0,
    };

    // GSAP ScrollTrigger Scrub Timeline
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        animState.progress = p;
        setScrollProgress(p);

        // Update progress bar UI
        if (p < 0.3) {
          setStageProgressText('SHAKING 005');
          setStageProgressPercent(5);
        } else if (p < 0.6) {
          const val = Math.round(5 + ((p - 0.3) / 0.3) * 57); // 005 -> 062
          setStageProgressText(`SHAKING ${String(val).padStart(3, '0')}`);
          setStageProgressPercent(val);
        } else {
          setStageProgressText('CANNED 100');
          setStageProgressPercent(100);
        }
      },
    });

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const p = animState.progress;

      // Mouse Parallax interpolation
      currentTiltX += (mouseTargetX * 0.4 - currentTiltX) * 0.05;
      currentTiltY += (mouseTargetY * 0.3 - currentTiltY) * 0.05;

      // Gentle floating bob
      const idleBob = Math.sin(elapsedTime * 1.5) * 0.04;

      // STAGE 1: p from 0.0 to 0.25 (Floating Whole Coconut)
      if (p <= 0.25) {
        const normP = p / 0.25;
        coconutGroup.visible = true;
        canGroup.visible = false;
        if (strawMesh) strawMesh.visible = false;

        // Position & Idle Float
        coconutGroup.position.set(currentTiltX * 0.6, idleBob, 0);
        coconutGroup.rotation.set(currentTiltY + idleBob * 0.5, currentTiltX * 0.8 + normP * 0.4, 0);

        // Keep coconut halves joined together
        if (coconutLeftMesh) {
          coconutLeftMesh.position.set(0, 0, 0);
          coconutLeftMesh.rotation.set(0, 0, 0);
        }
        if (coconutRightMesh) {
          coconutRightMesh.position.set(0, 0, 0);
          coconutRightMesh.rotation.set(0, 0, 0);
        }
      }
      // STAGE 2: p from 0.25 to 0.5 (Coconut Cracks Open -> Coconut Bowl with Straw)
      else if (p > 0.25 && p <= 0.5) {
        const normP = (p - 0.25) / 0.25; // 0 to 1
        coconutGroup.visible = true;
        canGroup.visible = false;
        if (strawMesh) strawMesh.visible = true;

        // Tilt coconut bowl towards user to look into coconut water
        coconutGroup.position.set(currentTiltX * 0.5, idleBob - normP * 0.1, 0);
        coconutGroup.rotation.x = currentTiltY + normP * 0.75; // tilts up to show inside
        coconutGroup.rotation.y = currentTiltX * 0.6;
        coconutGroup.rotation.z = Math.sin(normP * Math.PI) * 0.1;

        // Top half lifts and tilts away
        if (coconutLeftMesh) {
          coconutLeftMesh.position.y = normP * 0.55;
          coconutLeftMesh.position.z = -normP * 0.2;
          coconutLeftMesh.rotation.x = -normP * 0.8;
          coconutLeftMesh.rotation.z = normP * 0.3;
        }

        // Bottom half stays as bowl
        if (coconutRightMesh) {
          coconutRightMesh.position.y = -normP * 0.05;
        }
      }
      // STAGE 3: p from 0.5 to 0.8 (Shake -> Can Emerges -> 360 Spin)
      else if (p > 0.5 && p <= 0.8) {
        const normP = (p - 0.5) / 0.3; // 0 to 1

        if (normP < 0.35) {
          // Shaking Phase
          const shake = (1 - normP / 0.35) * 0.12;
          coconutGroup.visible = true;
          coconutGroup.position.x = (Math.random() - 0.5) * shake;
          coconutGroup.position.y = (Math.random() - 0.5) * shake;

          // Halves separate vertically
          if (coconutLeftMesh) coconutLeftMesh.position.y = 0.55 + normP * 1.2;
          if (coconutRightMesh) coconutRightMesh.position.y = -normP * 1.2;

          canGroup.visible = true;
          const canScale = (normP / 0.35) * 1.0;
          canGroup.scale.set(canScale, canScale, canScale);
          canGroup.position.set(0, 0, 0);
        } else {
          // Can is fully emerged, shells fly off
          coconutGroup.visible = false;
          canGroup.visible = true;
          canGroup.scale.set(1, 1, 1);

          // 360 Can Rotation on Scroll
          const spinP = (normP - 0.35) / 0.65;
          canGroup.rotation.y = spinP * Math.PI * 2.2 + currentTiltX * 0.8;
          canGroup.rotation.x = currentTiltY * 0.5;
          canGroup.position.set(currentTiltX * 0.3, idleBob, 0);
        }
      }
      // STAGE 4: p > 0.8 (Can Sinks as Scalloped Wave rises)
      else {
        coconutGroup.visible = false;
        canGroup.visible = true;
        const normP = (p - 0.8) / 0.2; // 0 to 1
        canGroup.scale.set(1, 1, 1);
        canGroup.position.y = idleBob - normP * 0.6; // descends slightly
        canGroup.rotation.y = Math.PI * 2.2 + normP * 0.5;
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
    <div ref={containerRef} className="relative w-full h-[550vh] bg-background">
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none select-none">
        
        {/* Three.js Canvas Mount */}
        <div ref={canvasMountRef} className="absolute inset-0 size-full z-10 pointer-events-auto" />

        {/* ----------------- STAGE 1 OVERLAY (p: 0.0 - 0.25) ----------------- */}
        <div
          style={{
            opacity: scrollProgress <= 0.2 ? Math.max(0, 1 - scrollProgress * 5) : 0,
            transform: `translateY(${-scrollProgress * 80}px)`,
          }}
          className="absolute inset-0 size-full flex items-center justify-between paddx pointer-events-none transition-opacity duration-300 z-20"
        >
          {/* Left Title: PARADISE IN EVERY SIP. */}
          <div className="w-[30vw] max-md:w-full flex flex-col items-start pt-[6vw] max-md:pt-[18vw]">
            <h1 className="font-khand text180 max-md:text-[14vw] font-bold text-foreground leading-[85%] uppercase tracking-[-0.04em]">
              PARADISE IN
              <br />
              EVERY SIP.
            </h1>

            {/* Hand-drawn Arrow + Two Tag Pills */}
            <div className="mt-[3vw] max-md:mt-4 flex items-start gap-[1vw] max-md:gap-2">
              <svg className="w-[3vw] h-[4vw] max-md:w-8 max-md:h-10 stroke-foreground fill-none" viewBox="0 0 50 80">
                <path d="M 10 10 Q 35 40 25 70" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 15 55 L 25 70 L 38 60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex flex-col gap-[0.4vw] max-md:gap-1 pt-[1.5vw] max-md:pt-3">
                <span className="font-patrick-hand text-[1.1vw] max-md:text-sm font-bold text-foreground bg-[#FFE386] px-[0.8vw] py-[0.15vw] max-md:px-2 max-md:py-0.5 rounded-sm shadow-xs whitespace-nowrap">
                  • Rich In Electrolytes
                </span>
                <span className="font-patrick-hand text-[1.1vw] max-md:text-sm font-bold text-foreground bg-[#FFE386] px-[0.8vw] py-[0.15vw] max-md:px-2 max-md:py-0.5 rounded-sm shadow-xs whitespace-nowrap">
                  • No Added Sugar
                </span>
              </div>
            </div>
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

        {/* ----------------- STAGE 2 OVERLAY (p: 0.25 - 0.5) ----------------- */}
        <div
          style={{
            opacity: scrollProgress > 0.22 && scrollProgress < 0.52 ? Math.min(1, Math.max(0, (scrollProgress - 0.22) * 8)) : 0,
            pointerEvents: scrollProgress > 0.22 && scrollProgress < 0.52 ? 'auto' : 'none',
          }}
          className="absolute inset-0 size-full paddx flex items-center justify-between pointer-events-none transition-opacity duration-300 z-20"
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

          {/* 3 Orbiting Badges Around Open Coconut Bowl */}
          {/* Badge 1: 0GM Of Sugar */}
          <div
            style={{
              transform: `translate(${Math.cos(scrollProgress * 12) * 20}px, ${Math.sin(scrollProgress * 12) * 20}px)`,
            }}
            className="absolute left-[24vw] max-md:left-[6vw] bottom-[28vh] size-[10vw] max-md:size-[24vw] rounded-full bg-[#463721] border-4 border-[#FFE386] flex flex-col items-center justify-center text-center p-[1vw] shadow-2xl z-30 transition-transform"
          >
            <span className="font-khand text-[2.4vw] max-md:text-2xl font-bold text-[#FFE386] leading-none">
              0GM
            </span>
            <span className="font-patrick-hand text-[1vw] max-md:text-xs text-[#FAF6F0] font-medium uppercase mt-0.5">
              Of Sugar
            </span>
          </div>

          {/* Badge 2: 100% Natural Hydration */}
          <div
            style={{
              transform: `translate(${Math.sin(scrollProgress * 12) * 20}px, ${-Math.cos(scrollProgress * 12) * 20}px)`,
            }}
            className="absolute right-[22vw] max-md:right-[6vw] top-[24vh] size-[11vw] max-md:size-[26vw] rounded-full bg-[#463721] border-4 border-[#FFE386] flex flex-col items-center justify-center text-center p-[1vw] shadow-2xl z-30 transition-transform"
          >
            <span className="font-khand text-[2.6vw] max-md:text-2xl font-bold text-[#FFE386] leading-none">
              100%
            </span>
            <span className="font-patrick-hand text-[1vw] max-md:text-xs text-[#FAF6F0] font-medium uppercase mt-0.5">
              Natural Hydration
            </span>
          </div>

          {/* Badge 3: 45KCL Per 200Ml */}
          <div
            style={{
              transform: `translate(${Math.cos(scrollProgress * 10) * 15}px, ${Math.sin(scrollProgress * 10) * 15}px)`,
            }}
            className="absolute left-[46vw] -translate-x-1/2 top-[14vh] size-[8.5vw] max-md:size-[20vw] rounded-full bg-[#FFE386] border-4 border-[#463721] flex flex-col items-center justify-center text-center p-[0.8vw] shadow-2xl z-30 transition-transform"
          >
            <span className="font-khand text-[2vw] max-md:text-xl font-bold text-[#463721] leading-none">
              45KCL
            </span>
            <span className="font-patrick-hand text-[0.85vw] max-md:text-[10px] text-[#463721] font-bold uppercase mt-0.5">
              Per 200Ml
            </span>
          </div>
        </div>

        {/* ----------------- STAGE 3 OVERLAY (p: 0.5 - 0.78) ----------------- */}
        <div
          style={{
            opacity: scrollProgress > 0.55 && scrollProgress < 0.8 ? Math.min(1, Math.max(0, (scrollProgress - 0.55) * 8)) : 0,
            pointerEvents: scrollProgress > 0.55 && scrollProgress < 0.8 ? 'auto' : 'none',
          }}
          className="absolute inset-0 size-full paddx flex items-center justify-between pointer-events-none transition-opacity duration-300 z-20"
        >
          {/* Left: COCONUT + details */}
          <div className="w-[28vw] max-md:w-full flex flex-col items-start">
            <h2 className="font-khand text180 max-md:text-[14vw] font-bold text-foreground leading-[85%] uppercase tracking-[-0.04em]">
              COCONUT
            </h2>
            <p className="font-sans text-[1.1vw] max-md:text-sm text-foreground/80 mt-[2vw] max-w-[24vw] max-md:max-w-[70vw] font-medium leading-relaxed">
              One green coconut, opened and pressed within a day of harvest. 100% raw, with 500mg of potassium.
            </p>
          </div>

          {/* Right: Six flavours + Explore button */}
          <div className="w-[28vw] max-md:hidden flex flex-col items-start pl-[2vw]">
            <p className="font-sans text-[1.1vw] text-foreground/80 mb-[2vw] font-medium leading-relaxed">
              Six flavours, each one pressed with real fruit. Mango, lychee, guava and three more worth meeting.
            </p>
            <div className="pointer-events-auto">
              <HandDrawnButton as="a" href="#flavours" title="Explore Flavors" />
            </div>
          </div>
        </div>

        {/* ----------------- STAGE 4 OVERLAY (p: 0.75 - 1.0) ----------------- */}
        <div
          style={{
            opacity: scrollProgress >= 0.75 ? Math.min(1, (scrollProgress - 0.75) * 6) : 0,
          }}
          className="absolute inset-0 size-full flex items-center justify-center pointer-events-none transition-opacity duration-300 z-5"
        >
          {/* Big Typography Behind Can: KEEP PALMO SIPPING.. */}
          <h2 className="font-khand text-[15vw] max-md:text-[18vw] font-bold uppercase tracking-[-0.04em] text-foreground/90 whitespace-nowrap text-center select-none">
            KEEP PALMO SIPPING..
          </h2>
        </div>

        {/* Diagonal Ray Line (Present in original Palmo screenshots) */}
        <div
          style={{
            opacity: scrollProgress > 0.65 ? Math.min(1, (scrollProgress - 0.65) * 4) : 0,
          }}
          className="pointer-events-none absolute inset-0 size-full z-8 overflow-hidden"
        >
          <div className="absolute top-0 left-[10vw] w-[140vw] h-[2px] bg-[#FFE386] origin-top-left rotate-[28deg] opacity-70" />
        </div>

        {/* Bottom Left Progress Bar Indicator (SHAKING 005 -> 062 -> CANNED 100) */}
        <div
          style={{
            opacity: scrollProgress > 0.35 && scrollProgress < 0.88 ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
          className="absolute bottom-[4vh] left-[4vw] z-30 flex flex-col gap-[0.4vw] max-md:gap-1 pointer-events-none"
        >
          <div className="flex items-baseline justify-between w-[18vw] max-md:w-[50vw]">
            <span className="font-khand text-[1.4vw] max-md:text-sm font-bold uppercase tracking-wider text-foreground">
              {stageProgressText.split(' ')[0]}
            </span>
            <span className="font-khand text-[1.4vw] max-md:text-sm font-bold tracking-wider text-foreground">
              {stageProgressText.split(' ')[1] || '100'}
            </span>
          </div>
          {/* Progress Bar Track */}
          <div className="w-[18vw] max-md:w-[50vw] h-[0.35vw] max-md:h-1.5 rounded-full bg-foreground/20 overflow-hidden">
            <div
              style={{ width: `${stageProgressPercent}%` }}
              className="h-full bg-foreground transition-all duration-150 rounded-full"
            />
          </div>
        </div>

        {/* Rising Scalloped Dark Wave Border (Transitions to #pure-coconut) */}
        <div
          style={{
            transform: `translateY(${Math.max(0, (1 - (scrollProgress - 0.75) / 0.25) * 100)}%)`,
            opacity: scrollProgress >= 0.72 ? 1 : 0,
          }}
          className="absolute inset-x-0 bottom-0 w-full h-[55vh] z-25 pointer-events-none will-change-transform flex flex-col justify-end"
        >
          {/* Scallop Waves SVG */}
          <svg viewBox="0 0 1440 180" fill="none" preserveAspectRatio="none" className="w-full h-[8vw] max-md:h-[18vw] fill-[#463721]">
            <path d="M0,180 L0,80 C120,-30 240,-30 360,80 C480,-30 600,-30 720,80 C840,-30 960,-30 1080,80 C1200,-30 1320,-30 1440,80 L1440,180 Z" />
          </svg>
          {/* Solid Dark Fill */}
          <div className="w-full h-full bg-[#463721]" />
        </div>

      </div>
    </div>
  );
}
