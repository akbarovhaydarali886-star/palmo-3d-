import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkNavbar, setIsDarkNavbar] = useState(false);

  const overlayRef = useRef(null);
  const linksContainerRef = useRef(null);
  const sayHelloRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const darkSections = document.querySelectorAll('[data-navbar-theme="dark"]');
      let overDark = false;
      const navY = 50;
      darkSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= navY && rect.bottom >= navY) {
          overDark = true;
        }
      });
      setIsDarkNavbar(overDark);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (count > 0 && badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1 },
        { scale: 1.3, duration: 0.22, ease: 'sine.out', yoyo: true, repeat: 1 }
      );
    }
  }, [count]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('contact@vasavprajapati.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { label: 'Home', href: '#top' },
    { label: 'Story', href: '#story' },
    { label: 'Flavours', href: '#flavours' },
    { label: 'Benefits', href: '#nutrition' },
    { label: 'Contact', href: '#cta' },
  ];

  // GSAP Menu open / close animation
  useEffect(() => {
    if (!overlayRef.current) return;
    const links = linksContainerRef.current?.querySelectorAll('[data-menu-link]');

    if (menuOpen) {
      const tl = gsap.timeline();
      tl.set(overlayRef.current, { autoAlpha: 1, pointerEvents: 'auto' })
        .fromTo(
          overlayRef.current,
          { clipPath: 'ellipse(75% 0% at 50% -5%)' },
          { clipPath: 'ellipse(105% 145% at 50% -5%)', duration: 1, ease: 'power3.inOut' }
        )
        .fromTo(
          links,
          { yPercent: 165, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 0.75, ease: 'power3.out', stagger: 0.06 },
          '-=0.45'
        )
        .fromTo(
          sayHelloRef.current,
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.5'
        );
    } else {
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        clipPath: 'ellipse(75% 0% at 50% -5%)',
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: 'none' });
        },
      });
    }
  }, [menuOpen]);

  const handleLinkClick = (href) => {
    setMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 paddx flex overflow-x-hidden gap-[1vw] items-center justify-between py-[1.5vw] left-0 w-full z-900 max-md:py-4">
        {/* Palm Logo */}
        <a
          href="#top"
          aria-label="Home"
          className={`size-[4vw] max-md:size-11 flex items-center justify-center transition-colors duration-500 hover:scale-105 ${
            isDarkNavbar ? 'text-[#FFE386]' : 'text-foreground'
          }`}
        >
          <svg
            viewBox="0 0 554 588"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block size-full overflow-visible"
            aria-hidden="true"
          >
            <g clipPath="url(#nav-palm-clip)">
              <path
                d="M277.092 287.522L245.263 399.581L218.361 390.494L239.606 419.495L201.243 554.522C168.118 513.043 154.848 454.355 170.874 397.958C186.897 341.53 228.253 301.325 277.092 287.522Z"
                fill="currentColor"
                fillOpacity="1"
              />
              <path
                d="M103.415 239.474C157.405 208.979 218.871 215.871 273.502 251.532L111.253 343.181L93.7865 296.4L90.1138 355.127L2.44079e-05 406.036C13.6111 331.805 49.4243 269.968 103.415 239.474Z"
                fill="currentColor"
                fillOpacity="1"
              />
              <path
                d="M208.565 133.999L163.197 163.698L124.48 138.82L144.267 92.6644L98.9187 122.376L18.5067 70.6849C67.6015 28.2433 133.909 20.2124 190.768 56.7573C247.628 93.3141 279.895 164.727 279.238 238.309L188.778 180.141L208.565 133.999Z"
                fill="currentColor"
                fillOpacity="1"
              />
              <path
                d="M396.393 71.7699L422.723 105.798L302.498 245.312C288.192 180.678 303.813 106.961 347.994 55.7056C392.172 4.43934 453.144 -10.6948 505.07 10.2686L442.601 82.755L396.393 71.7699Z"
                fill="currentColor"
                fillOpacity="1"
              />
              <path
                d="M449.012 222.22C500.592 240.23 537.353 290.902 548.572 350.682L490.342 330.346L481.041 295.881L474.335 324.775L422.226 306.586L411.391 266.372L403.553 300.076L309.091 267.121C344.373 223.573 397.414 204.232 449.012 222.22Z"
                fill="currentColor"
                fillOpacity="1"
              />
              <path
                d="M304.516 289.092L319.911 283.862C395.457 361.945 393.499 553.082 393.499 553.082L337.396 540.843C362.958 447.172 314.664 307.33 304.516 289.092Z"
                fill="currentColor"
                fillOpacity="1"
              />
            </g>
            <defs>
              <clipPath id="nav-palm-clip">
                <rect width="553.217" height="587.272" fill="white" transform="matrix(-1 0 0 1 553.217 0)" />
              </clipPath>
            </defs>
          </svg>
        </a>

        {/* Buttons on Right */}
        <div className="w-fit gap-[.5vw] max-md:gap-2 flex items-center justify-center">
          {/* Basket Button */}
          <button
            type="button"
            aria-label="Open basket"
            onClick={openCart}
            className={`rounded-md relative size-[2.5vw] max-md:size-10 flex items-center justify-center p-[0.45vw] max-md:p-2 cursor-pointer transition-all duration-300 active:scale-90 shadow-md ${
              isDarkNavbar
                ? 'bg-[#FFE386] text-[#463721] hover:bg-white'
                : 'bg-foreground text-light-beige hover:bg-light-beige hover:text-foreground'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="size-full transition-all duration-300"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M2.9,9C3,9,3.1,9,3.2,9c0.2,0,0.4-0.1,0.6-0.2l0.4-0.3C4.1,8.8,3.9,9,3.8,9.3c0,0,0,0,0,0c-0.4,0.8-0.6,1.7-0.7,2.6c0,0,0,0,0,0c0,0,0,0,0,0C3,12.3,3,12.6,3,13c0,5,4,9,9,9s9-4,9-9c0-0.4,0-0.7-0.1-1.1c-0.2-1.2-0.5-2.4-1.1-3.4C19.6,8.2,19.3,8,18.9,8h-3.5l1.2-2.8L19.8,6c0.5,0.1,1.1-0.2,1.2-0.7c0.1-0.5-0.2-1.1-0.7-1.2l-4-1c-0.5-0.1-1,0.1-1.2,0.6L13.2,8H8.4L6.9,6.5l1.5-1.1c0.3-0.2,0.4-0.5,0.4-0.8c0-0.3-0.1-0.6-0.4-0.8C7.7,3.3,6.9,3,6,3C3.8,3,2,4.8,2,6.9c0,0.5,0.1,1,0.3,1.5C2.4,8.7,2.6,8.9,2.9,9z M19,13c0,3.9-3.1,7-7,7s-7-3.1-7-7H19z M18.3,10c0.2,0.3,0.3,0.7,0.4,1H5.3c0.1-0.3,0.2-0.7,0.4-1H18.3z M5.1,8C5,8,4.9,8,4.9,8l0.4-0.3L5.6,8H5.1z M5.5,5.1L4.2,6C4.5,5.5,5,5.2,5.5,5.1z"
              />
            </svg>
            {count > 0 && (
              <span
                ref={badgeRef}
                className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-beige font-khand text-[11px] font-bold text-foreground will-change-transform"
              >
                {count}
              </span>
            )}
          </button>

          {/* Menu Button */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
            className={`text36 relative px-[2vw] py-[.3vw] max-md:px-5 max-md:py-2 font-patrick-hand rounded-md cursor-pointer overflow-hidden transition-colors duration-300 shadow-md ${
              isDarkNavbar
                ? 'bg-[#FFE386] text-[#463721] hover:bg-[#ffe89c]'
                : 'bg-foreground text-light-beige hover:bg-opacity-95'
            }`}
          >
            <span className="grid">
              <span
                className={`col-start-1 row-start-1 transition-all duration-400 ${
                  menuOpen ? '-translate-y-[130%] opacity-0' : 'translate-y-0 opacity-100'
                }`}
              >
                MENU
              </span>
              <span
                className={`col-start-1 row-start-1 transition-all duration-400 ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[130%] opacity-0'
                }`}
              >
                CLOSE
              </span>
            </span>
          </button>
        </div>
      </nav>

      {/* Fullscreen Overlay Menu with exact GSAP Ellipse ClipPath */}
      <div
        ref={overlayRef}
        aria-hidden={!menuOpen}
        style={{ clipPath: 'ellipse(75% 0% at 50% -5%)', visibility: 'hidden' }}
        className="fixed inset-0 z-800 bg-foreground text-light-beige pointer-events-none"
      >
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute left-1/2 top-[-15vw] size-[60vw] -translate-x-1/2 rounded-full opacity-25 blur-[8vw]"
            style={{ background: 'radial-gradient(circle, var(--gold), transparent 70%)' }}
          />
          <div className="absolute bottom-[-10vw] max-md:bottom-[-14vh] left-1/2 w-[60vw] max-md:w-[210vw] -translate-x-1/2 max-md:-translate-x-[57%] opacity-10">
            <svg viewBox="0 0 554 588" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-full w-full overflow-visible">
              <path
                d="M276.9 249.322L245.035 358.522L218.104 349.667L239.372 377.927L200.966 509.509 C167.804 469.088 154.52 411.898 170.563 356.94C186.604 301.952 228.007 262.772 276.9 249.322Z M103.415 207.766C157.405 181.329 218.871 187.303 273.502 218.22L111.253 297.676L93.7865 257.119 L90.1138 308.033L2.44079e-05 352.169C13.6111 287.814 49.4243 234.204 103.415 207.766Z M208.565 116.324L163.197 142.072L124.48 120.504L144.267 80.4888L98.9187 106.247L18.5067 61.4334 C67.6015 24.6383 133.909 17.6759 190.768 49.3588C247.628 81.052 279.895 142.964 279.238 206.757 L188.778 156.327L208.565 116.324Z M396.393 62.3739L422.723 91.8752L302.498 212.828C288.192 156.793 303.813 92.8834 347.994 48.4469 C392.172 4.00119 453.144 -9.11952 505.07 9.05494L442.601 71.8976L396.393 62.3739Z M453.656 172.446C505.236 188.06 541.998 231.991 553.217 283.818L494.986 266.187L485.685 236.307 L478.98 261.357L426.871 245.588L416.035 210.724L408.197 239.944L313.736 211.373 C349.017 173.619 402.059 156.851 453.656 172.446Z M291.272 233.752L312.996 223.029C391.719 410.788 337.783 853.463 337.783 853.463L267.028 820.022 C325.93 605.308 299.765 276.926 291.272 233.752Z"
                fill="#FFE386"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="paddx relative z-10 flex h-full w-full flex-col items-center justify-between py-[6vw] max-md:py-[8vh]">
          {/* Navigation Links */}
          <nav ref={linksContainerRef} className="flex flex-1 flex-col items-center justify-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-menu-link="true"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="group flex justify-center overflow-hidden px-[0.5vw] pb-[0.18em] pt-[0.04em] [margin-block:-0.13em]"
                style={{ fontSize: 'min(8vw, 13vh)' }}
              >
                <span className="block">
                  <span className="relative block whitespace-nowrap text150" style={{ fontSize: 'inherit', lineHeight: 1 }}>
                    <span className="block">{link.label}</span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 block text-background [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:[clip-path:inset(0_0_0_0)]"
                    >
                      {link.label}
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </nav>

          {/* Say Hello Section */}
          <div ref={sayHelloRef} className="flex w-full flex-col items-center gap-[0.2vw] max-md:gap-1">
            <p className="text36 font-patrick-hand text-beige">Say hello</p>
            <div className="flex items-center gap-[0.8vw] max-md:gap-2">
              <a
                href="mailto:hello@coconut.com"
                className="text32 transition-colors duration-300 hover:text-beige font-medium"
              >
                hello@coconut.com
              </a>
              <button
                type="button"
                aria-label="Copy hello@coconut.com"
                onClick={() => {
                  navigator.clipboard.writeText('hello@coconut.com');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="group relative flex size-[2vw] max-md:size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-all duration-300 active:scale-90 border-light-beige/40 text-light-beige hover:border-beige hover:bg-light-beige hover:text-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`absolute size-[1.1vw] max-md:size-4 transition-all duration-300 ${
                    copied ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
                  }`}
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`absolute size-[1.1vw] max-md:size-4 transition-all duration-300 ${
                    copied ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  }`}
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span
                  className={`pointer-events-none absolute bottom-[calc(100%+0.5vw)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-beige px-[0.6vw] py-[0.2vw] font-patrick-hand text-foreground transition-all duration-300 ${
                    copied ? 'translate-y-0 opacity-100' : 'translate-y-[0.4vw] opacity-0'
                  }`}
                  style={{ fontSize: 'min(0.9rem, 2vh)' }}
                >
                  Copied!
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
