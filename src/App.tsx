/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar';
import { Catalog } from './components/Catalog';
import { Footer } from './components/Footer';
import { QuickContact } from './components/QuickContact';
import { LanguageProvider } from './LanguageContext';
import { RentalProvider, useRental } from './RentalContext';
import { BookingDetails } from './components/BookingDetails';
import { AnimatePresence } from 'motion/react';

const AppContent = () => {
  const { selectedBike, setSelectedBike } = useRental();

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        <Catalog />
      </main>
      <QuickContact />
      <Footer />

      <AnimatePresence>
        {selectedBike && (
          <BookingDetails 
            bike={selectedBike} 
            onClose={() => setSelectedBike(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <RentalProvider>
        <AppContent />
      </RentalProvider>
    </LanguageProvider>
  );
}


