import React, { useState, useEffect } from 'react';
import type { Opportunity } from '../types';
import { Briefcase, Search, Calendar, Camera } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';
import { useOpportunitiesPageEdit } from '../context/OpportunitiesPageEditContext';

export const opportunities: Opportunity[] = [
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

interface OpportunitiesPageProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const { 
    opportunityList, 
    setOpportunityImage, 
    setOpportunityField, 
    imageDimensions, 
    setOpportunityImageDimensions,
    saveToLocalStorage 
  } = useOpportunitiesPageEdit();

  useEffect(() => {
    if (!isEditMode) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      saveToLocalStorage();
    }
  }, [isEditMode, saveToLocalStorage]);

  useEffect(() => {
    // Expose setOpportunityField for EditModeControls
    (window as any).setOpportunityFieldForEditPanel = setOpportunityField;
    return () => { (window as any).setOpportunityFieldForEditPanel = undefined; };
  }, [setOpportunityField]);

  // Helper to get opportunity data from context or initial array
  const getOpportunityData = (opportunityId: string) => {
    return opportunityList.find(o => o.id === opportunityId) || opportunities.find(o => o.id === opportunityId);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Briefcase className="w-8 h-8 text-[#003869] mr-3" />
          <h2
            className="text-2xl font-bold outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => setOpportunityField('page-title', 'title' as keyof Opportunity, e.currentTarget.textContent || 'Available Opportunities')}
          >
            {getOpportunityData('page-title')?.title || 'Available Opportunities'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunityList.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ResizableImage
                src={opportunity.imageUrl}
                alt={opportunity.title}
                isEditMode={isEditMode}
                onResize={(width, height) => setOpportunityImageDimensions(opportunity.id, width, height)}
                className={`object-cover ${!imageDimensions[opportunity.id] ? 'w-full h-[13rem]' : ''}`}
                style={{
                  ...(imageDimensions[opportunity.id]?.width ? { width: imageDimensions[opportunity.id].width + 'px' } : {}),
                  ...(imageDimensions[opportunity.id]?.height ? { height: imageDimensions[opportunity.id].height + 'px' } : {}),
                }}
                showChangeButton={true}
                showMoveButton={false}
                onImageChange={newUrl => setOpportunityImage(opportunity.id, newUrl)}
                imgProps={{ ['data-opportunity-id']: opportunity.id } as any}
              />
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-2 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setOpportunityField(opportunity.id, 'title', e.currentTarget.textContent || opportunity.title)}
                >
                  {opportunity.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm outline-none ${
                    opportunity.type === 'Hackathon' ? 'bg-green-100 text-green-800' :
                    opportunity.type === 'Research' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setOpportunityField(opportunity.id, 'type', e.currentTarget.textContent || opportunity.type)}
                >
                  {opportunity.type}
                </span>
                <p
                  className="text-gray-600 mt-3 mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setOpportunityField(opportunity.id, 'description', e.currentTarget.textContent || opportunity.description)}
                >
                  {opportunity.description}
                </p>
                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span
                      className="outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => setOpportunityField(opportunity.id, 'location', e.currentTarget.textContent || opportunity.location)}
                    >
                      {opportunity.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span
                      className="outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => setOpportunityField(opportunity.id, 'deadline', e.currentTarget.textContent || opportunity.deadline)}
                    >
                      Deadline: {opportunity.deadline}
                    </span>
                  </div>
                </div>
                <a
                  href={opportunity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-opportunity-id={opportunity.id}
                  onClick={e => {
                    if (isEditMode) {
                      e.preventDefault(); // Prevent navigation
                      e.stopPropagation(); // Stop event propagation
                      setSelectedElement(e.currentTarget); // Select the <a> tag directly
                    }
                  }}
                  className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;