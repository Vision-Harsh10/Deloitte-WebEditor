import React, { useState, useEffect } from 'react';
import type { Course } from '../types';
import { BookOpen } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';

const courses: Course[] = [
  {
    id: '1',
    title: 'Cloud Computing',
    description: 'Master Cloud Computing: Hands-On, Career-Ready Skills',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/courses/3261/banners/651c0fb790ac3_cloud-computing.jpg?d=800x420',
    duration: '4h 28min',
    level: 'Beginner',
    link: 'https://unstop.com/courses/software-tools/cloud-computing'
  },
  {
    id: '2',
    title: 'Data Analytics',
    description: 'Gain Hands-On Experience in Data Analytics to Drive Real-World Impact',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/courses/4119/banners/652901854fe00_skills_2-06.jpg?d=800x420',
    duration: '2h 30min',
    level: 'Intermediate',
    link: 'https://unstop.com/courses/software-tools/data-analytics'
  },
  {
    id: '3',
    title: 'AI/ML for Business',
    description: 'Master ML and AI for Business: Hands-On, Career-Ready',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/courses/4482/banners/658536695f13f_AI_ML.jpg?d=800x420',
    duration: '2h 23min',
    level: 'Advanced',
    link: 'https://unstop.com/courses/software-tools/machine-learning'
  }
];

interface LearningPageProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const LearningPage: React.FC<LearningPageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const [editableContent, setEditableContent] = useState<Record<string, string>>({});
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({});

  useEffect(() => {
    // Load saved content from localStorage
    const savedContent = localStorage.getItem('learningPageContent');
    if (savedContent) {
      setEditableContent(JSON.parse(savedContent));
    }

    // Load saved image dimensions from localStorage
    const savedDimensions = localStorage.getItem('learningPageImageDimensions');
    if (savedDimensions) {
      setImageDimensions(JSON.parse(savedDimensions));
    }
  }, []);

  const handleContentChange = (id: string, content: string) => {
    const newContent = { ...editableContent, [id]: content };
    setEditableContent(newContent);
    localStorage.setItem('learningPageContent', JSON.stringify(newContent));
  };

  const handleImageResize = (courseId: string, width: number, height: number) => {
    const newDimensions = { ...imageDimensions, [courseId]: { width, height } };
    setImageDimensions(newDimensions);
    localStorage.setItem('learningPageImageDimensions', JSON.stringify(newDimensions));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <BookOpen className="w-8 h-8 text-[#003869] mr-3" />
          <h2
            className="text-2xl font-bold"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => handleContentChange('title', e.currentTarget.textContent || 'Available Courses')}
          >
            {editableContent['title'] || 'Available Courses'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ResizableImage
                src={course.imageUrl}
                alt={course.title}
                isEditMode={isEditMode}
                onResize={(width, height) => handleImageResize(course.id, width, height)}
                className="w-full h-48 object-cover"
                style={{
                  width: imageDimensions[course.id]?.width || '100%',
                  height: imageDimensions[course.id]?.height || '12rem'
                }}
              />
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-2 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`course-${course.id}-title`, e.currentTarget.textContent || course.title)}
                >
                  {editableContent[`course-${course.id}-title`] || course.title}
                </h3>
                <p
                  className="text-gray-600 mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => handleContentChange(`course-${course.id}-description`, e.currentTarget.textContent || course.description)}
                >
                  {editableContent[`course-${course.id}-description`] || course.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span
                    className="outline-none"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                    onBlur={e => handleContentChange(`course-${course.id}-duration`, e.currentTarget.textContent || `Duration: ${course.duration}`)}
                  >
                    {editableContent[`course-${course.id}-duration`] || `Duration: ${course.duration}`}
                  </span>
                  <span
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full outline-none"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                    onBlur={e => handleContentChange(`course-${course.id}-level`, e.currentTarget.textContent || course.level)}
                  >
                    {editableContent[`course-${course.id}-level`] || course.level}
                  </span>
                </div>
                <a href={course.link} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block">
                    Start Learning
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

export default LearningPage;