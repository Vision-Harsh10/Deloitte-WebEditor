import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#F5F5F4] text-black">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About</h3>
            <ul className="space-y-2">
              <li><Link to="https://www2.deloitte.com/ui/en/legal/about-deloitte.html?icid=bottom_" className="hover:text-[#00a3ba]">About Us</Link></li>
              <li><Link to="https://www.deloitte.com/in/en/contact/contact-us.html" className="hover:text-[#00a3ba]">Contact</Link></li>
              <li><Link to="https://www.deloitte.com/global/en/legal/privacy.html?icid=bn_privacy" className="hover:text-[#00a3ba]">Privacy Policy</Link></li>
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
              <li><a href="https://www.linkedin.com/company/deloitte/" className="hover:text-[#00a3ba]">LinkedIn</a></li>
              <li><a href="https://x.com/deloitte?lang=en" className="hover:text-[#00a3ba]">Twitter</a></li>
              <li><a href="https://www.instagram.com/deloitte/?hl=en" className="hover:text-[#00a3ba]">Instagram</a></li>
              <li><a href="https://www.deloitte.com/global/en.html" className="hover:text-[#00a3ba]">Website</a></li>
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