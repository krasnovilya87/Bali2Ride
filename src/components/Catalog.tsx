import React, { useState } from 'react';
import { BIKES } from '../constants';
import { BikeType } from '../types';
import { BikeCard } from './BikeCard';
import { motion, LayoutGroup, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../LanguageContext';

export const Catalog = () => {
  const [activeType, setActiveType] = useState<BikeType>('all');
  const { t } = useLanguage();

  const filteredBikes = activeType === 'all' 
    ? BIKES 
    : BIKES.filter(bike => bike.type === activeType);

  const categories: { label: string; value: BikeType }[] = [
    { label: t.catalog.all, value: 'all' },
    { label: t.catalog.scooters, value: 'scooter' },
    { label: t.catalog.enduro, value: 'adventure' },
    { label: t.catalog.sport, value: 'sport' },
    { label: t.catalog.cruisers, value: 'cruiser' },
  ];

  return (
    <section id="catalog" className="py-12 px-4 md:px-6 bg-background">
      <div className="max-w-7xl mx-auto">

        <LayoutGroup>
          <motion.div 
            layout
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 min-h-[600px]"
          >
            <AnimatePresence mode='popLayout'>
              {filteredBikes.map((bike) => (
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
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

      </div>
    </section>
  );
};

