import React, { useState, useEffect } from 'react';
import { Bike, BikeType } from '../types';
import { BikeCard } from './BikeCard';
import { motion, LayoutGroup, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../LanguageContext';
import { getBikes, subscribeToBikes } from '../services/dataService';

export const Catalog = () => {
  const [activeType, setActiveType] = useState<BikeType>('all');
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Initial fetch to show immediate data if available
    const initialLoad = async () => {
      try {
        const data = await getBikes();
        if (data.length > 0) {
          setBikes(data);
          setLoading(false);
        }
      } catch (e) {}
    };
    initialLoad();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToBikes((updatedBikes) => {
      setBikes(updatedBikes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredBikes = (bikes || []).filter(bike => {
    if (activeType === 'all') return true;
    const bikeTypes = Array.isArray(bike.type) ? bike.type : [bike.type];
    return bikeTypes.includes(activeType);
  });

  const availableTypes = Array.from(new Set(bikes.flatMap(b => Array.isArray(b.type) ? b.type : [b.type]))).filter(Boolean) as string[];
  
  const categories: { label: string; value: string }[] = [
    { label: 'All', value: 'all' },
    ...availableTypes.map(type => ({ label: type as string, value: type as string }))
  ];

  return (
    <section id="catalog" className="py-12 px-4 md:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        
        {/* Filter UI */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 mb-6 md:mb-12 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveType(cat.value)}
                className={cn(
                  "px-2.5 md:px-6 py-1.5 md:py-2.5 rounded-full text-[10px] md:text-sm font-bold transition-all border whitespace-nowrap",
                  activeType === cat.value 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                    : "bg-surface border-border text-muted hover:text-foreground hover:border-foreground/20"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        <LayoutGroup>
          <motion.div 
            layout
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 min-h-[600px]"
          >
            <AnimatePresence mode='popLayout'>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="aspect-[4/5] bg-surface/50 animate-pulse rounded-[32px] border border-border"
                  />
                ))
              ) : filteredBikes.length > 0 ? (
                filteredBikes.map((bike) => (
                  <motion.div
                    key={bike.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BikeCard bike={bike} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-muted">
                  No bikes found
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

      </div>
    </section>
  );
};

