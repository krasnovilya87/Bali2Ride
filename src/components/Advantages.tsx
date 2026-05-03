import React from 'react';
import { Tag, Truck } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Advantages = () => {
  const { language } = useLanguage();
  
  const content = {
    ru: { discount: 'Скидка на долгий срок', delivery: '24/7 Доставка' },
    en: { discount: 'Long-term discount', delivery: '24/7 Delivery' },
    id: { discount: 'Diskon jangka panjang', delivery: '24/7 Pengiriman' },
    zh: { discount: '长期折扣', delivery: '24/7 送货' },
    de: { discount: 'Langzeitrabatt', delivery: '24/7 Lieferung' },
  };

  const active = content[language] || content.en;

  return (
    <div className="bg-surface border-b border-border py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-center gap-8 md:gap-16">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Tag className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-bold uppercase tracking-tight">{active.discount}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-bold uppercase tracking-tight">{active.delivery}</span>
        </div>
      </div>
    </div>
  );
};
