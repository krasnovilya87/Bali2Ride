import React from 'react';
import { Phone, MessageCircle, Send, Instagram } from 'lucide-react';

export const QuickContact = () => {
  const contacts = [
    {
      icon: <Phone className="w-5 h-5 md:w-6 md:h-6" />,
      href: "tel:+6281234567890",
      label: "Call"
    },
    {
      icon: <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />,
      href: "https://wa.me/6281234567890",
      label: "WhatsApp"
    },
    {
      icon: <Send className="w-5 h-5 md:w-6 md:h-6" />,
      href: "https://t.me/balimoto",
      label: "Telegram"
    },
    {
      icon: <Instagram className="w-5 h-5 md:w-6 md:h-6" />,
      href: "https://instagram.com/balimoto",
      label: "Instagram"
    }
  ];

  return (
    <section className="py-6 bg-muted/10 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4 md:gap-6 justify-center">
          {contacts.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noreferrer"
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
