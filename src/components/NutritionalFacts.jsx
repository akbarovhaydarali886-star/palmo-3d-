import React from 'react';
import { FLAVOURS, NUTRITION_ROWS } from '../data/flavours';
import { AnimatedHeading, AnimatedParagraph } from './AnimatedText';

export default function NutritionalFacts() {
  return (
    <section
      data-nav-dark="7"
      id="nutrition"
      className="paddx pt-[14vw] max-md:pt-[20vw] pb-[12vw] max-md:pb-[18vw] bg-foreground text-background relative z-20 w-full"
    >
      {/* Top Scalloped Border Divider */}
      <div className="absolute top-0 left-0 translate-y-[-50%] w-full h-fit pointer-events-none z-10">
        <div className="h-fit w-full overflow-hidden flex items-center justify-center relative z-9">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="size-[calc(100vw/5.5)] rounded-full bg-foreground shrink-0" />
          ))}
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-col items-center mb-[4vw] max-md:mb-6 text-center relative z-20">
        <AnimatedHeading
          as="h2"
          className="text180 uppercase text-center w-full leading-[85%] text-background relative z-20 max-md:text-[12vw] max-md:leading-[90%] font-khand font-bold tracking-[-0.04em]"
        >
          NUTRITIONAL FACTS
        </AnimatedHeading>
        <AnimatedParagraph
          delay={0.15}
          className="text36 max-md:text-base text-center max-w-[45vw] max-md:max-w-[85vw] mt-[1vw] max-md:mt-3 text-background/80 relative z-20 font-sans"
        >
          Compare essential electrolytes, calories, and natural fruit nutrients across our 6 signature 3D cans.
        </AnimatedParagraph>
      </div>

      {/* Desktop Comparison Table */}
      <div className="hidden md:block w-full max-w-[82vw] mx-auto rounded-lg border border-background/20 overflow-hidden bg-background/5 shadow-2xl backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-background/20 bg-background/10 font-khand text-base">
              <th className="py-[1.4vw] px-[1.5vw] text-[1.1vw] font-bold uppercase tracking-wider text-beige">
                Nutrient
              </th>
              {FLAVOURS.map((f) => (
                <th
                  key={f.id}
                  className={`py-[1.4vw] px-[1.5vw] text-[1.1vw] font-bold uppercase tracking-wider ${
                    f.id === 'natural' ? 'text-beige' : 'text-background'
                  }`}
                >
                  {f.name.replace('Natural Pure', 'Natural Pure').replace('Golden ', '').replace('Ruby ', '').replace('Tropical ', '').replace('Lush ', '').replace('Alphonso ', '')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-background/10 font-sans">
            {NUTRITION_ROWS.map((row) => (
              <tr key={row.key} className="hover:bg-background/10 transition-colors">
                <td className="py-[1.1vw] px-[1.5vw] text-[0.95vw] font-semibold text-background/90">
                  {row.label}
                </td>
                {FLAVOURS.map((f) => (
                  <td
                    key={f.id}
                    className={`py-[1.1vw] px-[1.5vw] text-[0.95vw] font-bold ${
                      f.id === 'natural' ? 'text-beige font-semibold' : 'text-background'
                    }`}
                  >
                    {f[row.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Comparison Cards */}
      <div className="md:hidden flex flex-col gap-4 w-full relative z-20">
        {FLAVOURS.map((flavour) => (
          <div
            key={flavour.id}
            className="p-4 rounded-2xl border border-background/15 bg-background/5 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-background/10 pb-2.5">
              <span className="font-khand font-bold text-xl uppercase tracking-wider text-background">
                {flavour.name}
              </span>
              <span className="text-[11px] font-bold text-beige uppercase px-2.5 py-0.5 rounded-full border border-beige/25 bg-beige/10">
                {flavour.servingSize}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <div className="flex justify-between items-center p-2 rounded-md bg-background/5 border border-background/10">
                <span className="text-background/65 font-medium">Calories</span>
                <span className="font-bold text-background/90">{flavour.calories}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-background/5 border border-background/10">
                <span className="text-background/65 font-medium">Sugar</span>
                <span className="font-bold text-beige">{flavour.sugar}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-background/5 border border-background/10">
                <span className="text-background/65 font-medium">Potassium</span>
                <span className="font-bold text-beige">{flavour.potassium}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-background/5 border border-background/10">
                <span className="text-background/65 font-medium">Vitamin C</span>
                <span className="font-bold text-background/90">{flavour.vitC}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Scalloped Border Divider */}
      <div className="absolute bottom-0 left-0 translate-y-[50%] w-full h-fit pointer-events-none z-10">
        <div className="h-fit w-full overflow-hidden flex items-center justify-center relative z-9">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="size-[calc(100vw/5.5)] rounded-full bg-foreground shrink-0" />
          ))}
        </div>
      </div>
    </section>
  );
}
