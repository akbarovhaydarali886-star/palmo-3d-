import React, { useState } from 'react';

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-[1.2vw] max-md:bottom-4 left-1/2 -translate-x-1/2 z-[850] pointer-events-auto">
      <div className="flex items-center gap-[0.8vw] max-md:gap-2.5 rounded-lg border border-[#e8dcc4] bg-[#FFF8EE]/95 px-[1vw] py-[0.5vw] max-md:px-3 max-md:py-2 shadow-xl backdrop-blur-md text-[#463721]">
        {/* Cookie Icon */}
        <span className="flex size-[1.8vw] max-md:size-6 items-center justify-center rounded-full bg-[#FFE386] text-[1.1vw] max-md:text-sm shrink-0">
          🍪
        </span>

        {/* Text */}
        <p className="font-sans text-[0.85vw] max-md:text-xs font-medium text-[#463721]/90 whitespace-nowrap">
          We use cookies to improve your experience.
        </p>

        {/* Later button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="font-patrick-hand text-[0.85vw] max-md:text-xs uppercase tracking-wider text-[#463721]/60 hover:text-[#463721] px-[0.4vw] max-md:px-1.5 transition-colors cursor-pointer"
        >
          LATER
        </button>

        {/* Okay button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-md bg-[#FFE386] hover:bg-[#FED85B] px-[0.8vw] py-[0.25vw] max-md:px-2.5 max-md:py-1 font-patrick-hand text-[0.9vw] max-md:text-xs font-bold text-[#463721] uppercase tracking-wider transition-colors shadow-xs cursor-pointer active:scale-95"
        >
          OKAY!
        </button>
      </div>
    </div>
  );
}
