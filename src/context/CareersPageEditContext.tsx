import React, { createContext, useContext, useState, useEffect } from 'react';

type CareersEditableContent = {
  heroTitle: string;
  heroDescription: string;
  jobs: Record<string, {
    title: string;
    department: string;
    location: string;
    description: string;
    requirements: string[];
    requirementsTitle: string;
    link: string;
    buttonLabel?: string;
  }>;
  jobsTitle: string;
};

type CareersPageEditContextType = {
  editableContent: CareersEditableContent;
  setHeroTitle: (value: string) => void;
  setHeroDescription: (value: string) => void;
  setJobsTitle: (value: string) => void;
  setJobField: (jobId: string, field: string, value: string) => void;
  setJobRequirement: (jobId: string, index: number, value: string) => void;
  setJobButtonLabel: (jobId: string, label: string) => void;
};

const CareersPageEditContext = createContext<CareersPageEditContextType | undefined>(undefined);

export const useCareersPageEdit = () => {
  const ctx = useContext(CareersPageEditContext);
  if (!ctx) throw new Error('useCareersPageEdit must be used within CareersPageEditProvider');
  return ctx;
};

export const CareersPageEditProvider: React.FC<{ initialContent: CareersEditableContent, children: React.ReactNode }> = ({ initialContent, children }) => {
  const [editableContent, setEditableContent] = useState<CareersEditableContent>(() => {
    try {
      const saved = localStorage.getItem('careersPageContent');
      const parsed = saved ? JSON.parse(saved) : initialContent;
      // Fallback if jobs are missing or empty
      if (!parsed.jobs || Object.keys(parsed.jobs).length === 0) return initialContent;
      return parsed;
    } catch {
      return initialContent;
    }
  });

  useEffect(() => {
    localStorage.setItem('careersPageContent', JSON.stringify(editableContent));
  }, [editableContent]);

  const setHeroTitle = (value: string) => setEditableContent(prev => ({ ...prev, heroTitle: value }));
  const setHeroDescription = (value: string) => setEditableContent(prev => ({ ...prev, heroDescription: value }));
  const setJobsTitle = (value: string) => setEditableContent(prev => ({ ...prev, jobsTitle: value }));
  const setJobField = (jobId: string, field: string, value: string) => setEditableContent(prev => ({
    ...prev,
    jobs: {
      ...prev.jobs,
      [jobId]: {
        ...prev.jobs[jobId],
        [field]: value
      }
    }
  }));
  const setJobRequirement = (jobId: string, index: number, value: string) => setEditableContent(prev => ({
    ...prev,
    jobs: {
      ...prev.jobs,
      [jobId]: {
        ...prev.jobs[jobId],
        requirements: prev.jobs[jobId].requirements.map((req, i) => i === index ? value : req)
      }
    }
  }));
  const setJobButtonLabel = (jobId: string, label: string) => setEditableContent(prev => ({
    ...prev,
    jobs: {
      ...prev.jobs,
      [jobId]: {
        ...prev.jobs[jobId],
        buttonLabel: label
      }
    }
  }));

  return (
    <CareersPageEditContext.Provider value={{
      editableContent,
      setHeroTitle,
      setHeroDescription,
      setJobsTitle,
      setJobField,
      setJobRequirement,
      setJobButtonLabel
    }}>
      {children}
    </CareersPageEditContext.Provider>
  );
}; 