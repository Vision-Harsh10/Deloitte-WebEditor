import React, { useState, useEffect } from 'react';
import type { Article } from '../types';
import { BookMarked, Clock, User } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';
import { useInsightsPageEdit } from '../context/InsightsPageEditContext';

export const articles: Article[] = [
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
  const {
    articleList,
    setArticleImage,
    setArticleField,
    imageDimensions,
    setArticleImageDimensions
  } = useInsightsPageEdit();

  useEffect(() => {
    // Expose setArticleField for EditModeControls
    (window as any).setArticleFieldForEditPanel = setArticleField;
    return () => { (window as any).setArticleFieldForEditPanel = undefined; };
  }, [setArticleField]);

  // Helper to get article data from context or initial array
  const getArticleData = (articleId: string) => {
    return articleList.find(a => a.id === articleId) || articles.find(a => a.id === articleId);
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
            onBlur={e => setArticleField('hero-title', 'title' as keyof Article, e.currentTarget.textContent || 'Explore Deloitte Insights')}
          >
            {getArticleData('hero-title')?.title || 'Explore Deloitte Insights'}
          </h1>
          <p
            className="text-xl text-[#ffffff] outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => setArticleField('hero-description', 'description' as keyof Article, e.currentTarget.textContent || 'Stay updated with the latest in technology and innovation')}
          >
            {getArticleData('hero-description')?.description || 'Stay updated with the latest in technology and innovation'}
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
            onBlur={e => setArticleField('articles-title', 'title' as keyof Article, e.currentTarget.textContent || 'Featured Articles')}
          >
            {getArticleData('articles-title')?.title || 'Featured Articles'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articleList.map((article) => (
            <div 
              key={article.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
            >
              <ResizableImage
                src={article.imageUrl}
                alt={article.title}
                isEditMode={isEditMode}
                onResize={(width, height) => setArticleImageDimensions(article.id, width, height)}
                className={`object-cover ${!imageDimensions[article.id] ? 'w-full h-48' : ''}`}
                style={{
                  ...(imageDimensions[article.id]?.width ? { width: imageDimensions[article.id].width + 'px' } : {}),
                  ...(imageDimensions[article.id]?.height ? { height: imageDimensions[article.id].height + 'px' } : {}),
                }}
              />
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-2 text-[#2b333f] outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setArticleField(article.id, 'title', e.currentTarget.textContent || article.title)}
                >
                  {article.title}
                </h3>
                <p
                  className="text-[#73859f] mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setArticleField(article.id, 'description', e.currentTarget.textContent || article.description)}
                >
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-[#303030] text-sm mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span
                      className="outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => setArticleField(article.id, 'date', e.currentTarget.textContent || article.date)}
                    >
                      {article.date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span
                      className="outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => setArticleField(article.id, 'author', e.currentTarget.textContent || article.author)}
                    >
                      {article.author}
                    </span>
                  </div>
                </div>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-article-id={article.id}
                  onClick={e => {
                    if (isEditMode) {
                      e.preventDefault(); // Prevent navigation
                      e.stopPropagation(); // Stop event propagation
                      setSelectedElement(e.currentTarget); // Select the <a> tag directly
                    }
                  }}
                >
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
            onBlur={e => setArticleField('categories-title', 'title' as keyof Article, e.currentTarget.textContent || 'Browse by Category')}
          >
            {getArticleData('categories-title')?.title || 'Browse by Category'}
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
                onBlur={e => setArticleField('category-1-title', 'title' as keyof Article, e.currentTarget.textContent || 'Technology Trends')}
              >
                {getArticleData('category-1-title')?.title || 'Technology Trends'}
              </h3>
              <p
                className="text-gray-600 outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => setArticleField('category-1-description', 'description' as keyof Article, e.currentTarget.textContent || 'Latest developments in computing and technology')}
              >
                {getArticleData('category-1-description')?.description || 'Latest developments in computing and technology'}
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
                onBlur={e => setArticleField('category-2-title', 'title' as keyof Article, e.currentTarget.textContent || 'Research Papers')}
              >
                {getArticleData('category-2-title')?.title || 'Research Papers'}
              </h3>
              <p
                className="text-gray-600 outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => setArticleField('category-2-description', 'description' as keyof Article, e.currentTarget.textContent || 'Academic publications and research findings')}
              >
                {getArticleData('category-2-description')?.description || 'Academic publications and research findings'}
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
                onBlur={e => setArticleField('category-3-title', 'title' as keyof Article, e.currentTarget.textContent || 'Industry News')}
              >
                {getArticleData('category-3-title')?.title || 'Industry News'}
              </h3>
              <p
                className="text-gray-600 outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => setArticleField('category-3-description', 'description' as keyof Article, e.currentTarget.textContent || 'Updates from ServiceNow and the tech industry')}
              >
                {getArticleData('category-3-description')?.description || 'Updates from ServiceNow and the tech industry'}
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
              onBlur={e => setArticleField('newsletter-title', 'title' as keyof Article, e.currentTarget.textContent || 'Stay Updated')}
            >
              {getArticleData('newsletter-title')?.title || 'Stay Updated'}
            </h2>
            <p
              className="mb-6 outline-none"
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onClick={e => setSelectedElement(e.currentTarget)}
              onBlur={e => setArticleField('newsletter-description', 'description' as keyof Article, e.currentTarget.textContent || 'Subscribe to our newsletter for the latest insights and updates')}
            >
              {getArticleData('newsletter-description')?.description || 'Subscribe to our newsletter for the latest insights and updates'}
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