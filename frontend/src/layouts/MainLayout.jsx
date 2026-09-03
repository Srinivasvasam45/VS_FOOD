import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import CartDrawer from '../components/CartDrawer';
import ConflictModal from '../components/ConflictModal';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Viewport */}
      <main className="flex-1 pb-16 md:pb-0">
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
