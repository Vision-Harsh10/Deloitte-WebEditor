import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Opportunity } from '../types';
import { opportunities } from '../pages/OpportunitiesPage';

const LOCAL_STORAGE_KEY = 'opportunitiesPageOpportunities';

interface OpportunitiesPageEditContextType {
  opportunityList: Opportunity[];
  setOpportunityImage: (opportunityId: string, newUrl: string) => void;
  setOpportunityField: (opportunityId: string, field: keyof Opportunity, value: string | number | string[]) => void;
  saveToLocalStorage: () => void;
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

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(opportunityList));
  }, [opportunityList]);

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

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(opportunityList));
  };

  return (
    <OpportunitiesPageEditContext.Provider value={{ 
      opportunityList, 
      setOpportunityImage, 
      setOpportunityField, 
      saveToLocalStorage 
    }}>
      {children}
    </OpportunitiesPageEditContext.Provider>
  );
}; 