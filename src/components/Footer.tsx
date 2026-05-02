import React from 'react';
import { Bike, Instagram, MessageCircle, Mail, MapPin, Phone, Send, MessageSquareText } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="pt-8 pb-4 px-4 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center">
          <p className="text-[8px] text-muted uppercase tracking-[0.2em] mb-2 opacity-50">
            {t.footer.desc}
          </p>
          <p className="text-[7px] text-muted uppercase tracking-widest opacity-30">
            © {new Date().getFullYear()} Bali2Ride. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

