import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Send, Instagram } from 'lucide-react';
import { getAdminContacts } from '../services/dataService';
import { AdminContacts } from '../types';

export const QuickContact = () => {
  const [contacts, setContacts] = useState<AdminContacts | null>(null);

  useEffect(() => {
    getAdminContacts().then(setContacts);
  }, []);

  const contactItems = [
    {
      icon: <Phone className="w-5 h-5 md:w-6 md:h-6" />,
      href: contacts ? `tel:${contacts.phone.replace(/\s+/g, '')}` : "#",
      label: "Call"
    },
    {
      icon: <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />,
      href: contacts ? `https://wa.me/${contacts.whatsapp.replace(/\D/g, '')}?text=Hello!%20I'd%20like%20to%20book%20a%20bike` : "#",
      label: "WhatsApp"
    },
    {
      icon: <Send className="w-5 h-5 md:w-6 md:h-6" />,
      href: contacts?.telegram ? `https://t.me/${contacts.telegram.replace(/^@/, '')}?text=Hello!%20I'd%20like%20to%20book%20a%20bike` : "#",
      label: "Telegram"
    },
    {
      icon: <Instagram className="w-5 h-5 md:w-6 md:h-6" />,
      href: contacts?.instagram ? `https://instagram.com/${contacts.instagram.replace(/^@/, '')}` : "#",
      label: "Instagram"
    }
  ];

  if (!contacts) return null;

  return (
    <section className="py-6 bg-muted/10 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4 md:gap-6 justify-center">
          {contactItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface text-gray-700 flex items-center justify-center shadow-sm border border-border/50 hover:text-primary hover:border-primary/30 hover:scale-110 active:scale-95 transition-all duration-300"
              title={item.label}
              id={`contact-icon-${index}`}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
