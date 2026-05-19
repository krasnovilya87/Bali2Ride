import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

export const Footer = ({ onAdminClick }: { onAdminClick?: () => void }) => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link 
            to="/faq"
            className="text-[8px] text-muted uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4"
          >
            FAQ
          </Link>
          <span className="text-[8px] text-muted/30">•</span>
          <a 
            href="/privacy.html"
            className="text-[8px] text-muted uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4"
          >
            Privacy Policy
          </a>
          <span className="text-[8px] text-muted/30">•</span>
          <a 
            href="/terms.html"
            className="text-[8px] text-muted uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4"
          >
            Terms of Service
          </a>
          <span className="text-[8px] text-muted/30">•</span>
          <a 
            href="/data-deletion.html"
            className="text-[8px] text-muted uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4"
          >
            Data Deletion
          </a>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={onAdminClick}
            className="text-[8px] text-muted uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity"
          >
            {t.footer.desc}
          </button>
          <p className="text-[7px] text-muted uppercase tracking-widest opacity-30">
            © {new Date().getFullYear()} CocoDrive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

