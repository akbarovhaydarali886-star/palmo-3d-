import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function AnimatedHeading({
  as: Component = 'h2',
  children,
  className = '',
  delay = 0,
  duration = 0.85,
  stagger = 0.035,
  ...props
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll('[data-char]');
    if (!chars.length) return;

    gsap.set(chars, { yPercent: 140 });
    gsap.set(el, { autoAlpha: 1 });

    let hasAnimated = false;
    const playAnim = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      gsap.to(chars, {
        yPercent: 0,
        duration: duration,
        ease: 'power3.out',
        stagger: { each: stagger, from: 'start' },
        delay: delay,
        clearProps: 'transform',
      });
    };

    // If loader is active, wait for it
    const loader = document.getElementById('loader');
    const isLoaderFinished = window.__loaderFinished;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!loader || isLoaderFinished || window.__loaderFinished) {
            playAnim();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    const handleLoaderComplete = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        playAnim();
        observer.disconnect();
      }
    };

    window.addEventListener('loaderComplete', handleLoaderComplete);

    return () => {
      observer.disconnect();
      window.removeEventListener('loaderComplete', handleLoaderComplete);
    };
  }, [delay, duration, stagger]);

  // Split string into characters preserving whitespace
  const text = typeof children === 'string' ? children : '';
  const characters = Array.from(text);

  return (
    <Component
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      {...props}
    >
      {characters.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span
            data-char="true"
            className="inline-block will-change-transform leading-[inherit]"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </Component>
  );
}

export function AnimatedParagraph({
  as: Component = 'p',
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  stagger = 0.05,
  ...props
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('[data-word]');
    if (!words.length) return;

    gsap.set(words, { yPercent: 140, opacity: 0 });
    gsap.set(el, { autoAlpha: 1 });

    let hasAnimated = false;
    const playAnim = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: duration,
        ease: 'power2.out',
        stagger: { each: stagger, from: 'start' },
        delay: delay,
        clearProps: 'transform,opacity',
      });
    };

    const loader = document.getElementById('loader');
    const isLoaderFinished = window.__loaderFinished;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!loader || isLoaderFinished || window.__loaderFinished) {
            playAnim();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    const handleLoaderComplete = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        playAnim();
        observer.disconnect();
      }
    };

    window.addEventListener('loaderComplete', handleLoaderComplete);

    return () => {
      observer.disconnect();
      window.removeEventListener('loaderComplete', handleLoaderComplete);
    };
  }, [delay, duration, stagger]);

  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  return (
    <Component
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      {...props}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.28em] align-bottom"
        >
          <span
            data-word="true"
            className="inline-block will-change-transform leading-[inherit]"
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}
