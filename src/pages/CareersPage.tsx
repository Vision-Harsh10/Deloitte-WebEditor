import React, { useState, useEffect } from 'react';
import type { Job } from '../types';
import { Briefcase, MapPin, Search } from 'lucide-react';

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

interface CareersPageProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const CareersPage: React.FC<CareersPageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const [editableContent, setEditableContent] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load saved content from localStorage
    const savedContent = localStorage.getItem('careersPageContent');
    if (savedContent) {
      setEditableContent(JSON.parse(savedContent));
    }
  }, []);

  const handleContentChange = (id: string, content: string) => {
    const newContent = { ...editableContent, [id]: content };
    setEditableContent(newContent);
    localStorage.setItem('careersPageContent', JSON.stringify(newContent));
  };

  return (
    <div className='bg-gray-200'>
      {/* Hero Section */}
      <div className="bg-[#000000] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl font-bold mb-4 text-[#ffffff] outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('hero-title', e.currentTarget.textContent || 'Build Your Career with Deloitte')}
          >
            {editableContent['hero-title'] || 'Build Your Career with Deloitte'}
          </h1>
          <p
            className="text-xl text-[#ffffff] outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('hero-description', e.currentTarget.textContent || 'Join us in shaping the future of stainless steel industry')}
          >
            {editableContent['hero-description'] || 'Join us in shaping the future of stainless steel industry'}
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      {/* <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent">
              <option value="">All Departments</option>
              <option value="ai">Artificial Intelligence</option>
              <option value="software">Software Development</option>
              <option value="research">Research & Development</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent">
              <option value="">All Locations</option>
              <option value="bangalore">Bangalore</option>
              <option value="hyderabad">Hyderabad</option>
            </select>
          </div>
        </div> */}
      {/* </div> */}

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Briefcase className="w-8 h-8 text-[#003869] mr-3" />
          <h2
            className="text-2xl font-bold outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('jobs-title', e.currentTarget.textContent || 'Open Positions')}
          >
            {editableContent['jobs-title'] || 'Open Positions'}
          </h2>
        </div>
        
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3
                    className="text-xl font-semibold mb-1 outline-none"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                    onBlur={e => handleContentChange(`job-${job.id}-title`, e.currentTarget.textContent || job.title)}
                  >
                    {editableContent[`job-${job.id}-title`] || job.title}
                  </h3>
                  <div className="flex items-center text-gray-500">
                    <span
                      className="mr-4 outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => handleContentChange(`job-${job.id}-department`, e.currentTarget.textContent || job.department)}
                    >
                      {editableContent[`job-${job.id}-department`] || job.department}
                    </span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span
                        className="outline-none"
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                        onBlur={e => handleContentChange(`job-${job.id}-location`, e.currentTarget.textContent || job.location)}
                      >
                        {editableContent[`job-${job.id}-location`] || job.location}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="mt-4 md:mt-0 bg-[#62d84e] text-[#032d42] px-6 py-2 rounded-lg hover:bg-[#9fe793] hover:text-black transition-colors">
                  Apply Now
                </button>
              </div>
              <p
                className="text-gray-900 mb-4 outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange(`job-${job.id}-description`, e.currentTarget.textContent || job.description)}
              >
                {editableContent[`job-${job.id}-description`] || job.description}
              </p>
              <div>
                <h4
                  className="font-semibold mb-2 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`job-${job.id}-requirements-title`, e.currentTarget.textContent || 'Requirements:')}
                >
                  {editableContent[`job-${job.id}-requirements-title`] || 'Requirements:'}
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {job.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => handleContentChange(`job-${job.id}-requirement-${index}`, e.currentTarget.textContent || req)}
                    >
                      {editableContent[`job-${job.id}-requirement-${index}`] || req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareersPage;