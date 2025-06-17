import React from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import { Award, Calendar, BookOpen,Clock, Users, Briefcase, User, GraduationCap, BookMarked, Trophy, Star } from 'lucide-react';
import type { Event, Course, Lab, Opportunity, Mentor, Article} from '../types';
import Leaderboard from '../components/Leaderboard';

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

const HomePage = () => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedElement, setSelectedElement] = React.useState<HTMLElement | null>(null);

  return (
    <div>
      <HeroBanner isEditMode={isEditMode} setSelectedElement={setSelectedElement} />
      
      {/* Community Leaders Section */}
      <Leaderboard isEditMode={isEditMode} setSelectedElement={setSelectedElement} />

      {/* Featured Events Section */}
      <section className="py-16 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-[#000] mr-3" />
              <h2 className="text-2xl font-bold text-[#000]">Featured Events</h2>
            </div>
            <Link to="/events" className="text-[#2b333f] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2"            >
              View All Events
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={event.imageUrl} 
                  alt={event.name}
                  className="w-full h-[11rem] object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.attendees} attendees</span>
                  </div>
                  <a href={event.link} target="_blank" rel="noopener noreferrer">
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
              <h2 className="text-2xl font-bold text-[#000]">Featured Courses</h2>
            </div>
            <Link to="/learning" className="text-[#2b333f] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2"            >
              View All Courses
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={course.imageUrl} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">Duration: {course.duration}</span>
                    <span style={{ backgroundColor: '#003869', color: '#FFFFFF', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                      {course.level}
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
      </section>
            
      {/* Mentorship Program Section */}
      <section className="py-16 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-[#000] mr-3" />
              <h2 className="text-2xl text-[#000] font-bold">Featured Mentors</h2>
            </div>
            <Link to="/mentorship" className="text-[#2b333f] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2"            >
              View All Mentors
            </Link>
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
                      <img
                        src={mentor.imageUrl}
                        alt={mentor.name}
                        className="w-44 h-44 rounded-full object-cover"
                      />
                    </div>
                  </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{mentor.name}</h3>
                  <p className="text-[#2b333f] mb-3">{mentor.title}</p>
                  <p className="text-gray-600 mb-4">{mentor.description}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill:string) => (
                        <span key={skill} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#003869', color: '#FFFFFF' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a href={mentor.link} target="_blank" rel="noopener noreferrer">
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
              <h2 className="text-2xl font-bold text-[#000]">Featured Opportunities</h2>
            </div>
            <Link to="/opportunities" className="text-[#2b333f] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2"            >
              View All Opportunities
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={opportunity.imageUrl} 
                  alt={opportunity.title}
                  className="w-full h-[13rem] object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    opportunity.type === 'Hackathon' ? 'bg-green-100 text-green-800' :
                    opportunity.type === 'Research' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {opportunity.type}
                  </span>
                 <p className="text-gray-600 mt-3 mb-4">{opportunity.description}</p>
                  <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                 <a
                    href={opportunity.link}
                    target="_blank"
                    className="w-full bg-white text-[#1783b0] border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block"
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
              <h2 className="text-2xl font-bold text-[#000]">Featured Articles</h2>
            </div>
            <Link to="/insights" className="text-[#2b333f] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2"            >
              View All Articles
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{article.author}</span>
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
        </div>
      </section>
    </div>
  );
};

export default HomePage;