import React, { useState, useEffect } from 'react';
import type { Mentor } from '../types';
import { Users, Star } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';

const mentors: Mentor[] = [
  {
    id: '1',
    name: 'Prabhakar Singh',
    title: 'Senior Consultant at Deloitte',
    expertise: ['Consulting', 'Business Strategy', 'Data Analytics'],
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/mentors/profile/663a035e70036.webp?d=240x240',
    description: '7 years of experience in Consulting & IT, I specialize in Tech & Digital Strategy',
    link: 'https://unstop.com/mentor/prabhakar'
  },
  {
    id: '2',
    name: 'Shrishti Omar',
    title: 'Strategy and Deal Advisory at Deloitte',
    expertise: ['Finance', 'Resume & CV Review', 'Interview Preparation'],
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/mentors/profile/651755da708a6.webp?d=240x240',
    description: 'Guesstimates & Excel Trainer training 300+ students on problem solving & advanced excel',
    link: 'https://unstop.com/mentor/shrishtiomar'
  },
  {
    id: '3',
    name: 'Soham Dasgupta',
    title: 'Deputy Manager at Deloitte',
    expertise: ['Business Analysis', 'Agile Expert & Mentor', 'Project Management'],
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/mentors/profile/678f7bb93afa4.webp?d=240x240',
    description: "Passionate about Agile and Digital Transformation . With 10 years in IT & BPM",
    link: 'https://unstop.com/mentor/soham07dasgupta'
  }
];

interface MentorshipPageProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const MentorshipPage: React.FC<MentorshipPageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const [editableContent, setEditableContent] = useState<Record<string, string>>({});
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({});

  useEffect(() => {
    // Load saved content from localStorage
    const savedContent = localStorage.getItem('mentorshipPageContent');
    if (savedContent) {
      setEditableContent(JSON.parse(savedContent));
    }

    // Load saved image dimensions from localStorage
    const savedDimensions = localStorage.getItem('mentorshipPageImageDimensions');
    if (savedDimensions) {
      setImageDimensions(JSON.parse(savedDimensions));
    }
  }, []);

  const handleContentChange = (id: string, content: string) => {
    const newContent = { ...editableContent, [id]: content };
    setEditableContent(newContent);
    localStorage.setItem('mentorshipPageContent', JSON.stringify(newContent));
  };

  const handleImageResize = (mentorId: string, width: number, height: number) => {
    const newDimensions = { ...imageDimensions, [mentorId]: { width, height } };
    setImageDimensions(newDimensions);
    localStorage.setItem('mentorshipPageImageDimensions', JSON.stringify(newDimensions));
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
            onBlur={e => handleContentChange('hero-title', e.currentTarget.textContent || 'Connect with Deloitte Experts')}
          >
            {editableContent['hero-title'] || 'Connect with Deloitte Experts'}
          </h1>
          <p
            className="text-xl text-[#ffffff] outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('hero-description', e.currentTarget.textContent || 'Learn from industry leaders and accelerate your growth')}
          >
            {editableContent['hero-description'] || 'Learn from industry leaders and accelerate your growth'}
          </p>
        </div>
      </div>

      {/* Mentorship Program Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#000000] rounded-lg shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Star className="w-8 h-8 text-white mr-3" />
            <h2
              className="text-2xl font-bold text-white outline-none"
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onClick={e => setSelectedElement(e.currentTarget)}
              onBlur={e => handleContentChange('program-title', e.currentTarget.textContent || 'Mentorship Program')}
            >
              {editableContent['program-title'] || 'Mentorship Program'}
            </h2>
          </div>
          <p
            className="text-gray-100 mb-6 outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('program-description', e.currentTarget.textContent || 'Connect with Delloite experts who can guide you through your technical journey. Our mentors are industry professionals with extensive experience in various domains of technology.')}
          >
            {editableContent['program-description'] || 'Connect with Delloite experts who can guide you through your technical journey. Our mentors are industry professionals with extensive experience in various domains of technology.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="p-4 rounded-lg transition-all duration-300 hover:shadow-xl"
              style={{ backgroundColor:'#86bc25', '--hover-color': '#9ed12f' } as React.CSSProperties}
            >
              <h3
                className="font-semibold mb-2 text-[#000] outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('feature-1-title', e.currentTarget.textContent || '1:1 Guidance')}
              >
                {editableContent['feature-1-title'] || '1:1 Guidance'}
              </h3>
              <p
                className="text-sm text-[#000] outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('feature-1-description', e.currentTarget.textContent || 'Personalized mentoring sessions with experts')}
              >
                {editableContent['feature-1-description'] || 'Personalized mentoring sessions with experts'}
              </p>
            </div>
            <div 
              className="p-4 rounded-lg transition-all duration-300 hover:shadow-xl"
              style={{ backgroundColor: '#86bc25', '--hover-color': '#9ed12f' } as React.CSSProperties}
            >
              <h3
                className="font-semibold mb-2 text-[#000] outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('feature-2-title', e.currentTarget.textContent || 'Career Support')}
              >
                {editableContent['feature-2-title'] || 'Career Support'}
              </h3>
              <p
                className="text-sm text-[#000] outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('feature-2-description', e.currentTarget.textContent || 'Get insights for career growth and development')}
              >
                {editableContent['feature-2-description'] || 'Get insights for career growth and development'}
              </p>
            </div>
            <div 
              className="p-4 rounded-lg transition-all duration-300 hover:shadow-xl"
              style={{ backgroundColor: '#86bc25', '--hover-color': '#9ed12f' } as React.CSSProperties}
            >
              <h3
                className="font-semibold mb-2 text-[#000] outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('feature-3-title', e.currentTarget.textContent || 'Technical Excellence')}
              >
                {editableContent['feature-3-title'] || 'Technical Excellence'}
              </h3>
              <p
                className="text-sm text-[#000] outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => handleContentChange('feature-3-description', e.currentTarget.textContent || 'Learn best practices and industry standards')}
              >
                {editableContent['feature-3-description'] || 'Learn best practices and industry standards'}
              </p>
            </div>
          </div>
        </div>

        {/* Available Mentors */}
        <div className="flex items-center mb-8">
          <Users className="w-8 h-8 text-[#003869] mr-3" />
          <h2
            className="text-2xl font-bold outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('mentors-title', e.currentTarget.textContent || 'Our Mentors')}
          >
            {editableContent['mentors-title'] || 'Our Mentors'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative w-full h-48">
                {/* Blurred Background */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-md"
                  style={{
                    backgroundImage: `url(${mentor.imageUrl})`,
                  }}
                ></div>

                {/* Centered Image */}
                <div className="relative flex items-center justify-center w-full h-full">
                  <ResizableImage
                    src={mentor.imageUrl}
                    alt={mentor.name}
                    isEditMode={isEditMode}
                    onResize={(width, height) => handleImageResize(mentor.id, width, height)}
                    className="w-44 h-44 rounded-full object-cover"
                    style={{
                      width: imageDimensions[mentor.id]?.width || '11rem',
                      height: imageDimensions[mentor.id]?.height || '11rem'
                    }}
                    showChangeButton={true}
                  />
                </div>
              </div>
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-1 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`mentor-${mentor.id}-name`, e.currentTarget.textContent || mentor.name)}
                >
                  {editableContent[`mentor-${mentor.id}-name`] || mentor.name}
                </h3>
                <p
                  className="text-gray-600 mb-2 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`mentor-${mentor.id}-title`, e.currentTarget.textContent || mentor.title)}
                >
                  {editableContent[`mentor-${mentor.id}-title`] || mentor.title}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => handleContentChange(`mentor-${mentor.id}-expertise-${index}`, e.currentTarget.textContent || skill)}
                    >
                      {editableContent[`mentor-${mentor.id}-expertise-${index}`] || skill}
                    </span>
                  ))}
                </div>
                <p
                  className="text-gray-600 mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`mentor-${mentor.id}-description`, e.currentTarget.textContent || mentor.description)}
                >
                  {editableContent[`mentor-${mentor.id}-description`] || mentor.description}
                </p>
                <a href={mentor.link} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block">
                    Connect with Mentor
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

export default MentorshipPage;