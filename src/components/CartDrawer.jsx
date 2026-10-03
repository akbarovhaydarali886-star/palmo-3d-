import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    lines,
    count,
    subtotal,
    shipping,
    total,
    freeShippingGap,
    freeShippingProgress,
    isOpen,
    closeCart,
    setQty,
    remove,
    clear,
    checkoutModalOpen,
    setCheckoutModalOpen,
  } = useCart();

  const backdropRef = useRef(null);
  const asideRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);
  const footerRef = useRef(null);
  const modalRef = useRef(null);

  // Drawer GSAP Transition
  useEffect(() => {
    if (!asideRef.current || !backdropRef.current) return;

    if (isOpen) {
      const tl = gsap.timeline();
      tl.set([backdropRef.current, asideRef.current], { autoAlpha: 1, pointerEvents: 'auto' })
        .fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0)
        .fromTo(
          asideRef.current,
          { clipPath: 'ellipse(0% 65% at 105% 50%)' },
          { clipPath: 'ellipse(150% 120% at 105% 50%)', duration: 1.15, ease: 'power3.inOut' },
          0
        )
        .fromTo(
          [headerRef.current, listRef.current, footerRef.current].filter(Boolean),
          { x: 28, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out', stagger: 0.07 },
          0.42
        );
    } else {
      const tl = gsap.timeline();
      tl.to(
        asideRef.current,
        { clipPath: 'ellipse(0% 65% at 105% 50%)', duration: 0.9, ease: 'power3.inOut' },
        0
      )
        .to(backdropRef.current, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.2)
        .set([asideRef.current, backdropRef.current], { autoAlpha: 0, pointerEvents: 'none' });
    }
  }, [isOpen]);

  // Checkout Concept Modal GSAP Transition
  useEffect(() => {
    if (!modalRef.current) return;

    if (checkoutModalOpen) {
      const items = modalRef.current.querySelectorAll('[data-note-item]');
      const tl = gsap.timeline();
      tl.set(modalRef.current, { autoAlpha: 1, pointerEvents: 'auto' })
        .fromTo(
          modalRef.current,
          { clipPath: 'ellipse(0% 0% at 50% 108%)' },
          { clipPath: 'ellipse(160% 160% at 50% 108%)', duration: 0.75, ease: 'power3.inOut' },
          0
        )
        .fromTo(
          items,
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08 },
          0.28
        );
    } else {
      const tl = gsap.timeline();
      tl.to(modalRef.current, {
        clipPath: 'ellipse(0% 0% at 50% 108%)',
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(modalRef.current, { autoAlpha: 0, pointerEvents: 'none' });
        },
      });
    }
  }, [checkoutModalOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        aria-hidden={!isOpen}
        onClick={closeCart}
        style={{ opacity: 0, visibility: 'hidden' }}
        className="fixed inset-0 z-800 bg-foreground/50 backdrop-blur-sm pointer-events-none will-change-[opacity]"
      />

      {/* Drawer with Palmo signature ellipse clipPath */}
      <aside
        ref={asideRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        style={{
          clipPath: 'ellipse(0% 65% at 105% 50%)',
          visibility: 'hidden',
        }}
        className="fixed right-0 top-0 z-900 h-full w-[32vw] max-md:w-full border-l border-light-beige/20 bg-foreground text-light-beige pointer-events-none will-change-[clip-path]"
      >
        {/* Palm Background Leaves */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden text-light-beige/10" aria-hidden="true">
          <span className="absolute right-[-4vw] top-[-3vw] size-[16vw] max-md:size-[40vw] -rotate-30">
            <svg viewBox="0 0 554 588" fill="currentColor" className="size-full">
              <path d="M276.9 249.322L245.035 358.522L218.104 349.667L239.372 377.927L200.966 509.509 C167.804 469.088 154.52 411.898 170.563 356.94C186.604 301.952 228.007 262.772 276.9 249.322Z M103.415 207.766C157.405 181.329 218.871 187.303 273.502 218.22L111.253 297.676L93.7865 257.119 L90.1138 308.033L2.44079e-05 352.169C13.6111 287.814 49.4243 234.204 103.415 207.766Z M208.565 116.324L163.197 142.072L124.48 120.504L144.267 80.4888L98.9187 106.247L18.5067 61.4334 C67.6015 24.6383 133.909 17.6759 190.768 49.3588C247.628 81.052 279.895 142.964 279.238 206.757 L188.778 156.327L208.565 116.324Z M396.393 62.3739L422.723 91.8752L302.498 212.828C288.192 156.793 303.813 92.8834 347.994 48.4469 C392.172 4.00119 453.144 -9.11952 505.07 9.05494L442.601 71.8976L396.393 62.3739Z" />
            </svg>
          </span>
          <span className="absolute left-[-3vw] bottom-[18vh] size-[13vw] max-md:size-[34vw] rotate-20">
            <svg viewBox="0 0 315 260" fill="currentColor" className="size-full">
              <path d="M313.516 61.4066C289.704 41.2566 265.91 21.0866 242.095 0.940556C240.814 -0.143444 239.329 -0.200443 238.097 0.314557C203.502 6.10156 168.075 5.42056 133.427 0.408558C132.154 -0.156442 130.602 0.0215541 129.479 0.749554C128.95 0.758554 128.395 0.880555 127.831 1.15056C91.0899 18.7016 54.3489 36.2516 17.6079 53.8026" />
            </svg>
          </span>
        </div>

        <div className="relative z-10 flex h-full flex-col">
          {/* Header */}
          <header
            ref={headerRef}
            className="relative z-10 flex shrink-0 items-start justify-between px-[2vw] pt-[2.2vw] pb-[1.2vw] max-md:px-6 max-md:pt-8 max-md:pb-4 border-b border-light-beige/10"
          >
            <div>
              <p className="text150 leading-none" style={{ fontSize: 'min(3.4vw, 5vh)' }}>
                Basket
              </p>
              <p className="text32 font-patrick-hand text-beige/80 tabular-nums">
                {lines.length === 0 ? 'Nothing poured yet' : `${count} ${count === 1 ? 'pack' : 'packs'} in basket`}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close basket"
              onClick={closeCart}
              className="group flex size-[2.4vw] max-md:size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-light-beige/30 transition-all duration-300 hover:bg-light-beige hover:text-foreground active:scale-90"
            >
              <div className="size-[1.1vw] max-md:size-4 rotate-45 transition-transform duration-500 group-hover:rotate-135">
                <svg className="h-full w-full object-contain" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </button>
          </header>

          {/* Free Shipping Progress */}
          {lines.length > 0 && (
            <div className="px-[2vw] py-[1vw] max-md:px-6 max-md:py-3 bg-foreground/50 border-b border-light-beige/10">
              <p className="font-patrick-hand text-beige tabular-nums" style={{ fontSize: 'min(0.95rem, 2.2vh)' }}>
                {freeShippingGap > 0
                  ? `$${freeShippingGap.toFixed(2)} away from free shipping`
                  : '🎉 Free shipping unlocked!'}
              </p>
              <div className="mt-[0.5vw] max-md:mt-2 h-[0.35vw] max-md:h-1.5 w-full overflow-hidden rounded-full bg-light-beige/15">
                <span
                  className="block h-full rounded-full bg-beige transition-[width] duration-700 ease-out"
                  style={{ width: `${freeShippingProgress * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div ref={listRef} className="relative z-10 flex-1 overflow-y-auto px-[2vw] max-md:px-6 py-4">
            {lines.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-[0.8vw] max-md:gap-3 text-center">
                <span className="size-[7vw] max-md:size-24 opacity-40">
                  <svg viewBox="0 0 315 260" fill="none" className="size-full">
                    <path
                      d="M313.516 61.4066C289.704 41.2566 265.91 21.0866 242.095 0.940556C240.814 -0.143444 239.329 -0.200443 238.097 0.314557C203.502 6.10156 168.075 5.42056 133.427 0.408558C132.154 -0.156442 130.602 0.0215541 129.479 0.749554C128.95 0.758554 128.395 0.880555 127.831 1.15056"
                      stroke="#FFE386"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <p className="text36 font-patrick-hand text-light-beige/70">Your basket is thirsty.</p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="text32 cursor-pointer font-patrick-hand text-beige underline underline-offset-4 transition-opacity duration-300 hover:opacity-70"
                >
                  Go pick a flavour
                </button>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-light-beige/10 bg-light-beige/5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="size-12 rounded-md flex items-center justify-center shrink-0 border border-light-beige/20"
                        style={{ backgroundColor: line.flavour.color }}
                      >
                        <span className="text-xl">🥥</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-khand font-bold text-lg leading-tight truncate text-light-beige">
                          {line.flavour.name}
                        </p>
                        <p className="font-patrick-hand text-xs text-beige/80">
                          {line.pack.label} • {line.pack.cans} cans
                        </p>
                        <p className="font-patrick-hand text-sm text-beige font-semibold">
                          ${line.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQty(line.id, line.qty - 1)}
                        className="size-7 rounded border border-light-beige/30 flex items-center justify-center font-bold text-sm hover:bg-light-beige hover:text-foreground transition-colors"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-khand font-bold text-sm tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.id, line.qty + 1)}
                        className="size-7 rounded border border-light-beige/30 flex items-center justify-center font-bold text-sm hover:bg-light-beige hover:text-foreground transition-colors"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(line.id)}
                        className="text-xs text-light-beige/50 hover:text-red-400 ml-1 transition-colors"
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {lines.length > 0 && (
            <footer
              ref={footerRef}
              className="relative z-10 shrink-0 border-t border-light-beige/15 px-[2vw] pb-[2vw] pt-[1.2vw] max-md:px-6 max-md:pb-8 max-md:pt-4 bg-foreground"
            >
              <div className="space-y-1 mb-2">
                <div className="flex items-baseline justify-between">
                  <p className="text32 font-patrick-hand">Subtotal</p>
                  <p className="text32 font-patrick-hand tabular-nums">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex items-baseline justify-between text-light-beige/60">
                  <p className="text32 font-patrick-hand">Shipping</p>
                  <p className="text32 font-patrick-hand tabular-nums">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </p>
                </div>
                <div className="my-[0.8vw] max-md:my-3 h-px w-full bg-light-beige/15" />
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text36 font-patrick-hand">Total</p>
                <span className="tabular-nums text150" style={{ fontSize: 'min(2.4vw, 4vh)' }}>
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCheckoutModalOpen(true)}
                className="mt-[1vw] max-md:mt-4 w-full cursor-pointer rounded-md bg-beige py-[0.8vw] max-md:py-3.5 text36 font-patrick-hand text-foreground transition-all duration-300 hover:bg-light-beige hover:-translate-y-px active:translate-y-0 active:scale-[0.98] font-bold shadow-lg"
              >
                Checkout
              </button>

              <button
                type="button"
                onClick={clear}
                className="mt-[0.5vw] max-md:mt-2 w-full cursor-pointer font-patrick-hand text-light-beige/50 transition-colors duration-300 hover:text-light-beige text-center block"
                style={{ fontSize: 'min(0.9rem, 2vh)' }}
              >
                Empty the basket
              </button>
            </footer>
          )}
        </div>

        {/* Concept Disclaimer Modal ("No till at the end") with Ellipse ClipPath */}
        <div
          ref={modalRef}
          role="alertdialog"
          aria-modal="true"
          aria-label="About checkout"
          style={{
            clipPath: 'ellipse(0% 0% at 50% 108%)',
            visibility: 'hidden',
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-[1.1vw] max-md:gap-5 bg-foreground px-[3vw] max-md:px-8 text-center text-light-beige pointer-events-none will-change-[clip-path]"
        >
          <span data-note-item="true" className="size-[4.5vw] max-md:size-16 text-beige">
            <svg className="size-full" viewBox="0 0 164 164" fill="none">
              <circle cx="82" cy="82" r="70" fill="#FFE386" fillOpacity="0.9" />
              <path
                d="M55 85 L75 105 L115 65"
                stroke="#463721"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p data-note-item="true" className="text150 leading-none text-beige" style={{ fontSize: 'min(3vw, 4.5vh)' }}>
            No till at the end
          </p>
          <p
            data-note-item="true"
            className="text32 max-w-[24vw] max-md:max-w-none font-patrick-hand text-light-beige/80"
            style={{ fontSize: 'min(1.1rem, 2.2vh)' }}
          >
            Palmo is a concept piece — the shop front is real, the shop is not. Nothing was charged and nothing is on its way. Your basket stays exactly where you left it.
          </p>
          <button
            data-note-item="true"
            type="button"
            onClick={() => setCheckoutModalOpen(false)}
            className="mt-[0.6vw] max-md:mt-2 cursor-pointer rounded-md bg-beige px-[1.6vw] py-[0.7vw] max-md:px-8 max-md:py-3 text36 font-patrick-hand text-foreground hover:bg-light-beige hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all shadow-md font-bold"
          >
            Back to the basket
          </button>
        </div>
      </aside>
    </>
  );
}
