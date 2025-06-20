import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'deloitteLogoUrl';
const LOGO_WIDTH_KEY = 'deloitteLogoWidth';
const UNSTOP_LOGO_URL_KEY = 'unstopLogoUrl';
const UNSTOP_LOGO_WIDTH_KEY = 'unstopLogoWidth';

const Navigation = ({ isEditMode = false }) => {
  const defaultNavItems = [
    { name: 'HOME', path: '/' },
    { name: 'EVENTS', path: '/events' },
    { name: 'LEARNING', path: '/learning' },
    { name: 'MENTORSHIP', path: '/mentorship' },
    { name: 'OPPORTUNITIES', path: '/opportunities' },
    { name: 'CAREERS', path: '/careers' },
    { name: 'INSIGHTS', path: '/insights' },
    // { name: 'BUILDER', path: '/builder' },
  ];

  const NAV_NAMES_KEY = 'navButtonNames';
  const [navItems, setNavItems] = useState(() => {
    const saved = localStorage.getItem(NAV_NAMES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaultNavItems to keep paths
        return defaultNavItems.map((item, idx) => ({
          ...item,
          name: parsed[idx] || item.name
        }));
      } catch {
        return defaultNavItems;
      }
    }
    return defaultNavItems;
  });

  useEffect(() => {
    // If navItems change, persist names
    localStorage.setItem(NAV_NAMES_KEY, JSON.stringify(navItems.map(item => item.name)));
  }, [navItems]);

  const handleNavNameChange = (idx: number, newName: string) => {
    setNavItems(items => items.map((item, i) => i === idx ? { ...item, name: newName } : item));
  };

  const defaultLogo = "https://www2.deloitte.com/content/dam/assets/logos/deloitte.svg";
  const [logoUrl, setLogoUrl] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved || defaultLogo;
  });

  const [logoWidth, setLogoWidth] = useState(() => {
    const saved = localStorage.getItem(LOGO_WIDTH_KEY);
    return saved ? saved : '8';
  });

  const [unstopLogoUrl, setUnstopLogoUrl] = useState(() => {
    const saved = localStorage.getItem(UNSTOP_LOGO_URL_KEY);
    return saved || 'https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/svg/unstop-logo-white.svg';
  });

  const [unstopLogoWidth, setUnstopLogoWidth] = useState(() => {
    const saved = localStorage.getItem(UNSTOP_LOGO_WIDTH_KEY);
    return saved ? saved : '4.5';
  });

  const [navBgColor, setNavBgColor] = useState(() => {
    return localStorage.getItem('navBgColor') || '#000000';
  });

  useEffect(() => {
    setNavBgColor(localStorage.getItem('navBgColor') || '#000000');
  }, []);

  const handleLogoUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoUrl(result);
      localStorage.setItem(LOCAL_STORAGE_KEY, result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUrlPrompt = () => {
    const url = window.prompt('Enter new logo URL:', logoUrl);
    if (url && url.trim()) {
      setLogoUrl(url.trim());
      localStorage.setItem(LOCAL_STORAGE_KEY, url.trim());
      // Prompt for width after URL
      const width = window.prompt('Enter logo width in rem (e.g., 8):', logoWidth);
      if (width && width.trim() && !isNaN(Number(width))) {
        setLogoWidth(width.trim());
        localStorage.setItem(LOGO_WIDTH_KEY, width.trim());
      }
    }
  };

  const handleUnstopLogoPrompt = () => {
    const url = window.prompt('Enter new Unstop logo URL:', unstopLogoUrl);
    if (url && url.trim()) {
      setUnstopLogoUrl(url.trim());
      localStorage.setItem(UNSTOP_LOGO_URL_KEY, url.trim());
      const width = window.prompt('Enter Unstop logo width in rem (e.g., 4.5):', unstopLogoWidth);
      if (width && width.trim() && !isNaN(Number(width))) {
        setUnstopLogoWidth(width.trim());
        localStorage.setItem(UNSTOP_LOGO_WIDTH_KEY, width.trim());
      }
    }
  };

  return (
    <nav
  className="text-[#ffffff]"
  style={{ backgroundColor: navBgColor }}
>
      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={unstopLogoUrl}
                alt="Unstop Logo"
                style={{ width: unstopLogoWidth + 'rem', height: 'auto', objectFit: 'contain' }}
                className={isEditMode ? 'cursor-pointer' : ''}
                onClick={isEditMode ? handleUnstopLogoPrompt : undefined}
              />
              <span className="text-xl font-bold"> | </span>
              <div className="inline-block p-1 relative group">
                <img
                  src={logoUrl}
                  alt="Deloitte Logo"
                  style={{ width: logoWidth + 'rem', height: 'auto', objectFit: 'contain' }}
                  className={isEditMode ? 'cursor-pointer' : ''}
                  onClick={isEditMode ? handleLogoUrlPrompt : undefined}
                />
              </div>
              {/* <span className="text-xl font-bold">Community</span> */}
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, idx) => {
                const textColor = localStorage.getItem('navBtnTextColor:' + item.path);
                const hoverTextColor = localStorage.getItem('navBtnHoverTextColor:' + item.path);
                const hasCustomColor = textColor || hoverTextColor ||
                  localStorage.getItem('navBtnBgColor:' + item.path) ||
                  localStorage.getItem('navBtnHoverColor:' + item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    data-nav-btn={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-normal transition-colors nav-hover-link${hasCustomColor ? ' custom-hover custom-nav-color' : ''}`}
                    style={{
                      backgroundColor: localStorage.getItem('navBtnBgColor:' + item.path) || undefined,
                      '--custom-text-color': textColor || undefined,
                      '--hover-text-color': hoverTextColor || undefined,
                      '--hover-color': localStorage.getItem('navBtnHoverColor:' + item.path) || undefined,
                    } as React.CSSProperties}
                  >
                    <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={e => handleNavNameChange(idx, e.currentTarget.textContent || item.name)}
                      style={{ outline: isEditMode ? '1px dashed #ccc' : 'none', cursor: isEditMode ? 'text' : 'inherit' }}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;