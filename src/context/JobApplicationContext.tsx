import React, { createContext, useContext, useState, useEffect } from 'react';

interface JobApplication {
  id: string;
  title: string;
  department: string;
  location: string;
  timestamp: string;
  applicationLink: string;
}

interface JobApplicationContextType {
  lastAppliedJob: JobApplication | null;
  setLastAppliedJob: (job: JobApplication) => void;
  clearLastAppliedJob: () => void;
  updateApplicationLink: (jobId: string, link: string) => void;
}

const JobApplicationContext = createContext<JobApplicationContextType | undefined>(undefined);

export const JobApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastAppliedJob, setLastAppliedJob] = useState<JobApplication | null>(null);

  useEffect(() => {
    // Load saved application from localStorage on mount
    const savedApplication = localStorage.getItem('lastAppliedJob');
    if (savedApplication) {
      setLastAppliedJob(JSON.parse(savedApplication));
    }
  }, []);

  const handleSetLastAppliedJob = (job: JobApplication) => {
    setLastAppliedJob(job);
    localStorage.setItem('lastAppliedJob', JSON.stringify(job));
  };

  const updateApplicationLink = (jobId: string, link: string) => {
    if (lastAppliedJob && lastAppliedJob.id === jobId) {
      const updatedJob = { ...lastAppliedJob, applicationLink: link };
      setLastAppliedJob(updatedJob);
      localStorage.setItem('lastAppliedJob', JSON.stringify(updatedJob));
    }
  };

  const clearLastAppliedJob = () => {
    setLastAppliedJob(null);
    localStorage.removeItem('lastAppliedJob');
  };

  return (
    <JobApplicationContext.Provider
      value={{
        lastAppliedJob,
        setLastAppliedJob: handleSetLastAppliedJob,
        clearLastAppliedJob,
        updateApplicationLink,
      }}
    >
      {children}
    </JobApplicationContext.Provider>
  );
};

export const useJobApplication = () => {
  const context = useContext(JobApplicationContext);
  if (context === undefined) {
    throw new Error('useJobApplication must be used within a JobApplicationProvider');
  }
  return context;
}; 