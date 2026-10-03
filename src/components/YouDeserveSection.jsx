import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HandDrawnButton from './HandDrawnButton';
import { useCart } from '../context/CartContext';

gsap.registerPlugin(ScrollTrigger);

export default function YouDeserveSection() {
  const sectionRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const watermarkRef = useRef(null);
  const { openCart } = useCart();

  // 3D Multi-directional mouse parallax (tilt and shift in 4 directions)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId;

    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const normY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
      targetX = normX;
      targetY = normY;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const updatePhysics = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      // Card 1 (Diamond card on left): shifts and rotates
      if (card1Ref.current) {
        gsap.set(card1Ref.current, {
          x: currentX * 35,
          y: currentY * 25,
          rotateZ: 45 + currentX * 6,
          rotateX: -currentY * 12,
          rotateY: currentX * 12,
        });
      }

      // Card 2 (Center polaroid): shifts opposite for parallax depth
      if (card2Ref.current) {
        gsap.set(card2Ref.current, {
          x: currentX * -25,
          y: currentY * -30,
          rotateZ: -2 + currentX * -4,
          rotateX: -currentY * 15,
          rotateY: currentX * 15,
        });
      }

      // Card 3 (Right polaroid): shifts with stronger tilt
      if (card3Ref.current) {
        gsap.set(card3Ref.current, {
          x: currentX * 30,
          y: currentY * -20,
          rotateZ: 6 + currentX * 5,
          rotateX: -currentY * 16,
          rotateY: currentX * 16,
        });
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(updatePhysics);

    // Scroll parallax on watermark
    const ctx = gsap.context(() => {
      if (watermarkRef.current) {
        gsap.fromTo(
          watermarkRef.current,
          { y: 60 },
          {
            y: -100,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }
    }, section);

    return () => {
      cancelAnimationFrame(animId);
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative z-10 w-full overflow-hidden bg-background paddx pt-[8vw] pb-[12vw] max-md:pt-[14vw] max-md:pb-[20vw] select-none perspective-[1200px]"
    >
      {/* Background Fruit Slice Line Watermark */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-[2vw] bottom-[-2vw] size-[28vw] max-md:size-[60vw] opacity-15 will-change-transform z-0"
      >
        <svg viewBox="0 0 400 400" fill="none" className="size-full stroke-[#463721]" strokeWidth="2">
          <path d="M50 350 A 280 280 0 0 1 350 50 L 50 350 Z" />
          <path d="M70 330 A 250 250 0 0 1 330 70 L 70 330 Z" strokeDasharray="5 4" />
          <line x1="100" y1="300" x2="210" y2="190" />
          <line x1="140" y1="260" x2="250" y2="150" />
        </svg>
      </div>

      {/* Main Heading */}
      <div className="relative z-10 text-center w-full max-w-[85vw] mx-auto pb-[5vw] max-md:pb-[8vw]">
        <h2 className="font-khand text180 max-md:text-[13vw] font-bold uppercase tracking-[-0.03em] text-foreground leading-[88%]">
          YOU DESERVE THE BEST FOR YOUR HEALTH.
        </h2>
      </div>

      {/* 3 Interactive Polaroid Cards Stage */}
      <div className="relative z-10 min-h-[46vw] max-md:min-h-[140vw] w-full flex items-center justify-center">
        {/* Card 1: Diamond Card on Left */}
        <div
          ref={card1Ref}
          style={{ willChange: 'transform' }}
          className="absolute left-[3vw] max-md:left-[-10vw] top-[4vw] max-md:top-[6vw] size-[25vw] max-md:size-[65vw] rounded-[2.5vw] border-8 max-md:border-4 border-[#FDFBF7] bg-[#E8DDD1] shadow-2xl overflow-hidden cursor-pointer group"
        >
          {/* Inner image rotated back -45deg so contents stay upright */}
          <div className="size-full -rotate-45 scale-135 relative flex flex-col justify-end p-[2.2vw] max-md:p-4 bg-cover bg-center" style={{ backgroundImage: "url('/img/coconut-holding.webp')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative z-10 text-light-beige">
              <p className="font-sans text-[1.1vw] max-md:text-xs font-semibold leading-relaxed drop-shadow-md mb-[1vw] max-md:mb-2">
                We want to make healthy, science-backed nutrition simple and accessible so you can feel better, perform better, and enjoy life every single day.
              </p>
              <HandDrawnButton
                title="Get Your Drink"
                onClick={openCart}
                className="text-light-beige!"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Center Polaroid (Yellow Coconuts) */}
        <div
          ref={card2Ref}
          style={{ willChange: 'transform' }}
          className="relative z-20 w-[24vw] max-md:w-[60vw] rounded-[1.2vw] max-md:rounded-[3vw] border-[10px] max-md:border-[6px] border-[#FDFBF7] bg-[#FDFBF7] shadow-2xl overflow-hidden cursor-pointer group transition-shadow duration-300 hover:shadow-[0_30px_70px_rgba(70,55,33,0.3)]"
        >
          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              src="/img/bunch-of-coconut.webp"
              alt="Organic fresh coconuts bunched on palm grove floor"
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
          </div>
          <div className="py-[1.2vw] max-md:py-2 text-center">
            <p className="font-patrick-hand text-[1.2vw] max-md:text-sm text-foreground/80 font-bold">
              • 100% Tree Ripe Harvest •
            </p>
          </div>
        </div>

        {/* Card 3: Right Polaroid (Green Coconut with straw) */}
        <div
          ref={card3Ref}
          style={{ willChange: 'transform' }}
          className="absolute right-[4vw] max-md:right-[-6vw] top-[2vw] max-md:top-[75vw] z-10 w-[24vw] max-md:w-[58vw] rounded-[1.2vw] max-md:rounded-[3vw] border-[10px] max-md:border-[6px] border-[#FDFBF7] bg-[#FDFBF7] shadow-2xl overflow-hidden cursor-pointer group transition-shadow duration-300 hover:shadow-[0_30px_70px_rgba(70,55,33,0.3)]"
        >
          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              src="/img/good-coconut.webp"
              alt="Clean ripe coconut showing natural golden husk texture"
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
          </div>
          <div className="py-[1.2vw] max-md:py-2 text-center">
            <p className="font-patrick-hand text-[1.2vw] max-md:text-sm text-foreground/80 font-bold">
              • Chilled, Raw & Pure •
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
