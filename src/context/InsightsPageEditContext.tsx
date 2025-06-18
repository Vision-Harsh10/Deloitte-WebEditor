import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Article } from '../types';
import { articles as initialArticles } from '../pages/InsightsPage';

const LOCAL_STORAGE_KEY = 'insightsPageArticles';
const IMAGE_DIMENSIONS_KEY = 'insightsPageImageDimensions';

interface EditableContent {
  articleContent: Record<string, {
    title: string;
    description: string;
    date: string;
    author: string;
    imageUrl?: string;
    link: string;
  }>;
}

interface InsightsPageEditContextType {
  articleList: Article[];
  editableContent: EditableContent;
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

export const InsightsPageEditProvider: React.FC<{ children: React.ReactNode; initialContent: EditableContent }> = ({ children, initialContent }) => {
  const [editableContent, setEditableContent] = useState<EditableContent>(() => {
    let parsedContent = initialContent;
    const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedContent) {
      try {
        const loadedContent = JSON.parse(savedContent);
        parsedContent = {
          ...initialContent,
          articleContent: {
            ...initialContent.articleContent,
            ...loadedContent.articleContent,
          }
        };
      } catch (e) {
        console.error("Failed to parse saved insights page content, using initial content:", e);
        parsedContent = initialContent;
      }
    }
    return parsedContent;
  });

  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>(() => {
    const savedDimensions = localStorage.getItem(IMAGE_DIMENSIONS_KEY);
    return savedDimensions ? JSON.parse(savedDimensions) : {};
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editableContent));
  }, [editableContent]);

  useEffect(() => {
    localStorage.setItem(IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
  }, [imageDimensions]);

  const setArticleImage = (articleId: string, newUrl: string) => {
    setEditableContent(prev => ({
      ...prev,
      articleContent: {
        ...prev.articleContent,
        [articleId]: {
          ...prev.articleContent[articleId],
          imageUrl: newUrl
        }
      }
    }));
  };

  const setArticleImageDimensions = (articleId: string, width: number, height: number) => {
    setImageDimensions(prev => ({
      ...prev,
      [articleId]: { width, height }
    }));
  };

  const setArticleField = (articleId: string, field: keyof Article, value: string | number | string[]) => {
    setEditableContent(prev => ({
      ...prev,
      articleContent: {
        ...prev.articleContent,
        [articleId]: {
          ...prev.articleContent[articleId],
          [field]: value
        }
      }
    }));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editableContent));
    localStorage.setItem(IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
  };

  const value = {
    articleList: Object.entries(editableContent.articleContent || {}).map(([id, content]) => ({
      id,
      ...content
    })) as Article[],
    editableContent,
    setArticleImage,
    imageDimensions,
    setArticleImageDimensions,
    setArticleField,
    saveToLocalStorage
  };

  return (
    <InsightsPageEditContext.Provider value={value}>
      {children}
    </InsightsPageEditContext.Provider>
  );
}; 