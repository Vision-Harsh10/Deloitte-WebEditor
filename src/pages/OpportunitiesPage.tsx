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

const OPPORTUNITIES_BTN_LABELS_KEY = 'opportunitiesBtnLabels';

function getInitialOpportunitiesBtnLabels(opportunities: Opportunity[]) {
  const saved = localStorage.getItem(OPPORTUNITIES_BTN_LABELS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback to default
    }
  }
  // Default: all opportunities get 'Apply Now'
  const obj: Record<string, string> = {};
  opportunities.forEach(o => { obj[o.id] = 'Apply Now'; });
  return obj;
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

  const [opportunitiesBtnLabels, setOpportunitiesBtnLabels] = useState<Record<string, string>>(() => getInitialOpportunitiesBtnLabels(opportunities));

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

  // Persist opportunitiesBtnLabels to localStorage
  useEffect(() => {
    localStorage.setItem(OPPORTUNITIES_BTN_LABELS_KEY, JSON.stringify(opportunitiesBtnLabels));
  }, [opportunitiesBtnLabels]);

  // Helper to get opportunity data from context or initial array
  const getOpportunityData = (opportunityId: string) => {
    return opportunityList.find(o => o.id === opportunityId) || opportunities.find(o => o.id === opportunityId);
  };

  // Utility to get persisted text style for a tag and text
  function getPersistedTextStyle(tag: string, text?: string) {
    text = text || '';
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    const styleKey = `textStyle:${tag}:hash${hash}`;
    const colorKey = `textColor:${tag}:hash${hash}`;
    let styleObj: Record<string, any> = {};
    try {
      styleObj = JSON.parse(localStorage.getItem(styleKey) || '{}');
    } catch {}
    const color = localStorage.getItem(colorKey);
    if (color) {
      styleObj.color = color;
    }
    return styleObj;
  }

  return (
    <div
      className="min-h-screen"
      data-home-section-id="opportunities-page"
      style={{ backgroundColor: localStorage.getItem('homeSectionBgColor:opportunities-page') || '#f3f4f6' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Briefcase className="w-8 h-8 text-[#003869] mr-3" />
          <h2
            className="text-2xl font-bold outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => setOpportunityField('page-title', 'title' as keyof Opportunity, e.currentTarget.textContent || 'Available Opportunities')}
            style={getPersistedTextStyle('h2', getOpportunityData('page-title')?.title || 'Available Opportunities')}
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
                  style={getPersistedTextStyle('h3', opportunity.title)}
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
                  style={getPersistedTextStyle('span', opportunity.type)}
                >
                  {opportunity.type}
                </span>
                <p
                  className="text-gray-600 mt-3 mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setOpportunityField(opportunity.id, 'description', e.currentTarget.textContent || opportunity.description)}
                  style={getPersistedTextStyle('p', opportunity.description)}
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
                      style={getPersistedTextStyle('span', opportunity.location)}
                    >
                      {opportunity.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {isEditMode ? (
                      <span
                        className="outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                        onBlur={e => setOpportunityField(opportunity.id, 'deadline', e.currentTarget.textContent || opportunity.deadline)}
                        style={getPersistedTextStyle('span', opportunity.deadline)}
                      >
                        {opportunity.deadline}
                      </span>
                    ) : (
                      <span style={getPersistedTextStyle('span', opportunity.deadline)}>
                        Deadline: {opportunity.deadline}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={opportunity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-opportunity-id={opportunity.id}
                  data-opportunities-btn={opportunity.id}
                  onClick={e => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedElement(e.currentTarget);
                    }
                  }}
                  className={`w-full border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors text-center block bg-white text-[#1783b0] hover:bg-[#1783b0] hover:text-white${localStorage.getItem('opportunitiesBtnHoverColor:' + opportunity.id) || localStorage.getItem('opportunitiesBtnHoverTextColor:' + opportunity.id) ? ' custom-hover' : ''}`}
                  style={{
                    backgroundColor: localStorage.getItem('opportunitiesBtnBgColor:' + opportunity.id) || undefined,
                    color: localStorage.getItem('opportunitiesBtnTextColor:' + opportunity.id) || undefined,
                    '--hover-color': localStorage.getItem('opportunitiesBtnHoverColor:' + opportunity.id) || undefined,
                    '--hover-text-color': localStorage.getItem('opportunitiesBtnHoverTextColor:' + opportunity.id) || undefined
                  } as React.CSSProperties}
                >
                  {isEditMode ? (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => {
                        const value = (e.currentTarget && e.currentTarget.textContent) ? e.currentTarget.textContent : 'Apply Now';
                        setOpportunitiesBtnLabels(prev => ({ ...prev, [opportunity.id]: value }));
                      }}
                      style={{ outline: '1px dashed #ccc', cursor: 'text' }}
                    >
                      {opportunitiesBtnLabels[opportunity.id] || 'Apply Now'}
                    </span>
                  ) : (
                    opportunitiesBtnLabels[opportunity.id] || 'Apply Now'
                  )}
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