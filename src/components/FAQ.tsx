import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, ChevronRight, MessageCircle, CreditCard, Shield, MapPin, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ isOpen, onClose }) => {
  const categories = [
    {
      title: "General Questions",
      icon: <HelpCircle className="w-4 h-4" />,
      questions: [
        {
          q: "How does Bali Rent Bike work?",
          a: "We are a booking platform (aggregator) that connects you with reliable local bike owners and rental agencies. We find the best deals, verify the bikes, and help you secure your booking so you don't have to waste time searching on the street."
        },
        {
          q: "Do I need an International Driving Permit (IDP)?",
          a: "Yes. To ride legally in Bali, you must have a valid motorcycle license from your home country and an International Driving Permit (Category A). Riding without it can lead to fines or issues with your travel insurance."
        },
        {
          q: "What is included in the rental price?",
          a: "Usually, the price includes: two helmets, raincoat (upon request), delivery to your hotel or airport (check the specific bike's terms), and basic maintenance support."
        }
      ]
    },
    {
      title: "Booking & Payment",
      icon: <CreditCard className="w-4 h-4" />,
      questions: [
        {
          q: "Why do I need to pay a commitment deposit?",
          a: "The deposit is used to 'lock' the bike in the owner's calendar. Since we work with independent owners, this ensures the bike won't be rented out to someone else before you arrive."
        },
        {
          q: "How can I pay?",
          a: "We support several convenient methods: QRIS (local standard for instant digital payments), Bank Transfer (to a local Indonesian account), and Cash (for the remaining balance upon delivery)."
        },
        {
          q: "Is my booking confirmed immediately?",
          a: "All bookings are 'On Request.' Once you submit a request, we contact the owner to confirm availability. You will receive a confirmation message via WhatsApp/Email within 30–60 minutes."
        }
      ]
    },
    {
      title: "On the Road (Safety & Liability)",
      icon: <Shield className="w-4 h-4" />,
      questions: [
        {
          q: "What happens if the bike breaks down?",
          a: "Contact us or the owner immediately via WhatsApp. The owner is responsible for technical maintenance. They will either send a mechanic to your location or replace the bike if it cannot be fixed quickly."
        },
        {
          q: "What should I do in case of an accident?",
          a: "Stay calm and contact the owner. Please note that the customer is responsible for any damage to the bike or third-party property during the rental period. We highly recommend having comprehensive travel insurance that covers motorcycle riding."
        },
        {
          q: "Who is responsible for the bike's condition?",
          a: "The direct owner (rental agency) is responsible for the bike's safety and maintenance. Bali Rent Bike acts as an intermediary to help you find and book the vehicle, but the final rental agreement is between you and the owner."
        }
      ]
    },
    {
      title: "Delivery & Returns",
      icon: <MapPin className="w-4 h-4" />,
      questions: [
        {
          q: "Can you deliver the bike to the airport?",
          a: "Yes, most of our partners offer airport delivery. Please provide your flight number and arrival time during booking so the agent can meet you at the terminal."
        },
        {
          q: "Can I return the bike in a different location?",
          a: "This depends on the owner's policy. Some allow 'One-Way' rentals (e.g., pick up in Canggu, drop off in Ubud) for an extra fee. Please check this with us before confirming your booking."
        }
      ]
    }
  ];

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
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-black text-foreground">FAQ</h2>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mt-0.5">Frequently Asked Questions</p>
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
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-10">
              {categories.map((category, catIdx) => (
                <section key={catIdx} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-display font-bold text-foreground">{category.title}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {category.questions.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors group">
                        <div className="flex gap-3">
                          <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <h4 className="text-sm font-bold text-foreground leading-snug">{q.q}</h4>
                        </div>
                        <p className="text-muted text-xs leading-relaxed pl-7">
                          {q.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
              
              {/* Contact Help */}
              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-foreground font-bold text-sm">Still have questions?</h4>
                  <p className="text-muted text-xs">Our team is here to help you via WhatsApp.</p>
                </div>
                <a 
                  href="https://wa.me/6281236335108"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with us
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <button 
                onClick={onClose}
                className="w-full h-12 bg-white text-black rounded-xl font-display font-black text-sm hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
