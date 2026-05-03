import React from 'react';
import { Bike } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { useRental } from '../RentalContext';
import { IDR_TO_USD } from '../constants';

interface BikeCardProps {
  bike: Bike;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike }) => {
  const { t } = useLanguage();
  const { days, setSelectedBike } = useRental();

  const getDiscountPercent = (d: number) => {
    if (d >= 30) return 25;
    if (d >= 7) return 15;
    if (d >= 1) return 8;
    return 0;
  };

  const discountPercent = getDiscountPercent(days);
  const currentPrice = Math.round(bike.pricePerDay * (1 - discountPercent / 100));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const getUSD = (price: number) => {
    return `~$${Math.round(price / IDR_TO_USD)}`;
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={() => setSelectedBike(bike)}
      className="group bg-surface rounded-2xl md:rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all flex flex-col cursor-pointer"
    >
      <div className="relative aspect-square md:aspect-[4/3] overflow-hidden">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="p-3 md:p-6 flex-grow flex flex-col">
        <h3 className="text-sm md:text-xl font-display font-bold mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {bike.name}
        </h3>

        <div className="hidden md:flex flex-col space-y-3 mb-8">
          {bike.features.slice(0, 2).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-muted">
              <div className="w-1 h-1 rounded-full bg-primary" />
              {feature}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-3 md:pt-6 border-t border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="hidden md:block text-[10px] text-muted uppercase tracking-widest font-bold">{t.catalog.perDay}</span>
            <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPrice}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm md:text-xl font-display font-bold whitespace-nowrap text-foreground flex items-baseline gap-1.5">
                      {formatPrice(currentPrice)}
                      <span className="text-[8px] md:text-xs text-muted font-normal uppercase">IDR</span>
                      <span className="text-[10px] md:text-xs text-muted font-medium opacity-70">
                        {getUSD(currentPrice)}
                      </span>
                    </span>
                  </div>
                  {discountPercent > 0 && (
                     <div className="flex items-center gap-1.5 md:gap-2">
                       <span className="text-[10px] md:text-xs text-muted line-through opacity-50">
                          {formatPrice(bike.pricePerDay)} IDR
                       </span>
                       <span className="text-[10px] md:text-xs font-bold text-red-500">
                          -{discountPercent}%
                       </span>
                     </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
