import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import HeroSection from './components/HeroSection';
import FlavoursGrid from './components/FlavoursGrid';
import NutritionalFacts from './components/NutritionalFacts';
import BoxOfHealth from './components/BoxOfHealth';
import Footer from './components/Footer';

export default function App() {
  const [loaded, setLoaded] = useState(false);

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
          <HeroSection />
          <FlavoursGrid />
          <NutritionalFacts />
          <BoxOfHealth />
          <Footer />
        </main>
      </div>
    </CartProvider>
  );
}
