import React, { useState, useEffect } from 'react';
import type { Lab } from '../types';
import { FlaskRound as Flask, Laptop, Cpu } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';

const labs: Lab[] = [
  {
    id: '1',
    title: 'AI Model Optimization Lab',
    description: 'Learn to optimize AI models using ServiceNow OpenVINO toolkit in this hands-on virtual lab.',
    type: 'virtual',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80',
    difficulty: 'Intermediate'
  },
  {
    id: '2',
    title: 'Parallel Computing Workshop',
    description: 'Physical workshop on parallel computing concepts using ServiceNow hardware.',
    type: 'physical',
    imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80',
    difficulty: 'Advanced'
  },
  {
    id: '3',
    title: 'IoT Development Kit Lab',
    description: 'Get started with IoT development using ServiceNow development kits.',
    type: 'physical',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
    difficulty: 'Beginner'
  }
];

interface ImageDimensions {
  [key: string]: {
    width: number;
    height: number;
  };
}

const LabsPage: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>(() => {
    const saved = localStorage.getItem('labsImageDimensions');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        setIsEditMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    localStorage.setItem('labsImageDimensions', JSON.stringify(imageDimensions));
  }, [imageDimensions]);

  const handleImageResize = (imageId: string, width: number, height: number) => {
    setImageDimensions(prev => ({
      ...prev,
      [imageId]: { width, height }
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Innovation Labs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Emerging Technologies</h2>
            <ResizableImage
              src="/images/labs-emerging-tech.jpg"
              alt="Emerging Technologies Lab"
              className="w-full rounded-lg mb-4"
              isEditMode={isEditMode}
              onResize={(width, height) => handleImageResize('emergingTech', width, height)}
              initialWidth={imageDimensions['emergingTech']?.width}
              initialHeight={imageDimensions['emergingTech']?.height}
            />
            <p className="text-gray-600">
              Explore cutting-edge technologies like AI, blockchain, and quantum computing
              in our state-of-the-art innovation labs.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Research & Development</h2>
            <ResizableImage
              src="/images/labs-research.jpg"
              alt="Research and Development"
              className="w-full rounded-lg mb-4"
              isEditMode={isEditMode}
              onResize={(width, height) => handleImageResize('research', width, height)}
              initialWidth={imageDimensions['research']?.width}
              initialHeight={imageDimensions['research']?.height}
            />
            <p className="text-gray-600">
              Our R&D teams work on breakthrough innovations that shape the future
              of business and technology.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Collaboration Spaces</h2>
            <ResizableImage
              src="/images/labs-collaboration.jpg"
              alt="Collaboration Spaces"
              className="w-full rounded-lg mb-4"
              isEditMode={isEditMode}
              onResize={(width, height) => handleImageResize('collaboration', width, height)}
              initialWidth={imageDimensions['collaboration']?.width}
              initialHeight={imageDimensions['collaboration']?.height}
            />
            <p className="text-gray-600">
              Modern workspaces designed to foster creativity, collaboration, and
              innovation among our teams and partners.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Prototyping Lab</h2>
            <ResizableImage
              src="/images/labs-prototype.jpg"
              alt="Prototyping Lab"
              className="w-full rounded-lg mb-4"
              isEditMode={isEditMode}
              onResize={(width, height) => handleImageResize('prototype', width, height)}
              initialWidth={imageDimensions['prototype']?.width}
              initialHeight={imageDimensions['prototype']?.height}
            />
            <p className="text-gray-600">
              Rapid prototyping facilities for testing and validating new ideas and concepts.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#eee] text-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Dive into ServiceNow Labs</h1>
          <p className="text-xl text-[#ffc000]">Get hands-on experience with cutting-edge technology</p>
        </div>
      </div>

      {/* Lab Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Laptop className="w-8 h-8 text-[#f49d34] mr-3" />
              <h2 className="text-xl font-bold">Virtual Labs</h2>
            </div>
            <p className="text-gray-600">
              Access our virtual labs from anywhere and practice with ServiceNow tools and technologies.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Cpu className="w-8 h-8 text-[#f49d34] mr-3" />
              <h2 className="text-xl font-bold">Physical Labs</h2>
            </div>
            <p className="text-gray-600">
              Join our in-person labs for hands-on experience with ServiceNow hardware.
            </p>
          </div>
        </div>

        {/* Available Labs */}
        <div className="mb-8">
          <div className="flex items-center mb-8">
            <Flask className="w-8 h-8 text-[#f49d34] mr-3" />
            <h2 className="text-2xl font-bold">Available Labs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {labs.map((lab) => (
              <div key={lab.id} className="bg-[#eee] rounded-lg shadow-lg overflow-hidden text-white">
                <img 
                  src={lab.imageUrl} 
                  alt={lab.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{lab.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      lab.type === 'virtual' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {lab.type}
                    </span>
                  </div>
                  <p className="text-gray-100 mb-4">{lab.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-[#f49d34] text-[#ffc000]">
                      {lab.difficulty}
                    </span>
                  </div>
                  <button className="w-full bg-[#f49d34] text-white py-2 rounded-lg hover:bg-[#003869] hover:text-black transition-colors">
                    Join Lab
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabsPage;