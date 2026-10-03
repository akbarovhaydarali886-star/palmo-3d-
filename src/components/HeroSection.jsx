import React from 'react';
import { AnimatedHeading, AnimatedParagraph } from './AnimatedText';

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative z-10 bg-background pt-[12vw] max-md:pt-[28vw] pb-[6vw] max-md:pb-[10vw] paddx text-center flex flex-col items-center justify-center"
    >
      <AnimatedParagraph
        className="font-patrick-hand text32 max-md:text-2xl text-center mb-[1vw] max-md:mb-3 text-foreground/80 tracking-wide"
      >
        Pure • Cold-Pressed • Organic Lineup
      </AnimatedParagraph>

      <AnimatedHeading
        as="h1"
        className="text180 uppercase text-center w-full leading-[85%] max-md:text-[14vw] max-md:leading-[90%] font-khand font-bold text-foreground tracking-[-0.04em]"
      >
        OUR FLAVOURS
      </AnimatedHeading>

      <AnimatedParagraph
        delay={0.2}
        className="text36 max-md:text-lg text-center max-w-[50vw] max-md:max-w-[90vw] mx-auto mt-[1.5vw] max-md:mt-4 font-medium font-sans text-foreground/90 leading-relaxed"
      >
        Explore 100% pure organic coconut water infused with cold-extracted natural fruit essences. Zero added sugar, maximum natural electrolytes.
      </AnimatedParagraph>
    </section>
  );
}
