import React, { createContext, useContext, useEffect, useState } from 'react';

interface FooterLink {
  id: string;
  name: string;
  link: string;
}

const LOCAL_STORAGE_KEY = 'footerLinks';

const initialFooterLinks: FooterLink[] = [
  { id: 'linkedin', name: 'LinkedIn', link: 'https://www.linkedin.com/company/deloitte/' },
  { id: 'twitter', name: 'Twitter', link: 'https://x.com/deloitte?lang=en' },
  { id: 'instagram', name: 'Instagram', link: 'https://www.instagram.com/deloitte/?hl=en' },
  { id: 'website', name: 'Website', link: 'https://www.deloitte.com/global/en.html' },
  { id: 'about-us', name: 'About Us', link: 'https://www2.deloitte.com/ui/en/legal/about-deloitte.html?icid=bottom_' },
  { id: 'contact', name: 'Contact', link: 'https://www.deloitte.com/in/en/contact/contact-us.html' },
  { id: 'privacy-policy', name: 'Privacy Policy', link: 'https://www.deloitte.com/global/en/legal/privacy.html?icid=bn_privacy' },
];

interface FooterEditContextType {
  footerLinks: FooterLink[];
  setFooterLink: (linkId: string, field: keyof FooterLink, value: string) => void;
  saveToLocalStorage: () => void;
}

const FooterEditContext = createContext<FooterEditContextType | undefined>(undefined);

export const useFooterEdit = () => {
  const ctx = useContext(FooterEditContext);
  if (!ctx) throw new Error('useFooterEdit must be used within FooterEditProvider');
  return ctx;
};

export const FooterEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialFooterLinks;
    } catch {
      return initialFooterLinks;
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(footerLinks));
  }, [footerLinks]);

  const setFooterLink = (linkId: string, field: keyof FooterLink, value: string) => {
    setFooterLinks(prev => {
      const updatedList = prev.map(link => {
        if (link.id === linkId) {
          return { ...link, [field]: value };
        }
        return link;
      });
      return updatedList;
    });
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(footerLinks));
  };

  return (
    <FooterEditContext.Provider value={{
      footerLinks,
      setFooterLink,
      saveToLocalStorage
    }}>
      {children}
    </FooterEditContext.Provider>
  );
}; 