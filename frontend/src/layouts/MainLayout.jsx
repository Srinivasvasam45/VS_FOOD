import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import CartDrawer from '../components/CartDrawer';
import ConflictModal from '../components/ConflictModal';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cosmic-950 text-slate-100 antialiased relative overflow-x-hidden">
      {/* Ambient Cosmic Background Lighting Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left cyber rose ambient glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-600/15 blur-[120px] animate-glow-pulse" />
        
        {/* Top-right electric indigo glow */}
        <div className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] rounded-full bg-neon-indigo/10 blur-[140px] animate-float-slow" />
        
        {/* Bottom-left neon cyan glow */}
        <div className="absolute bottom-10 left-1/4 w-[26rem] h-[26rem] rounded-full bg-neon-cyan/5 blur-[130px]" />
        
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top Floating Glass Navigation */}
      <Navbar />

      {/* Main Page Viewport */}
      <main className="flex-1 pb-20 md:pb-8 relative z-10">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Single Restaurant Conflict Prompt Modal */}
      <ConflictModal />
    </div>
  );
};

export default MainLayout;
