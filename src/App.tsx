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
import { Advantages } from './components/Advantages';
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

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataDeletion } from './components/DataDeletion';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const AppContent = () => {
  const { selectedBike, setSelectedBike } = useRental();
  const [showAdmin, setShowAdmin] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <main>
              <Catalog />
            </main>
            <Advantages />
            <QuickContact />
            <Footer 
              onAdminClick={() => setShowAdmin(true)} 
            />

            <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} />

            <AnimatePresence>
              {selectedBike && (
                <BookingDetails 
                  bike={selectedBike} 
                  onClose={() => setSelectedBike(null)} 
                />
              )}
            </AnimatePresence>
          </>
        } />
        
        <Route path="/faq" element={<FAQ isOpen={true} onClose={() => window.history.back()} />} />
      </Routes>
    </div>
  );
};

export default function App() {
  if (!hasValidKey) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '520px', backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          <div style={{ backgroundColor: '#fee2e2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <h2 style={{ color: '#111827', fontSize: '24px', marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.025em' }}>Google Maps Key Required</h2>
          <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '32px' }}>To use the map and search features, you need to add your Google Maps API key.</p>
          
          <div style={{ textAlign: 'left', backgroundColor: '#f3f4f6', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
            <p style={{ fontWeight: '700', marginBottom: '12px', fontSize: '14px', color: '#374151' }}>Setup Instructions:</p>
            <ol style={{ fontSize: '13px', color: '#4b5563', paddingLeft: '20px', margin: '0' }}>
              <li style={{ marginBottom: '8px' }}>Get an API key: <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener" style={{ color: '#006fee', textDecoration: 'none', fontWeight: '600' }}>Get Key</a></li>
              <li style={{ marginBottom: '8px' }}>Ensure <b>Billing</b> is enabled on your Cloud Project</li>
              <li style={{ marginBottom: '8px' }}>Enable <b>Maps JavaScript API</b>, <b>Places API</b>, and <b>Geocoding API</b></li>
              <li style={{ marginBottom: '8px' }}>Open <b>Settings</b> (⚙️ gear icon, top-right corner)</li>
              <li style={{ marginBottom: '8px' }}>Select <b>Secrets</b></li>
              <li style={{ marginBottom: '8px' }}>Type <code>GOOGLE_MAPS_PLATFORM_KEY</code> as name</li>
              <li>Paste your key and press <b>Enter</b></li>
            </ol>
          </div>
          
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>The app will rebuild automatically after you add the secret.</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <APIProvider apiKey={API_KEY} version="weekly" libraries={['places']}>
        <LanguageProvider>
          <RentalProvider>
            <AppContent />
          </RentalProvider>
        </LanguageProvider>
      </APIProvider>
    </Router>
  );
}


