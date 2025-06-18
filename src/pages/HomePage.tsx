import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import { Award, Calendar, BookOpen, Clock, Users, Briefcase, User, GraduationCap, BookMarked, Trophy, Star, Camera } from 'lucide-react';
import type { Event, Course, Lab, Opportunity, Mentor, Article } from '../types';
import Leaderboard from '../components/Leaderboard';
import ResizableImage from '../components/ResizableImage';
import { HomePageEditProvider, useHomePageEdit } from '../context/HomePageEditContext';
import type { EditableContent } from '../context/HomePageEditContext';

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

const featuredEvents: Event[] = [
  {
    id: '1',
    name:  "Deloitte | Frost & Sullivan (Paid Internships Offered",
    description: 'Crack real-world cases. Compete with the best. Lead with insight',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/banner/67e65f709adf0_shri-ram-case-conundrum-i-deloitte-i-frost-sullivan-paid-internships-offered.webp?d=1920x557',
    attendees: 3404,
    date: '29 Mar 25',
    impact: 'Design innovative business idea',
    link: 'https://unstop.com/competitions/shri-ram-case-conundrum-shri-ram-economics-summit-2025-srcc-du-1415627'
  },
  {
    id: '2',
    name: 'Shri Ram Investment Competition | Deloitte | Moneyvesta Capital | GCR',
    description: 'Test your investment in real-world market scenarios and compete to be a top strategist!',
    imageUrl:'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/banner/67f80ec172b34_shri-ram-investment-competition-deloitte-moneyvesta-capital-gcr.webp?d=1920x557',
    attendees: 3231,
    date: '15 Apr 25',
    impact  : 'Lead the way forward with your tech expertis',
    link: 'https://unstop.com/competitions/servicenow-women-code-to-win-2024-india-servicenow-838054'
  },
  {
    id: '3',
    name: 'Senior Analyst – Strategy & Operations at Deloitte',
    description: 'Deloitte is hiring for the position of Senior Analyst!',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2021/08/Deloitte-Emblem.png',
    attendees: 21119,
    impact: 'Join a leading tech company and make an impact',
    date: '20 Jun 22',
    link: 'http://unstop.com/jobs/senior-analyst-deloitte-us-india-360361'
  }
];

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

const featuredCourses: Course[] = [
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

const featuredLabs: Lab[] = [
  {
    id: '1',
    title: 'AI Model Optimization Lab',
    description: 'Learn to optimize AI models using ServiceNow OpenVINO toolkit.',
    type: 'virtual',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80',
    difficulty: 'Intermediate'
  },
  {
    id: '2',
    title: 'Parallel Computing Workshop',
    description: 'Physical workshop on parallel computing concepts.',
    type: 'physical',
    imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80',
    difficulty: 'Advanced'
  },
  {
    id: '3',
    title: 'IoT Development Kit Lab',
    description: 'Get started with IoT development using ServiceNow kits.',
    type: 'physical',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
    difficulty: 'Beginner'
  }
];

interface HomePageProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const initialContent = {
  sectionTitles: {
    events: 'Featured Events',
    courses: 'Featured Courses',
    mentors: 'Featured Mentors',
    opportunities: 'Featured Opportunities',
    articles: 'Featured Articles',
  },
  mentorImages: mentors.reduce((acc, mentor) => { acc[mentor.id] = mentor.imageUrl; return acc; }, {} as Record<string, string>),
  eventContent: featuredEvents.reduce((acc, event) => {
    acc[event.id] = {
      name: event.name,
      description: event.description,
      date: event.date,
      attendees: event.attendees,
      imageUrl: event.imageUrl,
    };
    return acc;
  }, {} as Record<string, any>),
  courseContent: featuredCourses.reduce((acc, course) => {
    acc[course.id] = {
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
      imageUrl: course.imageUrl,
    };
    return acc;
  }, {} as Record<string, any>),
  opportunityContent: opportunities.reduce((acc, opportunity) => {
    acc[opportunity.id] = {
      title: opportunity.title,
      description: opportunity.description,
      type: opportunity.type,
      location: opportunity.location,
      deadline: opportunity.deadline,
      link: opportunity.link,
    };
    return acc;
  }, {} as Record<string, any>),
  articleContent: articles.reduce((acc, article) => {
    acc[article.id] = {
      title: article.title,
      description: article.description,
      date: article.date,
      author: article.author,
      link: article.link,
    };
    return acc;
  }, {} as Record<string, any>),
};

const HomePageContent: React.FC<HomePageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const {
    editableContent,
    setSectionTitle,
    setEventContent,
    setEventField,
    setCourseContent,
    setOpportunityContent,
    setArticleContent,
    setMentorImage,
    setEventImage,
    setCourseImage,
    imageDimensions,
    setImageDimensions,
    setCourseField,
    setOpportunityField,
    setArticleField,
    setEditableContent,
  } = useHomePageEdit();

  // Save to localStorage on exit edit mode
  useEffect(() => {
    if (!isEditMode) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      // Save all content to localStorage
      localStorage.setItem('homePageContent', JSON.stringify(editableContent));
      localStorage.setItem('homePageImageDimensions', JSON.stringify(imageDimensions));
    }
  }, [isEditMode, editableContent, imageDimensions]);

  // Handler for global upload image action
  const handleGlobalUploadImage = (file: File) => {
    if (!selectedElement) return;
    const element = selectedElement;
    const eventId = element.getAttribute('data-event-id');
    const courseId = element.getAttribute('data-course-id');
    const mentorId = element.getAttribute('data-mentor-id');
    const articleId = element.getAttribute('data-article-id');
    const opportunityId = element.getAttribute('data-opportunity-id');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (eventId) {
        setEventImage(eventId, result);
        // Update localStorage for events
        const updatedEvents = { ...editableContent.eventContent };
        updatedEvents[eventId] = { ...updatedEvents[eventId], imageUrl: result };
        localStorage.setItem('homePageContent', JSON.stringify({
          ...editableContent,
          eventContent: updatedEvents
        }));
      } else if (courseId) {
        setCourseImage(courseId, result);
        // Update localStorage for courses
        const updatedCourses = { ...editableContent.courseContent };
        updatedCourses[courseId] = { ...updatedCourses[courseId], imageUrl: result };
        localStorage.setItem('homePageContent', JSON.stringify({
          ...editableContent,
          courseContent: updatedCourses
        }));
      } else if (mentorId) {
        setMentorImage(mentorId, result);
        // Update localStorage for mentors
        const updatedMentors = { ...editableContent.mentorImages };
        updatedMentors[mentorId] = result;
        localStorage.setItem('homePageContent', JSON.stringify({
          ...editableContent,
          mentorImages: updatedMentors
        }));
      } else if (articleId) {
        // Update article image through context
        const updatedArticles = { ...editableContent.articleContent };
        updatedArticles[articleId] = { ...updatedArticles[articleId], imageUrl: result };
        setEditableContent((prev: EditableContent) => ({
          ...prev,
          articleContent: updatedArticles
        }));
        // Update localStorage
        localStorage.setItem('homePageContent', JSON.stringify({
          ...editableContent,
          articleContent: updatedArticles
        }));
      } else if (opportunityId) {
        // Update opportunity image through context
        const updatedOpportunities = { ...editableContent.opportunityContent };
        updatedOpportunities[opportunityId] = { ...updatedOpportunities[opportunityId], imageUrl: result };
        setEditableContent((prev: EditableContent) => ({
          ...prev,
          opportunityContent: updatedOpportunities
        }));
        // Update localStorage
        localStorage.setItem('homePageContent', JSON.stringify({
          ...editableContent,
          opportunityContent: updatedOpportunities
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Image resize handler
  const handleImageResize = (id: string, width: number, height: number) => {
    setImageDimensions(id, width, height);
    // Update localStorage for image dimensions
    const updatedDimensions = { ...imageDimensions, [id]: { width, height } };
    localStorage.setItem('homePageImageDimensions', JSON.stringify(updatedDimensions));
  };

  React.useEffect(() => {
    // Expose setEventField for EditModeControls
    (window as any).setEventFieldForEditPanel = setEventField;
    (window as any).setCourseFieldForEditPanel = setCourseField;
    (window as any).setOpportunityFieldForEditPanel = setOpportunityField;
    (window as any).setArticleFieldForEditPanel = setArticleField;
    
    return () => {
      (window as any).setEventFieldForEditPanel = undefined;
      (window as any).setCourseFieldForEditPanel = undefined;
      (window as any).setOpportunityFieldForEditPanel = undefined;
      (window as any).setArticleFieldForEditPanel = undefined;
    };
  }, [setEventField, setCourseField, setOpportunityField, setArticleField]);

  return (
    <>
      <main>
        <HeroBanner isEditMode={isEditMode} setSelectedElement={setSelectedElement} />
        <Leaderboard isEditMode={isEditMode} setSelectedElement={setSelectedElement} />
        
        {/* Featured Events Section */}
        <section className="py-16 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-[#000] mr-3" />
                {isEditMode ? (
                  <h2
                    className="text-2xl font-bold text-[#000] outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => setSectionTitle('events', e.currentTarget.textContent || '')}
                    onClick={e => setSelectedElement(e.currentTarget)}
                  >
                    {editableContent.sectionTitles.events}
                  </h2>
                ) : (
                  <h2 className="text-2xl font-bold text-[#000]">{editableContent.sectionTitles.events}</h2>
                )}
              </div>
              <Link to="/events" className="text-[#2b333f] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2">
                View All Events
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                  style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
                >
                  <ResizableImage
                    src={editableContent.eventContent[event.id]?.imageUrl || event.imageUrl}
                    alt={editableContent.eventContent[event.id]?.name || event.name}
                    isEditMode={isEditMode}
                    onResize={(width, height) => handleImageResize(`event-${event.id}`, width, height)}
                    className="w-full h-[11rem] object-cover object-center"
                    style={{
                      ...(imageDimensions[`event-${event.id}`]?.width ? { width: imageDimensions[`event-${event.id}`].width + 'px' } : {}),
                      ...(imageDimensions[`event-${event.id}`]?.height ? { height: imageDimensions[`event-${event.id}`].height + 'px' } : {}),
                    }}
                    showMoveButton={false}
                    showChangeButton={true}
                    onImageChange={newUrl => {
                      setEventImage(event.id, newUrl);
                      // Force a re-render by updating the event content through the context
                      const updatedEvents = { ...editableContent.eventContent };
                      updatedEvents[event.id] = { ...updatedEvents[event.id], imageUrl: newUrl };
                      setEditableContent(prev => ({
                        ...prev,
                        eventContent: updatedEvents
                      }));
                      localStorage.setItem('homePageContent', JSON.stringify({
                        ...editableContent,
                        eventContent: updatedEvents
                      }));
                    }}
                    imgProps={{ ['data-event-id']: event.id } as any}
                  />
                  <div className="p-6">
                    {isEditMode ? (
                      <h3
                        className="text-xl font-semibold mb-2 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => setEventField(event.id, 'name', e.currentTarget.textContent || '')}
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {editableContent.eventContent[event.id]?.name || event.name}
                      </h3>
                    ) : (
                      <h3 className="text-xl font-semibold mb-2">{editableContent.eventContent[event.id]?.name || event.name}</h3>
                    )}
                    {isEditMode ? (
                      <p
                        className="text-gray-600 mb-4 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => setEventField(event.id, 'description', e.currentTarget.textContent || '')}
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {editableContent.eventContent[event.id]?.description || event.description}
                      </p>
                    ) : (
                      <p className="text-gray-600 mb-4">{editableContent.eventContent[event.id]?.description || event.description}</p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      {isEditMode ? (
                        <span
                          className="outline-none"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={e => setEventField(event.id, 'date', e.currentTarget.textContent || '')}
                          onClick={e => setSelectedElement(e.currentTarget)}
                        >
                          Date: {editableContent.eventContent[event.id]?.date || event.date}
                        </span>
                      ) : (
                        <span>Date: {new Date(editableContent.eventContent[event.id]?.date || event.date).toLocaleDateString()}</span>
                      )}
                      {isEditMode ? (
                        <span
                          className="outline-none"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={e => setEventField(event.id, 'attendees', Number(e.currentTarget.textContent) || 0)}
                          onClick={e => setSelectedElement(e.currentTarget)}
                        >
                          {editableContent.eventContent[event.id]?.attendees || event.attendees} attendees
                        </span>
                      ) : (
                        <span>{editableContent.eventContent[event.id]?.attendees || event.attendees} attendees</span>
                      )}
                    </div>
                    <a href={editableContent.eventContent[event.id]?.link || event.link} target="_blank" rel="noopener noreferrer" data-event-id={event.id}>
                      <button className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block">
                        Register Now
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-[#000] mr-3" />
                {isEditMode ? (
                  <h2
                    className="text-2xl font-bold text-[#000] outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => setSectionTitle('courses', e.currentTarget.textContent || '')}
                    onClick={e => setSelectedElement(e.currentTarget)}
                  >
                    {editableContent.sectionTitles.courses}
                  </h2>
                ) : (
                  <h2 className="text-2xl font-bold text-[#000]">{editableContent.sectionTitles.courses}</h2>
                )}
              </div>
              <Link to="/learning" className="text-[#2b333f] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2">
                View All Courses
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                  style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
                >
                  <div className="aspect-[16/9] w-full">
                    <ResizableImage
                      src={editableContent.courseContent[course.id]?.imageUrl || course.imageUrl}
                      alt={course.title}
                      isEditMode={isEditMode}
                      onResize={(width, height) => handleImageResize(`course-${course.id}`, width, height)}
                      className="w-full h-full object-cover object-center rounded-t-lg"
                      style={{
                        ...(imageDimensions[`course-${course.id}`]?.width ? { width: imageDimensions[`course-${course.id}`].width + 'px' } : {}),
                        ...(imageDimensions[`course-${course.id}`]?.height ? { height: imageDimensions[`course-${course.id}`].height + 'px' } : {}),
                      }}
                      showMoveButton={false}
                      showChangeButton={true}
                      onImageChange={newUrl => {
                        setCourseImage(course.id, newUrl);
                        // Force a re-render by updating the course content through the context
                        const updatedCourses = { ...editableContent.courseContent };
                        updatedCourses[course.id] = { ...updatedCourses[course.id], imageUrl: newUrl };
                        setEditableContent(prev => ({
                          ...prev,
                          courseContent: updatedCourses
                        }));
                        localStorage.setItem('homePageContent', JSON.stringify({
                          ...editableContent,
                          courseContent: updatedCourses
                        }));
                      }}
                      imgProps={{ ['data-course-id']: course.id } as any}
                    />
                  </div>
                  <div className="p-6">
                    {isEditMode ? (
                      <h3
                        className="text-xl font-semibold mb-2 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => setCourseField(course.id, 'title', e.currentTarget.textContent || '')}
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {editableContent.courseContent[course.id]?.title || course.title}
                      </h3>
                    ) : (
                      <h3 className="text-xl font-semibold mb-2">{editableContent.courseContent[course.id]?.title || course.title}</h3>
                    )}
                    {isEditMode ? (
                      <p
                        className="text-gray-600 mb-4 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => setCourseField(course.id, 'description', e.currentTarget.textContent || '')}
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {editableContent.courseContent[course.id]?.description || course.description}
                      </p>
                    ) : (
                      <p className="text-gray-600 mb-4">{editableContent.courseContent[course.id]?.description || course.description}</p>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      {isEditMode ? (
                        <span
                          className="text-sm text-gray-500 outline-none"
                          contentEditable
                          suppressContentEditableWarning
                          onClick={e => setSelectedElement(e.currentTarget)}
                        >
                          Duration: {editableContent.courseContent[course.id]?.duration || course.duration}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Duration: {editableContent.courseContent[course.id]?.duration || course.duration}</span>
                      )}
                      {isEditMode ? (
                        <span
                          style={{ backgroundColor: '#003869', color: '#FFFFFF', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}
                          className="outline-none"
                          contentEditable
                          suppressContentEditableWarning
                          onClick={e => setSelectedElement(e.currentTarget)}
                        >
                          {editableContent.courseContent[course.id]?.level || course.level}
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#003869', color: '#FFFFFF', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                          {editableContent.courseContent[course.id]?.level || course.level}
                        </span>
                      )}
                    </div>
                    <a href={editableContent.courseContent[course.id]?.link || course.link} target="_blank" rel="noopener noreferrer" data-course-id={course.id}>
                      <button className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block">
                        Start Learning
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
              
        {/* Mentorship Program Section */}
        <section className="py-16 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-[#000] mr-3" />
                {isEditMode ? (
                  <h2
                    className="text-2xl font-bold text-[#000] outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => setSectionTitle('mentors', e.currentTarget.textContent || '')}
                    onClick={e => setSelectedElement(e.currentTarget)}
                  >
                    {editableContent.sectionTitles.mentors}
                  </h2>
                ) : (
                  <h2 className="text-2xl font-bold text-[#000]">{editableContent.sectionTitles.mentors}</h2>
                )}
              </div>
              <Link to="/mentorship" className="text-[#2b333f] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2">
                View All Mentors
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mentors.map((mentor) => (
                <div 
                  key={mentor.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                  style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
                >
                  <div className="relative w-full h-48 flex items-center justify-center">
                    {/* Blurred Background */}
                    <img
                      src={editableContent.mentorImages[mentor.id] || mentor.imageUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover object-center blur-lg scale-110"
                      style={{ zIndex: 0, filter: 'blur(16px) brightness(0.8)' }}
                      aria-hidden="true"
                    />
                    {/* Centered Circular Profile Image */}
                    <ResizableImage
                      src={editableContent.mentorImages[mentor.id] || mentor.imageUrl}
                      alt={mentor.name}
                      isEditMode={false} // Disable adjust feature for mentor images
                      onResize={(width, height) => handleImageResize(`mentor-${mentor.id}`, width, height)}
                      className="relative z-10 w-44 h-44 rounded-full object-cover border-4 border-white shadow-lg"
                      style={{
                        ...(imageDimensions[`mentor-${mentor.id}`]?.width ? { width: imageDimensions[`mentor-${mentor.id}`].width + 'px' } : {}),
                        ...(imageDimensions[`mentor-${mentor.id}`]?.height ? { height: imageDimensions[`mentor-${mentor.id}`].height + 'px' } : {}),
                        marginTop: '16px',
                      }}
                      showMoveButton={false}
                      showChangeButton={true}
                      onImageChange={newUrl => {
                        setMentorImage(mentor.id, newUrl);
                        // Force a re-render by updating the mentor image through the context
                        const updatedMentors = { ...editableContent.mentorImages };
                        updatedMentors[mentor.id] = newUrl;
                        setEditableContent(prev => ({
                          ...prev,
                          mentorImages: updatedMentors
                        }));
                        localStorage.setItem('homePageContent', JSON.stringify({
                          ...editableContent,
                          mentorImages: updatedMentors
                        }));
                      }}
                      imgProps={{ ['data-mentor-id']: mentor.id } as any}
                    />
                  </div>
                  <div className="p-6">
                    {isEditMode ? (
                      <h3
                        className="text-xl font-semibold mb-1 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {mentor.name}
                      </h3>
                    ) : (
                      <h3 className="text-xl font-semibold mb-1">{mentor.name}</h3>
                    )}
                    {isEditMode ? (
                      <p
                        className="text-[#2b333f] mb-3 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {mentor.title}
                      </p>
                    ) : (
                      <p className="text-[#2b333f] mb-3">{mentor.title}</p>
                    )}
                    {isEditMode ? (
                      <p
                        className="text-gray-600 mb-4 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {mentor.description}
                      </p>
                    ) : (
                      <p className="text-gray-600 mb-4">{mentor.description}</p>
                    )}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Expertise:</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill:string) => (
                          isEditMode ? (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-full text-sm outline-none"
                              style={{ backgroundColor: '#003869', color: '#FFFFFF' }}
                              contentEditable
                              suppressContentEditableWarning
                              onClick={e => setSelectedElement(e.currentTarget)}
                            >
                              {skill}
                            </span>
                          ) : (
                            <span key={skill} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#003869', color: '#FFFFFF' }}>
                              {skill}
                            </span>
                          )
                        ))}
                      </div>
                    </div>
                    <a href={editableContent.mentorImages[mentor.id] || mentor.link} target="_blank" rel="noopener noreferrer" data-mentor-id={mentor.id}>
                      <button className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block">
                        Connect
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
     {/* Opportunities Program Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <Briefcase className="w-8 h-8 text-[#000] mr-3 " />
                {isEditMode ? (
                  <h2
                    className="text-2xl font-bold text-[#000] outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => setSectionTitle('opportunities', e.currentTarget.textContent || '')}
                    onClick={e => setSelectedElement(e.currentTarget)}
                  >
                    {editableContent.sectionTitles.opportunities}
                  </h2>
                ) : (
                  <h2 className="text-2xl font-bold text-[#000]">{editableContent.sectionTitles.opportunities}</h2>
                )}
              </div>
              <Link to="/opportunities" className="text-[#2b333f] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2">
                View All Opportunities
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {opportunities.map((opportunity) => (
                <div 
                  key={opportunity.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                  style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
                >
                  <ResizableImage
                    src={editableContent.opportunityContent[opportunity.id]?.imageUrl || opportunity.imageUrl}
                    alt={editableContent.opportunityContent[opportunity.id]?.title || opportunity.title}
                    isEditMode={isEditMode}
                    onResize={(width, height) => handleImageResize(`opportunity-${opportunity.id}`, width, height)}
                    className="w-full h-[13rem] object-cover object-center"
                    style={{
                      ...(imageDimensions[`opportunity-${opportunity.id}`]?.width ? { width: imageDimensions[`opportunity-${opportunity.id}`].width + 'px' } : {}),
                      ...(imageDimensions[`opportunity-${opportunity.id}`]?.height ? { height: imageDimensions[`opportunity-${opportunity.id}`].height + 'px' } : {}),
                    }}
                    showMoveButton={false}
                    showChangeButton={true}
                    onImageChange={newUrl => {
                      // Update opportunity image through context
                      const updatedOpportunities = { ...editableContent.opportunityContent };
                      updatedOpportunities[opportunity.id] = { ...updatedOpportunities[opportunity.id], imageUrl: newUrl };
                      setEditableContent(prev => ({
                        ...prev,
                        opportunityContent: updatedOpportunities
                      }));
                      // Update localStorage
                      localStorage.setItem('homePageContent', JSON.stringify({
                        ...editableContent,
                        opportunityContent: updatedOpportunities
                      }));
                    }}
                    imgProps={{ ['data-opportunity-id']: opportunity.id } as any}
                  />
                  <div className="p-6">
                    {isEditMode ? (
                      <h3
                        className="text-xl font-semibold mb-2 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => setOpportunityField(opportunity.id, 'title', e.currentTarget.textContent || '')}
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {editableContent.opportunityContent[opportunity.id]?.title || opportunity.title}
                      </h3>
                    ) : (
                      <h3 className="text-xl font-semibold mb-2">{editableContent.opportunityContent[opportunity.id]?.title || opportunity.title}</h3>
                    )}
                    {isEditMode ? (
                      <span
                        className={`px-3 py-1 rounded-full text-sm outline-none ${
                          editableContent.opportunityContent[opportunity.id]?.type === 'Hackathon' ? 'bg-green-100 text-green-800' :
                          editableContent.opportunityContent[opportunity.id]?.type === 'Research' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                        contentEditable
                        suppressContentEditableWarning
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {editableContent.opportunityContent[opportunity.id]?.type || opportunity.type}
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        editableContent.opportunityContent[opportunity.id]?.type === 'Hackathon' ? 'bg-green-100 text-green-800' :
                        editableContent.opportunityContent[opportunity.id]?.type === 'Research' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {editableContent.opportunityContent[opportunity.id]?.type || opportunity.type}
                      </span>
                    )}
                    {isEditMode ? (
                      <p
                        className="text-gray-600 mt-3 mb-4 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => setOpportunityField(opportunity.id, 'description', e.currentTarget.textContent || '')}
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {editableContent.opportunityContent[opportunity.id]?.description || opportunity.description}
                      </p>
                    ) : (
                      <p className="text-gray-600 mt-3 mb-4">{editableContent.opportunityContent[opportunity.id]?.description || opportunity.description}</p>
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
                            {editableContent.opportunityContent[opportunity.id]?.location || opportunity.location}
                          </span>
                        ) : (
                          <span>{editableContent.opportunityContent[opportunity.id]?.location || opportunity.location}</span>
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
                            Deadline: {editableContent.opportunityContent[opportunity.id]?.deadline || opportunity.deadline}
                          </span>
                        ) : (
                          <span>Deadline: {new Date(editableContent.opportunityContent[opportunity.id]?.deadline || opportunity.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                   <a
                      href={editableContent.opportunityContent[opportunity.id]?.link || opportunity.link}
                      target="_blank"
                      className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block"
                      data-opportunity-id={opportunity.id}
                    >
                      Apply Now
                    </a>
                  </div>
                  </div>
              ))}
            </div>
          </div>
        </section>
         {/* Articles Program Section */}
        <section className="py-16 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-[#000] mr-3" />
                {isEditMode ? (
                  <h2
                    className="text-2xl font-bold text-[#000] outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => setSectionTitle('articles', e.currentTarget.textContent || '')}
                    onClick={e => setSelectedElement(e.currentTarget)}
                  >
                    {editableContent.sectionTitles.articles}
                  </h2>
                ) : (
                  <h2 className="text-2xl font-bold text-[#000]">{editableContent.sectionTitles.articles}</h2>
                )}
              </div>
              <Link to="/insights" className="text-[#2b333f] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2">
                View All Articles
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <div 
                  key={article.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                  style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
                >
                  <ResizableImage
                    src={editableContent.articleContent[article.id]?.imageUrl || article.imageUrl}
                    alt={article.title}
                    isEditMode={isEditMode}
                    onResize={(width, height) => handleImageResize(`article-${article.id}`, width, height)}
                    className="w-full h-48 object-cover object-center"
                    style={{
                      ...(imageDimensions[`article-${article.id}`]?.width ? { width: imageDimensions[`article-${article.id}`].width + 'px' } : {}),
                      ...(imageDimensions[`article-${article.id}`]?.height ? { height: imageDimensions[`article-${article.id}`].height + 'px' } : {}),
                    }}
                    showMoveButton={false}
                    showChangeButton={true}
                    onImageChange={newUrl => {
                      // Update article image through context
                      const updatedArticles = { ...editableContent.articleContent };
                      updatedArticles[article.id] = { ...updatedArticles[article.id], imageUrl: newUrl };
                      setEditableContent(prev => ({
                        ...prev,
                        articleContent: updatedArticles
                      }));
                      // Update localStorage
                      localStorage.setItem('homePageContent', JSON.stringify({
                        ...editableContent,
                        articleContent: updatedArticles
                      }));
                    }}
                    imgProps={{ ['data-article-id']: article.id } as any}
                  />
                  
                  <div className="p-6">
                    {isEditMode ? (
                      <h3
                        className="text-xl font-semibold mb-2 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => setArticleField(article.id, 'title', e.currentTarget.textContent || '')}
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {editableContent.articleContent[article.id]?.title || article.title}
                      </h3>
                    ) : (
                      <h3 className="text-xl font-semibold mb-2">{editableContent.articleContent[article.id]?.title || article.title}</h3>
                    )}
                    {isEditMode ? (
                      <p
                        className="text-gray-600 mb-4 outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => setArticleField(article.id, 'description', e.currentTarget.textContent || '')}
                        onClick={e => setSelectedElement(e.currentTarget)}
                      >
                        {editableContent.articleContent[article.id]?.description || article.description}
                      </p>
                    ) : (
                      <p className="text-gray-600 mb-4">{editableContent.articleContent[article.id]?.description || article.description}</p>
                    )}
                    <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {isEditMode ? (
                          <span
                            className="outline-none"
                            contentEditable
                            suppressContentEditableWarning
                            onClick={e => setSelectedElement(e.currentTarget)}
                          >
                            {editableContent.articleContent[article.id]?.date || article.date}
                          </span>
                        ) : (
                          <span>{new Date(editableContent.articleContent[article.id]?.date || article.date).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {isEditMode ? (
                          <span
                            className="outline-none"
                            contentEditable
                            suppressContentEditableWarning
                            onClick={e => setSelectedElement(e.currentTarget)}
                          >
                            {editableContent.articleContent[article.id]?.author || article.author}
                          </span>
                        ) : (
                          <span>{editableContent.articleContent[article.id]?.author || article.author}</span>
                        )}
                      </div>
                    </div>
                    <a href={editableContent.articleContent[article.id]?.link || article.link} target="_blank" rel="noopener noreferrer" data-article-id={article.id}>
                      <button className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block">
                        Read More
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const HomePage: React.FC<HomePageProps> = (props) => (
  <HomePageEditProvider initialContent={initialContent}>
    <HomePageContent {...props} />
  </HomePageEditProvider>
);

export default HomePage;