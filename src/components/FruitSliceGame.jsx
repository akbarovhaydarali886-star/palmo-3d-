import React, { useRef, useEffect, useState } from 'react';

const FRUIT_IMAGES = [
  '/fruits/coconut.webp',
  '/fruits/pineapple.webp',
  '/fruits/watermolon.webp',
  '/fruits/guava.webp',
  '/fruits/lychee.webp',
  '/fruits/strawberry.webp',
];

export default function FruitSliceGame({ onScoreChange, isFrozen = false }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    // Preload fruit images
    const loadedImages = [];
    FRUIT_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => loadedImages.push(img);
    });

    let fruits = [];
    let particles = [];
    let trail = [];
    let isMouseDown = false;
    let localScore = 0;

    class Fruit {
      constructor() {
        this.radius = Math.min(width * 0.04, 38) + Math.random() * 12;
        this.x = width * 0.15 + Math.random() * (width * 0.7);
        this.y = height + this.radius;
        this.vx = (Math.random() - 0.5) * (width * 0.005);
        this.vy = -(height * 0.016 + Math.random() * (height * 0.008));
        this.gravity = height * 0.0003;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.08;
        this.sliced = false;
        this.image = loadedImages[Math.floor(Math.random() * loadedImages.length)] || null;
        this.sliceAngle = 0;
        this.splitOffset = 0;
      }

      update() {
        if (!isFrozen) {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += this.gravity;
          this.rotation += this.vRot;
          if (this.sliced) {
            this.splitOffset += 2;
          }
        }
      }

      draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);

        if (this.image && this.image.complete && this.image.naturalWidth > 0) {
          const s = this.radius * 2;
          if (!this.sliced) {
            c.drawImage(this.image, -s / 2, -s / 2, s, s);
          } else {
            // Two halves flying apart
            c.save();
            c.translate(-this.splitOffset, 0);
            c.drawImage(this.image, 0, 0, this.image.width / 2, this.image.height, -s / 2, -s / 2, s / 2, s);
            c.restore();

            c.save();
            c.translate(this.splitOffset, 0);
            c.drawImage(this.image, this.image.width / 2, 0, this.image.width / 2, this.image.height, 0, -s / 2, s / 2, s);
            c.restore();
          }
        } else {
          // Fallback stylized fruit circle
          c.beginPath();
          c.arc(0, 0, this.radius, 0, Math.PI * 2);
          c.fillStyle = '#FFE386';
          c.fill();
          c.strokeStyle = '#463721';
          c.lineWidth = 3;
          c.stroke();
        }
        c.restore();
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.radius = Math.random() * 4 + 2;
        this.color = color || '#FFE386';
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.015;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // Spawn loop
    let spawnTimer = 0;

    function checkSlice(p1, p2) {
      fruits.forEach((fruit) => {
        if (fruit.sliced) return;

        // Line-point distance to fruit center
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.hypot(dx, dy);
        if (len === 0) return;

        const u = Math.max(0, Math.min(1, ((fruit.x - p1.x) * dx + (fruit.y - p1.y) * dy) / (len * len)));
        const projX = p1.x + u * dx;
        const projY = p1.y + u * dy;
        const dist = Math.hypot(fruit.x - projX, fruit.y - projY);

        if (dist < fruit.radius) {
          fruit.sliced = true;
          localScore += 1;
          setScore(localScore);
          if (onScoreChange) onScoreChange(localScore);

          // Spawn splash particles
          for (let i = 0; i < 14; i++) {
            particles.push(new Particle(fruit.x, fruit.y, Math.random() > 0.5 ? '#FFE386' : '#FAF6F0'));
          }
        }
      });
    }

    // Mouse / Touch handlers
    const addPoint = (x, y) => {
      trail.push({ x, y, time: Date.now() });
      if (trail.length > 1) {
        const p1 = trail[trail.length - 2];
        const p2 = trail[trail.length - 1];
        checkSlice(p1, p2);
      }
    };

    const handlePointerDown = (e) => {
      isMouseDown = true;
      const rect = canvas.getBoundingClientRect();
      addPoint(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handlePointerMove = (e) => {
      if (!isMouseDown) return;
      const rect = canvas.getBoundingClientRect();
      addPoint(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handlePointerUp = () => {
      isMouseDown = false;
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Touch
    canvas.addEventListener('touchstart', (e) => {
      isMouseDown = true;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (t) addPoint(t.clientX - rect.left, t.clientY - rect.top);
    });

    canvas.addEventListener('touchmove', (e) => {
      if (!isMouseDown) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (t) addPoint(t.clientX - rect.left, t.clientY - rect.top);
    });

    canvas.addEventListener('touchend', handlePointerUp);

    // Resize
    const handleResize = () => {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animId;
    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Spawn new fruits
      if (!isFrozen) {
        spawnTimer++;
        if (spawnTimer % 65 === 0 && fruits.length < 5) {
          fruits.push(new Fruit());
        }
      }

      // Update & draw fruits
      fruits = fruits.filter((f) => f.y < height + 100);
      fruits.forEach((f) => {
        f.update();
        f.draw(ctx);
      });

      // Update & draw particles
      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // Draw Slice Trail
      const now = Date.now();
      trail = trail.filter((pt) => now - pt.time < 180);

      if (trail.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.strokeStyle = '#FFE386';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#FFE386';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [isFrozen, onScoreChange]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Interactive fruit slicing mini-game. Move pointer or touch across the screen to slice fresh flying coconuts and fruits."
      className="absolute inset-0 z-10 w-full h-full cursor-crosshair touch-none select-none"
    />
  );
}
