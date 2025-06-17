import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { EventEditProvider } from './context/EventEditContext';
import { events } from './pages/EventsPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EventEditProvider initialEvents={events}>
      <App />
    </EventEditProvider>
  </StrictMode>
);
