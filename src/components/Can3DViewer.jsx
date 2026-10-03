import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

export default function Can3DViewer({
  textureUrl,
  flavourColor = '#946C3C',
  isInteractive = true,
  isHovered = false,
}) {
  const mountRef = useRef(null);
  const hoveredRef = useRef(isHovered);
  hoveredRef.current = isHovered;
  const spinYRef = useRef({ value: 0 });

  useEffect(() => {
    if (isHovered) {
      gsap.to(spinYRef.current, {
        value: spinYRef.current.value + Math.PI * 2,
        duration: 0.85,
        ease: 'power2.out',
      });
    }
  }, [isHovered]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 300;
    let height = mount.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();

    // Camera (compact framing)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffe386, 1.0);
    dirLight2.position.set(-3, -2, 2);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // Root Group for rotations & mouse interactions
    const canGroup = new THREE.Group();
    scene.add(canGroup);

    let canMesh = null;
    let isDisposed = false;

    // Load texture with flipY = true (correct orientation, right-side-up)
    const textureLoader = new THREE.TextureLoader();
    const canTexture = textureLoader.load(textureUrl, () => {
      renderer.render(scene, camera);
    });
    canTexture.colorSpace = THREE.SRGBColorSpace;
    canTexture.flipY = true;
    canTexture.generateMipmaps = true;
    canTexture.minFilter = THREE.LinearMipmapLinearFilter;
    canTexture.magFilter = THREE.LinearFilter;

    // Create high-detail procedural aluminum can geometry as fallback / instant placeholder
    function createProceduralCan() {
      const group = new THREE.Group();

      // Main cylindrical body (compact, elegant size)
      const bodyGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.7, 48, 1, true);
      const bodyMat = new THREE.MeshStandardMaterial({
        map: canTexture,
        roughness: 0.32,
        metalness: 0.2,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      // Silver top shoulder & lid
      const metalMat = new THREE.MeshStandardMaterial({
        color: 0xd8d8d8,
        metalness: 0.85,
        roughness: 0.22,
      });

      const topTaperGeo = new THREE.CylinderGeometry(0.42, 0.48, 0.12, 48);
      const topTaper = new THREE.Mesh(topTaperGeo, metalMat);
      topTaper.position.y = 0.85 + 0.06;
      group.add(topTaper);

      const topRimGeo = new THREE.TorusGeometry(0.42, 0.024, 16, 48);
      const topRim = new THREE.Mesh(topRimGeo, metalMat);
      topRim.rotation.x = Math.PI / 2;
      topRim.position.y = 0.97;
      group.add(topRim);

      const lidGeo = new THREE.CircleGeometry(0.41, 48);
      const lid = new THREE.Mesh(lidGeo, metalMat);
      lid.rotation.x = -Math.PI / 2;
      lid.position.y = 0.96;
      group.add(lid);

      // Silver bottom
      const bottomTaperGeo = new THREE.CylinderGeometry(0.48, 0.42, 0.12, 48);
      const bottomTaper = new THREE.Mesh(bottomTaperGeo, metalMat);
      bottomTaper.position.y = -0.85 - 0.06;
      group.add(bottomTaper);

      const bottomGeo = new THREE.CircleGeometry(0.41, 48);
      const bottom = new THREE.Mesh(bottomGeo, metalMat);
      bottom.rotation.x = Math.PI / 2;
      bottom.position.y = -0.97;
      group.add(bottom);

      return group;
    }

    // Load GLB model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/model/can1.glb',
      (gltf) => {
        if (isDisposed) return;
        canGroup.clear();
        const model = gltf.scene;

        // Traverse to apply texture to label mesh (Shell) and metal to Bottom/Top
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (
              child.name === 'Shell' ||
              child.material?.name === 'Etiquette' ||
              !child.name.toLowerCase().includes('metal')
            ) {
              const mat = new THREE.MeshStandardMaterial({
                map: canTexture,
                roughness: 0.32,
                metalness: 0.18,
              });
              child.material = mat;
            } else {
              const metalMat = new THREE.MeshStandardMaterial({
                color: 0xd8d8d8,
                metalness: 0.85,
                roughness: 0.22,
              });
              child.material = metalMat;
            }
          }
        });

        // Center model vertically and horizontally
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Compact, elegant scale matching Palmo
        // (can height is ~4.07 units in GLB, scale 0.52 gives ~2.1 units height, perfectly sized)
        model.scale.set(0.52, 0.52, 0.52);

        canGroup.add(model);
        canMesh = model;
      },
      undefined,
      (err) => {
        console.warn('GLB load fallback to procedural can:', err);
        if (isDisposed) return;
        canGroup.clear();
        canMesh = createProceduralCan();
        canGroup.add(canMesh);
      }
    );

    // Initial procedural can until GLB finishes parsing
    const initialProcedural = createProceduralCan();
    canGroup.add(initialProcedural);
    canMesh = initialProcedural;

    // Mouse tilt tracking
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      if (!isInteractive) return;
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 1.3;
      targetRotationX = y * 0.7;
    };

    const handleMouseLeave = () => {
      targetRotationX = 0;
      targetRotationY = 0;
    };

    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseleave', handleMouseLeave);

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth;
      height = mount.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();
    let currentScale = 1;

    let lastSpinY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth hover scale & tilt interpolation
      const isHov = hoveredRef.current;
      const targetScale = isHov ? 1.06 : 1.0;
      const targetTiltX = isHov ? -0.14 : 0;
      const targetTiltZ = isHov ? 0.05 : 0;

      currentScale += (targetScale - currentScale) * 0.08;
      canGroup.scale.set(currentScale, currentScale, currentScale);

      // Floating gentle bobbing
      canGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.06;

      // Dynamic hover 360 spin delta
      const deltaSpin = spinYRef.current.value - lastSpinY;
      lastSpinY = spinYRef.current.value;
      canGroup.rotation.y += deltaSpin;

      // Base idle continuous rotation (slightly faster on hover) + mouse interaction
      const spinSpeed = isHov ? 0.012 : 0.006;
      canGroup.rotation.y += spinSpeed;
      canGroup.rotation.y += (targetRotationY - (canGroup.rotation.y % (Math.PI * 2))) * 0.04;
      canGroup.rotation.x += (targetRotationX + targetTiltX - canGroup.rotation.x) * 0.05;
      canGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.025 + targetTiltZ;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('mouseleave', handleMouseLeave);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [textureUrl, flavourColor, isInteractive]);

  return <div ref={mountRef} className="size-full flex items-center justify-center pointer-events-auto" />;
}
