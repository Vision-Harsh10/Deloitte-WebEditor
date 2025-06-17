import React, { useState, useEffect } from 'react';
import type { Opportunity } from '../types';
import { Briefcase, Search, Calendar } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';

const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Shri Ram Case Cade || Gartner || Deloitte || Brainworks',
    description: 'Where strategy meets action — compete, innovate, and lead under pressure',
    deadline: '26 Mar 25',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/banner/67cf38a876027_shri-ram-case-cade.webp?d=1920x557',
    type: 'Competition',
    location  : 'Pan India',
    link: 'https://unstop.com/competitions/shri-ram-case-cade-episteme-2025-shri-ram-college-of-commerce-srcc-1424796'
  },
  {
    id: '2',
    title: "Das Capital '22: Talk by Mr. Vaibhav Sharma (Director at Deloitte)",
    description: 'Explore how FinTech is reshaping the future of financial services',
    deadline: '05 Feb 22,',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/banner/61f386cf1de45_fintech_and_its_impact_on_the_future_of_financial_services.jpg?d=1920x557',
    type: 'Workshop',
    location: 'Online',
    link: 'https://unstop.com/workshops-webinars/das-capital-22-talk-by-mr-vaibhav-sharma-director-at-deloitte-das-capital-2022-st-stephens-college-ssc-delhi-un-258934'
  },
  {
    id: '3',
    title: "Cash of Clans : Portfolio Wars - FMA, SRCC (in collaboration with Deloitte)",
    description: 'Test your financial strategy in a high-stakes portfolio showdown',
    deadline: '10 Apr 25,',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/banner/67f16b481a9d2_cash-of-clans-portfolio-wars-fma-srcc.webp?d=1920x557',
    type: 'Workshop',
    location: ' New Delhi, Delhi, India',
    link: 'https://unstop.com/competitions/portfolio-management-competition-fma-srcc-crossroads-2025-srcc-du-1456345'
  }
];

const OpportunitiesPage = () => {
  const [isEditMode, setIsEditMode] = useState(false);

  // Edit Panel integration
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const handleStyleChange = (styles: any) => {
    if (selectedElement) {
      Object.entries(styles).forEach(([key, value]) => {
        selectedElement.style[key as any] = value as string;
      });
    }
  };
  const handleLayoutChange = (layout: any) => {
    if (selectedElement) {
      Object.entries(layout).forEach(([key, value]) => {
        selectedElement.style[key as any] = value as string;
      });
    }
  };
  const handleComponentAction = (action: string) => {
    if (action === 'deselect') setSelectedElement(null);
    // Add more actions as needed
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        setIsEditMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Briefcase className="w-8 h-8 text-[#003869] mr-3" />
          {isEditMode ? (
            <h2
              className="text-2xl font-bold outline-none"
              contentEditable
              suppressContentEditableWarning
              onClick={e => setSelectedElement(e.currentTarget)}
            >
              Available Opportunities
            </h2>
          ) : (
            <h2 className="text-2xl font-bold">Available Opportunities</h2>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ResizableImage
                src={opportunity.imageUrl}
                alt={opportunity.title}
                isEditMode={isEditMode}
                onResize={(width, height) => {
                  console.log('Image resized:', width, height);
                }}
                className="w-full h-[13rem] object-cover object-center"
              />
              <div className="p-6">
                {isEditMode ? (
                  <h3
                    className="text-xl font-semibold mb-2 outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                  >
                    {opportunity.title}
                  </h3>
                ) : (
                  <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
                )}
                {isEditMode ? (
                  <span
                    className={`px-3 py-1 rounded-full text-sm outline-none ${
                      opportunity.type === 'Hackathon' ? 'bg-green-100 text-green-800' :
                      opportunity.type === 'Research' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                    contentEditable
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                  >
                    {opportunity.type}
                  </span>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    opportunity.type === 'Hackathon' ? 'bg-green-100 text-green-800' :
                    opportunity.type === 'Research' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {opportunity.type}
                  </span>
                )}
                {isEditMode ? (
                  <p
                    className="text-gray-600 mt-3 mb-4 outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                  >
                    {opportunity.description}
                  </p>
                ) : (
                  <p className="text-gray-600 mt-3 mb-4">{opportunity.description}</p>
                )}
                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {isEditMode ? (
                      <span
                        className="outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {opportunity.location}
                      </span>
                    ) : (
                      <span>{opportunity.location}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {isEditMode ? (
                      <span
                        className="outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        Deadline: {opportunity.deadline}
                      </span>
                    ) : (
                      <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <a
                  href={opportunity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Edit Mode Active - Press Ctrl/Cmd + E to toggle
        </div>
      )}
    </div>
  );
};

export default OpportunitiesPage;