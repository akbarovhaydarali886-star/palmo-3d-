import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { FLAVOURS } from '../data/flavours';
import Can3DViewer from './Can3DViewer';
import { useCart } from '../context/CartContext';
import { AnimatedHeading, AnimatedParagraph } from './AnimatedText';
import HandDrawnButton from './HandDrawnButton';

export default function BoxOfHealth() {
  const { openCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);

  const cardRef = useRef(null);
  const wipeRef = useRef(null);
  const isTransitioning = useRef(false);

  const activeFlavour = FLAVOURS[activeIndex];

  const changeFlavour = (direction) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const nextIndex =
      direction > 0
        ? activeIndex === FLAVOURS.length - 1
          ? 0
          : activeIndex + 1
        : activeIndex === 0
        ? FLAVOURS.length - 1
        : activeIndex - 1;

    const nextFlavour = FLAVOURS[nextIndex];

    if (wipeRef.current && cardRef.current) {
      gsap.killTweensOf(wipeRef.current);
      gsap.set(wipeRef.current, {
        backgroundColor: nextFlavour.color,
        clipPath: 'circle(0% at 50% 50%)',
      });

      gsap.to(wipeRef.current, {
        clipPath: 'circle(75% at 50% 50%)',
        duration: 1.15,
        ease: 'expo.out',
        onComplete: () => {
          setActiveIndex(nextIndex);
          if (cardRef.current) {
            gsap.set(cardRef.current, { backgroundColor: nextFlavour.color });
          }
          if (wipeRef.current) {
            gsap.set(wipeRef.current, { clipPath: 'circle(0% at 50% 50%)' });
          }
          isTransitioning.current = false;
        },
      });
    } else {
      setActiveIndex(nextIndex);
      isTransitioning.current = false;
    }
  };

  return (
    <section
      id="cta"
      className="min-h-screen max-md:h-auto shrink-0 relative w-full z-10 bg-background paddx py-[4vw] pb-[8vw] max-md:pt-[8vw] max-md:pb-[20vw] flex items-center pt-[20vw]!"
    >
      <div className="relative z-20 h-full min-h-[70vh] max-md:h-auto w-full flex max-md:flex-col-reverse gap-[1.5vw] max-md:gap-[5vw]">
        {/* Left Card: THE BOX OF HEALTH */}
        <div className="relative w-1/2 max-md:w-full min-h-[70vh] max-md:min-h-0 max-md:h-[110vw] overflow-hidden rounded-[2vw] max-md:rounded-[6vw] border-4 border-foreground/60 bg-beige px-[4vw] py-[3vw] max-md:px-[7vw] max-md:py-[8vw] flex flex-col justify-center max-md:items-center max-md:text-center shadow-xl">
          {/* Corner Bolt Circles */}
          <span className="absolute left-[1.5vw] top-[1.5vw] size-[1vw] max-md:size-[3vw] rounded-full bg-foreground" />
          <span className="absolute right-[1.5vw] top-[1.5vw] size-[1vw] max-md:size-[3vw] rounded-full bg-foreground" />
          <span className="absolute bottom-[1.5vw] left-[1.5vw] size-[1vw] max-md:size-[3vw] rounded-full bg-foreground" />
          <span className="absolute bottom-[1.5vw] right-[1.5vw] size-[1vw] max-md:size-[3vw] rounded-full bg-foreground" />

          <AnimatedParagraph
            delay={0.1}
            className="font-patrick-hand text32 uppercase opacity-70 text-foreground"
          >
            straight from the shell
          </AnimatedParagraph>

          <AnimatedHeading
            as="h2"
            className="text180 mt-[min(1.5vw,2vh)] max-md:mt-[4vw] uppercase font-khand font-bold text-foreground leading-[85%]"
          >
            THE BOX OF HEALTH.
          </AnimatedHeading>

          <AnimatedParagraph
            delay={0.25}
            className="text36 mt-[min(2vw,2.5vh)] max-md:mt-[5vw] w-[85%] max-md:w-full font-medium text-foreground/90"
          >
            Chilled, clean, ready to sip. Order before the batch runs dry.
          </AnimatedParagraph>

          {/* Action Buttons with exact Palmo hand-drawn SVG redraw & rolling character animations */}
          <div className="mt-[min(3vw,3.5vh)] max-md:mt-[8vw] flex items-center gap-[2vw] max-md:gap-[2vw]">
            <HandDrawnButton
              title="Get Your Drink"
              onClick={openCart}
            />

            <HandDrawnButton
              as="a"
              href="#flavours"
              title="Explore Flavors"
            />
          </div>
        </div>

        {/* Right Card: Interactive Can Carousel Stage with Circle Wipe */}
        <div
          ref={cardRef}
          style={{ backgroundColor: activeFlavour.color }}
          className="relative w-1/2 max-md:w-full min-h-[70vh] max-md:min-h-0 max-md:h-[110vw] overflow-hidden rounded-[2vw] max-md:rounded-[6vw] border-4 border-foreground/60 flex flex-col shadow-xl"
        >
          {/* Circular Wipe Overlay for Flavor Switch */}
          <span
            ref={wipeRef}
            aria-hidden="true"
            style={{ clipPath: 'circle(0% at 50% 50%)' }}
            className="pointer-events-none absolute inset-0 will-change-[clip-path] z-1"
          />

          {/* Corner Bolt Circles */}
          <span className="absolute left-[1.5vw] top-[1.5vw] size-[1vw] max-md:size-[3vw] rounded-full bg-foreground z-10" />
          <span className="absolute right-[1.5vw] top-[1.5vw] size-[1vw] max-md:size-[3vw] rounded-full bg-foreground z-10" />
          <span className="absolute bottom-[1.5vw] left-[1.5vw] size-[1vw] max-md:size-[3vw] rounded-full bg-foreground z-10" />
          <span className="absolute bottom-[1.5vw] right-[1.5vw] size-[1vw] max-md:size-[3vw] rounded-full bg-foreground z-10" />

          {/* Active Flavour Name */}
          <p
            style={{ color: '#FAF6F0' }}
            className="relative z-10 pt-[3vw] max-md:pt-[8vw] text-center font-patrick-hand text32 uppercase transition-all duration-500 font-bold"
          >
            {activeFlavour.fullName}
          </p>

          {/* 3D Can Showcase Area */}
          <div className="relative flex-1 min-h-[42vh] max-md:min-h-0 w-full flex items-center justify-center z-10">
            <div className="size-full">
              <Can3DViewer
                key={activeFlavour.id}
                textureUrl={activeFlavour.texture}
                flavourColor={activeFlavour.color}
                isInteractive={true}
              />
            </div>

            {/* Prev Button */}
            <button
              type="button"
              onClick={() => changeFlavour(-1)}
              aria-label="Previous flavour"
              className="group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full duration-300 absolute! left-[2vw] max-md:left-[5vw] top-1/2 -translate-y-1/2 z-20 size-[5vw] max-md:size-12 bg-foreground border-2 border-foreground text-background hover:bg-beige hover:text-foreground active:scale-95 shadow-lg"
            >
              <svg className="h-[1.4vw] w-[1.4vw] max-md:h-4 max-md:w-4" viewBox="0 0 47 41" fill="none">
                <path d="M43.2324 21.0645H4.23242M21.6499 38L4.23242 21.0645L21.6499 3" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => changeFlavour(1)}
              aria-label="Next flavour"
              className="group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full duration-300 absolute! right-[2vw] max-md:right-[5vw] top-1/2 -translate-y-1/2 z-20 size-[5vw] max-md:size-12 bg-foreground border-2 border-foreground text-background hover:bg-beige hover:text-foreground active:scale-95 shadow-lg"
            >
              <svg className="h-[1.4vw] w-[1.4vw] max-md:h-4 max-md:w-4 rotate-180" viewBox="0 0 47 41" fill="none">
                <path d="M43.2324 21.0645H4.23242M21.6499 38L4.23242 21.0645L21.6499 3" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scalloped divider on bottom */}
      <div className="absolute translate-y-[7.5vw] bottom-0 left-0 w-full h-fit pointer-events-none z-10">
        <div className="h-fit w-full overflow-hidden flex items-center justify-center relative z-9">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="size-[calc(100vw/5.5)] rounded-full bg-background shrink-0" />
          ))}
        </div>
      </div>
    </section>
  );
}
