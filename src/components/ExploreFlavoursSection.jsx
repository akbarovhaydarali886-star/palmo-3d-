import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FLAVOURS } from '../data/flavours';
import FlavourCard from './FlavourCard';

gsap.registerPlugin(ScrollTrigger);

export default function ExploreFlavoursSection() {
  const sectionRef = useRef(null);
  const sunRef = useRef(null);

  // Rotating Sun on Scroll
  useEffect(() => {
    const section = sectionRef.current;
    const sun = sunRef.current;
    if (!section || !sun) return;

    const ctx = gsap.context(() => {
      gsap.to(sun, {
        rotation: 360 * 2, // 2 full revolutions over scroll
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="flavours"
      data-navbar-theme="dark"
      className="relative z-10 w-full bg-[#463721] text-[#FAF6F0] paddx pt-[4vw] pb-[10vw] max-md:pt-[8vw] max-md:pb-[20vw]"
    >
      {/* Heading: EXPLORE ALL [☀️] FLAVOURS */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-[2vw] max-md:gap-3 text-center pb-[4vw] max-md:pb-[8vw]">
        <h2 className="font-khand text180 max-md:text-[13vw] font-bold uppercase tracking-[-0.03em] leading-none text-[#FAF6F0]">
          EXPLORE ALL
        </h2>

        {/* Multi-ray Sun Icon (Rotates on scroll) */}
        <div
          ref={sunRef}
          aria-hidden="true"
          className="size-[6vw] max-md:size-[14vw] flex items-center justify-center will-change-transform"
        >
          <svg viewBox="0 0 100 100" fill="none" className="size-full stroke-[#FFE386]" strokeWidth="3">
            {/* 16-point geometric sun star */}
            <circle cx="50" cy="50" r="14" strokeWidth="2.5" />
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              return (
                <g key={i} transform={`rotate(${angle} 50 50)`}>
                  <path d="M 50 18 L 46 32 L 54 32 Z" fill="#FFE386" />
                </g>
              );
            })}
          </svg>
        </div>

        <h2 className="font-khand text180 max-md:text-[13vw] font-bold uppercase tracking-[-0.03em] leading-none text-[#FAF6F0]">
          FLAVOURS
        </h2>
      </div>

      {/* 6 Flavour Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-[1.5vw] max-md:gap-[4vw] w-full">
        {FLAVOURS.map((flavour) => (
          <FlavourCard key={flavour.id} flavour={flavour} />
        ))}
      </div>

      {/* Scalloped divider on bottom transitioning to light beige */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[98%] pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-[5vw] max-md:h-[9vw] fill-[#463721]"
        >
          <path d="M0,0 C90,80 180,80 240,0 C300,80 420,80 480,0 C540,80 660,80 720,0 C780,80 900,80 960,0 C1020,80 1140,80 1200,0 C1260,80 1380,80 1440,0 L1440,0 L0,0 Z" />
        </svg>
      </div>
    </section>
  );
}
