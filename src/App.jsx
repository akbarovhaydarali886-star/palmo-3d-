import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import CoconutHero from './components/CoconutHero';
import PureCoconutSection from './components/PureCoconutSection';
import ExploreFlavoursSection from './components/ExploreFlavoursSection';
import YouDeserveSection from './components/YouDeserveSection';
import SippersSaySection from './components/SippersSaySection';
import BoxOfHealth from './components/BoxOfHealth';
import NutritionalFacts from './components/NutritionalFacts';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import NotFoundView from './components/NotFoundView';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [show404, setShow404] = useState(false);

  React.useEffect(() => {
    const checkHash = () => {
      setShow404(window.location.hash === '#404');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  return (
    <CartProvider>
      <div className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-beige selection:text-foreground">
        {/* Initial Loader */}
        <Loader onLoaded={() => setLoaded(true)} />

        {/* Skip to Content for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:font-patrick-hand focus:text-beige focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold"
        >
          Skip to main content
        </a>

        {/* Navigation Bar */}
        <Navbar />

        {/* Basket Drawer */}
        <CartDrawer />

        {/* Main Content Sections */}
        <main id="main-content" className="flex-1 overflow-x-clip w-full relative">
          <CoconutHero />
          <PureCoconutSection />
          <ExploreFlavoursSection />
          <YouDeserveSection />
          <SippersSaySection />
          <BoxOfHealth />
          <NutritionalFacts />
          <Footer />
        </main>

        {/* Cookie Consent Floating Pill */}
        <CookieBanner />

        {/* 404 Easter Egg Page (from media_1791043000059.png) */}
        {show404 && (
          <NotFoundView
            onBack={() => {
              window.location.hash = '';
              setShow404(false);
            }}
          />
        )}
      </div>
    </CartProvider>
  );
}
