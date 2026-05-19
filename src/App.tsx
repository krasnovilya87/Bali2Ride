/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Catalog } from './components/Catalog';
import { Footer } from './components/Footer';
import { QuickContact } from './components/QuickContact';
import { LanguageProvider } from './LanguageContext';
import { RentalProvider, useRental } from './RentalContext';
import { BookingDetails } from './components/BookingDetails';
import { AnimatePresence } from 'motion/react';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './lib/firebase';
import { AdminPanel } from './components/AdminPanel';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { FAQ } from './components/FAQ';
import { getLatestExchangeRates, updateExchangeRates } from './services/dataService';
import { APIProvider } from '@vis.gl/react-google-maps';

const AppContent = () => {
  const { selectedBike, setSelectedBike } = useRental();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Seed exchange rates if missing from Firebase
    const seedRates = async () => {
      try {
        const existing = await getLatestExchangeRates();
        if (!existing) {
          const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          const data = await res.json();
          await updateExchangeRates({
            rates: {
              USD: data.rates.USD,
              IDR: data.rates.IDR,
              RUB: data.rates.RUB
            },
            timestamp: Date.now(),
            markupusdt: 0.05,
            markuprub: 0.05
          });
          console.log('Successfully seeded initial exchange rates to Firebase');
        }
      } catch (err) {
        console.error('Error seeding exchange rates:', err);
      }
    };
    seedRates();

    async function testConnection() {
      try {
        // Use a dummy doc to test firestore connection
        await getDocFromServer(doc(db, 'test', 'connection'));
        setConnectionError(null);
      } catch (error: any) {
        console.error("Firestore connection failed:", error);
        // Only show error if it's not a standard permission denied (which is expected if 'test/connection' doesn't exist)
        // If it's a connection error, it will usually say something about 'client is offline' or 'project-id'
        if (error.code === 'permission-denied') {
          // This actually means connection IS working but we just don't have access to this specific test doc
          setConnectionError(null);
          return;
        }
        setConnectionError(error.message || "Failed to connect to Firebase");
      }
    }
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      {connectionError && (
        <div className="fixed top-0 left-0 right-0 z-[600] bg-red-500 text-white text-center py-2 text-xs font-bold animate-pulse">
          Firebase Connection Error: {connectionError}. Please check your configuration.
        </div>
      )}
      <Navbar />
      <main>
        <Catalog />
      </main>
      <QuickContact />
      <Footer 
        onAdminClick={() => setShowAdmin(true)} 
        onPrivacyClick={() => setShowPrivacy(true)}
        onTermsClick={() => setShowTerms(true)}
        onFAQClick={() => setShowFAQ(true)}
      />

      <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
      <PrivacyPolicy isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsOfService isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <FAQ isOpen={showFAQ} onClose={() => setShowFAQ(false)} />

      <AnimatePresence>
        {selectedBike && (
          <BookingDetails 
            bike={selectedBike} 
            onClose={() => setSelectedBike(null)} 
            onPrivacyClick={() => setShowPrivacy(true)}
            onTermsClick={() => setShowTerms(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <APIProvider apiKey={process.env.GOOGLE_MAPS_PLATFORM_KEY || ''} version="weekly" libraries={['places']}>
      <LanguageProvider>
        <RentalProvider>
          <AppContent />
        </RentalProvider>
      </LanguageProvider>
    </APIProvider>
  );
}


