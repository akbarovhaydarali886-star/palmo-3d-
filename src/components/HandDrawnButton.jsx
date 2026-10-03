import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

export default function HandDrawnButton({
  title = 'Explore Flavors',
  className = '',
  onClick,
  as: Component = 'button',
  href,
  ...props
}) {
  const btnRef = useRef(null);
  const pathRef = useRef(null);
  const charRefs = useRef([]);
  const pathLengthRef = useRef(0);

  const words = title.split(' ');

  const measureAndInit = useCallback(() => {
    const pathEl = pathRef.current;
    const btnEl = btnRef.current;
    if (!pathEl || !btnEl) return;

    pathLengthRef.current = pathEl.getTotalLength();
    gsap.set(pathEl, { strokeDasharray: pathLengthRef.current, strokeDashoffset: 0 });

    const rect = btnEl.getBoundingClientRect();
    if (rect.width && rect.height) {
      const scaleFactor = Math.sqrt((rect.width / 208) * (rect.height / 74));
      gsap.set(pathEl, { strokeWidth: 3 / scaleFactor });
    }
  }, []);

  useEffect(() => {
    const btnEl = btnRef.current;
    if (!btnEl) return;
    measureAndInit();
    const observer = new ResizeObserver(measureAndInit);
    observer.observe(btnEl);
    return () => observer.disconnect();
  }, [measureAndInit]);

  const handlePointerEnter = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pathEl = pathRef.current;
    if (!pathEl) return;

    gsap.killTweensOf(pathEl);
    gsap.to(pathEl, {
      strokeDashoffset: pathLengthRef.current,
      duration: 0.5,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
    gsap.to(pathEl, {
      opacity: 0,
      duration: 0.16,
      delay: 0.34,
      ease: 'power2.in',
      overwrite: 'auto',
    });

    const activeChars = charRefs.current.filter(Boolean);
    gsap.to(activeChars, {
      yPercent: -50,
      duration: 0.575,
      ease: 'expo.out',
      stagger: { each: 0.014, from: 'start' },
      overwrite: 'auto',
    });
  };

  const handlePointerLeave = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pathEl = pathRef.current;
    if (!pathEl) return;

    gsap.killTweensOf(pathEl);
    gsap.to(pathEl, {
      opacity: 1,
      duration: 0.14,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to(pathEl, {
      strokeDashoffset: 0,
      duration: 0.55,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });

    const activeChars = charRefs.current.filter(Boolean);
    gsap.to(activeChars, {
      yPercent: 0,
      duration: 0.52,
      ease: 'expo.out',
      stagger: { each: 0.0115, from: 'end' },
      overwrite: 'auto',
    });
  };

  return (
    <Component
      ref={btnRef}
      href={href}
      type={Component === 'button' ? 'button' : undefined}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      aria-label={title}
      className={`relative inline-flex cursor-pointer items-center justify-center text-foreground will-change-transform ${className}`}
      {...props}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 208 74"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d="M118.8 65.7551C118.8 65.7551 9.54145 66.2038 2.20331 40.1869C-5.73315 12.0488 55.2778 1.5 95.5383 1.5C135.799 1.5 195.672 4.08468 205.776 31.8674C219.086 68.4625 44.4656 72.5 44.4656 72.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span
        aria-hidden="true"
        className="font-patrick-hand relative z-1 flex gap-[0.3em] px-[1.5vw] py-[0.8vw] pb-[1vw]! text-[1.3rem] leading-[1.2] tracking-[-0.04em] whitespace-nowrap max-md:px-6 max-md:py-3 max-md:pb-3.5! select-none font-bold"
      >
        {words.map((word, r) => (
          <span key={r} className="inline-flex">
            {Array.from(word).map((char, n) => {
              const charIndex =
                words.slice(0, r).reduce((acc, w) => acc + w.length, 0) + n;
              return (
                <span
                  key={n}
                  className="relative inline-block h-[1.55em] -my-[0.175em] overflow-hidden align-bottom"
                >
                  <span
                    ref={(el) => (charRefs.current[charIndex] = el)}
                    className="flex flex-col leading-[1.55] will-change-transform"
                  >
                    <span>{char}</span>
                    <span>{char}</span>
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </Component>
  );
}
