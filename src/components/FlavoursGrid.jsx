import React from 'react';
import { FLAVOURS } from '../data/flavours';
import FlavourCard from './FlavourCard';

export default function FlavoursGrid() {
  return (
    <section id="flavours" className="relative z-10 bg-background paddx pb-[12vw] max-md:pb-[20vw]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5vw] max-md:gap-[4vw] w-full">
        {FLAVOURS.map((flavour) => (
          <FlavourCard key={flavour.id} flavour={flavour} />
        ))}
      </div>
    </section>
  );
}
