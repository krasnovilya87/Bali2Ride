import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, FileCheck, AlertCircle, ChevronRight, Gavel, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ isOpen, onClose }) => {
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
                   <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-black text-foreground">Terms of Service</h2>
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
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">1. Acceptance of Terms</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  By accessing and using this website (the "Platform"), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the Platform.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">2. Nature of the Service</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  The Platform acts as an intermediary connecting users ("Renters") with bike owners ("Owners"). The Platform facilitates the booking process but is not a party to the actual rental agreement between the Renter and the Owner.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">3. Technical Condition</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Owner’s Responsibility", desc: "The Owner is solely responsible for ensuring that the bike is in good working order and complies with regulations." },
                    { title: "Pre-Rental Inspection", desc: "Renters are encouraged to inspect the vehicle. Defects must be reported immediately." },
                    { title: "Maintenance", desc: "The Platform is not liable for mechanical failures or injuries resulting from technical states." }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <h4 className="text-foreground font-bold text-sm mb-1">{item.title}</h4>
                      <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <Gavel className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">4. Damages and Disputes</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { title: "Direct Settlement", desc: "Owners and Renters resolve damage issues directly between themselves." },
                    { title: "Platform’s Role", desc: "We provide infrastructure but no insurance and act as no arbitrator." },
                    { title: "Liability", desc: "Compensation must be settled without Platform involvement." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                      <div>
                        <span className="text-foreground font-bold text-sm block">{item.title}</span>
                        <span className="text-muted text-xs leading-relaxed">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">5. Cancellations</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  Cancellations made more than 48 hours before the rental starts are eligible for a full refund. Within 24-48 hours, partial service fees may apply. Platform fees may be non-refundable.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">6. User Conduct</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Valid License Required', 'Obey Traffic Laws', 'Helmet is Mandatory'].map((text, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-center text-[10px] text-muted font-black uppercase tracking-wider">
                      {text}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">7. Limitation of Liability</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed italic">
                  "The Platform shall not be held liable for any damages, injuries, or loss of life resulting from vehicle use. All risks are assumed by the Renter and Owner."
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 bg-white/[0.02] border-t border-white/5 space-y-4">
              <button 
                onClick={onClose}
                className="w-full h-12 bg-white text-black rounded-xl font-display font-black text-sm hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                Accept & Close
              </button>
              
              <div className="flex flex-col items-center gap-3 pt-2">
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
