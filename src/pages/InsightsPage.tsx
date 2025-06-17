import React, { useState, useEffect } from 'react';
import type { Article } from '../types';
import { BookMarked, Clock, User } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';

const articles: Article[] = [
  {
    id: '1',
    title: "2025 Smart Manufacturing and Global's Survey",
    description: 'As factories get smarter, manufacturers tackle talent gaps and operational risks',
    imageUrl: 'https://assets.deloitte.com/is/image/deloitte/US187578_Banner-1920x880:425-x-425?$Responsive$&fmt=webp&fit=stretch,1&wid=425&hei=425&dpr=off',
    date: '01 May 2025', 
    author: 'Deloitte',
    link: 'https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html'
  },
  {
    id: '2',
    title: 'CEO compass: Deloitte Global 2025 Airline CEO Survey',
    description: 'Airline CEOs prioritize financial discipline while investing in tech, talent, and resilience',
    imageUrl: 'https://assets.deloitte.com/is/image/deloitte/US188318_Banner-1920x880:480-x-720?$Responsive$&fmt=webp&fit=stretch,1&wid=480&hei=723&dpr=off',
    date: '29 May 2025',
    author: 'Deloitte',
    link: 'https://www2.deloitte.com/us/en/insights/focus/transportation/ceo-global-airline-survey.html'
  },
  {
    id: '3',
    title: 'US Economic Forecast: Tariffs update',
    description: 'New tariffs may slow GDP growth in the near term before a gradual recovery',
    imageUrl: 'https://assets.deloitte.com/is/image/deloitte/US188283_Banner_1920x880?$Responsive$&fmt=webp&fit=stretch,1&wid=320&dpr=off',
    date: '2025-01-01',
    author: 'Deloitte',
    link: 'https://www2.deloitte.com/us/en/insights/economy/us-economic-forecast/united-states-tariffs-analysis.html'
  }
];

interface InsightsPageProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const InsightsPage: React.FC<InsightsPageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const [editableContent, setEditableContent] = useState<Record<string, string>>({});
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({});

  useEffect(() => {
    // Load saved content from localStorage
    const savedContent = localStorage.getItem('insightsPageContent');
    if (savedContent) {
      setEditableContent(JSON.parse(savedContent));
    }

    // Load saved image dimensions from localStorage
    const savedDimensions = localStorage.getItem('insightsPageImageDimensions');
    if (savedDimensions) {
      setImageDimensions(JSON.parse(savedDimensions));
    }
  }, []);

  const handleContentChange = (id: string, content: string) => {
    const newContent = { ...editableContent, [id]: content };
    setEditableContent(newContent);
    localStorage.setItem('insightsPageContent', JSON.stringify(newContent));
  };

  const handleImageResize = (articleId: string, width: number, height: number) => {
    const newDimensions = { ...imageDimensions, [articleId]: { width, height } };
    setImageDimensions(newDimensions);
    localStorage.setItem('insightsPageImageDimensions', JSON.stringify(newDimensions));
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
            onBlur={e => handleContentChange('hero-title', e.currentTarget.textContent || 'Explore Deloitte Insights')}
          >
            {editableContent['hero-title'] || 'Explore Deloitte Insights'}
          </h1>
          <p
            className="text-xl text-[#ffffff] outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('hero-description', e.currentTarget.textContent || 'Stay updated with the latest in technology and innovation')}
          >
            {editableContent['hero-description'] || 'Stay updated with the latest in technology and innovation'}
          </p>
        </div>
      </div>

      {/* Featured Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <BookMarked className="w-8 h-8 text-[#003869] mr-3" />
          <h2
            className="text-2xl font-bold outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('articles-title', e.currentTarget.textContent || 'Featured Articles')}
          >
            {editableContent['articles-title'] || 'Featured Articles'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
            >
              <ResizableImage
                src={article.imageUrl}
                alt={article.title}
                isEditMode={isEditMode}
                onResize={(width, height) => handleImageResize(article.id, width, height)}
                className="w-full h-48 object-cover"
                style={{
                  width: imageDimensions[article.id]?.width || '100%',
                  height: imageDimensions[article.id]?.height || '12rem'
                }}
              />
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-2 text-[#2b333f] outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`article-${article.id}-title`, e.currentTarget.textContent || article.title)}
                >
                  {editableContent[`article-${article.id}-title`] || article.title}
                </h3>
                <p
                  className="text-[#73859f] mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`article-${article.id}-description`, e.currentTarget.textContent || article.description)}
                >
                  {editableContent[`article-${article.id}-description`] || article.description}
                </p>
                <div className="flex items-center justify-between text-[#303030] text-sm mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span
                      className="outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => handleContentChange(`article-${article.id}-date`, e.currentTarget.textContent || new Date(article.date).toLocaleDateString())}
                    >
                      {editableContent[`article-${article.id}-date`] || new Date(article.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span
                      className="outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => handleContentChange(`article-${article.id}-author`, e.currentTarget.textContent || article.author)}
                    >
                      {editableContent[`article-${article.id}-author`] || article.author}
                    </span>
                  </div>
                </div>
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block">
                    Read More
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mt-16">
          <h2
            className="text-2xl font-bold mb-6 outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('categories-title', e.currentTarget.textContent || 'Browse by Category')}
          >
            {editableContent['categories-title'] || 'Browse by Category'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
            >
              <h3
                className="text-lg font-semibold mb-2 outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('category-1-title', e.currentTarget.textContent || 'Technology Trends')}
              >
                {editableContent['category-1-title'] || 'Technology Trends'}
              </h3>
              <p
                className="text-gray-600 outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('category-1-description', e.currentTarget.textContent || 'Latest developments in computing and technology')}
              >
                {editableContent['category-1-description'] || 'Latest developments in computing and technology'}
              </p>
            </div>
            <div 
              className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
            >
              <h3
                className="text-lg font-semibold mb-2 outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('category-2-title', e.currentTarget.textContent || 'Research Papers')}
              >
                {editableContent['category-2-title'] || 'Research Papers'}
              </h3>
              <p
                className="text-gray-600 outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('category-2-description', e.currentTarget.textContent || 'Academic publications and research findings')}
              >
                {editableContent['category-2-description'] || 'Academic publications and research findings'}
              </p>
            </div>
            <div 
              className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
            >
              <h3
                className="text-lg font-semibold mb-2 outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('category-3-title', e.currentTarget.textContent || 'Industry News')}
              >
                {editableContent['category-3-title'] || 'Industry News'}
              </h3>
              <p
                className="text-gray-600 outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('category-3-description', e.currentTarget.textContent || 'Updates from ServiceNow and the tech industry')}
              >
                {editableContent['category-3-description'] || 'Updates from ServiceNow and the tech industry'}
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-[#000000] text-white rounded-lg p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-2xl font-bold mb-4 outline-none"
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onClick={e => setSelectedElement(e.currentTarget)}
              onBlur={e => handleContentChange('newsletter-title', e.currentTarget.textContent || 'Stay Updated')}
            >
              {editableContent['newsletter-title'] || 'Stay Updated'}
            </h2>
            <p
              className="mb-6 outline-none"
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onClick={e => setSelectedElement(e.currentTarget)}
              onBlur={e => handleContentChange('newsletter-description', e.currentTarget.textContent || 'Subscribe to our newsletter for the latest insights and updates')}
            >
              {editableContent['newsletter-description'] || 'Subscribe to our newsletter for the latest insights and updates'}
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#000000] focus:border-transparent"
              />
              <button className="bg-[#62d84e] text-[#032d42] px-6 py-2 rounded-lg font-semibold transition-colors hover:bg-[#9fe793] hover:text-black">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;