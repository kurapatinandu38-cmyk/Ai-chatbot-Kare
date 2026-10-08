import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('[Fatal Error] Root DOM element #root was not found.');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary fallbackTitle="Portal Initialization Alert">
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
