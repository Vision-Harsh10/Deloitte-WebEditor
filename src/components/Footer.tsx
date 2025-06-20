import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFooterEdit } from '../context/FooterEditContext';

interface FooterProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const Footer: React.FC<FooterProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const { footerLinks, setFooterLink } = useFooterEdit();

  // Add state for persistent background color
  const [footerBgColor, setFooterBgColor] = useState(() => {
    return localStorage.getItem('footerBgColor') || '#F5F5F4';
  });

  useEffect(() => {
    setFooterBgColor(localStorage.getItem('footerBgColor') || '#F5F5F4');
    // Apply persistent background color for each footer list item
    setTimeout(() => {
      document.querySelectorAll('[data-footer-link-id]').forEach(el => {
        const id = el.getAttribute('data-footer-link-id');
        const color = localStorage.getItem('footerItemBgColor:' + id);
        if (color) {
          (el as HTMLElement).style.backgroundColor = color;
        }
      });
    }, 0);
  }, []);

  useEffect(() => {
    // Expose setFooterLink for EditModeControls
    (window as any).setFooterLinkForEditPanel = setFooterLink;
    return () => { (window as any).setFooterLinkForEditPanel = undefined; };
  }, [setFooterLink]);

  // Helper to get link data from context
  const getFooterLink = (id: string) => {
    return footerLinks.find(link => link.id === id);
  };

  return (
    <footer className="text-black" style={{ backgroundColor: footerBgColor }}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About</h3>
            <ul className="space-y-2">
              <li><a
                href={getFooterLink('about-us')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:about-us') || localStorage.getItem('footerItemHoverTextColor:about-us') ? ' custom-hover' : ''}`}
                data-footer-link-id="about-us"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:about-us') || undefined,
                  color: localStorage.getItem('footerItemTextColor:about-us') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:about-us') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:about-us') || undefined
                } as React.CSSProperties}
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedElement(e.currentTarget);
                  }
                }}
              >About Us</a></li>
              <li><a
                href={getFooterLink('contact')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:contact') || localStorage.getItem('footerItemHoverTextColor:contact') ? ' custom-hover' : ''}`}
                data-footer-link-id="contact"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:contact') || undefined,
                  color: localStorage.getItem('footerItemTextColor:contact') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:contact') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:contact') || undefined
                } as React.CSSProperties}
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedElement(e.currentTarget);
                  }
                }}
              >Contact</a></li>
              <li><a
                href={getFooterLink('privacy-policy')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:privacy-policy') || localStorage.getItem('footerItemHoverTextColor:privacy-policy') ? ' custom-hover' : ''}`}
                data-footer-link-id="privacy-policy"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:privacy-policy') || undefined,
                  color: localStorage.getItem('footerItemTextColor:privacy-policy') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:privacy-policy') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:privacy-policy') || undefined
                } as React.CSSProperties}
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedElement(e.currentTarget);
                  }
                }}
              >Privacy Policy</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/events" className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:events') || localStorage.getItem('footerItemHoverTextColor:events') ? ' custom-hover' : ''}`}
                data-footer-link-id="events"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:events') || undefined,
                  color: localStorage.getItem('footerItemTextColor:events') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:events') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:events') || undefined
                } as React.CSSProperties}
              >Events</Link></li>
              <li><Link to="/learning" className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:learning') || localStorage.getItem('footerItemHoverTextColor:learning') ? ' custom-hover' : ''}`}
                data-footer-link-id="learning"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:learning') || undefined,
                  color: localStorage.getItem('footerItemTextColor:learning') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:learning') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:learning') || undefined
                } as React.CSSProperties}
              >Learning</Link></li>
              {/* <li><Link to="/labs" className="hover:text-[#f49d34]">Labs</Link></li> */}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/mentorship" className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:mentorship') || localStorage.getItem('footerItemHoverTextColor:mentorship') ? ' custom-hover' : ''}`}
                data-footer-link-id="mentorship"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:mentorship') || undefined,
                  color: localStorage.getItem('footerItemTextColor:mentorship') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:mentorship') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:mentorship') || undefined
                } as React.CSSProperties}
              >Mentorship</Link></li>
              <li><Link to="/opportunities" className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:opportunities') || localStorage.getItem('footerItemHoverTextColor:opportunities') ? ' custom-hover' : ''}`}
                data-footer-link-id="opportunities"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:opportunities') || undefined,
                  color: localStorage.getItem('footerItemTextColor:opportunities') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:opportunities') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:opportunities') || undefined
                } as React.CSSProperties}
              >Opportunities</Link></li>
              <li><Link to="/insights" className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:insights') || localStorage.getItem('footerItemHoverTextColor:insights') ? ' custom-hover' : ''}`}
                data-footer-link-id="insights"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:insights') || undefined,
                  color: localStorage.getItem('footerItemTextColor:insights') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:insights') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:insights') || undefined
                } as React.CSSProperties}
              >Insights</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <ul className="space-y-2">
              <li><a
                href={getFooterLink('linkedin')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:linkedin') || localStorage.getItem('footerItemHoverTextColor:linkedin') ? ' custom-hover' : ''}`}
                data-footer-link-id="linkedin"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:linkedin') || undefined,
                  color: localStorage.getItem('footerItemTextColor:linkedin') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:linkedin') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:linkedin') || undefined
                } as React.CSSProperties}
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedElement(e.currentTarget);
                  }
                }}
              >LinkedIn</a></li>
              <li><a
                href={getFooterLink('twitter')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:twitter') || localStorage.getItem('footerItemHoverTextColor:twitter') ? ' custom-hover' : ''}`}
                data-footer-link-id="twitter"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:twitter') || undefined,
                  color: localStorage.getItem('footerItemTextColor:twitter') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:twitter') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:twitter') || undefined
                } as React.CSSProperties}
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedElement(e.currentTarget);
                  }
                }}
              >Twitter</a></li>
              <li><a
                href={getFooterLink('instagram')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:instagram') || localStorage.getItem('footerItemHoverTextColor:instagram') ? ' custom-hover' : ''}`}
                data-footer-link-id="instagram"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:instagram') || undefined,
                  color: localStorage.getItem('footerItemTextColor:instagram') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:instagram') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:instagram') || undefined
                } as React.CSSProperties}
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedElement(e.currentTarget);
                  }
                }}
              >Instagram</a></li>
              <li><a
                href={getFooterLink('website')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-[#00a3ba]${localStorage.getItem('footerItemHoverColor:website') || localStorage.getItem('footerItemHoverTextColor:website') ? ' custom-hover' : ''}`}
                data-footer-link-id="website"
                style={{
                  backgroundColor: localStorage.getItem('footerItemBgColor:website') || undefined,
                  color: localStorage.getItem('footerItemTextColor:website') || undefined,
                  '--hover-color': localStorage.getItem('footerItemHoverColor:website') || undefined,
                  '--hover-text-color': localStorage.getItem('footerItemHoverTextColor:website') || undefined
                } as React.CSSProperties}
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedElement(e.currentTarget);
                  }
                }}
              >Website</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[#333333] text-center">
          <p className="text-base text-black flex items-center justify-center">
            Powered by 
            <a 
              href="https://www.unstop.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-2"
            >
              <img 
                src="https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/svg/unstop-logo.svg" 
                alt="Unstop Logo" 
                className="h-7"
              />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;