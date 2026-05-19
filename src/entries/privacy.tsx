import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { LanguageProvider } from '../LanguageContext';
import { BrowserRouter as Router } from 'react-router-dom';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <LanguageProvider>
        <PrivacyPolicy isOpen={true} onClose={() => window.location.href = '/'} />
      </LanguageProvider>
    </Router>
  </StrictMode>,
);
