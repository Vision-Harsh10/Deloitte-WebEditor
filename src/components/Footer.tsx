import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFooterEdit } from '../context/FooterEditContext';

interface FooterProps {
  isEditMode: boolean;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const Footer: React.FC<FooterProps> = ({ isEditMode, selectedElement, setSelectedElement }) => {
  const { footerLinks, setFooterLink } = useFooterEdit();

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
    <footer className="bg-[#F5F5F4] text-black">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About</h3>
            <ul className="space-y-2">
              <li><a
                href={getFooterLink('about-us')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00a3ba]"
                data-footer-link-id="about-us"
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault(); // Prevent navigation
                    e.stopPropagation(); // Stop event propagation
                    setSelectedElement(e.currentTarget); // Select the <a> tag directly
                  }
                }}
              >About Us</a></li>
              <li><a
                href={getFooterLink('contact')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00a3ba]"
                data-footer-link-id="contact"
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault(); // Prevent navigation
                    e.stopPropagation(); // Stop event propagation
                    setSelectedElement(e.currentTarget); // Select the <a> tag directly
                  }
                }}
              >Contact</a></li>
              <li><a
                href={getFooterLink('privacy-policy')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00a3ba]"
                data-footer-link-id="privacy-policy"
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault(); // Prevent navigation
                    e.stopPropagation(); // Stop event propagation
                    setSelectedElement(e.currentTarget); // Select the <a> tag directly
                  }
                }}
              >Privacy Policy</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/events" className="hover:text-[#00a3ba]">Events</Link></li>
              <li><Link to="/learning" className="hover:text-[#00a3ba]">Learning</Link></li>
              {/* <li><Link to="/labs" className="hover:text-[#f49d34]">Labs</Link></li> */}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/mentorship" className="hover:text-[#00a3ba]">Mentorship</Link></li>
              <li><Link to="/opportunities" className="hover:text-[#00a3ba]">Opportunities</Link></li>
              <li><Link to="/insights" className="hover:text-[#00a3ba]">Insights</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <ul className="space-y-2">
              <li><a
                href={getFooterLink('linkedin')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00a3ba]"
                data-footer-link-id="linkedin"
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault(); // Prevent navigation
                    e.stopPropagation(); // Stop event propagation
                    setSelectedElement(e.currentTarget); // Select the <a> tag directly
                  }
                }}
              >LinkedIn</a></li>
              <li><a
                href={getFooterLink('twitter')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00a3ba]"
                data-footer-link-id="twitter"
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault(); // Prevent navigation
                    e.stopPropagation(); // Stop event propagation
                    setSelectedElement(e.currentTarget); // Select the <a> tag directly
                  }
                }}
              >Twitter</a></li>
              <li><a
                href={getFooterLink('instagram')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00a3ba]"
                data-footer-link-id="instagram"
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault(); // Prevent navigation
                    e.stopPropagation(); // Stop event propagation
                    setSelectedElement(e.currentTarget); // Select the <a> tag directly
                  }
                }}
              >Instagram</a></li>
              <li><a
                href={getFooterLink('website')?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00a3ba]"
                data-footer-link-id="website"
                onClick={e => {
                  if (isEditMode) {
                    e.preventDefault(); // Prevent navigation
                    e.stopPropagation(); // Stop event propagation
                    setSelectedElement(e.currentTarget); // Select the <a> tag directly
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