import React from 'react';
import { ShieldCheck, Headset, Truck, MousePointerClick, Tag, Wrench } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Advantages = () => {
  const { language } = useLanguage();
  
  const content = {
    ru: [
      { icon: ShieldCheck, text: 'Не старше 3 лет' },
      { icon: Headset, text: 'Техподдержка' },
      { icon: Truck, text: 'Бесплатная доставка' },
      { icon: MousePointerClick, text: 'Простое бронирование' },
      { icon: Tag, text: 'Честная цена' },
      { icon: Wrench, text: 'Хорошо обслужены' },
    ],
    en: [
      { icon: ShieldCheck, text: 'Under 3 years old' },
      { icon: Headset, text: 'Tech Support' },
      { icon: Truck, text: 'Free Delivery' },
      { icon: MousePointerClick, text: 'Easy Booking' },
      { icon: Tag, text: 'Fair Price' },
      { icon: Wrench, text: 'Well Maintained' },
    ],
    id: [
      { icon: ShieldCheck, text: 'Di bawah 3 tahun' },
      { icon: Headset, text: 'Dukungan Teknis' },
      { icon: Truck, text: 'Pengiriman Gratis' },
      { icon: MousePointerClick, text: 'Pemesanan Mudah' },
      { icon: Tag, text: 'Harga Jujur' },
      { icon: Wrench, text: 'Terawat Baik' },
    ],
    zh: [
      { icon: ShieldCheck, text: '3年内新车' },
      { icon: Headset, text: '技术支持' },
      { icon: Truck, text: '免费送货' },
      { icon: MousePointerClick, text: '预订简便' },
      { icon: Tag, text: '价格公开' },
      { icon: Wrench, text: '定期保养' },
    ],
    de: [
      { icon: ShieldCheck, text: 'Unter 3 Jahre alt' },
      { icon: Headset, text: 'Technischer Support' },
      { icon: Truck, text: 'Kostenlose Lieferung' },
      { icon: MousePointerClick, text: 'Einfache Buchung' },
      { icon: Tag, text: 'Fairer Preis' },
      { icon: Wrench, text: 'Gut gewartet' },
    ],
  };

  const activeItems = content[language as keyof typeof content] || content.en;

  return (
    <section className="py-6 bg-surface/50 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8">
          {activeItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <item.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight text-foreground/70 leading-tight max-w-[80px]">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
