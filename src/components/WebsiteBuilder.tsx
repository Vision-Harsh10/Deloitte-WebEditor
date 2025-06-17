import React, { useState, useEffect } from 'react';
import { WebsiteConfig, WebsiteContent, WebsiteStyle } from '../types/website';
import { generateBuild } from '../utils/buildGenerator';
import ResizableImage from './ResizableImage';

const WebsiteBuilder: React.FC = () => {
  const [config, setConfig] = useState<WebsiteConfig>({
    content: {
      pages: {
        home: {
          title: 'Welcome to My Website',
          content: 'This is the home page content.',
          images: {
            mainImage: {
              src: '',
              alt: 'Main image',
              width: 400,
              height: 300
            }
          },
        },
      },
    },
    style: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        background: '#ffffff',
        text: '#1f2937',
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
      },
      spacing: {
        padding: '1rem',
        margin: '1rem',
      },
    },
  });

  const [isSaved, setIsSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load saved configuration from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('websiteConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Save configuration to localStorage
  const saveConfig = () => {
    localStorage.setItem('websiteConfig', JSON.stringify(config));
    setIsSaved(true);
    setLastSaved(new Date());
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveConfig();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config]);

  const handleContentChange = (pageId: string, field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      content: {
        ...prev.content,
        pages: {
          ...prev.content.pages,
          [pageId]: {
            ...prev.content.pages[pageId],
            [field]: value,
          },
        },
      },
    }));
    setIsSaved(false);
  };

  const handleStyleChange = (category: keyof WebsiteStyle, field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [category]: {
          ...prev.style[category],
          [field]: value,
        },
      },
    }));
    setIsSaved(false);
  };

  const handleImageUpload = (pageId: string, imageId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setConfig(prev => ({
        ...prev,
        content: {
          ...prev.content,
          pages: {
            ...prev.content.pages,
            [pageId]: {
              ...prev.content.pages[pageId],
              images: {
                ...prev.content.pages[pageId].images,
                [imageId]: {
                  ...prev.content.pages[pageId].images[imageId],
                  src,
                  alt: file.name
                }
              }
            }
          }
        }
      }));
      setIsSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageResize = (pageId: string, imageId: string, width: number, height: number) => {
    setConfig(prev => ({
      ...prev,
      content: {
        ...prev.content,
        pages: {
          ...prev.content.pages,
          [pageId]: {
            ...prev.content.pages[pageId],
            images: {
              ...prev.content.pages[pageId].images,
              [imageId]: {
                ...prev.content.pages[pageId].images[imageId],
                width,
                height
              }
            }
          }
        }
      }
    }));
    setIsSaved(false);
  };

  const handleGenerateBuild = async () => {
    try {
      const blob = await generateBuild(config);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'website-build.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating build:', error);
      alert('Failed to generate build. Please try again.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Editor Panel */}
      <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Website Builder</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={saveConfig}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Save
            </button>
            <span className="text-sm text-gray-600">
              {isSaved ? 'All changes saved' : 'Unsaved changes'}
              {lastSaved && (
                <span className="ml-2">
                  (Last saved: {lastSaved.toLocaleTimeString()})
                </span>
              )}
            </span>
          </div>
        </div>
        
        {/* Content Editor */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Content Editor</h3>
          {Object.entries(config.content.pages).map(([pageId, page]) => (
            <div key={pageId} className="mb-4">
              <input
                type="text"
                value={page.title}
                onChange={(e) => handleContentChange(pageId, 'title', e.target.value)}
                className="w-full p-2 mb-2 border rounded"
                placeholder="Page Title"
              />
              <input
                type="text"
                value={page.content}
                onChange={(e) => handleContentChange(pageId, 'content', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Page Content"
              />
              
              {/* Image Upload Section */}
              <div className="mt-4">
                <h4 className="text-md font-medium mb-2">Images</h4>
                {Object.entries(page.images).map(([imageId, image]) => (
                  <div key={imageId} className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      {imageId}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(pageId, imageId, file);
                        }
                      }}
                      className="w-full p-2 border rounded"
                    />
                    {image.src && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => {
                            setConfig(prev => ({
                              ...prev,
                              content: {
                                ...prev.content,
                                pages: {
                                  ...prev.content.pages,
                                  [pageId]: {
                                    ...prev.content.pages[pageId],
                                    images: {
                                      ...prev.content.pages[pageId].images,
                                      [imageId]: {
                                        ...prev.content.pages[pageId].images[imageId],
                                        alt: e.target.value
                                      }
                                    }
                                  }
                                }
                              }
                            }));
                            setIsSaved(false);
                          }}
                          className="w-full p-2 border rounded"
                          placeholder="Image Alt Text"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Style Editor */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Style Editor</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <input
                type="color"
                value={config.style.colors.primary}
                onChange={(e) => handleStyleChange('colors', 'primary', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <input
                type="color"
                value={config.style.colors.background}
                onChange={(e) => handleStyleChange('colors', 'background', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Family</label>
              <select
                value={config.style.typography.fontFamily}
                onChange={(e) => handleStyleChange('typography', 'fontFamily', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Open Sans, sans-serif">Open Sans</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateBuild}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Generate Build
        </button>
      </div>

      {/* Preview Panel */}
      <div className="w-2/3 bg-white p-4 overflow-y-auto">
        <div
          className="p-4 rounded-lg shadow"
          style={{
            backgroundColor: config.style.colors.background,
            color: config.style.colors.text,
            fontFamily: config.style.typography.fontFamily,
          }}
        >
          {Object.entries(config.content.pages).map(([pageId, page]) => (
            <div key={pageId}>
              <h1
                className="text-3xl font-bold mb-4"
                style={{ color: config.style.colors.primary }}
              >
                {page.title}
              </h1>
              <p className="text-lg mb-4">{page.content}</p>
              
              {/* Display Images */}
              <div className="space-y-4">
                {Object.entries(page.images).map(([imageId, image]) => (
                  image.src && (
                    <div key={imageId} className="flex justify-center">
                      <ResizableImage
                        src={image.src}
                        alt={image.alt}
                        isEditMode={true}
                        onResize={(width, height) => handleImageResize(pageId, imageId, width, height)}
                        className="max-w-full"
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder; 