import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Shield, Zap } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=1920&auto=format&fit=crop"
          alt="Bali Beach"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-3xl sm:text-6xl md:text-8xl font-display font-bold leading-[1.1] mb-6 uppercase tracking-tighter">
            {t.hero.title1} <br />
            <span className="text-primary">{t.hero.title2}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed font-light">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-primary text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(242,125,38,0.3)] transform hover:-translate-y-1">
              {t.hero.btnCatalog}
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-10 py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all transform hover:-translate-y-1">
              {t.hero.btnTerms}
            </button>
          </div>
        </motion.div>

        {/* Stats / Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="bg-primary/20 p-3 rounded-xl">
              <MapPin className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight">{t.hero.freeDelivery}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">{t.hero.deliverySub}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="bg-primary/20 p-3 rounded-xl">
              <Shield className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight">{t.hero.insurance}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">{t.hero.insuranceSub}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="bg-primary/20 p-3 rounded-xl">
              <Zap className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight">{t.hero.support}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">{t.hero.supportSub}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative arrow */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
      >
        <div className="w-px h-12 bg-white" />
      </motion.div>
    </section>
  );
};

