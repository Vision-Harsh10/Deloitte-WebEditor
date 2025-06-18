import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Opportunity } from '../types';
import { opportunities } from '../pages/OpportunitiesPage';

const LOCAL_STORAGE_KEY = 'opportunitiesPageOpportunities';
const IMAGE_DIMENSIONS_KEY = 'opportunitiesPageImageDimensions';

interface OpportunitiesPageEditContextType {
  opportunityList: Opportunity[];
  setOpportunityImage: (opportunityId: string, newUrl: string) => void;
  setOpportunityField: (opportunityId: string, field: keyof Opportunity, value: string | number | string[]) => void;
  saveToLocalStorage: () => void;
  imageDimensions: Record<string, { width: number; height: number }>;
  setOpportunityImageDimensions: (opportunityId: string, width: number, height: number) => void;
}

const OpportunitiesPageEditContext = createContext<OpportunitiesPageEditContextType | undefined>(undefined);

export const useOpportunitiesPageEdit = () => {
  const ctx = useContext(OpportunitiesPageEditContext);
  if (!ctx) throw new Error('useOpportunitiesPageEdit must be used within OpportunitiesPageEditProvider');
  return ctx;
};

export const OpportunitiesPageEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [opportunityList, setOpportunityList] = useState<Opportunity[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : opportunities;
    } catch {
      return opportunities;
    }
  });

  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>(() => {
    try {
      const saved = localStorage.getItem(IMAGE_DIMENSIONS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(opportunityList));
  }, [opportunityList]);

  useEffect(() => {
    localStorage.setItem(IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
  }, [imageDimensions]);

  const setOpportunityImage = (opportunityId: string, newUrl: string) => {
    setOpportunityList(prev => prev.map(opportunity => 
      opportunity.id === opportunityId ? { ...opportunity, imageUrl: newUrl } : opportunity
    ));
  };

  const setOpportunityField = (opportunityId: string, field: keyof Opportunity, value: string | number | string[]) => {
    setOpportunityList(prev => {
      const updatedList = prev.map(opportunity => {
        if (opportunity.id === opportunityId) {
          const updatedOpportunity = { ...opportunity, [field]: value };
          return updatedOpportunity;
        }
        return opportunity;
      });
      return updatedList;
    });
  };

  const setOpportunityImageDimensions = (opportunityId: string, width: number, height: number) => {
    setImageDimensions(prev => ({
      ...prev,
      [opportunityId]: { width, height }
    }));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(opportunityList));
    localStorage.setItem(IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
  };

  return (
    <OpportunitiesPageEditContext.Provider value={{ 
      opportunityList, 
      setOpportunityImage, 
      setOpportunityField, 
      saveToLocalStorage,
      imageDimensions,
      setOpportunityImageDimensions
    }}>
      {children}
    </OpportunitiesPageEditContext.Provider>
  );
}; 