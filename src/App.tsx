import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import LearningPage from './pages/LearningPage';
import LabsPage from './pages/LabsPage';
import MentorshipPage from './pages/MentorshipPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import CareersPage from './pages/CareersPage';
import InsightsPage from './pages/InsightsPage';
import CommandPalette from './components/CommandPalette';
import ElementEditor from './components/ElementEditor';
import EditModeControls from './components/EditModeControls';
import WebsiteBuilder from './components/WebsiteBuilder';
import { saveWebsiteState } from './utils/saveWebsiteState';
import { EditHistory } from './types/website';
import { generateBuild } from './utils/buildGenerator';
import { useEventEdit } from './context/EventEditContext';

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [editHistory, setEditHistory] = useState<EditHistory>({});
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const eventEdit = (() => {
    try {
      return useEventEdit();
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey)) {
        if (e.key === 'e') {
          e.preventDefault();
          setIsEditMode(prev => !prev);
        } else if (e.key === 'u') {
          e.preventDefault();
          handleSaveWebsiteState();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editHistory]);

  useEffect(() => {
    if (isEditMode) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target || target === document.body) return;
        // Don't select if clicking on edit controls or command palette
        if (target.closest('.edit-controls') || target.closest('.command-palette')) {
          return;
        }
        setSelectedElement(target);
      };
      document.addEventListener('click', handleClick, { capture: true });
      return () => {
        document.removeEventListener('click', handleClick, { capture: true });
      };
    } else {
      setSelectedElement(null);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Disable all <a> and <button> elements except those in the edit panel
      if (
        (target.tagName === 'A' || target.tagName === 'BUTTON') &&
        !target.closest('.edit-controls')
      ) {
        e.preventDefault();
        e.stopPropagation();
        // Optionally, add a visual cue here if desired
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      document.body.classList.add('edit-mode');
    } else {
      document.body.classList.remove('edit-mode');
    }
    return () => {
      document.body.classList.remove('edit-mode');
    };
  }, [isEditMode]);

  const handleCommandSelect = (command: string) => {
    setShowCommandPalette(false);
    if (command === 'edit-mode') {
      setIsEditMode(true);
    } else if (command === 'preview-mode') {
      setIsEditMode(false);
      setSelectedElement(null);
    }
  };

  const handleStyleChange = (styles: { [key: string]: string }) => {
    if (selectedElement) {
      const elementId = selectedElement.id || selectedElement.className || Math.random().toString();
      setEditHistory(prev => ({
        ...prev,
        [elementId]: {
          ...prev[elementId],
          styles: {
            ...prev[elementId]?.styles,
            ...styles,
          },
        },
      }));

      Object.entries(styles).forEach(([key, value]) => {
        selectedElement.style.setProperty(key, value);
      });
    }
  };

  const handleLayoutChange = (layout: { [key: string]: string }) => {
    if (selectedElement) {
      const elementId = selectedElement.id || selectedElement.className || Math.random().toString();
      setEditHistory(prev => ({
        ...prev,
        [elementId]: {
          ...prev[elementId],
          layout: {
            ...prev[elementId]?.layout,
            ...layout,
          },
        },
      }));

      Object.entries(layout).forEach(([key, value]) => {
        if (value !== undefined) {
          selectedElement.style.setProperty(key, value);
        }
      });
    }
  };

  const handleComponentAction = (action: string) => {
    if (!selectedElement) return;

    switch (action) {
      case 'deselect':
        setSelectedElement(null);
        break;
      case 'move-up':
        const prevSibling = selectedElement.previousElementSibling;
        if (prevSibling) {
          selectedElement.parentNode?.insertBefore(selectedElement, prevSibling);
        }
        break;
      case 'move-down':
        const nextSibling = selectedElement.nextElementSibling;
        if (nextSibling) {
          selectedElement.parentNode?.insertBefore(nextSibling, selectedElement);
        }
        break;
      case 'duplicate':
        const clone = selectedElement.cloneNode(true) as HTMLElement;
        selectedElement.parentNode?.insertBefore(clone, selectedElement.nextSibling);
        setSelectedElement(clone);
        break;
      case 'delete':
        selectedElement.remove();
        setSelectedElement(null);
        break;
      case 'upload-image':
        if (selectedElement instanceof HTMLImageElement) {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          
          const handleFileSelect = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            
            if (!file) {
              return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
              alert('Please select a valid image file.');
              return;
            }

            // Validate file size (max 5MB)
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_FILE_SIZE) {
              alert('Image size should be less than 5MB.');
              return;
            }

            try {
              const reader = new FileReader();
              
              reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                  // Check for event card image
                  const eventId = selectedElement.getAttribute('data-event-id');
                  if (eventId && eventEdit) {
                    eventEdit.setEventImage(eventId, result);
                  } else {
                    selectedElement.src = result;
                    const elementId = selectedElement.id || selectedElement.className || Math.random().toString();
                    setEditHistory(prev => ({
                      ...prev,
                      [elementId]: {
                        ...prev[elementId],
                        src: result,
                      },
                    }));
                  }
                }
              };

              reader.onerror = () => {
                throw new Error('Failed to read the image file.');
              };

              reader.readAsDataURL(file);
            } catch (error) {
              console.error('Error uploading image:', error);
              alert('Failed to upload image. Please try again.');
            } finally {
              // Clean up
              input.removeEventListener('change', handleFileSelect);
            }
          };

          input.addEventListener('change', handleFileSelect);
          input.click();
        }
        break;
    }
  };

  const handleSaveWebsiteState = async () => {
    setSaveStatus('Saving...');
    const success = await saveWebsiteState(editHistory);
    setSaveStatus(success ? 'Saved successfully!' : 'Failed to save');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleGenerateBuild = async () => {
    try {
      // Get the current path from the URL
      const currentPath = window.location.pathname.replace('/', '') || 'home';
      
      // Get the main content element
      const mainContent = document.querySelector('main');
      if (!mainContent) {
        throw new Error('Could not find page content. Please try again.');
      }

      // Validate required content
      const title = document.title || 'Untitled Page';
      const content = mainContent.innerHTML;
      if (!content.trim()) {
        throw new Error('Page content is empty. Please add some content before generating the build.');
      }

      // Create a temporary config object with the current page
      const config = {
        content: {
          pages: {
            [currentPath]: {
              title,
              content,
              images: Array.from(mainContent.querySelectorAll('img')).reduce((acc, img, index) => {
                if (!img.src) {
                  console.warn(`Image at index ${index} has no source URL`);
                  return acc;
                }
                return {
                  ...acc,
                  [`image${index + 1}`]: {
                    src: img.src,
                    alt: img.alt || `Image ${index + 1}`,
                    width: img.width || 0,
                    height: img.height || 0
                  }
                };
              }, {})
            }
          }
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
        }
      };

      const blob = await generateBuild(config, currentPath);
      if (!blob) {
        throw new Error('Failed to generate build file.');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentPath}-build.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating build:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate build. Please try again.');
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {isEditMode && (
          <>
            <div className="fixed top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded z-50">
              Edit Mode Active - Click any element to edit
            </div>
            <EditModeControls
              onStyleChange={handleStyleChange}
              onLayoutChange={handleLayoutChange}
              onComponentAction={handleComponentAction}
              selectedElement={selectedElement}
              onGenerateBuild={handleGenerateBuild}
              className="edit-controls z-50"
            />
          </>
        )}

        {saveStatus && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded z-50">
            {saveStatus}
          </div>
        )}

        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage isEditMode={isEditMode} selectedElement={selectedElement} setSelectedElement={setSelectedElement} />} />
            <Route path="/events" element={<EventsPage isEditMode={isEditMode} selectedElement={selectedElement} setSelectedElement={setSelectedElement} />} />
            <Route path="/learning" element={<LearningPage isEditMode={isEditMode} selectedElement={selectedElement} setSelectedElement={setSelectedElement} />} />
            <Route path="/labs" element={<LabsPage />} />
            <Route path="/mentorship" element={<MentorshipPage isEditMode={isEditMode} selectedElement={selectedElement} setSelectedElement={setSelectedElement} />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/careers" element={<CareersPage isEditMode={isEditMode} selectedElement={selectedElement} setSelectedElement={setSelectedElement} />} />
            <Route path="/insights" element={<InsightsPage isEditMode={isEditMode} selectedElement={selectedElement} setSelectedElement={setSelectedElement} />} />
            {/* <Route path="/builder" element={<WebsiteBuilder />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelect={handleCommandSelect}
      />
    </Router>
  );
}

export default App;