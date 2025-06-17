import React, { useState, useRef, useEffect } from 'react';
import { Move, Camera } from 'lucide-react';

interface ResizableImageProps {
  src: string;
  alt: string;
  className?: string;
  isEditMode: boolean;
  onResize: (width: number, height: number) => void;
  onPositionChange?: (x: number, y: number) => void;
  style?: React.CSSProperties;
  initialWidth?: number;
  initialHeight?: number;
  initialPosition?: { x: number; y: number };
  onImageChange?: (newUrl: string) => void;
  showChangeButton?: boolean;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  showMoveButton?: boolean;
}

const ResizableImage: React.FC<ResizableImageProps> = ({
  src,
  alt,
  className = '',
  isEditMode,
  onResize,
  onPositionChange,
  style,
  initialWidth,
  initialHeight,
  initialPosition = { x: 0, y: 0 },
  onImageChange,
  showChangeButton = false,
  imgProps = {},
  showMoveButton = true,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Add handle types for all 8 directions
  type HandleType = 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  // Helper to get cursor style for each handle
  const getCursor = (type: HandleType) => {
    switch (type) {
      case 'top': return 'ns-resize';
      case 'right': return 'ew-resize';
      case 'bottom': return 'ns-resize';
      case 'left': return 'ew-resize';
      case 'top-left': return 'nwse-resize';
      case 'top-right': return 'nesw-resize';
      case 'bottom-left': return 'nesw-resize';
      case 'bottom-right': return 'nwse-resize';
    }
  };

  // Store which handle is being dragged
  const [activeHandle, setActiveHandle] = useState<HandleType | null>(null);

  // Initialize dimensions and position
  useEffect(() => {
    if (imageRef.current && containerRef.current) {
      if (initialWidth && initialHeight) {
        imageRef.current.style.width = `${initialWidth}px`;
        imageRef.current.style.height = `${initialHeight}px`;
      } else if (style?.width && style?.height) {
        imageRef.current.style.width = typeof style.width === 'number' ? `${style.width}px` : style.width;
        imageRef.current.style.height = typeof style.height === 'number' ? `${style.height}px` : style.height;
      }
      
      containerRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [initialWidth, initialHeight, style, position]);

  useEffect(() => {
    if (!isEditMode) {
      setIsResizing(false);
      setIsDragging(false);
    }
  }, [isEditMode]);

  // Generalized mouse down for any handle
  const handleResizeMouseDown = (type: HandleType) => (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    setIsResizing(true);
    setActiveHandle(type);
    setStartX(e.clientX);
    setStartY(e.clientY);
    if (imageRef.current) {
      setStartWidth(imageRef.current.offsetWidth);
      setStartHeight(imageRef.current.offsetHeight);
    }
    if (containerRef.current) {
      setDragStartX(containerRef.current.offsetLeft);
      setDragStartY(containerRef.current.offsetTop);
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    setIsDragging(true);
    setDragStartX(e.clientX - position.x);
    setDragStartY(e.clientY - position.y);
  };

  // Enhanced mouse move for all handles
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && imageRef.current && activeHandle) {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = position.x;
      let newY = position.y;
      const minSize = 50;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      switch (activeHandle) {
        case 'right':
          newWidth = Math.max(minSize, startWidth + dx);
          break;
        case 'left':
          newWidth = Math.max(minSize, startWidth - dx);
          newX = position.x + dx;
          break;
        case 'bottom':
          newHeight = Math.max(minSize, startHeight + dy);
          break;
        case 'top':
          newHeight = Math.max(minSize, startHeight - dy);
          newY = position.y + dy;
          break;
        case 'top-left':
          newWidth = Math.max(minSize, startWidth - dx);
          newX = position.x + dx;
          newHeight = Math.max(minSize, startHeight - dy);
          newY = position.y + dy;
          break;
        case 'top-right':
          newWidth = Math.max(minSize, startWidth + dx);
          newHeight = Math.max(minSize, startHeight - dy);
          newY = position.y + dy;
          break;
        case 'bottom-left':
          newWidth = Math.max(minSize, startWidth - dx);
          newX = position.x + dx;
          newHeight = Math.max(minSize, startHeight + dy);
          break;
        case 'bottom-right':
          newWidth = Math.max(minSize, startWidth + dx);
          newHeight = Math.max(minSize, startHeight + dy);
          break;
      }
      imageRef.current.style.width = `${newWidth}px`;
      imageRef.current.style.height = `${newHeight}px`;
      setPosition({ x: newX, y: newY });
      if (onPositionChange) onPositionChange(newX, newY);
    } else if (isDragging && containerRef.current) {
      const newX = e.clientX - dragStartX;
      const newY = e.clientY - dragStartY;
      setPosition({ x: newX, y: newY });
      if (onPositionChange) {
        onPositionChange(newX, newY);
      }
    }
  };

  // Enhanced mouse up
  const handleMouseUp = () => {
    if (isResizing && imageRef.current) {
      setIsResizing(false);
      setActiveHandle(null);
      onResize(
        imageRef.current.offsetWidth,
        imageRef.current.offsetHeight
      );
    } else if (isDragging) {
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (isResizing || isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isDragging, startX, startY, startWidth, startHeight, dragStartX, dragStartY]);

  const handleImageUpload = (newUrl: string) => {
    if (onImageChange) {
      onImageChange(newUrl);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative inline-block"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`${className} ${isEditMode ? 'cursor-move' : ''}`}
        style={{
          ...style,
          resize: isEditMode ? 'both' : 'none',
          minWidth: '50px',
          minHeight: '50px',
          transformOrigin: 'center center',
        }}
        onMouseDown={handleDragStart}
        {...(imgProps as any)}
      />
      {isEditMode && (
        <>
          {/* 8 resize handles */}
          {/* Corners */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-20" style={{transform:'translate(-50%,-50%)'}} onMouseDown={handleResizeMouseDown('top-left')} />
          <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-20" style={{transform:'translate(50%,-50%)'}} onMouseDown={handleResizeMouseDown('top-right')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-20" style={{transform:'translate(-50%,50%)'}} onMouseDown={handleResizeMouseDown('bottom-left')} />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-20" style={{transform:'translate(50%,50%)'}} onMouseDown={handleResizeMouseDown('bottom-right')} />
          {/* Edges */}
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize z-20" style={{transform:'translate(-50%,-50%)'}} onMouseDown={handleResizeMouseDown('top')} />
          <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize z-20" style={{transform:'translate(-50%,50%)'}} onMouseDown={handleResizeMouseDown('bottom')} />
          <div className="absolute top-1/2 left-0 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize z-20" style={{transform:'translate(-50%,-50%)'}} onMouseDown={handleResizeMouseDown('left')} />
          <div className="absolute top-1/2 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize z-20" style={{transform:'translate(50%,-50%)'}} onMouseDown={handleResizeMouseDown('right')} />
          {/* Border/shadow feedback */}
          <div className={`absolute inset-0 pointer-events-none rounded-lg ${isResizing ? 'ring-4 ring-blue-400 shadow-lg' : 'ring-2 ring-blue-300'}`} />

          {/* Move (drag) and Camera (upload) buttons - top right, side by side */}
          <div className="absolute top-2 right-2 z-30 flex flex-row gap-2">
            {showMoveButton && (
              <button
                onMouseDown={handleDragStart}
                className="p-1 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors"
                title="Reposition Image"
              >
                <Move className="w-4 h-4" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ResizableImage; 