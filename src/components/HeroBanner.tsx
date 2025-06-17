import React, { useState, useEffect } from 'react';
import ResizableImage from './ResizableImage';
import { Camera } from 'lucide-react';

interface HeroBannerProps {
  isEditMode: boolean;
  setSelectedElement: (el: HTMLElement | null) => void;
}

interface HeroContent {
  title: string;
  subtitle: string;
}

const HERO_BANNER_STORAGE_KEY = 'heroBannerContent';
const HERO_BANNER_IMAGE_DIMENSIONS_KEY = 'heroBannerImageDimensions';

const HeroBanner: React.FC<HeroBannerProps> = ({ isEditMode, setSelectedElement }) => {
  const [heroContent, setHeroContent] = useState<HeroContent>(() => {
    const saved = localStorage.getItem(HERO_BANNER_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          title: parsed.title || 'Deloitte Community',
          subtitle: parsed.subtitle || "Build What's Next. Together with Deloitte."
        };
      } catch {
        return {
          title: 'Deloitte Community',
          subtitle: "Build What's Next. Together with Deloitte."
        };
      }
    }
    return {
      title: 'Deloitte Community',
      subtitle: "Build What's Next. Together with Deloitte."
    };
  });

  const [backgroundImage, setBackgroundImage] = useState<string>(() => {
    const saved = localStorage.getItem(HERO_BANNER_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.backgroundImage || "https://pbs.twimg.com/profile_banners/8457092/1690923063/1500x500";
      } catch {
        return "https://pbs.twimg.com/profile_banners/8457092/1690923063/1500x500";
      }
    }
    return "https://pbs.twimg.com/profile_banners/8457092/1690923063/1500x500";
  });

  const [gradientColors, setGradientColors] = useState(() => {
    const saved = localStorage.getItem(HERO_BANNER_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.gradientColors || { from: '#000000', to: '#218c1b' };
      } catch {
        return { from: '#000000', to: '#218c1b' };
      }
    }
    return { from: '#000000', to: '#218c1b' };
  });

  // Image dimensions state
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>(() => {
    const saved = localStorage.getItem(HERO_BANNER_IMAGE_DIMENSIONS_KEY);
    return saved ? JSON.parse(saved) : { width: 0, height: 0 };
  });

  // Save to localStorage on exit edit mode
  useEffect(() => {
    if (!isEditMode) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      localStorage.setItem(HERO_BANNER_STORAGE_KEY, JSON.stringify({
        ...heroContent,
        backgroundImage,
        gradientColors
      }));
      localStorage.setItem(HERO_BANNER_IMAGE_DIMENSIONS_KEY, JSON.stringify(imageDimensions));
    }
  }, [isEditMode, heroContent, backgroundImage, gradientColors, imageDimensions]);

  const handleContentChange = (field: keyof HeroContent, value: string) => {
    setHeroContent((prev: HeroContent) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGradientColorChange = (position: 'from' | 'to', color: string) => {
    setGradientColors((prev: { from: string; to: string }) => ({
      ...prev,
      [position]: color
    }));
  };

  // Image resize handler
  const handleImageResize = (width: number, height: number) => {
    const newDimensions = { width, height };
    setImageDimensions(newDimensions);
    localStorage.setItem(HERO_BANNER_IMAGE_DIMENSIONS_KEY, JSON.stringify(newDimensions));
  };

  return (
    <div className="relative bg-[#001f82] text-white py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})`
          }}
        />
        <div className="absolute inset-0">
          <ResizableImage
            src={backgroundImage}
            alt="Hero Banner Background"
            isEditMode={false}
            onResize={handleImageResize}
            className="w-full h-full object-cover object-center opacity-20"
            style={{
              width: imageDimensions.width || '100%',
              height: imageDimensions.height || '100%',
            }}
            showChangeButton={false}
            onImageChange={(newUrl) => setBackgroundImage(newUrl)}
            showMoveButton={false}
          />
          {isEditMode && (
            <label htmlFor="upload-hero-banner-image" className="absolute bottom-4 left-4 z-20 cursor-pointer bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <Camera className="w-5 h-5 text-gray-700" />
              <input
                id="upload-hero-banner-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setBackgroundImage(event.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          )}
        </div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {isEditMode ? (
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 outline-none"
              contentEditable
              suppressContentEditableWarning
              onBlur={e => handleContentChange('title', e.currentTarget.textContent || '')}
              onClick={e => setSelectedElement(e.currentTarget)}
            >
              {heroContent.title}
            </h1>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {heroContent.title}
            </h1>
          )}
          {isEditMode ? (
            <p
              className="text-xl md:text-2xl outline-none"
              contentEditable
              suppressContentEditableWarning
              onBlur={e => handleContentChange('subtitle', e.currentTarget.textContent || '')}
              onClick={e => setSelectedElement(e.currentTarget)}
            >
              {heroContent.subtitle}
            </p>
          ) : (
            <p className="text-xl md:text-2xl">
              {heroContent.subtitle}
            </p>
          )}
          <div className="mt-8">
            <a
              href="/"
              className="inline-block bg-[#218c1b] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#54c22a] hover:text-[#000000] transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
      {isEditMode && (
        <div className="absolute top-4 left-4 bg-white/90 px-3 py-2 rounded-lg shadow border border-gray-200 flex flex-col items-start z-10 min-w-[140px]">
          <span className="text-xs font-semibold text-gray-700 mb-2">Banner Gradient</span>
          <div className="flex flex-row items-center gap-3 w-full">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">Left Side</span>
              <input
                type="color"
                value={gradientColors.from}
                onChange={(e) => handleGradientColorChange('from', e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-gray-300"
                title="Gradient Left Side Color"
              />
            </div>
            <span className="text-gray-400 mx-1">→</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">Right Side</span>
              <input
                type="color"
                value={gradientColors.to}
                onChange={(e) => handleGradientColorChange('to', e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-gray-300"
                title="Gradient Right Side Color"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;