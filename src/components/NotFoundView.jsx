import React, { useState, useEffect, useRef } from 'react';

export default function NotFoundView({ onBack }) {
  const [score, setScore] = useState(2);
  const [lives, setLives] = useState(3);
  const [exploded, setExploded] = useState(false);
  const canvasRef = useRef(null);
  const trailRef = useRef([]);

  // Blade trail canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
      });
      if (trailRef.current.length > 25) {
        trailRef.current.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);

        for (let i = 1; i < trailRef.current.length; i++) {
          const pt = trailRef.current[i];
          ctx.lineTo(pt.x, pt.y);
          pt.age += 1;
        }

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#FFE386';
        ctx.shadowBlur = 12;
        ctx.stroke();

        trailRef.current = trailRef.current.filter((pt) => pt.age < 15);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSliceItem = (type) => {
    if (type === 'bomb') {
      setExploded(true);
      setLives((l) => Math.max(0, l - 1));
      setTimeout(() => setExploded(false), 800);
    } else {
      setScore((s) => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[950] flex flex-col items-center justify-between bg-[#F8F8F0] text-[#463721] overflow-hidden select-none paddx py-[3vw] max-md:py-6">
      {/* Blade Trail Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-30" />

      {/* Background Palm Silhouettes */}
      <div className="pointer-events-none absolute inset-0 z-0 flex justify-between items-center opacity-15 overflow-hidden">
        {/* Left Palm */}
        <div className="size-[55vw] max-md:size-[110vw] -translate-x-[20%] fill-[#463721]">
          <svg viewBox="0 0 554 588" className="size-full">
            <path d="M276.9 249.3L245 358.5L218.1 349.7L239.4 377.9L201 509.5C167.8 469.1 154.5 411.9 170.6 356.9C186.6 302 228 262.8 276.9 249.3Z" />
          </svg>
        </div>
        {/* Right Palm */}
        <div className="size-[55vw] max-md:size-[110vw] translate-x-[20%] fill-[#463721]">
          <svg viewBox="0 0 554 588" className="size-full">
            <path d="M276.9 249.3L245 358.5L218.1 349.7L239.4 377.9L201 509.5C167.8 469.1 154.5 411.9 170.6 356.9C186.6 302 228 262.8 276.9 249.3Z" />
          </svg>
        </div>
      </div>

      {/* Header Bar */}
      <div className="relative z-20 w-full flex items-center justify-between">
        {/* Logo */}
        <a href="#top" onClick={onBack} className="size-[3.5vw] max-md:size-10 text-[#463721] cursor-pointer">
          <svg viewBox="0 0 554 588" fill="currentColor" className="size-full">
            <path d="M277.092 287.522L245.263 399.581L218.361 390.494L239.606 419.495L201.243 554.522C168.118 513.043 154.848 454.355 170.874 397.958C186.897 341.53 228.253 301.325 277.092 287.522Z" />
          </svg>
        </a>

        {/* Score & Lives Pill (SCORE 2 | • • •) */}
        <div className="flex items-center gap-[0.8vw] max-md:gap-2 rounded-full bg-[#463721] text-[#FFE386] px-[1.2vw] py-[0.5vw] max-md:px-4 max-md:py-1.5 shadow-lg">
          <span className="font-khand text-[1.1vw] max-md:text-sm font-semibold uppercase tracking-wider text-[#FAF6F0]/70">
            SCORE
          </span>
          <span className="font-khand text-[1.8vw] max-md:text-xl font-bold tabular-nums">
            {score}
          </span>
          <span className="text-[#FAF6F0]/30 font-light mx-1">|</span>
          <div className="flex items-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`size-2.5 rounded-full transition-colors ${
                  i < lives ? 'bg-[#CB533B]' : 'bg-[#FAF6F0]/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Menu/Close */}
        <button
          type="button"
          onClick={onBack}
          className="rounded-md bg-[#463721] text-[#FFE386] px-[1.5vw] py-[0.4vw] max-md:px-4 max-md:py-1.5 font-patrick-hand text-[1.2vw] max-md:text-sm uppercase tracking-wider shadow-md hover:bg-opacity-90 cursor-pointer"
        >
          MENU
        </button>
      </div>

      {/* Main 404 Stage */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto text-center">
        {/* Giant 404 + BOOM! */}
        <div className="relative flex items-center justify-center select-none">
          <h1 className="font-khand text-[22vw] max-md:text-[34vw] font-bold text-[#463721] leading-[80%] tracking-[-0.04em]">
            404
          </h1>
          {/* BOOM explosion */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none ${
              exploded ? 'scale-125 opacity-100' : 'scale-100 opacity-90'
            }`}
          >
            <span className="font-khand text-[10vw] max-md:text-[16vw] font-extrabold text-[#CB533B] tracking-wide uppercase drop-shadow-[0_0_20px_rgba(203,83,59,0.8)] -rotate-6">
              BOOM!
            </span>
          </div>
        </div>

        <p className="font-sans text-[1.3vw] max-md:text-base text-[#463721]/80 font-medium mt-[1vw] max-md:mt-3">
          Lost in the grove. Slice coconuts or head back.
        </p>

        {/* Action Buttons: Home & Flavours */}
        <div className="flex items-center gap-[1.2vw] max-md:gap-3 mt-[2vw] max-md:mt-5">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-[#463721] text-[#FFE386] px-[2.5vw] py-[0.7vw] max-md:px-6 max-md:py-2.5 font-patrick-hand text-[1.3vw] max-md:text-base font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border-2 border-[#463721] bg-[#FAF6F0] text-[#463721] px-[2.5vw] py-[0.7vw] max-md:px-6 max-md:py-2.5 font-patrick-hand text-[1.3vw] max-md:text-base font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#463721] hover:text-[#FAF6F0] active:scale-95 shadow-md cursor-pointer"
          >
            Flavours
          </button>
        </div>
      </div>

      {/* Interactive Floating Targets (Coconut, Watermelon, Bomb) */}
      <div
        onClick={() => handleSliceItem('coconut')}
        className="absolute left-[12vw] bottom-[18vh] size-[6vw] max-md:size-[14vw] rounded-full overflow-hidden cursor-crosshair transition-transform hover:scale-110 active:scale-90 shadow-xl animate-bounce"
        style={{ animationDuration: '3s' }}
        title="Slice Coconut!"
      >
        <img src="/fruits/coconut.webp" alt="Coconut" className="size-full object-contain" />
      </div>

      <div
        onClick={() => handleSliceItem('watermelon')}
        className="absolute right-[22vw] top-[14vh] size-[7vw] max-md:size-[16vw] rounded-full overflow-hidden cursor-crosshair transition-transform hover:scale-110 active:scale-90 shadow-xl animate-bounce"
        style={{ animationDuration: '3.6s' }}
        title="Slice Watermelon!"
      >
        <img src="/fruits/watermolon.webp" alt="Watermelon" className="size-full object-contain" />
      </div>

      <div
        onClick={() => handleSliceItem('bomb')}
        className="absolute right-[18vw] bottom-[16vh] size-[5.5vw] max-md:size-[13vw] rounded-full bg-[#1A1A1A] border-4 border-[#FFE386] flex items-center justify-center cursor-crosshair transition-transform hover:scale-110 active:scale-90 shadow-2xl animate-pulse"
        title="Slice Bomb! (BOOM)"
      >
        <span className="text-[2.5vw] max-md:text-2xl">💣</span>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-20 text-center pb-[1vw]">
        <p className="font-patrick-hand text-[0.9vw] max-md:text-xs text-[#463721]/50 tracking-[0.2em] uppercase font-bold">
          SWIPE / DRAG TO SLICE
        </p>
      </div>
    </div>
  );
}
