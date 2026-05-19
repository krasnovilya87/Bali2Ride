import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, MessageCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminContacts } from '../services/dataService';
import { AdminContacts } from '../types';

export const DataDeletion = () => {
  const [contacts, setContacts] = useState<AdminContacts | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const data = await getAdminContacts();
      setContacts(data);
    };
    fetchContacts();
    window.scrollTo(0, 0);
  }, []);

  const whatsappUrl = contacts?.whatsapp 
    ? `https://wa.me/${contacts.whatsapp.replace(/\D/g, '')}?text=Hello!%20I'd%20like%20to%20request%20data%20deletion%20for%20my%20account.`
    : "#";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
          </Link>
          <h1 className="text-xl font-display font-black">Data Deletion</h1>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 text-center"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-[24px] bg-red-500/10 flex items-center justify-center text-red-500">
              <Trash2 className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-black leading-tight">
              Request Data Deletion
            </h2>
            <p className="text-muted text-lg leading-relaxed max-w-md mx-auto">
              Contact us on WhatsApp to delete your data. We respect your privacy and will process your request within 24-48 hours.
            </p>
          </div>

          <div className="pt-8">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-display font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp Support
            </a>
          </div>

          <div className="pt-16 border-t border-border/50 text-left space-y-6">
            <h3 className="text-lg font-display font-bold">What data will be deleted?</h3>
            <ul className="space-y-4 text-muted text-sm">
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <span>Personal identification information (Name, Email, Phone number)</span>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <span>Booking history and preferences</span>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <span>Communication logs with our support team</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </main>

      <footer className="p-12 border-t border-border bg-surface/30">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link 
              to="/faq"
              className="text-[9px] text-muted uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4"
            >
              FAQ
            </Link>
            <span className="text-[9px] text-muted/20">•</span>
            <a 
              href="/privacy.html"
              className="text-[9px] text-muted uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4"
            >
              Privacy Policy
            </a>
            <span className="text-[9px] text-muted/20">•</span>
            <a 
              href="/terms.html"
              className="text-[9px] text-muted uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4"
            >
              Terms of Service
            </a>
            <span className="text-[9px] text-muted/20">•</span>
            <a 
              href="/data-deletion.html"
              className="text-[9px] text-muted uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-4"
            >
              Data Deletion
            </a>
          </div>
          <p className="text-[8px] text-muted uppercase tracking-[0.3em] opacity-30">
            © {new Date().getFullYear()} CocoDrive. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
