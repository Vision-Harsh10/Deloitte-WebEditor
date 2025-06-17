import React, { useState, useEffect } from 'react';
import type { Course } from '../types';
import { BookOpen, Clock, User } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';
import { useLearningPageEdit, LearningPageEditProvider } from '../context/LearningPageEditContext';

export const courses: Course[] = [
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
  // Create initial content from courses
  const initialContent = {
    courseContent: Object.fromEntries(
      courses.map(course => [
        course.id,
        {
          title: course.title,
          description: course.description,
          duration: course.duration,
          level: course.level,
          imageUrl: course.imageUrl,
          link: course.link
        }
      ])
    )
  };

  return (
    <LearningPageEditProvider initialContent={initialContent}>
      <LearningPageContent
        isEditMode={isEditMode}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
      />
    </LearningPageEditProvider>
  );
};

const LearningPageContent: React.FC<LearningPageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const {
    courseList,
    setCourseImage,
    setCourseField,
    imageDimensions,
    setCourseImageDimensions
  } = useLearningPageEdit();

  useEffect(() => {
    // Expose setCourseField for EditModeControls
    (window as any).setCourseFieldForEditPanel = setCourseField;
    return () => { (window as any).setCourseFieldForEditPanel = undefined; };
  }, [setCourseField]);

  useEffect(() => {
    console.log('LearningPage rendered. Current course links:', courseList.map(c => ({ id: c.id, link: c.link })));
  }, [courseList]);

  // Helper to get course data from context or initial array
  const getCourseData = (courseId: string) => {
    return courseList.find(c => c.id === courseId) || courses.find(c => c.id === courseId);
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
            onBlur={e => setCourseField('hero-title', 'title' as keyof Course, e.currentTarget.textContent || 'Explore Learning')}
          >
            {getCourseData('hero-title')?.title || 'Explore Learning'}
          </h1>
          <p
            className="text-xl text-[#ffffff] outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => setCourseField('hero-description', 'description' as keyof Course, e.currentTarget.textContent || 'Discover courses and resources to enhance your skills')}
          >
            {getCourseData('hero-description')?.description || 'Discover courses and resources to enhance your skills'}
          </p>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <BookOpen className="w-8 h-8 text-[#003869] mr-3" />
          <h2
            className="text-2xl font-bold outline-none"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            onBlur={e => setCourseField('courses-title', 'title' as keyof Course, e.currentTarget.textContent || 'Featured Courses')}
          >
            {getCourseData('courses-title')?.title || 'Featured Courses'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseList.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
            >
              <ResizableImage
                src={course.imageUrl}
                alt={course.title}
                isEditMode={isEditMode}
                onResize={(width, height) => setCourseImageDimensions(course.id, width, height)}
                className={`object-cover ${!imageDimensions[course.id] ? 'w-full h-48' : ''}`}
                style={{
                  ...(imageDimensions[course.id]?.width ? { width: imageDimensions[course.id].width + 'px' } : {}),
                  ...(imageDimensions[course.id]?.height ? { height: imageDimensions[course.id].height + 'px' } : {}),
                }}
                showChangeButton={false}
                onImageChange={newUrl => setCourseImage(course.id, newUrl)}
                imgProps={{ ['data-course-id']: course.id } as any}
              />
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-2 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setCourseField(course.id, 'title', e.currentTarget.textContent || course.title)}
                >
                  {course.title}
                </h3>
                <p
                  className="text-gray-600 mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onClick={e => setSelectedElement(e.currentTarget)}
                  onBlur={e => setCourseField(course.id, 'description', e.currentTarget.textContent || course.description)}
                >
                  {course.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span
                    className="outline-none"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                    onBlur={e => setCourseField(course.id, 'duration', e.currentTarget.textContent || course.duration)}
                  >
                    Duration: {course.duration}
                  </span>
                  <span
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full outline-none"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onClick={e => setSelectedElement(e.currentTarget)}
                    onBlur={e => setCourseField(course.id, 'level', e.currentTarget.textContent || course.level)}
                  >
                    {course.level}
                  </span>
                </div>
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-course-id={course.id}
                  onClick={e => {
                    if (isEditMode) {
                      e.preventDefault(); // Prevent navigation
                      e.stopPropagation(); // Stop event propagation
                      setSelectedElement(e.currentTarget); // Select the <a> tag directly
                    }
                  }}
                >
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