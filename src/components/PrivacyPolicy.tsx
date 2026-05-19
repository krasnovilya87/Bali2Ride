import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-black text-foreground">Privacy Policy</h2>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mt-0.5">Last Updated: 01.05.2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link 
                  to="/"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-[10px] font-bold uppercase tracking-widest text-muted"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Home
                </Link>
                <button 
                  onClick={onClose}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 active:scale-95"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">1. Introduction</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  Welcome to CocoDrive ("Company", "we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (the "Site").
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">2. Information We Collect</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-muted text-sm leading-relaxed">We may collect and process the following types of information:</p>
                  <ul className="space-y-2">
                    {[
                      { title: 'Personal Identification Information', desc: 'Name, email address, phone number, and billing/shipping address.' },
                      { title: 'Technical Data', desc: 'IP address, browser type, device information, and operating system.' },
                      { title: 'Usage Data', desc: 'Information about how you use our Site, products, and services.' },
                      { title: 'Transaction Data', desc: 'Details about payments to and from you (though we do not store full credit card numbers; these are handled by secure third-party processors).' }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 group">
                        <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="text-foreground font-bold text-sm block">{item.title}</span>
                          <span className="text-muted text-xs leading-relaxed">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">3. How We Use Your Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Process and manage bookings',
                    'Provide customer support',
                    'Send administrative information',
                    'Improve Site functionality',
                    'Legal compliance and fraud prevention'
                  ].map((text, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-muted font-medium">
                      {text}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">4. GDPR Compliance</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  If you are located in the European Economic Area (EEA), our legal basis for collecting and using your data depends on the context: Consent, Contract, or Legal Obligation.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">5. Data Sharing</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  We do not sell or rent your personal data to third parties. We may share your information with Service Providers or Legal Authorities if required by law.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">6. Cookies</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  We use cookies to track activity on our Site and hold certain information. You can instruct your browser to refuse all cookies.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">7. Security</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal data. However, no method of transmission is 100% secure.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">8. Your Rights</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  You have the right to access, update, or delete the information we have on you, right of rectification, and right to object to or restrict processing.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 bg-white/[0.02] border-t border-white/5 space-y-8">
              <button 
                onClick={onClose}
                className="w-full h-12 bg-white text-black rounded-xl font-display font-black text-sm hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                Accept & Close
              </button>
              
              <div className="flex flex-col items-center gap-6 pt-4">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                  <Link to="/faq" className="text-[9px] text-muted uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4">FAQ</Link>
                  <span className="text-[9px] text-muted/20">•</span>
                  <a href="/privacy.html" className="text-[9px] text-muted uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4">Privacy Policy</a>
                  <span className="text-[9px] text-muted/20">•</span>
                  <a href="/terms.html" className="text-[9px] text-muted uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4">Terms of Service</a>
                  <span className="text-[9px] text-muted/20">•</span>
                  <a href="/data-deletion.html" className="text-[9px] text-muted uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4">Data Deletion</a>
                </div>
                <p className="text-[8px] text-muted uppercase tracking-[0.3em] opacity-30">
                  © {new Date().getFullYear()} CocoDrive. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
