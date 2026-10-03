import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ['PURE', 'FRESH', 'CLEAN'];

export default function PureCoconutSection() {
  const containerRef = useRef(null);
  const fruitRightRef = useRef(null);
  const fruitLeftRef = useRef(null);
  const smileyRef = useRef(null);
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Right coconut slice doodle moves UP on scroll down (parallax)
      if (fruitRightRef.current) {
        gsap.fromTo(
          fruitRightRef.current,
          { y: 150, rotate: -8 },
          {
            y: -180,
            rotate: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        );
      }

      // Left doodle moves subtly
      if (fruitLeftRef.current) {
        gsap.fromTo(
          fruitLeftRef.current,
          { y: 80, rotate: 10 },
          {
            y: -80,
            rotate: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      // ScrollTrigger for word swapping (PURE -> FRESH -> CLEAN)
      ScrollTrigger.create({
        trigger: el,
        start: 'top 65%',
        end: 'bottom 35%',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.35) {
            setActiveWordIndex(0); // PURE
          } else if (progress < 0.7) {
            setActiveWordIndex(1); // FRESH
          } else {
            setActiveWordIndex(2); // CLEAN
          }
        },
      });

      // Smiley sticker idle wiggle
      if (smileyRef.current) {
        gsap.to(smileyRef.current, {
          rotate: 15,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="pure-coconut"
      data-navbar-theme="dark"
      className="relative z-10 w-full overflow-hidden bg-[#463721] text-[#FAF6F0] paddx py-[8vw] pb-[5vw] max-md:py-[16vw] select-none"
    >
      {/* Top Left Smiley Face Sticker (licking lips 😋) */}
      <div
        ref={smileyRef}
        className="absolute left-[5vw] top-[3vw] max-md:left-[4vw] max-md:top-[4vw] size-[7vw] max-md:size-[18vw] rounded-full bg-[#FFE386] border-4 max-md:border-2 border-[#463721] flex items-center justify-center shadow-2xl z-20 cursor-pointer transition-transform duration-300 hover:scale-115 active:scale-95"
        title="Naturally delicious!"
      >
        <svg viewBox="0 0 100 100" fill="none" className="size-[80%] stroke-[#463721]" strokeWidth="6" strokeLinecap="round">
          {/* Eyes */}
          <path d="M 28 38 Q 36 28 42 38" />
          <path d="M 58 38 Q 64 28 72 38" />
          {/* Smiling mouth */}
          <path d="M 25 58 Q 50 85 75 58" fill="#463721" />
          {/* Tongue sticking out */}
          <path d="M 45 70 Q 55 92 65 72 Z" fill="#CB533B" stroke="#463721" strokeWidth="4" />
        </svg>
      </div>

      {/* Left Coconut Line Doodle */}
      <div
        ref={fruitLeftRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-[2vw] bottom-[2vw] size-[18vw] max-md:size-[40vw] opacity-30 will-change-transform z-10"
      >
        <svg viewBox="0 0 200 200" fill="none" className="size-full stroke-[#FFE386]" strokeWidth="3" strokeLinecap="round">
          <path d="M 30 150 Q 80 40 170 80 Q 150 170 30 150 Z" />
          <path d="M 50 140 Q 90 60 150 90" strokeDasharray="6 4" strokeWidth="2" />
          <line x1="80" y1="110" x2="110" y2="150" strokeWidth="2" />
          <line x1="110" y1="80" x2="140" y2="120" strokeWidth="2" />
        </svg>
      </div>

      {/* Right Coconut Slice Doodle (Moves UP on scroll down) */}
      <div
        ref={fruitRightRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-[3vw] top-[4vw] size-[22vw] max-md:size-[48vw] opacity-40 will-change-transform z-10"
      >
        <svg viewBox="0 0 260 260" fill="none" className="size-full stroke-[#FFE386]" strokeWidth="3.5" strokeLinecap="round">
          {/* Outer arc */}
          <path d="M 30 220 A 180 180 0 0 1 230 40 L 190 20 A 200 200 0 0 0 20 180 Z" />
          {/* Inner segments */}
          <line x1="50" y1="200" x2="180" y2="70" strokeWidth="2.5" />
          <line x1="80" y1="220" x2="150" y2="110" strokeWidth="2" />
          <line x1="120" y1="180" x2="210" y2="90" strokeWidth="2" />
          <path d="M 60 170 A 130 130 0 0 1 180 60" strokeDasharray="8 6" strokeWidth="2" />
        </svg>
      </div>

      {/* Main Bold Display Copy */}
      <div className="relative z-20 max-w-[88vw] mx-auto text-center pt-[2vw] max-md:pt-[6vw]">
        <h2 className="font-khand text180 max-md:text-[13vw] font-bold uppercase tracking-[-0.03em] leading-[88%] text-[#FAF6F0]">
          PURE COCONUT WATER.{' '}
          <br className="max-md:hidden" />
          NATURALLY HYDRATING,{' '}
          <br className="max-md:hidden" />
          REFRESHINGLY{' '}
          {/* Morphing Word Pill */}
          <span className="relative inline-flex items-center justify-center align-middle px-[1.5vw] py-[0.1vw] max-md:px-4 max-md:py-1 rounded-full bg-[#FFE386] text-[#463721] font-extrabold shadow-lg transition-transform duration-300 hover:scale-105">
            <span className="inline-block transition-all duration-300 min-w-[3.5ch]">
              {WORDS[activeWordIndex]}
            </span>
          </span>{' '}
          , FROM{' '}
          <br className="max-md:hidden" />
          NATURE'S SOURCE. —
        </h2>

        {/* Handwritten text with arrow */}
        <div className="relative w-fit ml-auto mr-[12vw] max-md:mr-[4vw] mt-[2vw] max-md:mt-4 flex flex-col items-center">
          <svg className="w-[4vw] h-[3vw] max-md:w-10 max-md:h-8 stroke-[#FFE386] fill-none" viewBox="0 0 80 50">
            <path d="M 10 10 Q 50 15 65 40" strokeWidth="3" strokeLinecap="round" />
            <path d="M 50 35 L 65 40 L 68 25" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-patrick-hand text-[1.4vw] max-md:text-base text-[#FFE386] font-bold tracking-wide -rotate-6 whitespace-nowrap">
            Thats Why People Love To Drink It !
          </p>
        </div>
      </div>
    </section>
  );
}
