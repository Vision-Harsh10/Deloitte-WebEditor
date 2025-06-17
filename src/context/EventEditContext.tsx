import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Event } from '../types';

const LOCAL_STORAGE_KEY = 'eventPageEvents';

interface EventEditContextType {
  eventList: Event[];
  setEventImage: (eventId: string, newUrl: string) => void;
  setEventField: (eventId: string, field: keyof Event, value: string | number) => void;
  saveToLocalStorage: () => void;
}

const EventEditContext = createContext<EventEditContextType | undefined>(undefined);

export const useEventEdit = () => {
  const ctx = useContext(EventEditContext);
  if (!ctx) throw new Error('useEventEdit must be used within EventEditProvider');
  return ctx;
};

export const EventEditProvider: React.FC<{ children: React.ReactNode, initialEvents: Event[] }> = ({ children, initialEvents }) => {
  const [eventList, setEventList] = useState<Event[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialEvents;
    } catch {
      return initialEvents;
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(eventList));
  }, [eventList]);

  const setEventImage = (eventId: string, newUrl: string) => {
    setEventList(prev => prev.map(ev => ev.id === eventId ? { ...ev, imageUrl: newUrl } : ev));
  };

  const setEventField = (eventId: string, field: keyof Event, value: string | number) => {
    setEventList(prev => prev.map(ev => ev.id === eventId ? { ...ev, [field]: value } : ev));
  };

  // Explicit save function
  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(eventList));
  };

  return (
    <EventEditContext.Provider value={{ eventList, setEventImage, setEventField, saveToLocalStorage }}>
      {children}
    </EventEditContext.Provider>
  );
}; 