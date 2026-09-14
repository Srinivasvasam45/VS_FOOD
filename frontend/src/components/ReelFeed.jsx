import React, { useState, useEffect, useRef } from 'react';
import ReelCard from './ReelCard';
import LoadingSpinner from './LoadingSpinner';
import { Utensils, RefreshCw, Flame, Sparkles } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center min-h-[620px]">
        <LoadingSpinner size="lg" message="Loading mouth-watering food reels..." />
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 rounded-3xl glass-card max-w-md mx-auto my-8 border border-white/10 shadow-glass-lg animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-neon-rose mb-4 shadow-neon-rose">
          <Flame size={32} />
        </div>
        <h3 className="text-xl font-black text-white mb-2 tracking-tight">
          No Food Reels Found
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          No food videos match your current category or search filter. Try clearing your filters or check back soon!
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-neon-rose text-white text-xs font-black transition-all shadow-neon-rose active:scale-95"
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
        className="w-full max-w-[440px] h-[calc(100vh-5.5rem)] md:h-[800px] overflow-y-scroll snap-y-mandatory no-scrollbar rounded-none md:rounded-3xl border-0 md:border md:border-white/10 bg-cosmic-950 shadow-glass-lg relative"
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
