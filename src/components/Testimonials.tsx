import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

const REVIEWS = [
  {
    name: 'Alexander',
    role: 'Digital Nomad',
    text: 'The best service in Bali. The bike was delivered directly to my villa in Canggu. Vario was in perfect technical condition.',
    avatar: 'https://i.pravatar.cc/150?u=a1'
  },
  {
    name: 'Maria',
    role: 'Traveler',
    text: 'I took a Vespa for a photo shoot and trips. Very polite staff, helped with the choice and explained all the nuances of driving.',
    avatar: 'https://i.pravatar.cc/150?u=a2'
  },
  {
    name: 'Dmitry',
    role: 'Freelancer',
    text: 'I have been using the services for six months now. They are always in touch, if a flat tire happens - they come and fix it in 20 minutes.',
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
