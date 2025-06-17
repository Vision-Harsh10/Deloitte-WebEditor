import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Article } from '../types';
import { articles as initialArticles } from '../pages/InsightsPage';

const LOCAL_STORAGE_KEY = 'insightsPageArticles';

export const articles: Article[] = [
  {
    id: '1',
    title: "2025 Smart Manufacturing and Global's Survey",
    description: 'As factories get smarter, manufacturers tackle talent gaps and operational risks',
    imageUrl: 'https://assets.deloitte.com/is/image/deloitte/US187578_Banner-1920x880:425-x-425?$Responsive$&fmt=webp&fit=stretch,1&wid=425&hei=425&dpr=off',
    date: '01 May 2025', 
    author: 'Deloitte',
    link: 'https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html'
  },
  {
    id: '2',
    title: 'CEO compass: Deloitte Global 2025 Airline CEO Survey',
    description: 'Airline CEOs prioritize financial discipline while investing in tech, talent, and resilience',
    imageUrl: 'https://assets.deloitte.com/is/image/deloitte/US188318_Banner-1920x880:480-x-720?$Responsive$&fmt=webp&fit=stretch,1&wid=480&hei=723&dpr=off',
    date: '29 May 2025',
    author: 'Deloitte',
    link: 'https://www2.deloitte.com/us/en/insights/focus/transportation/ceo-global-airline-survey.html'
  },
  {
    id: '3',
    title: 'US Economic Forecast: Tariffs update',
    description: 'New tariffs may slow GDP growth in the near term before a gradual recovery',
    imageUrl: 'https://assets.deloitte.com/is/image/deloitte/US188283_Banner_1920x880?$Responsive$&fmt=webp&fit=stretch,1&wid=320&dpr=off',
    date: '2025-01-01',
    author: 'Deloitte',
    link: 'https://www2.deloitte.com/us/en/insights/economy/us-economic-forecast/united-states-tariffs-analysis.html'
  }
];

interface InsightsPageEditContextType {
  articleList: Article[];
  setArticleImage: (articleId: string, newUrl: string) => void;
  imageDimensions: Record<string, { width: number; height: number }>;
  setArticleImageDimensions: (articleId: string, width: number, height: number) => void;
  setArticleField: (articleId: string, field: keyof Article, value: string | number | string[]) => void;
  saveToLocalStorage: () => void;
}

const InsightsPageEditContext = createContext<InsightsPageEditContextType | undefined>(undefined);

export const useInsightsPageEdit = () => {
  const ctx = useContext(InsightsPageEditContext);
  if (!ctx) throw new Error('useInsightsPageEdit must be used within InsightsPageEditProvider');
  return ctx;
};

export const InsightsPageEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articleList, setArticleList] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialArticles;
    } catch {
      return initialArticles;
    }
  });

  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_imageDimensions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articleList));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_imageDimensions', JSON.stringify(imageDimensions));
  }, [articleList]);

  const setArticleImage = (articleId: string, newUrl: string) => {
    setArticleList(prev => prev.map(article => 
      article.id === articleId ? { ...article, imageUrl: newUrl } : article
    ));
  };

  const setArticleImageDimensions = (articleId: string, width: number, height: number) => {
    setImageDimensions(prev => ({
      ...prev,
      [articleId]: { width, height },
    }));
  };

  const setArticleField = (articleId: string, field: keyof Article, value: string | number | string[]) => {
    setArticleList(prev => {
      const updatedList = prev.map(article => {
        if (article.id === articleId) {
          const updatedArticle = { ...article, [field]: value };
          return updatedArticle;
        }
        return article;
      });
      return updatedList;
    });
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articleList));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_imageDimensions', JSON.stringify(imageDimensions));
  };

  return (
    <InsightsPageEditContext.Provider value={{
      articleList,
      setArticleImage,
      imageDimensions,
      setArticleImageDimensions,
      setArticleField,
      saveToLocalStorage
    }}>
      {children}
    </InsightsPageEditContext.Provider>
  );
}; 