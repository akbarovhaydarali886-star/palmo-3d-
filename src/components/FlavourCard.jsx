import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import Can3DViewer from './Can3DViewer';
import { PACKS } from '../data/flavours';
import { useCart } from '../context/CartContext';

const LEAF_OFFSETS = [
  { x: -160, y: 160, spin: -45 },
  { x: 160, y: -160, spin: 60 },
  { x: 160, y: 160, spin: 90 },
  { x: -160, y: -160, spin: -70 }
];

export default function FlavourCard({ flavour }) {
  const { add, openCart, lastAdded } = useCart();
  const [packPickerOpen, setPackPickerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef(null);
  const circleRef = useRef(null);
  const titleRef = useRef(null);
  const leavesRef = useRef([]);
  const popoverRef = useRef(null);

  const isJustAdded = lastAdded && lastAdded.id.startsWith(flavour.id);

  // Set initial leaf positions
  useEffect(() => {
    leavesRef.current.forEach((el, i) => {
      if (el) {
        gsap.set(el, {
          xPercent: LEAF_OFFSETS[i].x,
          yPercent: LEAF_OFFSETS[i].y,
          rotation: LEAF_OFFSETS[i].spin,
        });
      }
    });
  }, []);

  const handlePointerEnter = () => {
    setIsHovered(true);
    // Kill running tweens
    const titleChars = titleRef.current?.querySelectorAll('[data-char]');
    gsap.killTweensOf([circleRef.current, titleChars, leavesRef.current]);

    // Circle expand
    if (circleRef.current) {
      gsap.fromTo(
        circleRef.current,
        { clipPath: 'circle(0% at 50% 50%)' },
        { clipPath: 'circle(75% at 50% 50%)', duration: 0.5, ease: 'power2.inOut' }
      );
    }

    // Letters roll up
    if (titleChars && titleChars.length) {
      gsap.to(titleChars, {
        yPercent: -100,
        duration: 0.5,
        ease: 'power3.out',
        stagger: { each: 0.018, from: 'start' },
      });
    }

    // Leaves fly inward
    if (leavesRef.current.length) {
      gsap.to(leavesRef.current, {
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.08,
      });
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    const titleChars = titleRef.current?.querySelectorAll('[data-char]');
    gsap.killTweensOf([circleRef.current, titleChars, leavesRef.current]);

    // Circle retract
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.9,
        ease: 'power2.inOut',
      });
    }

    // Letters roll back down
    if (titleChars && titleChars.length) {
      gsap.to(titleChars, {
        yPercent: 0,
        duration: 0.45,
        ease: 'power3.out',
        stagger: { each: 0.015, from: 'end' },
      });
    }

    // Leaves fly outward to original positions
    leavesRef.current.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          xPercent: LEAF_OFFSETS[i].x,
          yPercent: LEAF_OFFSETS[i].y,
          rotation: LEAF_OFFSETS[i].spin,
          duration: 0.7,
          ease: 'power2.in',
          delay: (leavesRef.current.length - 1 - i) * 0.04,
        });
      }
    });

    if (packPickerOpen) {
      setPackPickerOpen(false);
    }
  };

  // Popover GSAP animation
  useEffect(() => {
    if (!popoverRef.current) return;
    if (packPickerOpen) {
      gsap.fromTo(
        popoverRef.current,
        { y: 12, autoAlpha: 0, scale: 0.94 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.4, ease: 'sine.out', overwrite: 'auto' }
      );
    } else {
      gsap.to(popoverRef.current, {
        y: 8,
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.28,
        ease: 'sine.in',
        overwrite: 'auto',
      });
    }
  }, [packPickerOpen]);

  const handleSelectPack = (packId) => {
    add(flavour.id, packId, 1);
    setPackPickerOpen(false);
  };

  return (
    <div
      ref={cardRef}
      style={{ '--flavour': flavour.color }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="group h-[40vw] max-md:h-[80vw] p-[.7vw] max-md:p-[2.5vw] w-full bg-background max-md:rounded-2xl cursor-pointer max-md:bg-foreground relative select-none"
    >
      {/* Upper 3D Showcase Box */}
      <div className="relative w-full h-[90%] max-md:h-[85%] flex items-center justify-center bg-light-beige rounded-lg max-md:rounded-xl overflow-hidden shadow-sm">
        {/* Animated background color expansion on hover */}
        <span
          ref={circleRef}
          aria-hidden="true"
          style={{
            backgroundColor: flavour.color,
            clipPath: 'circle(0% at 50% 50%)',
          }}
          className="pointer-events-none absolute inset-0 will-change-[clip-path]"
        />

        {/* Floating Botanical SVG Elements */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-light-beige">
          {/* Leaf 0: Bottom Left */}
          <span
            ref={(el) => (leavesRef.current[0] = el)}
            className="absolute left-[-2vw] bottom-[-3vw] size-[12vw] max-md:size-[26vw] will-change-transform"
          >
            <div className="size-full rotate-25">
              <svg className="h-full w-full object-contain" viewBox="0 0 510 532" fill="none">
                <path
                  d="M382.06 14.5583C375.64 9.78756 369.127 5.12951 362.553 0.549777C360.646 -0.778942 358.322 0.504116 357.507 2.25336C355.472 6.62831 353.435 11.0045 351.4 15.3794C340.341 31.0181 328.668 46.2592 317.054 61.5307C305.623 76.5621 293.461 91.4586 283.349 107.33C278.352 115.172 277.108 123.511 276.713 132.511C276.353 140.699 275.661 148.833 274.302 156.932C271.563 173.253 266.472 189.218 259.679 204.43C245.505 236.162 223.589 264.424 197.381 288.215C167.657 315.198 132.768 336.582 96.0861 354.111C87.4724 358.228 77.9275 361.732 71.2812 368.614C64.4516 375.685 59.7235 384.662 54.5011 392.802C42.9914 410.742 31.4818 428.681 19.9721 446.621C17.1471 451.025 14.3216 455.427 11.4975 459.831C11.3327 460.087 11.2158 460.342 11.1307 460.596C7.59367 465.953 4.05619 471.31 0.518263 476.667C-0.202228 477.759 -0.249845 479.627 0.867764 480.553C44.6535 516.825 103.002 535.381 161.071 531.314"
                  fill="currentColor"
                  fillOpacity=".6"
                />
              </svg>
            </div>
          </span>

          {/* Leaf 1: Top Right */}
          <span
            ref={(el) => (leavesRef.current[1] = el)}
            className="absolute right-[-2vw] top-[-3vw] size-[11vw] max-md:size-[24vw] will-change-transform"
          >
            <div className="size-full -rotate-40">
              <svg className="h-full w-full object-contain" viewBox="0 0 510 532" fill="none">
                <path
                  d="M382.06 14.5583C375.64 9.78756 369.127 5.12951 362.553 0.549777C360.646 -0.778942 358.322 0.504116 357.507 2.25336C355.472 6.62831 353.435 11.0045 351.4 15.3794C340.341 31.0181 328.668 46.2592 317.054 61.5307C305.623 76.5621 293.461 91.4586 283.349 107.33C278.352 115.172 277.108 123.511 276.713 132.511C276.353 140.699 275.661 148.833 274.302 156.932C271.563 173.253 266.472 189.218 259.679 204.43C245.505 236.162 223.589 264.424 197.381 288.215"
                  fill="currentColor"
                  fillOpacity=".6"
                />
              </svg>
            </div>
          </span>

          {/* Leaf 2: Bottom Right */}
          <span
            ref={(el) => (leavesRef.current[2] = el)}
            className="absolute right-[1.5vw] bottom-[1.5vw] size-[8vw] max-md:size-[18vw] will-change-transform"
          >
            <div className="size-full rotate-12">
              <svg className="h-full w-full object-contain" viewBox="0 0 315 260" fill="none">
                <path
                  d="M313.516 61.4066C289.704 41.2566 265.91 21.0866 242.095 0.940556C240.814 -0.143444 239.329 -0.200443 238.097 0.314557C203.502 6.10156 168.075 5.42056 133.427 0.408558C132.154 -0.156442 130.602 0.0215541 129.479 0.749554C128.95 0.758554 128.395 0.880555 127.831 1.15056"
                  fill="currentColor"
                  fillOpacity=".6"
                />
              </svg>
            </div>
          </span>

          {/* Leaf 3: Top Left */}
          <span
            ref={(el) => (leavesRef.current[3] = el)}
            className="absolute left-[-1.5vw] top-[1vw] size-[8vw] max-md:size-[18vw] will-change-transform"
          >
            <div className="size-full rotate-15">
              <svg className="h-full w-full object-contain" viewBox="0 0 315 260" fill="none">
                <path
                  d="M313.516 61.4066C289.704 41.2566 265.91 21.0866 242.095 0.940556C240.814 -0.143444 239.329 -0.200443 238.097 0.314557C203.502 6.10156 168.075 5.42056 133.427 0.408558"
                  fill="currentColor"
                  fillOpacity=".6"
                />
              </svg>
            </div>
          </span>
        </div>

        {/* 3D WebGL Can */}
        <div className="absolute inset-0 h-full w-full">
          <Can3DViewer
            textureUrl={flavour.texture}
            flavourColor={flavour.color}
            isInteractive={true}
            isHovered={isHovered}
          />
        </div>
      </div>

      {/* Bottom Info Row */}
      <div className="flex h-[10%] max-md:h-[15%] max-md:pt-[2vw] px-[.5vw] w-full justify-between items-center">
        {/* Animated Letter Flip Title */}
        <p ref={titleRef} className="text36 font-patrick-hand text-foreground overflow-hidden max-md:text-light-beige">
          <span className="flex">
            {flavour.name.split('').map((char, index) => (
              <span key={index} className="relative inline-block overflow-hidden">
                <span data-char="true" className="block will-change-transform">
                  <span className="block whitespace-pre">{char}</span>
                  <span className="block whitespace-pre absolute top-full left-0 text-light-brown max-md:text-beige">
                    {char}
                  </span>
                </span>
              </span>
            ))}
          </span>
        </p>

        {/* Add Button & Pick-a-pack Popover */}
        <div className="relative text-foreground max-md:text-light-beige">
          <button
            type="button"
            aria-expanded={packPickerOpen}
            aria-label={`Add ${flavour.name} to basket`}
            onClick={(e) => {
              e.stopPropagation();
              setPackPickerOpen(!packPickerOpen);
            }}
            className="group/add flex cursor-pointer items-center justify-center p-1 rounded-full hover:bg-foreground/10 transition-colors"
          >
            <div
              className={`size-[2vw] max-md:size-[6vw] shrink-0 transition-transform duration-500 ${
                packPickerOpen ? 'rotate-45' : 'group-hover/add:rotate-90 group-hover/add:scale-110'
              }`}
            >
              <svg className="h-full w-full object-contain" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </button>

          {/* "Added to basket" tooltip */}
          <span
            className={`pointer-events-none absolute bottom-[calc(100%+0.6vw)] right-0 whitespace-nowrap rounded-md bg-beige px-[0.6vw] py-[0.2vw] max-md:px-3 max-md:py-1 font-patrick-hand text-foreground transition-all duration-300 shadow-md ${
              isJustAdded ? 'translate-y-0 opacity-100' : 'translate-y-[0.4vw] opacity-0'
            }`}
            style={{ fontSize: 'min(0.9rem, 2vh)' }}
          >
            Added to basket
          </span>

          {/* Pick A Pack Popover */}
          <div
            ref={popoverRef}
            style={{ visibility: 'hidden' }}
            className="absolute bottom-[calc(100%+0.8vw)] max-md:bottom-[calc(100%+3vw)] right-0 z-50 w-[14vw] max-md:w-[62vw] origin-bottom-right overflow-hidden rounded-lg bg-foreground p-[0.6vw] max-md:p-3 text-light-beige shadow-2xl"
          >
            <p className="px-[0.4vw] max-md:px-2 pb-[0.4vw] max-md:pb-2 font-patrick-hand text-beige text-xs uppercase tracking-wider font-semibold">
              Pick a pack
            </p>
            {PACKS.map((pack) => (
              <button
                key={pack.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPack(pack.id);
                }}
                className="group/pack flex w-full cursor-pointer items-center justify-between gap-[0.5vw] max-md:gap-2 rounded-md px-[0.4vw] py-[0.35vw] max-md:px-2 max-md:py-2 text-left transition-colors duration-300 hover:bg-light-beige hover:text-foreground"
              >
                <span className="min-w-0">
                  <span className="block font-patrick-hand text-sm font-bold">{pack.label}</span>
                  <span className="block truncate font-patrick-hand opacity-60 text-xs">
                    {pack.note}
                  </span>
                </span>
                <span className="shrink-0 font-patrick-hand tabular-nums text-beige transition-colors duration-300 group-hover/pack:text-foreground font-semibold text-sm">
                  ${pack.price.toFixed(2)}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPackPickerOpen(false);
                openCart();
              }}
              className="mt-[0.3vw] max-md:mt-1 w-full cursor-pointer border-t border-light-beige/15 pt-[0.4vw] max-md:pt-2 font-patrick-hand text-light-beige/60 transition-colors duration-300 hover:text-beige text-xs text-center"
            >
              View basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
