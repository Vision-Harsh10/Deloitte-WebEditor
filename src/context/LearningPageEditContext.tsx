import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Course } from '../types';
import { courses } from '../pages/LearningPage'; // Import the static courses array

const LOCAL_STORAGE_KEY = 'learningPageContent';
const IMAGE_DIMENSIONS_KEY = 'learningPageImageDimensions';

interface EditableContent {
  courseContent: Record<string, {
    title: string;
    description: string;
    duration: string;
    level: string;
    imageUrl?: string;
    link: string;
  }>;
}

interface LearningPageEditContextType {
  courseList: Course[];
  editableContent: EditableContent;
  setCourseContent: (courseId: string, field: string, value: string) => void;
  setCourseField: (courseId: string, field: keyof Course, value: string | number) => void;
  setCourseImage: (courseId: string, newUrl: string) => void;
  imageDimensions: Record<string, { width: number; height: number }>;
  setCourseImageDimensions: (id: string, width: number, height: number) => void;
  saveToLocalStorage: () => void;
}

const LearningPageEditContext = createContext<LearningPageEditContextType | undefined>(undefined);

export const useLearningPageEdit = () => {
  const context = useContext(LearningPageEditContext);
  if (!context) {
    throw new Error('useLearningPageEdit must be used within a LearningPageEditProvider');
  }
  return context;
};

export const LearningPageEditProvider: React.FC<{ children: React.ReactNode; initialContent: EditableContent }> = ({ children, initialContent }) => {
  const [editableContent, setEditableContent] = useState<EditableContent>(() => {
    let parsedContent = initialContent; // Start with the provided initial content
    const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedContent) {
      try {
        const loadedContent = JSON.parse(savedContent);
        // Merge loaded content with initial content. Prioritize loaded content for specific course fields.
        parsedContent = {
          ...initialContent,
          courseContent: {
            ...initialContent.courseContent,
            ...loadedContent.courseContent, // Loaded courses override initial ones
          }
        };
      } catch (e) {
        console.error("Failed to parse saved learning page content, using initial content:", e);
        // Fallback to initialContent if parsing fails
        parsedContent = initialContent;
      }
    }
    console.log('LearningPageEditProvider - Initial parsedContent.courseContent:', parsedContent.courseContent); // Add this line for debugging
    return parsedContent;
  });

  const [imageDimensions, setImageDimensionsState] = useState<Record<string, { width: number; height: number }>>(() => {
    const savedDimensions = localStorage.getItem(IMAGE_DIMENSIONS_KEY);
    return savedDimensions ? JSON.parse(savedDimensions) : {};
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editableContent));
  }, [editableContent]);

  useEffect(() => {
    localStorage.setItem(IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
  }, [imageDimensions]);

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

  const setCourseImage = (courseId: string, newUrl: string) => {
    setCourseContent(courseId, 'imageUrl', newUrl);
  };

  const setCourseImageDimensions = (id: string, width: number, height: number) => {
    setImageDimensionsState(prev => ({
      ...prev,
      [id]: { width, height }
    }));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editableContent));
    localStorage.setItem(IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
  };

  const value = {
    courseList: Object.entries(editableContent.courseContent || {}).map(([id, content]) => ({
      id,
      ...content
    })) as Course[],
    editableContent,
    setCourseContent,
    setCourseField,
    setCourseImage,
    imageDimensions,
    setCourseImageDimensions,
    saveToLocalStorage
  };

  return (
    <LearningPageEditContext.Provider value={value}>
      {children}
    </LearningPageEditContext.Provider>
  );
}; 