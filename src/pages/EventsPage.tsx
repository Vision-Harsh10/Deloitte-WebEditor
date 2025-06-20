import React, { useState, useEffect } from 'react';
import type { Event } from '../types';
import { Calendar, Pencil } from 'lucide-react';
import ResizableImage from '../components/ResizableImage';
import { useEventEdit, EventEditProvider } from '../context/EventEditContext';
// import InlineEditableText from '../components/InlineEditableText';

const events: Event[] = [
  {
    id: '1',
    name:  "Deloitte | Frost & Sullivan (Paid Internships Offered",
    description: 'Crack real-world cases. Compete with the best. Lead with insight',
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/banner/67e65f709adf0_shri-ram-case-conundrum-i-deloitte-i-frost-sullivan-paid-internships-offered.webp?d=1920x557',
    attendees: 3404,
    date: '29 Mar 25',
    impact: 'Solve cases. Win internships & rewards',
    link: 'https://unstop.com/competitions/shri-ram-case-conundrum-shri-ram-economics-summit-2025-srcc-du-1415627'
  },
  {
    id: '2',
    name: 'Shri Ram Investment Competition | Deloitte | Moneyvesta Capital | GCR',
    description: 'Test your investment in real-world market scenarios and compete to be a top strategist!',
    imageUrl:'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/banner/67f80ec172b34_shri-ram-investment-competition-deloitte-moneyvesta-capital-gcr.webp?d=1920x557',
    attendees: 3231,
    date: '15 Apr 25',
    impact  : 'Test your skills in real-world finance',
    link: 'https://unstop.com/competitions/servicenow-women-code-to-win-2024-india-servicenow-838054'
  },
  {
    id: '3',
    name: 'Senior Analyst – Strategy & Operations at Deloitte',
    description: 'Deloitte is hiring for the position of Senior Analyst!',
    imageUrl: 'https://logos-world.net/wp-content/uploads/2021/08/Deloitte-Emblem.png',
    attendees: 21119,
    impact: 'Join Deloitte and drive real impact',
    date: '20 Jun 22',
    link: 'http://unstop.com/jobs/senior-analyst-deloitte-us-india-360361'
  }
];

interface EventsPageProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const LOCAL_STORAGE_KEY = 'eventPageEvents';

const EVENTS_BTN_LABELS_KEY = 'eventsBtnLabels';

function getInitialEventsBtnLabels(events: Event[]) {
  const saved = localStorage.getItem(EVENTS_BTN_LABELS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback to default
    }
  }
  // Default: all events get 'Register Now'
  const obj: Record<string, string> = {};
  events.forEach(ev => { obj[ev.id] = 'Register Now'; });
  return obj;
}

const EventsPage: React.FC<EventsPageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  return (
    <EventEditProvider initialEvents={events}>
      <EventsPageContent
        isEditMode={isEditMode}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
      />
    </EventEditProvider>
  );
};

const EventsPageContent: React.FC<EventsPageProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const { 
    eventList, 
    setEventImage, 
    setEventField, 
    imageDimensions,
    setEventImageDimensions,
    saveToLocalStorage 
  } = useEventEdit();

  const [eventsBtnLabels, setEventsBtnLabels] = useState<Record<string, string>>(() => getInitialEventsBtnLabels(events));

  useEffect(() => {
    if (!isEditMode) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      saveToLocalStorage();
    }
  }, [isEditMode, saveToLocalStorage]);

  useEffect(() => {
    // Expose setEventField for EditModeControls
    (window as any).setEventFieldForEditPanel = setEventField;
    return () => { (window as any).setEventFieldForEditPanel = undefined; };
  }, [setEventField]);

  // Persist eventsBtnLabels to localStorage
  useEffect(() => {
    localStorage.setItem(EVENTS_BTN_LABELS_KEY, JSON.stringify(eventsBtnLabels));
  }, [eventsBtnLabels]);

  // Utility to get persisted text style for a tag and text
  function getPersistedTextStyle(tag: string, text: string) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    const styleKey = `textStyle:${tag}:hash${hash}`;
    const colorKey = `textColor:${tag}:hash${hash}`;
    let styleObj: Record<string, any> = {};
    try {
      styleObj = JSON.parse(localStorage.getItem(styleKey) || '{}');
    } catch {}
    const color = localStorage.getItem(colorKey);
    if (color) {
      styleObj.color = color;
    }
    return styleObj;
  }

  return (
    <div
      className="min-h-screen"
      data-home-section-id="events-page"
      style={{ backgroundColor: localStorage.getItem('homeSectionBgColor:events-page') || '#f3f4f6' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Calendar className="w-8 h-8 text-[#003869] mr-3" />
          <h2
            className="text-2xl font-bold"
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={e => setSelectedElement(e.currentTarget)}
            style={getPersistedTextStyle('h2', 'Upcoming Events')}
          >
            Upcoming Events
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventList.map(event => (
            <div 
              key={event.id} 
              className="bg-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
            >
              <ResizableImage
                src={event.imageUrl}
                alt={event.name}
                isEditMode={isEditMode}
                onResize={(width, height) => setEventImageDimensions(event.id, width, height)}
                className={`object-cover object-center rounded-lg overflow-hidden ${!imageDimensions[event.id] ? 'w-full h-[13rem]' : ''}`}
                style={{
                  ...(imageDimensions[event.id]?.width ? { width: imageDimensions[event.id].width + 'px' } : {}),
                  ...(imageDimensions[event.id]?.height ? { height: imageDimensions[event.id].height + 'px' } : {}),
                }}
                showChangeButton={true}
                showMoveButton={false}
                onImageChange={newUrl => {
                  setEventImage(event.id, newUrl);
                  // Force a re-render by updating the event list through the context
                  const updatedEvents = eventList.map(ev => 
                    ev.id === event.id ? { ...ev, imageUrl: newUrl } : ev
                  );
                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEvents));
                }}
                imgProps={{ ['data-event-id']: event.id } as any}
              />
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-2 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={e => setEventField(event.id, 'name', e.currentTarget.textContent || '')}
                  onClick={e => setSelectedElement(e.currentTarget)}
                  style={getPersistedTextStyle('h3', event.name)}
                >
                  {event.name}
                </h3>
                <p
                  className="text-gray-600 mb-4 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={e => setEventField(event.id, 'description', e.currentTarget.textContent || '')}
                  onClick={e => setSelectedElement(e.currentTarget)}
                  style={getPersistedTextStyle('p', event.description)}
                >
                  {event.description}
                </p>
                <div
                  className="text-gray-700 mb-2 outline-none"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={e => setEventField(event.id, 'impact', e.currentTarget.textContent || '')}
                  onClick={e => setSelectedElement(e.currentTarget)}
                  style={getPersistedTextStyle('div', event.impact)}
                >
                  {event.impact}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  {isEditMode ? (
                    <span
                      className="outline-none"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => setEventField(event.id, 'date', e.currentTarget.textContent || '')}
                      onClick={e => setSelectedElement(e.currentTarget)}
                      style={getPersistedTextStyle('span', event.date)}
                    >
                      {event.date}
                    </span>
                  ) : (
                    <span style={getPersistedTextStyle('span', event.date)}>
                      Date: {event.date}
                    </span>
                  )}
                  {isEditMode ? (
                    <span
                      className="outline-none"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => setEventField(event.id, 'attendees', Number(e.currentTarget.textContent) || 0)}
                      onClick={e => setSelectedElement(e.currentTarget)}
                      style={getPersistedTextStyle('span', String(event.attendees))}
                    >
                      {event.attendees}
                    </span>
                  ) : (
                    <span style={getPersistedTextStyle('span', String(event.attendees))}>
                      {event.attendees} attendees
                    </span>
                  )}
                </div>
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event-id={event.id}
                  data-events-btn={event.id}
                  onClick={e => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedElement(e.currentTarget);
                    }
                  }}
                  className={`w-full border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors text-center block bg-white text-[#1783b0] hover:bg-[#1783b0] hover:text-white${localStorage.getItem('eventsBtnHoverColor:' + event.id) || localStorage.getItem('eventsBtnHoverTextColor:' + event.id) ? ' custom-hover' : ''}`}
                  style={{
                    backgroundColor: localStorage.getItem('eventsBtnBgColor:' + event.id) || undefined,
                    color: localStorage.getItem('eventsBtnTextColor:' + event.id) || undefined,
                    '--hover-color': localStorage.getItem('eventsBtnHoverColor:' + event.id) || undefined,
                    '--hover-text-color': localStorage.getItem('eventsBtnHoverTextColor:' + event.id) || undefined
                  } as React.CSSProperties}
                >
                  {isEditMode ? (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => {
                        const value = (e.currentTarget && e.currentTarget.textContent) ? e.currentTarget.textContent : 'Register Now';
                        setEventsBtnLabels(prev => ({ ...prev, [event.id]: value }));
                      }}
                      style={{ outline: '1px dashed #ccc', cursor: 'text' }}
                    >
                      {eventsBtnLabels[event.id] || 'Register Now'}
                    </span>
                  ) : (
                    eventsBtnLabels[event.id] || 'Register Now'
                  )}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { events };
export default EventsPage;