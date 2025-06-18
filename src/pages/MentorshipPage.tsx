import React, { useState, useEffect } from 'react';
import type { Mentor } from '../types';
import { Users, Star, Camera } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';
import { useMentorshipPageEdit } from '../context/MentorshipPageEditContext';

export const mentors: Mentor[] = [
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
  const { mentorList, setMentorImage, setMentorField } = useMentorshipPageEdit();

  useEffect(() => {
    // Expose setMentorField for EditModeControls
    (window as any).setMentorFieldForEditPanel = setMentorField;
    return () => { (window as any).setMentorFieldForEditPanel = undefined; };
  }, [setMentorField]);

  // Helper to get mentor data from context or initial array
  const getMentorData = (mentorId: string) => {
    return mentorList.find(m => m.id === mentorId) || mentors.find(m => m.id === mentorId);
  };

  // Helper to update expertise (since it's an array)
  const handleExpertiseChange = (mentorId: string, index: number, newSkill: string) => {
    const mentor = getMentorData(mentorId);
    if (mentor) {
      const updatedExpertise = [...mentor.expertise];
      updatedExpertise[index] = newSkill;
      setMentorField(mentorId, 'expertise', updatedExpertise);
    }
  };

  // Handler for uploading a new mentor image
  const handleMentorImageUpload = (mentorId: string, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setMentorImage(mentorId, result);
    };
    reader.readAsDataURL(file);
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
            onBlur={e => setMentorField('hero-title', 'name' as keyof Mentor, e.currentTarget.textContent || 'Connect with Deloitte Experts')}
          >
            {getMentorData('hero-title')?.name || 'Connect with Deloitte Experts'}
          </h1>
          <p
            className="text-xl text-[#ffffff] outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => setMentorField('hero-description', 'description' as keyof Mentor, e.currentTarget.textContent || 'Learn from industry leaders and accelerate your growth')}
          >
            {getMentorData('hero-description')?.description || 'Learn from industry leaders and accelerate your growth'}
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
              onBlur={e => setMentorField('program-title', 'name' as keyof Mentor, e.currentTarget.textContent || 'Mentorship Program')}
            >
              {getMentorData('program-title')?.name || 'Mentorship Program'}
            </h2>
          </div>
          <p
            className="text-gray-100 mb-6 outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => setMentorField('program-description', 'description' as keyof Mentor, e.currentTarget.textContent || 'Connect with Delloite experts who can guide you through your technical journey. Our mentors are industry professionals with extensive experience in various domains of technology.')}
          >
            {getMentorData('program-description')?.description || 'Connect with Delloite experts who can guide you through your technical journey. Our mentors are industry professionals with extensive experience in various domains of technology.'}
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
                onBlur={e => setMentorField('feature-1-title', 'name' as keyof Mentor, e.currentTarget.textContent || '1:1 Guidance')}
              >
                {getMentorData('feature-1-title')?.name || '1:1 Guidance'}
              </h3>
              <p
                className="text-sm text-[#000] outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => setMentorField('feature-1-description', 'description' as keyof Mentor, e.currentTarget.textContent || 'Personalized mentoring sessions with experts')}
              >
                {getMentorData('feature-1-description')?.description || 'Personalized mentoring sessions with experts'}
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
                onBlur={e => setMentorField('feature-2-title', 'name' as keyof Mentor, e.currentTarget.textContent || 'Career Support')}
              >
                {getMentorData('feature-2-title')?.name || 'Career Support'}
              </h3>
              <p
                className="text-sm text-[#000] outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => setMentorField('feature-2-description', 'description' as keyof Mentor, e.currentTarget.textContent || 'Get insights for career growth and development')}
              >
                {getMentorData('feature-2-description')?.description || 'Get insights for career growth and development'}
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
                onBlur={e => setMentorField('feature-3-title', 'name' as keyof Mentor, e.currentTarget.textContent || 'Technical Excellence')}
              >
                {getMentorData('feature-3-title')?.name || 'Technical Excellence'}
              </h3>
              <p
                className="text-sm text-[#000] outline-none"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => setSelectedElement(e.currentTarget)}
                onBlur={e => setMentorField('feature-3-description', 'description' as keyof Mentor, e.currentTarget.textContent || 'Learn best practices and industry standards')}
              >
                {getMentorData('feature-3-description')?.description || 'Learn best practices and industry standards'}
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
            onBlur={e => setMentorField('mentors-title', 'name' as keyof Mentor, e.currentTarget.textContent || 'Our Mentors')}
          >
            {getMentorData('mentors-title')?.name || 'Our Mentors'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentorList.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative w-full h-48 flex items-center justify-center">
                {/* Blurred Background */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-md"
                  style={{
                    backgroundImage: `url(${mentor.imageUrl})`,
                  }}
                ></div>

                {/* Centered Circular Profile Image */}
                <ResizableImage
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  isEditMode={false}
                  onResize={(width, height) => setMentorImage(mentor.id, width.toString())}
                  className="w-44 h-44 rounded-full object-cover z-10"
                  showChangeButton={false}
                  showMoveButton={false}
                />
                {isEditMode && (
                  <label htmlFor={`upload-mentor-image-${mentor.id}`} className="absolute bottom-2 right-2 z-20 cursor-pointer bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <Camera className="w-5 h-5 text-gray-700" />
                    <input
                      id={`upload-mentor-image-${mentor.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleMentorImageUpload(mentor.id, e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-1 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setMentorField(mentor.id, 'name', e.currentTarget.textContent || mentor.name)}
                >
                  {mentor.name}
                </h3>
                <p
                  className="text-gray-600 mb-2 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setMentorField(mentor.id, 'title', e.currentTarget.textContent || mentor.title)}
                >
                  {mentor.title}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm outline-none"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onClick={e => setSelectedElement(e.currentTarget)}
                      onBlur={e => handleExpertiseChange(mentor.id, index, e.currentTarget.textContent || skill)}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p
                  className="text-gray-600 mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setMentorField(mentor.id, 'description', e.currentTarget.textContent || mentor.description)}
                >
                  {mentor.description}
                </p>
                <a
                  href={mentor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-mentor-id={mentor.id}
                  onClick={e => {
                    if (isEditMode) {
                      e.preventDefault(); // Prevent navigation
                      e.stopPropagation(); // Stop event propagation
                      setSelectedElement(e.currentTarget); // Select the <a> tag directly
                    }
                  }}
                >
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