import React from 'react';
import { Bike, Instagram, MessageCircle, Mail, MapPin, Phone, Send, MessageSquareText } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Footer = ({ onAdminClick, onPrivacyClick, onTermsClick }: { onAdminClick?: () => void, onPrivacyClick?: () => void, onTermsClick?: () => void }) => {
  const { t } = useLanguage();

  return (
    <footer className="pt-8 pb-4 px-4 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-2">
        <div className="text-center">
          <button 
            onClick={onAdminClick}
            className="text-[8px] text-muted uppercase tracking-[0.2em] mb-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            {t.footer.desc}
          </button>
          <p className="text-[7px] text-muted uppercase tracking-widest opacity-30">
            © {new Date().getFullYear()} CocoDrive. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onPrivacyClick}
            className="text-[8px] text-muted uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4"
          >
            Privacy Policy
          </button>
          <span className="text-[8px] text-muted/30">•</span>
          <button 
            onClick={onTermsClick}
            className="text-[8px] text-muted uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
};

