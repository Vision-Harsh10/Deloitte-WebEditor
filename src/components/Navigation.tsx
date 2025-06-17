import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'EVENTS', path: '/events' },
    { name: 'LEARNING', path: '/learning' },
    { name: 'MENTORSHIP', path: '/mentorship' },
    { name: 'OPPORTUNITIES', path: '/opportunities' },
    { name: 'CAREERS', path: '/careers' },
    { name: 'INSIGHTS', path: '/insights' },
    // { name: 'BUILDER', path: '/builder' },
  ];

  return (
    <nav className="bg-[#000000] text-[#ffffff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/svg/unstop-logo-white.svg" alt="Unstop Logo" className="w-18 h-9" />
              <span className="text-xl font-bold"> | </span>
              <div className="inline-block p-1">
                <img src="https://www2.deloitte.com/content/dam/assets/logos/deloitte.svg" alt="Deloitte Logo" className="w-[8rem]" />
              </div>
              {/* <span className="text-xl font-bold">Community</span> */}
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 rounded-md text-sm font-normal  hover:text-[#86bc25] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;