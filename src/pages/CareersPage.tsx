import React from 'react';
import type { Job } from '../types';
import { Briefcase, MapPin, Search } from 'lucide-react';
import { useJobApplication } from '../context/JobApplicationContext';
import { Link } from 'react-router-dom';
import { useCareersPageEdit, CareersPageEditProvider } from '../context/CareersPageEditContext';

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

const jobs: Job[] = [
  {
    id: '1',
    title: 'Sales & Marketing Executive',
    department: 'Sales & Marketing',
    location: 'Chennai, India',
    description: 'Drive dealer growth, market expansion, and on-ground brand activation across India',
    requirements: [
      "MBA/PGDM in Sales & Marketing",
      "0–2 years of experience in Sales function",
      "Pan-India mobility with extensive travel",
      "Proficiency in MS Office and MS Excel"
    ]    
  },
  {
    id: '2',
    title: 'Application Developer Internship',
    department: 'Software Development',
    location: 'Chennai, India',
    description: 'Contribute to impactful digital solutions enhancing user experience and business efficiency.',
    requirements: [
      "Proficiency in Dart & state management.",
      "Strong REST API skills.",
      "Proficiency in SQL and database management.",
      "Degree in CS, strong analytical & communication skills."
    ]    
  },
  {
    id: '3',
    title: 'Internal Audit Executive',
    department: 'Finance and Audit',
    location: 'Chennai, India',
    description: 'Support audit planning, risk management, and compliance.',
    requirements: [
      "Bachelor's degree in Accounting, Finance, Business Administration.",
      "Master's degree (MBA, MAcc) preferred for senior roles.",
      "Certifications: CPA, CA, CIA, CISA, CMA preferred."
    ]    
  }
];

const initialContent: CareersEditableContent = {
  heroTitle: 'Build Your Career with Deloitte',
  heroDescription: 'Join us in shaping the future of stainless steel industry',
  jobs: jobs.reduce((acc, job) => {
    acc[job.id] = {
      title: job.title,
      department: job.department,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      requirementsTitle: 'Requirements:',
      link: `/apply/${job.id}`,
      buttonLabel: 'Apply Now'
    };
    return acc;
  }, {} as CareersEditableContent['jobs']),
  jobsTitle: 'Open Positions',
};

interface CareersPageProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

// Utility to get persisted color for a tag and text
function getPersistedTextColor(tag: string, text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  const key = `textColor:${tag}:hash${hash}`;
  return localStorage.getItem(key) || undefined;
}

// Utility to get persisted text style for a tag and text
function getPersistedTextStyle(tag: string, text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  const key = `textStyle:${tag}:hash${hash}`;
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

const CareersPageContent: React.FC<CareersPageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const { setLastAppliedJob } = useJobApplication();
  const {
    editableContent,
    setHeroTitle,
    setHeroDescription,
    setJobsTitle,
    setJobField,
    setJobRequirement,
    setJobButtonLabel
  } = useCareersPageEdit();

  return (
    <div
      className='bg-gray-200'
      data-careers-main-bg
      style={{ backgroundColor: localStorage.getItem('careersPageMainBgColor') || '#e5e7eb' }}
    >
      {/* Hero Section */}
      <div
        className="text-white py-16"
        data-careers-hero-section
        style={{ backgroundColor: localStorage.getItem('careersPageHeroBgColor') || '#000000' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl font-bold mb-4 outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => setHeroTitle(e.currentTarget.textContent || 'Build Your Career with Deloitte')}
            key={editableContent.heroTitle}
            data-careers-text-id="hero-title"
            style={{
              color: getPersistedTextColor('h1', editableContent.heroTitle) || '#fff',
              ...getPersistedTextStyle('h1', editableContent.heroTitle)
            } as React.CSSProperties}
          >
            {editableContent.heroTitle}
          </h1>
          <p
            className="text-xl outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => setHeroDescription(e.currentTarget.textContent || 'Join us in shaping the future of stainless steel industry')}
            key={editableContent.heroDescription}
            data-careers-text-id="hero-description"
            style={{
              color: getPersistedTextColor('p', editableContent.heroDescription) || '#fff',
              ...getPersistedTextStyle('p', editableContent.heroDescription)
            } as React.CSSProperties}
          >
            {editableContent.heroDescription}
          </p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Briefcase className="w-8 h-8 text-[#003869] mr-3" />
          <h2
            className="text-2xl font-bold outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => setJobsTitle(e.currentTarget.textContent || 'Open Positions')}
            key={editableContent.jobsTitle}
            data-careers-text-id={`jobs-title`}
            style={{
              color: getPersistedTextColor('h2', editableContent.jobsTitle) || undefined,
              ...getPersistedTextStyle('h2', editableContent.jobsTitle)
            } as React.CSSProperties}
          >
            {editableContent.jobsTitle}
          </h2>
        </div>
        <div className="space-y-6">
          {Object.entries(editableContent.jobs || {}).map(([jobId, job]) => {
            const typedJob = job as CareersEditableContent['jobs'][string];
            return (
              <div
                key={jobId}
                className="bg-white rounded-lg shadow-lg p-6"
                data-careers-job-card={jobId}
                style={{ backgroundColor: localStorage.getItem('careersPageJobCardBgColor:' + jobId) || '#fff' }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3
                      className="text-xl font-semibold mb-1 outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => setJobField(jobId, 'title', e.currentTarget.textContent || typedJob.title)}
                      key={typedJob.title}
                      data-careers-text-id={`job-${jobId}-title`}
                      style={{
                        color: getPersistedTextColor('h3', typedJob.title) || undefined,
                        ...getPersistedTextStyle('h3', typedJob.title)
                      } as React.CSSProperties}
                    >
                      {typedJob.title}
                    </h3>
                    <div className="flex items-center text-gray-500">
                      <span
                        className="mr-4 outline-none"
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                        onBlur={e => setJobField(jobId, 'department', e.currentTarget.textContent || typedJob.department)}
                        key={typedJob.department}
                        data-careers-text-id={`job-${jobId}-department`}
                        style={{
                          color: getPersistedTextColor('span', typedJob.department) || undefined,
                          ...getPersistedTextStyle('span', typedJob.department)
                        } as React.CSSProperties}
                      >
                        {typedJob.department}
                      </span>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span
                          className="outline-none"
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onClick={e => setSelectedElement(e.currentTarget)}
                          onBlur={e => setJobField(jobId, 'location', e.currentTarget.textContent || typedJob.location)}
                          key={typedJob.location}
                          data-careers-text-id={`job-${jobId}-location`}
                          style={{
                            color: getPersistedTextColor('span', typedJob.location) || undefined,
                            ...getPersistedTextStyle('span', typedJob.location)
                          } as React.CSSProperties}
                        >
                          {typedJob.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`mt-4 md:mt-0 bg-[#62d84e] px-6 py-2 rounded-lg hover:bg-[#9fe793] hover:text-black transition-colors inline-block careers-btn-override${localStorage.getItem('careersPageJobBtnHoverColor:' + jobId) || localStorage.getItem('careersPageJobBtnHoverTextColor:' + jobId) ? ' custom-hover' : ''}`}
                    data-careers-job-btn={jobId}
                    style={{
                      backgroundColor: localStorage.getItem('careersPageJobBtnBgColor:' + jobId) || '#62d84e',
                      '--careers-btn-color': localStorage.getItem('careersPageJobBtnTextColor:' + jobId) || '#032d42',
                      '--hover-color': localStorage.getItem('careersPageJobBtnHoverColor:' + jobId) || '#9fe793',
                      '--hover-text-color': localStorage.getItem('careersPageJobBtnHoverTextColor:' + jobId) || '#000'
                    } as React.CSSProperties}
                    onClick={e => {
                      if (isEditMode) {
                        setSelectedElement(e.currentTarget);
                      } else {
                        const jobData = {
                          id: jobId,
                          title: typedJob.title,
                          department: typedJob.department,
                          location: typedJob.location,
                          timestamp: new Date().toISOString(),
                          applicationLink: typedJob.link
                        };
                        setLastAppliedJob(jobData);
                        // You can add any other logic here for non-edit mode
                      }
                    }}
                  >
                    {isEditMode ? (
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => setJobButtonLabel(jobId, e.currentTarget.textContent || 'Apply Now')}
                        style={{ outline: '1px dashed #ccc', cursor: 'text' }}
                      >
                        {typedJob.buttonLabel || 'Apply Now'}
                      </span>
                    ) : (
                      typedJob.buttonLabel || 'Apply Now'
                    )}
                  </button>
                </div>
                <p
                  className="text-gray-900 mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setJobField(jobId, 'description', e.currentTarget.textContent || typedJob.description)}
                  key={typedJob.description}
                  data-careers-text-id={`job-${jobId}-description`}
                  style={{
                    color: getPersistedTextColor('p', typedJob.description) || undefined,
                    ...getPersistedTextStyle('p', typedJob.description)
                  } as React.CSSProperties}
                >
                  {typedJob.description}
                </p>
                <div>
                  <h4
                    className="font-semibold mb-2 outline-none"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                    onBlur={e => setJobField(jobId, 'requirementsTitle', e.currentTarget.textContent || typedJob.requirementsTitle)}
                    key={typedJob.requirementsTitle}
                    data-careers-text-id={`job-${jobId}-requirementsTitle`}
                    style={{
                      color: getPersistedTextColor('h4', typedJob.requirementsTitle) || undefined,
                      ...getPersistedTextStyle('h4', typedJob.requirementsTitle)
                    } as React.CSSProperties}
                  >
                    {typedJob.requirementsTitle}
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {typedJob.requirements.map((req, index) => (
                      <li
                        key={index}
                        className="outline-none"
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                        onBlur={e => setJobRequirement(jobId, index, e.currentTarget.textContent || req)}
                        data-careers-text-id={`job-${jobId}-requirement-${index}`}
                        style={{
                          color: getPersistedTextColor('li', req) || undefined,
                          ...getPersistedTextStyle('li', req)
                        } as React.CSSProperties}
                      >
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CareersPage: React.FC<CareersPageProps> = (props) => (
  <CareersPageEditProvider initialContent={initialContent}>
    <CareersPageContent {...props} />
  </CareersPageEditProvider>
);

export default CareersPage;