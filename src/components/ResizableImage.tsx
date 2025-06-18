import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const lastResizeRef = useRef<{ width: number; height: number } | null>(null);
  const requestAnimationFrameRef = useRef<number>();
  const isResizingRef = useRef(false);

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
      isResizingRef.current = false;
    }
  }, [isEditMode]);

  // Debounced resize handler with RAF
  const debouncedResize = useCallback((width: number, height: number) => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Only trigger resize if dimensions have changed significantly
    if (!lastResizeRef.current || 
        Math.abs(lastResizeRef.current.width - width) > 5 || 
        Math.abs(lastResizeRef.current.height - height) > 5) {
      
      // Use requestAnimationFrame for smoother updates
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }

      requestAnimationFrameRef.current = requestAnimationFrame(() => {
        resizeTimeoutRef.current = setTimeout(() => {
          if (isResizingRef.current) {
            onResize(width, height);
            lastResizeRef.current = { width, height };
          }
        }, 150); // Increased debounce time to 150ms
      });
    }
  }, [onResize]);

  // Generalized mouse down for any handle
  const handleResizeMouseDown = (type: HandleType) => (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    setIsResizing(true);
    isResizingRef.current = true;
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

  // Enhanced mouse move with RAF for smoother updates
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && imageRef.current && activeHandle) {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }

      requestAnimationFrameRef.current = requestAnimationFrame(() => {
        const image = imageRef.current;
        if (!image) return;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = position.x;
        let newY = position.y;
        const minSize = 50;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Calculate new dimensions based on handle type
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

        // Apply new dimensions directly to the image element with transform for better performance
        image.style.transform = `translate(${newX}px, ${newY}px)`;
        image.style.width = `${newWidth}px`;
        image.style.height = `${newHeight}px`;
        image.style.willChange = 'transform, width, height';
        
        setPosition({ x: newX, y: newY });
        if (onPositionChange) onPositionChange(newX, newY);

        // Debounce the resize callback
        debouncedResize(newWidth, newHeight);
      });
    } else if (isDragging && containerRef.current) {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }

      requestAnimationFrameRef.current = requestAnimationFrame(() => {
        const newX = e.clientX - dragStartX;
        const newY = e.clientY - dragStartY;
        if (imageRef.current) {
          imageRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
          imageRef.current.style.willChange = 'transform';
        }
        setPosition({ x: newX, y: newY });
        if (onPositionChange) {
          onPositionChange(newX, newY);
        }
      });
    }
  };

  // Enhanced mouse up with cleanup
  const handleMouseUp = () => {
    if (isResizing && imageRef.current) {
      setIsResizing(false);
      isResizingRef.current = false;
      setActiveHandle(null);
      
      // Clear any pending resize timeout and animation frame
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
      
      // Ensure final dimensions are saved
      onResize(
        imageRef.current.offsetWidth,
        imageRef.current.offsetHeight
      );
    } else if (isDragging) {
      setIsDragging(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, []);

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
        className={`${className} ${(isEditMode && showMoveButton) ? 'cursor-move' : ''}`}
        style={{
          ...style,
          resize: isEditMode ? 'both' : 'none',
          minWidth: '50px',
          minHeight: '50px',
          transformOrigin: 'center center',
        }}
        onMouseDown={showMoveButton && isEditMode ? handleDragStart : undefined}
        onDragStart={isEditMode ? (e) => e.preventDefault() : undefined}
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
            {showChangeButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (event) => {
                    const file = (event.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const result = e.target?.result;
                        if (typeof result === 'string' && onImageChange) {
                          onImageChange(result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ResizableImage; 