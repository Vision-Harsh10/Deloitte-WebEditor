import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Mentor } from '../types';
import { mentors } from '../pages/MentorshipPage';

const LOCAL_STORAGE_KEY = 'mentorshipPageMentors';
const IMAGE_DIMENSIONS_KEY = 'mentorshipPageImageDimensions';

interface MentorshipPageEditContextType {
  mentorList: Mentor[];
  setMentorImage: (mentorId: string, newUrl: string) => void;
  setMentorField: (mentorId: string, field: keyof Mentor, value: string | number | string[]) => void;
  saveToLocalStorage: () => void;
}

const MentorshipPageEditContext = createContext<MentorshipPageEditContextType | undefined>(undefined);

export const useMentorshipPageEdit = () => {
  const ctx = useContext(MentorshipPageEditContext);
  if (!ctx) throw new Error('useMentorshipPageEdit must be used within MentorshipPageEditProvider');
  return ctx;
};

export const MentorshipPageEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mentorList, setMentorList] = useState<Mentor[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : mentors;
    } catch {
      return mentors;
    }
  });

  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>(() => {
    const saved = localStorage.getItem(IMAGE_DIMENSIONS_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mentorList));
  }, [mentorList]);

  useEffect(() => {
    localStorage.setItem(IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
  }, [imageDimensions]);

  const setMentorImage = (mentorId: string, newUrl: string) => {
    setMentorList(prev => prev.map(mentor => mentor.id === mentorId ? { ...mentor, imageUrl: newUrl } : mentor));
  };

  const setMentorField = (mentorId: string, field: keyof Mentor, value: string | number | string[]) => {
    setMentorList(prev => {
      const updatedList = prev.map(mentor => {
        if (mentor.id === mentorId) {
          const updatedMentor = { ...mentor, [field]: value };
          return updatedMentor;
        }
        return mentor;
      });
      return updatedList;
    });
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mentorList));
    localStorage.setItem(IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
  };

  return (
    <MentorshipPageEditContext.Provider value={{ mentorList, setMentorImage, setMentorField, saveToLocalStorage }}>
      {children}
    </MentorshipPageEditContext.Provider>
  );
}; 