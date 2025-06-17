import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';

const opportunities = [
  {
    id: '1',
    title: 'Software Engineer Intern',
    company: 'Deloitte Digital',
    location: 'Bangalore, India',
    type: 'Internship',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunities/663a035e70036.webp?d=800x420',
    description: 'Join our team as a Software Engineer Intern and work on cutting-edge technologies.',
    requirements: ['B.Tech/M.Tech in Computer Science', 'Strong programming skills', 'Knowledge of web technologies'],
    deadline: '2024-04-30',
    link: 'https://unstop.com/opportunities/software-engineer-intern'
  },
  {
    id: '2',
    title: 'Data Analyst',
    company: 'Deloitte Consulting',
    location: 'Hyderabad, India',
    type: 'Full-time',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunities/651755da708a6.webp?d=800x420',
    description: 'Exciting opportunity for a Data Analyst to work with our consulting team.',
    requirements: ['B.Tech/M.Tech in Data Science', 'Experience with data analysis tools', 'Strong analytical skills'],
    deadline: '2024-05-15',
    link: 'https://unstop.com/opportunities/data-analyst'
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'Deloitte Digital',
    location: 'Mumbai, India',
    type: 'Full-time',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunities/678f7bb93afa4.webp?d=800x420',
    description: 'Join our design team to create amazing user experiences.',
    requirements: ['B.Des/M.Des in Design', 'Portfolio of work', 'Experience with design tools'],
    deadline: '2024-05-30',
    link: 'https://unstop.com/opportunities/ux-designer'
  }
];

interface OpportunityPageProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const OpportunityPage: React.FC<OpportunityPageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const [editableContent, setEditableContent] = useState<Record<string, string>>({});
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({});

  useEffect(() => {
    // Load saved content from localStorage
    const savedContent = localStorage.getItem('opportunityPageContent');
    if (savedContent) {
      setEditableContent(JSON.parse(savedContent));
    }

    // Load saved image dimensions from localStorage
    const savedDimensions = localStorage.getItem('opportunityPageImageDimensions');
    if (savedDimensions) {
      setImageDimensions(JSON.parse(savedDimensions));
    }
  }, []);

  const handleContentChange = (id: string, content: string) => {
    const newContent = { ...editableContent, [id]: content };
    setEditableContent(newContent);
    localStorage.setItem('opportunityPageContent', JSON.stringify(newContent));
  };

  const handleImageResize = (opportunityId: string, width: number, height: number) => {
    const newDimensions = { ...imageDimensions, [opportunityId]: { width, height } };
    setImageDimensions(newDimensions);
    localStorage.setItem('opportunityPageImageDimensions', JSON.stringify(newDimensions));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#000000] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl font-bold mb-4 text-[#ffffff] outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('hero-title', e.currentTarget.textContent || 'Career Opportunities')}
          >
            {editableContent['hero-title'] || 'Career Opportunities'}
          </h1>
          <p
            className="text-xl text-[#ffffff] outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('hero-description', e.currentTarget.textContent || 'Explore exciting career opportunities at Deloitte')}
          >
            {editableContent['hero-description'] || 'Explore exciting career opportunities at Deloitte'}
          </p>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Briefcase className="w-8 h-8 text-[#003869] mr-3" />
          <h2
            className="text-2xl font-bold outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('opportunities-title', e.currentTarget.textContent || 'Available Positions')}
          >
            {editableContent['opportunities-title'] || 'Available Positions'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ResizableImage
                src={opportunity.imageUrl}
                alt={opportunity.title}
                isEditMode={isEditMode}
                onResize={(width, height) => handleImageResize(opportunity.id, width, height)}
                className="w-full h-48 object-cover"
                style={{
                  width: imageDimensions[opportunity.id]?.width || '100%',
                  height: imageDimensions[opportunity.id]?.height || '12rem'
                }}
              />
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-2 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`opportunity-${opportunity.id}-title`, e.currentTarget.textContent || opportunity.title)}
                >
                  {editableContent[`opportunity-${opportunity.id}-title`] || opportunity.title}
                </h3>
                <p
                  className="text-gray-600 mb-2 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`opportunity-${opportunity.id}-company`, e.currentTarget.textContent || opportunity.company)}
                >
                  {editableContent[`opportunity-${opportunity.id}-company`] || opportunity.company}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span
                    className="outline-none"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                    onBlur={e => handleContentChange(`opportunity-${opportunity.id}-location`, e.currentTarget.textContent || opportunity.location)}
                  >
                    {editableContent[`opportunity-${opportunity.id}-location`] || opportunity.location}
                  </span>
                  <span className="mx-2">•</span>
                  <span
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full outline-none"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                    onBlur={e => handleContentChange(`opportunity-${opportunity.id}-type`, e.currentTarget.textContent || opportunity.type)}
                  >
                    {editableContent[`opportunity-${opportunity.id}-type`] || opportunity.type}
                  </span>
                </div>
                <p
                  className="text-gray-600 mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`opportunity-${opportunity.id}-description`, e.currentTarget.textContent || opportunity.description)}
                >
                  {editableContent[`opportunity-${opportunity.id}-description`] || opportunity.description}
                </p>
                <div className="mb-4">
                  <h4
                    className="font-semibold mb-2 outline-none"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                    onBlur={e => handleContentChange(`opportunity-${opportunity.id}-requirements-title`, e.currentTarget.textContent || 'Requirements')}
                  >
                    {editableContent[`opportunity-${opportunity.id}-requirements-title`] || 'Requirements'}
                  </h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {opportunity.requirements.map((req, index) => (
                      <li
                        key={index}
                        className="mb-1 outline-none"
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                        onBlur={e => handleContentChange(`opportunity-${opportunity.id}-requirement-${index}`, e.currentTarget.textContent || req)}
                      >
                        {editableContent[`opportunity-${opportunity.id}-requirement-${index}`] || req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <span
                    className="outline-none"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                    onBlur={e => handleContentChange(`opportunity-${opportunity.id}-deadline`, e.currentTarget.textContent || `Apply by: ${opportunity.deadline}`)}
                  >
                    {editableContent[`opportunity-${opportunity.id}-deadline`] || `Apply by: ${opportunity.deadline}`}
                  </span>
                </div>
                <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block">
                    Apply Now
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpportunityPage; 