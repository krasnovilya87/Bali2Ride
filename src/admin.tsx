import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebase';
import { AdminPanel } from './components/AdminPanel';
import { LanguageProvider } from './LanguageContext';
import './index.css';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminPanel isOpen={true} onClose={() => window.location.href = '/'} />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AdminPage />
    </LanguageProvider>
  </StrictMode>,
);
