import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REVIEWS = [
  {
    id: 1,
    quote: "I JUST LOVE THE PRODUCT.",
    author: "@Theheartbrosco",
  },
  {
    id: 2,
    quote: "TASTES LIKE A HOLIDAY.",
    author: "@coconutclub",
  },
  {
    id: 3,
    quote: "MY MORNING RITUAL NOW.",
    author: "@sipwithsana",
  },
  {
    id: 4,
    quote: "CLEAN, CRISP, UNREAL.",
    author: "@ravi.eats",
  },
  {
    id: 5,
    quote: "NOTHING ELSE COMES CLOSE.",
    author: "@thegreenpantry",
  },
  {
    id: 6,
    quote: "FINISHED THE BOX IN A WEEK.",
    author: "@dailydoseofmeher",
  },
];

export default function SippersSaySection() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const fruitWatermarkRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  // Parallax fruit slice moving on scroll
  useEffect(() => {
    if (!containerRef.current || !fruitWatermarkRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fruitWatermarkRef.current,
        { y: 80, rotate: -5 },
        {
          y: -120,
          rotate: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const slide = (direction) => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.firstElementChild?.clientWidth || 320;
    const gap = window.innerWidth * 0.015;
    const scrollAmount = (cardWidth + gap) * direction;

    trackRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={containerRef}
      id="sippers-say"
      className="relative z-10 w-full overflow-hidden bg-background paddx py-[6vw] max-md:py-[14vw]"
    >
      {/* Background Parallax Fruit Watermark */}
      <div
        ref={fruitWatermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-[4vw] bottom-[-4vw] size-[32vw] max-md:size-[65vw] opacity-15 will-change-transform z-0"
      >
        <svg viewBox="0 0 400 400" fill="none" className="size-full stroke-[#463721]" strokeWidth="2.5">
          {/* Detailed citrus/coconut slice outline */}
          <path d="M50 350 A 280 280 0 0 1 350 50 L 50 350 Z" />
          <path d="M70 330 A 250 250 0 0 1 330 70 L 70 330 Z" strokeDasharray="6 4" />
          <line x1="90" y1="310" x2="220" y2="180" />
          <line x1="120" y1="280" x2="250" y2="150" />
          <line x1="160" y1="240" x2="290" y2="110" />
          <path d="M120 280 A 180 180 0 0 1 280 120" strokeWidth="1.5" />
          <circle cx="210" cy="190" r="14" strokeWidth="2" />
        </svg>
      </div>

      {/* Header Row */}
      <div className="relative z-10 flex items-center justify-between pb-[3.5vw] max-md:pb-[6vw]">
        <h2 className="font-khand text180 max-md:text-[14vw] font-bold uppercase tracking-[-0.03em] text-foreground leading-none">
          SIPPERS SAY !
        </h2>

        {/* Carousel Prev & Next Inverting Buttons */}
        <div className="flex items-center gap-[0.8vw] max-md:gap-2">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => slide(-1)}
            aria-label="Previous review"
            className="group flex size-[4vw] max-md:size-12 items-center justify-center rounded-full border-2 border-foreground bg-beige text-foreground transition-all duration-300 hover:bg-foreground hover:text-beige active:scale-95 shadow-md cursor-pointer"
          >
            <svg
              className="size-[1.4vw] max-md:size-5 transition-transform group-hover:-translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => slide(1)}
            aria-label="Next review"
            className="group flex size-[4vw] max-md:size-12 items-center justify-center rounded-full border-2 border-foreground bg-foreground text-beige transition-all duration-300 hover:bg-beige hover:text-foreground active:scale-95 shadow-md cursor-pointer"
          >
            <svg
              className="size-[1.4vw] max-md:size-5 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Review Cards Track */}
      <div
        ref={trackRef}
        className="relative z-10 flex gap-[1.5vw] max-md:gap-[4vw] overflow-x-auto scroll-smooth pb-[2vw] no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            style={{ scrollSnapAlign: 'start' }}
            className="group relative flex-none w-[22vw] max-md:w-[78vw] min-h-[17vw] max-md:min-h-[58vw] rounded-[1.8vw] max-md:rounded-[4vw] border-[3px] border-foreground/70 bg-[#FFF8EE] p-[2.2vw] max-md:p-6 flex flex-col justify-between items-center text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl select-none"
          >
            {/* 4 Corner Rivets */}
            <span className="absolute left-[1vw] top-[1vw] size-[0.6vw] max-md:size-2 rounded-full bg-foreground" />
            <span className="absolute right-[1vw] top-[1vw] size-[0.6vw] max-md:size-2 rounded-full bg-foreground" />
            <span className="absolute bottom-[1vw] left-[1vw] size-[0.6vw] max-md:size-2 rounded-full bg-foreground" />
            <span className="absolute bottom-[1vw] right-[1vw] size-[0.6vw] max-md:size-2 rounded-full bg-foreground" />

            {/* Quote Icon */}
            <div className="pt-[0.5vw]">
              <svg className="w-[3.2vw] h-[2.5vw] max-md:w-10 max-md:h-8 fill-beige" viewBox="0 0 48 38">
                <path d="M0 22C0 9.85 7.8 0 20.3 0L22 4.2C13.8 6.5 9.7 11.8 9.3 17.5H20.5V38H0V22ZM26 22C26 9.85 33.8 0 46.3 0L48 4.2C39.8 6.5 35.7 11.8 35.3 17.5H46.5V38H26V22Z" />
              </svg>
            </div>

            {/* Quote Text */}
            <p className="font-khand text-[1.9vw] max-md:text-2xl font-bold uppercase tracking-tight text-foreground leading-[1.1] my-[1vw]">
              {review.quote}
            </p>

            {/* Author */}
            <p className="font-patrick-hand text-[1.3vw] max-md:text-base text-foreground/80 font-medium">
              {review.author}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
