import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

const REVIEWS = [
  {
    name: 'Александр',
    role: 'Цифровой кочевник',
    text: 'Лучший сервис на Бали. Байк доставили прямо к вилле в Чангу. Vario была в идеальном техническом состоянии.',
    avatar: 'https://i.pravatar.cc/150?u=a1'
  },
  {
    name: 'Мария',
    role: 'Путешественница',
    text: 'Брала Веспу для фотосессии и поездок. Очень вежливый персонал, помогли с выбором и объяснили все нюансы вождения.',
    avatar: 'https://i.pravatar.cc/150?u=a2'
  },
  {
    name: 'Дмитрий',
    role: 'Фрилансер',
    text: 'Пользуюсь услугами BaliMoto уже полгода. Всегда на связи, если случается прокол колеса — приезжают и чинят за 20 минут.',
    avatar: 'https://i.pravatar.cc/150?u=a3'
  }
];

export const Testimonials = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs block mb-2">{t.testimonials.subtitle}</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter">{t.testimonials.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-surface p-8 rounded-[32px] border border-border relative group"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5 group-hover:text-primary/10 transition-colors" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg text-muted mb-8 italic leading-relaxed">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full grayscale" />
                <div>
                  <p className="font-bold">{review.name}</p>
                  <p className="text-xs text-muted uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
