import React, { useState } from 'react';
import FruitSliceGame from './FruitSliceGame';

export default function Footer() {
  const [score, setScore] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);

  const footerLinks = [
    { label: 'Home', href: '#top' },
    { label: 'Our Story', href: '#story' },
    { label: 'Flavours', href: '#flavours' },
    { label: 'Benefits', href: '#nutrition' },
    { label: 'Contact', href: '#cta' },
  ];

  return (
    <div id="footer" data-slash-zone="true" className="relative z-0 h-screen max-md:h-dvh min-h-160 max-md:min-h-145 w-full select-none">
      <div className="fixed bottom-0 left-0 h-screen max-md:h-dvh min-h-160 max-md:min-h-145 w-full bg-foreground text-background">
        <footer className="relative flex h-full w-full flex-col justify-between max-md:justify-end overflow-hidden pt-[9.5vw] max-md:pt-[22vw] pb-[1.5vw] max-md:pb-[5vw] border-t border-background/10">
          
          {/* Interactive Fruit Slicing Game in Background */}
          <div className="absolute inset-0 z-15 pointer-events-auto">
            <FruitSliceGame onScoreChange={setScore} isFrozen={isFrozen} />
          </div>

          {/* Top Info & Navigation */}
          <div className="paddx relative z-20 flex max-md:flex-col items-start justify-between gap-[4vw] max-md:gap-[7vw] pointer-events-none">
            <div className="w-[24vw] max-md:w-full max-md:text-center">
              <p className="font-patrick-hand text32 max-md:text-lg uppercase text-beige tracking-wider">
                palmo coconut co.
              </p>
              <p className="text36 max-md:w-[65%] max-md:mx-auto max-md:text-[1.35rem] mt-[1vw] max-md:mt-3 font-medium capitalize text-background/90 leading-tight max-md:leading-snug">
                Cold pressed, never concentrated. Picked ripe, sipped cold.
              </p>
            </div>

            <nav aria-label="Footer" className="flex max-md:mb-[10vw] gap-[5vw] max-md:w-full font-patrick-hand text32 max-md:text-lg! pt-[4vw] max-md:pt-0 capitalize">
              <ul className="flex max-md:w-full max-md:flex-col max-md:justify-center gap-[2vw] max-md:gap-y-1">
                {footerLinks.map((link) => (
                  <li key={link.label} className="max-md:text-center">
                    <a
                      href={link.href}
                      className="inline-block max-md:py-1 text-background transition-colors hover:text-beige pointer-events-auto"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Large PALMO Background Typography & Palm Trees */}
          <div className="relative mt-[2vw] max-md:mt-[4vw] h-[28vw] max-md:h-[52vw] pointer-events-none">
            <div className="pointer-events-none z-10 absolute inset-x-0 bottom-0 h-full">
              {/* Left Palm Tree */}
              <div
                className="absolute top-[5vw] max-md:top-[-48vw] left-[-3vw] max-md:left-[-16vw] rotate-30 max-md:rotate-35 h-[22vw] w-[22vw] max-md:h-[46vw] max-md:w-[46vw] -scale-x-100 opacity-80"
                aria-hidden="true"
              >
                <svg viewBox="0 0 554 588" fill="none" className="block h-full w-full overflow-visible">
                  <path d="M276.9 249.322L245.035 358.522L218.104 349.667L239.372 377.927L200.966 509.509 C167.804 469.088 154.52 411.898 170.563 356.94C186.604 301.952 228.007 262.772 276.9 249.322Z M103.415 207.766C157.405 181.329 218.871 187.303 273.502 218.22L111.253 297.676L93.7865 257.119 L90.1138 308.033L2.44079e-05 352.169C13.6111 287.814 49.4243 234.204 103.415 207.766Z M208.565 116.324L163.197 142.072L124.48 120.504L144.267 80.4888L98.9187 106.247L18.5067 61.4334 C67.6015 24.6383 133.909 17.6759 190.768 49.3588C247.628 81.052 279.895 142.964 279.238 206.757 L188.778 156.327L208.565 116.324Z M396.393 62.3739L422.723 91.8752L302.498 212.828C288.192 156.793 303.813 92.8834 347.994 48.4469 C392.172 4.00119 453.144 -9.11952 505.07 9.05494L442.601 71.8976L396.393 62.3739Z M453.656 172.446C505.236 188.06 541.998 231.991 553.217 283.818L494.986 266.187L485.685 236.307 L478.98 261.357L426.871 245.588L416.035 210.724L408.197 239.944L313.736 211.373 C349.017 173.619 402.059 156.851 453.656 172.446Z M291.272 233.752L312.996 223.029C391.719 410.788 337.783 853.463 337.783 853.463L267.028 820.022 C325.93 605.308 299.765 276.926 291.272 233.752Z" fill="#FFE386" />
                </svg>
              </div>

              {/* Right Palm Tree */}
              <div
                className="absolute top-[1vw] max-md:top-[-52vw] right-[-2vw] max-md:right-[-14vw] -rotate-35 max-md:-rotate-35 h-[24vw] w-[24vw] max-md:h-[48vw] max-md:w-[48vw] opacity-80"
                aria-hidden="true"
              >
                <svg viewBox="0 0 554 588" fill="none" className="block h-full w-full overflow-visible">
                  <path d="M276.9 249.322L245.035 358.522L218.104 349.667L239.372 377.927L200.966 509.509 C167.804 469.088 154.52 411.898 170.563 356.94C186.604 301.952 228.007 262.772 276.9 249.322Z M103.415 207.766C157.405 181.329 218.871 187.303 273.502 218.22L111.253 297.676L93.7865 257.119 L90.1138 308.033L2.44079e-05 352.169C13.6111 287.814 49.4243 234.204 103.415 207.766Z M208.565 116.324L163.197 142.072L124.48 120.504L144.267 80.4888L98.9187 106.247L18.5067 61.4334 C67.6015 24.6383 133.909 17.6759 190.768 49.3588C247.628 81.052 279.895 142.964 279.238 206.757 L188.778 156.327L208.565 116.324Z M396.393 62.3739L422.723 91.8752L302.498 212.828C288.192 156.793 303.813 92.8834 347.994 48.4469 C392.172 4.00119 453.144 -9.11952 505.07 9.05494L442.601 71.8976L396.393 62.3739Z M453.656 172.446C505.236 188.06 541.998 231.991 553.217 283.818L494.986 266.187L485.685 236.307 L478.98 261.357L426.871 245.588L416.035 210.724L408.197 239.944L313.736 211.373 C349.017 173.619 402.059 156.851 453.656 172.446Z M291.272 233.752L312.996 223.029C391.719 410.788 337.783 853.463 337.783 853.463L267.028 820.022 C325.93 605.308 299.765 276.926 291.272 233.752Z" fill="#FFE386" />
                </svg>
              </div>
            </div>

            {/* Giant Palmo Text */}
            <div className="absolute inset-x-0 bottom-[1vw] max-md:bottom-0 z-5">
              <h2 className="text-center font-khand text-[22vw] max-md:text-[30vw] leading-[.78] font-medium tracking-[-.04em] uppercase text-beige">
                Palmo
              </h2>
            </div>
          </div>

          {/* Interactive Score Badge & Freeze Button */}
          <div className="z-30 flex items-center gap-[0.8vw] max-md:gap-2 rounded-full border border-background/15 bg-foreground/90 backdrop-blur-md px-[1.2vw] py-[0.5vw] max-md:px-3 max-md:py-1.5 select-none md:absolute md:bottom-[2vw] md:right-[3vw] max-md:relative max-md:mx-auto max-md:mb-3 max-md:w-fit pointer-events-auto shadow-lg">
            <div className="flex items-baseline gap-[0.4vw] max-md:gap-1.5 font-khand leading-none pointer-events-none">
              <span className="text-[1.1vw] max-md:text-xs font-medium uppercase tracking-wider text-beige/70">
                Score
              </span>
              <span className="text-[1.8vw] max-md:text-xl font-bold tracking-tight text-beige tabular-nums">
                {score}
              </span>
            </div>
            <span className="h-[1.2vw] max-md:h-3.5 w-px bg-background/20" aria-hidden="true" />
            <div className="flex items-center gap-[0.35vw] max-md:gap-1 pointer-events-none">
              <span className="size-[0.45vw] max-md:size-1.5 rounded-full bg-beige/60" />
              <span className="size-[0.45vw] max-md:size-1.5 rounded-full bg-beige/60" />
              <span className="size-[0.45vw] max-md:size-1.5 rounded-full bg-beige/60" />
            </div>
            <div className="flex items-center">
              <span className="h-3.5 w-px bg-background/20 mx-2" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setIsFrozen(!isFrozen)}
                className="flex items-center justify-center gap-1.5 rounded-full px-2.5 py-0.5 font-khand text-xs font-semibold uppercase tracking-wider transition-colors duration-200 bg-background/15 text-background/80 hover:bg-background/25 cursor-pointer"
                aria-pressed={isFrozen}
                aria-label="Freeze Scroll"
              >
                <span className={`size-1.5 shrink-0 rounded-full ${isFrozen ? 'bg-red-400' : 'bg-green-400'}`} />
                <span>{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
              </button>
            </div>
          </div>

          {/* Copyright Pill */}
          <div className="relative w-[50vw] max-md:w-[90vw] mx-auto rounded-full max-md:rounded-2xl z-20 flex max-md:flex-col items-center justify-between max-md:justify-center max-md:gap-1 bg-light-beige text-foreground px-[1.5vw] max-md:px-4 py-[1vw] max-md:py-3 text-[1vw] max-md:text-[0.8rem] text-center capitalize pointer-events-auto font-medium shadow-md">
            <p>© 2026 palmo. all rights reserved.</p>
            <p>made under the sun</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
