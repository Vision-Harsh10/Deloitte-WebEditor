import { Trophy, Camera } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import LeaderboardSidebar from './LeaderboardSidebar';
import { resizeImage } from '../utils/imageUtils';

interface Leader {
  id: string;
  name: string;
  imageUrl: string;
  points: number;
  badges: string[];
  title: string;
  link: string;
}

const defaultLeaders: Leader[] = [
    {
        id: '1',
        name: 'Yash Desai',
        imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/profile/67c0d82bc7e36.png',
        points: 15350,
        badges: ['Top Performer'],
        title: 'Bharati Vidyapeeth College of Engineering',
        link: 'https://unstop.com/u/yashdesai2007'
      },
      {
        id: '2',
        name: 'Sunil Kumar Mehta',
        imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/profile/68174ff0769c6.jpg',
        points: 14500,
        badges: ['Rising Star'],
        title: 'Lovely Professional University (LPU), Punjab',
        link: 'https://unstop.com/u/sunilmeh6124'
      },
      {
        id: '3',
        name: 'Harshavardhan Bajoria',
        imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/profile/63ca88f851750.jpg',
        points: 13400,
        badges: ['AI Enthusiast'],
        title: 'Amity University Kolkata',
        link: 'https://unstop.com/u/hvbajoria'
      }
    ];

interface LeaderboardProps {
  isEditMode: boolean;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const LEADERBOARD_STORAGE_KEY = 'leaderboardContent';
const LEADERBOARD_IMAGE_DIMENSIONS_KEY = 'leaderboardImageDimensions';
const LEADER_BTN_LABELS_KEY = 'leaderBtnLabels';

function getInitialLeaderBtnLabels(leaders: Leader[]) {
  const saved = localStorage.getItem(LEADER_BTN_LABELS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback to default
    }
  }
  // Default: all leaders get 'View Profile'
  const obj: Record<string, string> = {};
  leaders.forEach(l => { obj[l.id] = 'View Profile'; });
  return obj;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ isEditMode, setSelectedElement }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leaders, setLeaders] = useState<Leader[]>(() => {
    const saved = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultLeaders;
      }
    }
    return defaultLeaders;
  });

  // Image dimensions state
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>(() => {
    const saved = localStorage.getItem(LEADERBOARD_IMAGE_DIMENSIONS_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [leaderBtnLabels, setLeaderBtnLabels] = useState<Record<string, string>>(() => getInitialLeaderBtnLabels(defaultLeaders));

  useEffect(() => {
    if (!isEditMode) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaders));
      localStorage.setItem(LEADERBOARD_IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
    }
  }, [isEditMode, leaders, imageDimensions]);

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaders));
  }, [leaders]);

  // Persist leaderBtnLabels to localStorage
  useEffect(() => {
    localStorage.setItem(LEADER_BTN_LABELS_KEY, JSON.stringify(leaderBtnLabels));
  }, [leaderBtnLabels]);

  const handleLeaderUpdate = (id: string, field: keyof Leader, value: string | number | string[]) => {
    setLeaders(prevLeaders => 
      prevLeaders.map(leader => 
        leader.id === id ? { ...leader, [field]: value } : leader
      )
    );
  };

  // Image resize handler
  const handleImageResize = (id: string, width: number, height: number) => {
    const newDimensions = { ...imageDimensions, [id]: { width, height } };
    setImageDimensions(newDimensions);
    localStorage.setItem(LEADERBOARD_IMAGE_DIMENSIONS_KEY, JSON.stringify(newDimensions));
  };

  // Image change handler
  const handleImageChange = (leaderId: string, newUrl: string) => {
    setLeaders(prevLeaders => 
      prevLeaders.map(leader => 
        leader.id === leaderId ? { ...leader, imageUrl: newUrl } : leader
      )
    );
    // Force a re-render by updating localStorage
    const updatedLeaders = leaders.map(leader => 
      leader.id === leaderId ? { ...leader, imageUrl: newUrl } : leader
    );
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updatedLeaders));
  };

  // Expose setter for link editing in edit mode
  const handleLeaderLinkUpdate = useCallback((leaderId: string, newLink: string) => {
    handleLeaderUpdate(leaderId, 'link', newLink);
  }, [handleLeaderUpdate]);

  useEffect(() => {
    if (isEditMode) {
      (window as any).setLeaderboardLinkForEditPanel = handleLeaderLinkUpdate;
    } else {
      (window as any).setLeaderboardLinkForEditPanel = undefined;
    }
    return () => {
      (window as any).setLeaderboardLinkForEditPanel = undefined;
    };
  }, [isEditMode, handleLeaderLinkUpdate]);

  return (
    <>
    <section
      className="py-16"
      data-home-section-id="leaderboard"
      style={{ backgroundColor: localStorage.getItem('homeSectionBgColor:leaderboard') || '#e5e7eb' }}
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-[#000000] mr-3" />
              <h2
                className="text-2xl font-bold text-[#000000]"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onClick={e => {
                  e.stopPropagation();
                  setSelectedElement(e.currentTarget);
                }}
              >
                Top Community Leaders
              </h2>
            </div>
            <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-[#000000] font-semibold flex items-center group hover:underline hover:decoration-[#00718f] hover:underline-offset-4 hover:decoration-2"            >
            View All Rankings
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <div key={leader.id} className="bg-[#f5f5f5] rounded-lg shadow-lg p-6 relative">
                <div className="absolute top-4 right-4 text-[#303030] font-bold">
                  #{index + 1}
                </div>
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <img
                      src={leader.imageUrl}
                      alt={leader.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                      data-leader-id={leader.id}
                    />
                    {isEditMode && (
                      <label htmlFor={`upload-leader-image-${leader.id}`} className="absolute bottom-0 right-0 z-20 cursor-pointer bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <Camera className="w-4 h-4 text-gray-700" />
                        <input
                          id={`upload-leader-image-${leader.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async e => {
                            const file = e.target.files?.[0] || null;
                            if (!file) return;
                            try {
                              const compressed = await resizeImage(file);
                              handleImageChange(leader.id, compressed);
                            } catch (err) {
                              alert('Failed to process image. Please use a smaller image.');
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-lg text-[#303030]"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={e => handleLeaderUpdate(leader.id, 'name', e.currentTarget.textContent || '')}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedElement(e.currentTarget);
                      }}
                    >
                      {leader.name}
                    </h3>
                    <p
                      className="text-[#2b333f] text-sm"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={e => handleLeaderUpdate(leader.id, 'title', e.currentTarget.textContent || '')}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedElement(e.currentTarget);
                      }}
                    >
                      {leader.title}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-[#b8d9e2] text-[#293e40] px-3 py-1 rounded-full text-sm">
                    {leader.badges[0]}
                  </span>
                  <span 
                    className="text-[#2b333f] font-semibold"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={e => handleLeaderUpdate(leader.id, 'points', parseInt(e.currentTarget.textContent || '0'))}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedElement(e.currentTarget);
                    }}
                  >
                    {leader.points} Points
                  </span>
                </div>
                <a
                  href={leader.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-leader-id={leader.id}
                  onClick={e => { if (isEditMode) { e.preventDefault(); } }}
                  className={`w-full bg-white border-2 border-[#1783b0] py-2 rounded-lg font-semibold transition-colors hover:bg-[#1783b0] hover:text-white text-center block${localStorage.getItem('leaderboardItemHoverColor:' + leader.id) || localStorage.getItem('leaderboardItemHoverTextColor:' + leader.id) ? ' custom-hover' : ''}`}
                  style={{
                    color: localStorage.getItem('leaderboardItemTextColor:' + leader.id) || undefined,
                    '--hover-color': localStorage.getItem('leaderboardItemHoverColor:' + leader.id) || undefined,
                    '--hover-text-color': localStorage.getItem('leaderboardItemHoverTextColor:' + leader.id) || undefined
                  } as React.CSSProperties}
                >
                  {isEditMode ? (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => setLeaderBtnLabels(prev => ({ ...prev, [leader.id]: e.currentTarget.textContent || 'View Profile' }))}
                      style={{ outline: '1px dashed #ccc', cursor: 'text' }}
                    >
                      {leaderBtnLabels[leader.id] || 'View Profile'}
                    </span>
                  ) : (
                    leaderBtnLabels[leader.id] || 'View Profile'
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeaderboardSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default Leaderboard;