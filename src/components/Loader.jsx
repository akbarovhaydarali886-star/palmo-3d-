import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

export default function Loader({ onLoaded }) {
  const [percent, setPercent] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const loaderRef = useRef(null);
  const beigeLeftRef = useRef(null);
  const beigeRightRef = useRef(null);
  const darkLeftRef = useRef(null);
  const darkRightRef = useRef(null);
  const treeRef = useRef(null);
  const fillRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    // Initial fill state: empty (translate down 860)
    if (fillRef.current) {
      fillRef.current.setAttribute('transform', 'translate(0, 860)');
    }

    const counterObj = { p: 0 };
    const wipeObj = { v: -36 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          window.__loaderFinished = true;
          window.dispatchEvent(new Event('loaderComplete'));
          setIsDone(true);
          if (onLoaded) onLoaded();
        },
      });

      // 1. Fill coconut palm tree from 0 to 100% like pouring liquid
      tl.to(counterObj, {
        p: 100,
        duration: 1.5,
        ease: 'power1.inOut',
        onUpdate: () => {
          const currentP = Math.floor(counterObj.p);
          setPercent(currentP);
          if (fillRef.current) {
            fillRef.current.setAttribute(
              'transform',
              `translate(0, ${860 * (1 - counterObj.p / 100)})`
            );
          }
        },
      });

      // 2. Fade counter numbers down
      tl.to(
        counterRef.current,
        {
          autoAlpha: 0,
          y: 28,
          duration: 0.35,
          ease: 'power2.in',
        },
        '-=0.05'
      );

      // 3. Mask wipe animation: wipes the coconut away from bottom to top
      tl.to(
        wipeObj,
        {
          v: 100,
          duration: 0.65,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (treeRef.current) {
              treeRef.current.style.setProperty('--wipe', `${wipeObj.v}%`);
            }
          },
        },
        '-=0.25'
      );

      // Explicitly fade out tree completely so it disappears before curtains open!
      tl.to(
        treeRef.current,
        {
          autoAlpha: 0,
          scale: 0.96,
          duration: 0.35,
          ease: 'power2.in',
        },
        '-=0.3'
      );

      // 4. Dark foreground curtains peel open
      const curtainEase = 'power3.inOut';
      const curtainDuration = 1.45;

      tl.to(
        darkLeftRef.current,
        {
          xPercent: -170,
          rotate: -5,
          duration: curtainDuration,
          ease: curtainEase,
        },
        '-=0.08'
      );
      tl.to(
        darkRightRef.current,
        {
          xPercent: 170,
          rotate: 5,
          duration: curtainDuration,
          ease: curtainEase,
        },
        '<'
      );

      // 5. Beige curtains peel open
      tl.to(
        beigeLeftRef.current,
        {
          xPercent: -170,
          rotate: -5,
          duration: curtainDuration,
          ease: curtainEase,
        },
        '-=1.2'
      );
      tl.to(
        beigeRightRef.current,
        {
          xPercent: 170,
          rotate: 5,
          duration: curtainDuration,
          ease: curtainEase,
        },
        '<'
      );
    }, loaderRef);

    return () => ctx.revert();
  }, [onLoaded]);

  if (isDone) return null;

  const d1 = Math.floor(percent / 100) % 10;
  const d2 = Math.floor(percent / 10) % 10;
  const d3 = percent % 10;

  return (
    <section
      ref={loaderRef}
      id="loader"
      className="fixed top-0 left-0 z-999 flex h-screen w-full items-center justify-center overflow-hidden max-md:h-dvh pointer-events-auto"
    >
      {/* Beige Curtains */}
      <div
        ref={beigeLeftRef}
        className="absolute -top-[30dvh] left-0 h-[160dvh] w-[58%] will-change-transform z-1 origin-right bg-beige"
      />
      <div
        ref={beigeRightRef}
        className="absolute -top-[30dvh] right-0 left-auto h-[160dvh] w-[58%] will-change-transform z-1 origin-left bg-beige"
      />

      {/* Dark Foreground Curtains */}
      <div
        ref={darkLeftRef}
        className="absolute -top-[30dvh] left-0 h-[160dvh] w-[58%] will-change-transform z-2 origin-right bg-foreground"
      />
      <div
        ref={darkRightRef}
        className="absolute -top-[30dvh] right-0 left-auto h-[160dvh] w-[58%] will-change-transform z-2 origin-left bg-foreground"
      />

      {/* Center Palm Tree with Wipe Mask & Liquid Fill */}
      <div
        ref={treeRef}
        className="relative z-10"
        style={{
          '--wipe': '-36%',
          WebkitMaskImage:
            'linear-gradient(to top, transparent 0%, transparent var(--wipe), #000 calc(var(--wipe) + 36%), #000 100%)',
          maskImage:
            'linear-gradient(to top, transparent 0%, transparent var(--wipe), #000 calc(var(--wipe) + 36%), #000 100%)',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
        }}
      >
        <svg
          viewBox="0 0 554 860"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-[10vw] max-md:w-[36vw] overflow-visible will-change-transform"
          style={{ height: 'auto', transformOrigin: 'center center' }}
        >
          <defs>
            <clipPath id="loader-tree-clip">
              <path d="M276.9 249.322L245.035 358.522L218.104 349.667L239.372 377.927L200.966 509.509 C167.804 469.088 154.52 411.898 170.563 356.94C186.604 301.952 228.007 262.772 276.9 249.322Z M103.415 207.766C157.405 181.329 218.871 187.303 273.502 218.22L111.253 297.676L93.7865 257.119 L90.1138 308.033L0 352.169C13.6111 287.814 49.4243 234.204 103.415 207.766Z M208.565 116.324L163.197 142.072L124.48 120.504L144.267 80.4888L98.9187 106.247L18.5067 61.4334 C67.6015 24.6383 133.909 17.6759 190.768 49.3588C247.628 81.052 279.895 142.964 279.238 206.757 L188.778 156.327L208.565 116.324Z M396.393 62.3739L422.723 91.8752L302.498 212.828C288.192 156.793 303.813 92.8834 347.994 48.4469 C392.172 4.00119 453.144 -9.11952 505.07 9.05494L442.601 71.8976L396.393 62.3739Z M453.656 172.446C505.236 188.06 541.998 231.991 553.217 283.818L494.986 266.187L485.685 236.307 L478.98 261.357L426.871 245.588L416.035 210.724L408.197 239.944L313.736 211.373 C349.017 173.619 402.059 156.851 453.656 172.446Z M291.272 233.752L312.996 223.029C391.719 410.788 337.783 853.463 337.783 853.463L267.028 820.022 C325.93 605.308 299.765 276.926 291.272 233.752Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#loader-tree-clip)">
            {/* Base dim silhouette */}
            <rect x="0" y="-10" width="554" height="870" fill="var(--beige)" opacity="0.15" />
            {/* Liquid filling group that rises from bottom */}
            <g ref={fillRef} transform="translate(0, 860)">
              <rect x="0" y="0" width="554" height="860" fill="var(--beige)" />
            </g>
          </g>
          <path
            d="M276.9 249.322L245.035 358.522L218.104 349.667L239.372 377.927L200.966 509.509 C167.804 469.088 154.52 411.898 170.563 356.94C186.604 301.952 228.007 262.772 276.9 249.322Z M103.415 207.766C157.405 181.329 218.871 187.303 273.502 218.22L111.253 297.676L93.7865 257.119 L90.1138 308.033L0 352.169C13.6111 287.814 49.4243 234.204 103.415 207.766Z M208.565 116.324L163.197 142.072L124.48 120.504L144.267 80.4888L98.9187 106.247L18.5067 61.4334 C67.6015 24.6383 133.909 17.6759 190.768 49.3588C247.628 81.052 279.895 142.964 279.238 206.757 L188.778 156.327L208.565 116.324Z M396.393 62.3739L422.723 91.8752L302.498 212.828C288.192 156.793 303.813 92.8834 347.994 48.4469 C392.172 4.00119 453.144 -9.11952 505.07 9.05494L442.601 71.8976L396.393 62.3739Z M453.656 172.446C505.236 188.06 541.998 231.991 553.217 283.818L494.986 266.187L485.685 236.307 L478.98 261.357L426.871 245.588L416.035 210.724L408.197 239.944L313.736 211.373 C349.017 173.619 402.059 156.851 453.656 172.446Z M291.272 233.752L312.996 223.029C391.719 410.788 337.783 853.463 337.783 853.463L267.028 820.022 C325.93 605.308 299.765 276.926 291.272 233.752Z"
            stroke="var(--beige)"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Percentage Counter Bottom Left */}
      <div
        ref={counterRef}
        className="fixed bottom-8 left-8 z-10 flex items-end gap-1 text-beige max-md:bottom-[4dvh] max-md:left-1/2 max-md:-translate-x-1/2 select-none"
        style={{
          fontFamily: 'var(--font-khand)',
          fontWeight: 600,
          fontSize: 'clamp(3rem, 6vw, 5rem)',
        }}
      >
        <span className="inline-flex items-end leading-none tracking-[-0.06em]">
          <span className="relative inline-block overflow-hidden align-bottom tabular-nums leading-none" style={{ height: '1em', width: '0.48em' }}>
            <span className="block">{d1 > 0 ? d1 : ''}</span>
          </span>
          <span className="relative inline-block overflow-hidden align-bottom tabular-nums leading-none" style={{ height: '1em', width: '0.48em' }}>
            <span className="block">{percent >= 10 ? d2 : '0'}</span>
          </span>
          <span className="relative inline-block overflow-hidden align-bottom tabular-nums leading-none" style={{ height: '1em', width: '0.48em' }}>
            <span className="block">{d3}</span>
          </span>
        </span>
        <span className="opacity-60 leading-none pb-1" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
          %
        </span>
      </div>
    </section>
  );
}
