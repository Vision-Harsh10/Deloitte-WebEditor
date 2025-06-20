import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Event, Course, Opportunity, Mentor, Article } from '../types';

const LOCAL_STORAGE_KEY = 'homePageContent';
const IMAGE_DIMENSIONS_KEY = 'homePageImageDimensions';

export interface EditableContent {
  sectionTitles: {
    events: string;
    courses: string;
    mentors: string;
    opportunities: string;
    articles: string;
  };
  mentorImages: Record<string, string>;
  mentorButtonLabels: Record<string, string>;
  eventContent: Record<string, {
    name: string;
    description: string;
    date: string;
    attendees: string;
    imageUrl?: string;
    link: string;
    buttonLabel?: string;
  }>;
  courseContent: Record<string, {
    title: string;
    description: string;
    duration: string;
    level: string;
    imageUrl?: string;
    link: string;
    buttonLabel?: string;
  }>;
  opportunityContent: Record<string, {
    title: string;
    description: string;
    type: string;
    location: string;
    deadline: string;
    link: string;
    imageUrl?: string;
    buttonLabel?: string;
  }>;
  articleContent: Record<string, {
    title: string;
    description: string;
    date: string;
    author: string;
    link: string;
    imageUrl?: string;
    buttonLabel?: string;
  }>;
}

interface HomePageEditContextType {
  editableContent: EditableContent;
  setSectionTitle: (key: string, value: string) => void;
  setEventContent: (eventId: string, field: string, value: string) => void;
  setEventField: (eventId: string, field: keyof Event, value: string | number) => void;
  setCourseContent: (courseId: string, field: string, value: string) => void;
  setCourseField: (courseId: string, field: keyof Course, value: string | number) => void;
  setOpportunityContent: (opportunityId: string, field: string, value: string) => void;
  setOpportunityField: (opportunityId: string, field: keyof Opportunity, value: string | number) => void;
  setArticleContent: (articleId: string, field: string, value: string) => void;
  setArticleField: (articleId: string, field: keyof Article, value: string | number) => void;
  setMentorImage: (mentorId: string, newUrl: string) => void;
  setEventImage: (eventId: string, newUrl: string) => void;
  setCourseImage: (courseId: string, newUrl: string) => void;
  imageDimensions: Record<string, { width: number; height: number }>;
  setImageDimensions: (id: string, width: number, height: number) => void;
  saveToLocalStorage: () => void;
  setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
  setButtonLabel: (type: 'event' | 'course' | 'opportunity' | 'article', id: string, label: string) => void;
  setMentorButtonLabel: (mentorId: string, label: string) => void;
}

const HomePageEditContext = createContext<HomePageEditContextType | undefined>(undefined);

export const useHomePageEdit = () => {
  const ctx = useContext(HomePageEditContext);
  if (!ctx) throw new Error('useHomePageEdit must be used within HomePageEditProvider');
  return ctx;
};

export const HomePageEditProvider: React.FC<{ children: React.ReactNode; initialContent: EditableContent }> = ({ children, initialContent }) => {
  const migrateContent = (content: any): EditableContent => {
    // Ensure mentorButtonLabels exists
    if (!content.mentorButtonLabels) content.mentorButtonLabels = {};
    // Ensure buttonLabel exists for all items
    if (content.eventContent) {
      Object.keys(content.eventContent).forEach(id => {
        if (!('buttonLabel' in content.eventContent[id])) content.eventContent[id].buttonLabel = '';
      });
    }
    if (content.courseContent) {
      Object.keys(content.courseContent).forEach(id => {
        if (!('buttonLabel' in content.courseContent[id])) content.courseContent[id].buttonLabel = '';
      });
    }
    if (content.opportunityContent) {
      Object.keys(content.opportunityContent).forEach(id => {
        if (!('buttonLabel' in content.opportunityContent[id])) content.opportunityContent[id].buttonLabel = '';
      });
    }
    if (content.articleContent) {
      Object.keys(content.articleContent).forEach(id => {
        if (!('buttonLabel' in content.articleContent[id])) content.articleContent[id].buttonLabel = '';
      });
    }
    return content;
  };

  const [editableContent, setEditableContent] = useState<EditableContent>(() => {
    try {
      const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = savedContent ? JSON.parse(savedContent) : initialContent;
      return migrateContent(parsed);
    } catch (e) {
      console.error("Failed to parse saved home page content, using initial content:", e);
      return migrateContent(initialContent);
    }
  });

  const [imageDimensions, setImageDimensionsState] = useState<Record<string, { width: number; height: number }>>(() => {
    try {
    const savedDimensions = localStorage.getItem(IMAGE_DIMENSIONS_KEY);
    return savedDimensions ? JSON.parse(savedDimensions) : {};
    } catch (e) {
      console.error("Failed to parse saved image dimensions, using empty object:", e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editableContent));
  }, [editableContent]);

  useEffect(() => {
    localStorage.setItem(IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
  }, [imageDimensions]);

  // Always migrate content on every update to ensure all fields exist
  useEffect(() => {
    setEditableContent(prev => migrateContent({ ...prev }));
  }, []); // Only run once on mount to avoid infinite loop

  const setSectionTitle = (key: string, value: string) => {
    setEditableContent(prev => ({
      ...prev,
      sectionTitles: {
        ...prev.sectionTitles,
        [key]: value
      }
    }));
  };

  const setEventContent = (eventId: string, field: string, value: string) => {
    setEditableContent(prev => ({
      ...prev,
      eventContent: {
        ...prev.eventContent,
        [eventId]: {
          ...prev.eventContent[eventId],
          [field]: value
        }
      }
    }));
  };

  const setEventField = (eventId: string, field: keyof Event, value: string | number) => {
    setEventContent(eventId, field, value.toString());
  };

  const setCourseContent = (courseId: string, field: string, value: string) => {
    setEditableContent(prev => ({
      ...prev,
      courseContent: {
        ...prev.courseContent,
        [courseId]: {
          ...prev.courseContent[courseId],
          [field]: value
        }
      }
    }));
  };

  const setCourseField = (courseId: string, field: keyof Course, value: string | number) => {
    setCourseContent(courseId, field, value.toString());
  };

  const setOpportunityContent = (opportunityId: string, field: string, value: string) => {
    setEditableContent(prev => ({
      ...prev,
      opportunityContent: {
        ...prev.opportunityContent,
        [opportunityId]: {
          ...prev.opportunityContent[opportunityId],
          [field]: value
        }
      }
    }));
  };

  const setOpportunityField = (opportunityId: string, field: keyof Opportunity, value: string | number) => {
    setOpportunityContent(opportunityId, field, value.toString());
  };

  const setArticleContent = (articleId: string, field: string, value: string) => {
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

  const setArticleField = (articleId: string, field: keyof Article, value: string | number) => {
    setArticleContent(articleId, field, value.toString());
  };

  const setMentorImage = (mentorId: string, newUrl: string) => {
    setEditableContent(prev => ({
      ...prev,
      mentorImages: {
        ...prev.mentorImages,
        [mentorId]: newUrl
      }
    }));
  };

  const setEventImage = (eventId: string, newUrl: string) => {
    setEventContent(eventId, 'imageUrl', newUrl);
  };

  const setCourseImage = (courseId: string, newUrl: string) => {
    setCourseContent(courseId, 'imageUrl', newUrl);
  };

  const setImageDimensions = (id: string, width: number, height: number) => {
    setImageDimensionsState(prev => ({
      ...prev,
      [id]: { width, height }
    }));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editableContent));
    localStorage.setItem(IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
  };

  const contentKeyMap = {
    event: 'eventContent',
    course: 'courseContent',
    opportunity: 'opportunityContent',
    article: 'articleContent',
  } as const;

  const setButtonLabel = (type: 'event' | 'course' | 'opportunity' | 'article', id: string, label: string) => {
    setEditableContent(prev => {
      const key = contentKeyMap[type];
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          [id]: {
            ...prev[key][id],
            buttonLabel: label
          }
        }
      };
      console.log('setButtonLabel', type, id, label, updated);
      return updated;
    });
  };

  const setMentorButtonLabel = (mentorId: string, label: string) => {
    setEditableContent(prev => ({
      ...prev,
      mentorButtonLabels: {
        ...prev.mentorButtonLabels,
        [mentorId]: label
      }
    }));
  };

  const value: HomePageEditContextType = {
    editableContent,
    setSectionTitle,
    setEventContent,
    setEventField,
    setCourseContent,
    setCourseField,
    setOpportunityContent,
    setOpportunityField,
    setArticleContent,
    setArticleField,
    setMentorImage,
    setEventImage,
    setCourseImage,
    imageDimensions,
    setImageDimensions,
    saveToLocalStorage,
    setEditableContent,
    setButtonLabel,
    setMentorButtonLabel
  };

  return (
    <HomePageEditContext.Provider value={value}>
      {children}
    </HomePageEditContext.Provider>
  );
}; 