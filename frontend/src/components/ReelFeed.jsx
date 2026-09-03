import React, { useState, useEffect, useRef } from 'react';
import ReelCard from './ReelCard';
import LoadingSpinner from './LoadingSpinner';
import { Utensils, RefreshCw } from 'lucide-react';

const ReelFeed = ({ foods = [], loading = false, onRefresh }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Setup Intersection Observer to detect the most visible reel
  useEffect(() => {
    if (!foods.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: [0.55, 0.75],
      }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [foods]);

  // Keyboard navigation for reels (Arrow Up / Arrow Down)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = Math.min(activeIndex + 1, foods.length - 1);
        itemRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(activeIndex - 1, 0);
        itemRefs.current[prevIndex]?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, foods.length]);

  if (loading && foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <LoadingSpinner size="lg" message="Loading mouth-watering food reels..." />
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-slate-900/40 rounded-3xl border border-slate-800/80 max-w-md mx-auto my-8">
        <div className="w-16 h-16 rounded-3xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4">
          <Utensils size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Food Reels Available</h3>
        <p className="text-sm text-slate-400 mb-6">
          No food videos match your current category or search filter. Try clearing your filters or check back soon!
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors shadow-lg shadow-brand-600/30"
          >
            <RefreshCw size={14} />
            <span>Refresh Reels</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center pb-12">
      {/* Centered Reel Container */}
      <div
        ref={containerRef}
        className="w-full max-w-[440px] h-[calc(100vh-4.5rem)] md:h-[800px] overflow-y-scroll snap-y-mandatory no-scrollbar rounded-none md:rounded-3xl border-0 md:border md:border-slate-800 bg-black shadow-2xl relative"
      >
        {foods.map((food, index) => (
          <div
            key={food._id}
            data-index={index}
            ref={(el) => (itemRefs.current[index] = el)}
            className="w-full h-full snap-start-always flex items-center justify-center shrink-0"
          >
            <ReelCard
              food={food}
              isActive={activeIndex === index}
              isMuted={isMuted}
              toggleMute={toggleMute}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelFeed;
