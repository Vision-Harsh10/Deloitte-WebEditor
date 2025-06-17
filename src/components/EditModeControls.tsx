import React, { useState, useRef, useEffect } from 'react';
import { 
  Type, 
  Layout, 
  Image as ImageIcon, 
  Palette, 
  Move, 
  Copy, 
  Trash2,
  ChevronDown, 
  ChevronUp, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  ChevronRight,
  Undo2
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface EditModeControlsProps {
  onStyleChange: (styles: any) => void;
  onLayoutChange: (layout: any) => void;
  onComponentAction: (action: string) => void;
  selectedElement: HTMLElement | null;
  className?: string;
  onGenerateBuild?: () => void;
}

const EditModeControls: React.FC<EditModeControlsProps> = ({
  onStyleChange,
  onLayoutChange,
  onComponentAction,
  selectedElement,
  className = '',
  onGenerateBuild,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'layout' | 'image' | 'style'>('text');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showOpacityPicker, setShowOpacityPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const colorButtonSelectionRef = useRef<Range | null>(null);

  // Movable panel state
  const [panelPos, setPanelPos] = useState({ top: 80, left: window.innerWidth - 300 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; top: number; left: number } | null>(null);

  // Store original styles when element is selected
  const originalStyles = useRef<{ [key: string]: string }>({});

  // Save original styles when element is selected
  React.useEffect(() => {
    if (selectedElement) {
      const computedStyle = window.getComputedStyle(selectedElement);
      originalStyles.current = {
        color: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
        fontSize: computedStyle.fontSize,
        fontWeight: computedStyle.fontWeight,
        fontStyle: computedStyle.fontStyle,
        textDecoration: computedStyle.textDecoration,
        textDecorationLine: computedStyle.textDecorationLine,
        textAlign: computedStyle.textAlign,
        lineHeight: computedStyle.lineHeight,
        letterSpacing: computedStyle.letterSpacing,
        opacity: computedStyle.opacity,
      };
    }
  }, [selectedElement]);

  // Style presets
  const stylePresets = {
    'Heading 1': {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    'Heading 2': {
      fontSize: '2rem',
      fontWeight: 'bold',
      lineHeight: '1.3',
      letterSpacing: '-0.01em',
    },
    'Body Text': {
      fontSize: '1rem',
      lineHeight: '1.5',
      letterSpacing: '0.01em',
    },
    'Caption': {
      fontSize: '0.875rem',
      lineHeight: '1.4',
      letterSpacing: '0.02em',
      color: '#666666',
    },
  };

  const handlePresetSelect = (presetName: string) => {
    if (!selectedElement) return;
    const preset = stylePresets[presetName as keyof typeof stylePresets];
    Object.entries(preset).forEach(([key, value]) => {
      selectedElement.style[key as any] = value;
    });
    onStyleChange(preset);
  };

  const handleResetStyles = () => {
    if (!selectedElement) return;
    Object.entries(originalStyles.current).forEach(([key, value]) => {
      selectedElement.style[key as any] = value;
    });
    onStyleChange(originalStyles.current);
  };

  const handleOpacityChange = (opacity: string) => {
    if (!selectedElement) return;
    selectedElement.style.opacity = opacity;
    onStyleChange({ opacity });
  };

  const handleLineHeightChange = (lineHeight: string) => {
    if (!selectedElement) return;
    selectedElement.style.lineHeight = lineHeight;
    onStyleChange({ lineHeight });
  };

  const handleLetterSpacingChange = (spacing: string) => {
    if (!selectedElement) return;
    selectedElement.style.letterSpacing = spacing;
    onStyleChange({ letterSpacing: spacing });
  };

  // Enhanced color picker colors
  const colorPalette = [
    // Primary colors
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    // Secondary colors
    '#FFFF00', '#FF00FF', '#00FFFF',
    // Grayscale
    '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151',
    // Brand colors
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    // Pastels
    '#FEE2E2', '#FEF3C7', '#DCFCE7', '#DBEAFE', '#F3E8FF',
  ];

  // Add useEffect for ESC key handling
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedElement) {
        // Remove selection highlight
        selectedElement.style.outline = '';
        selectedElement.style.outlineOffset = '';
        // Call onComponentAction to handle deselection
        onComponentAction('deselect');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, onComponentAction]);

  // Add useEffect for selection highlight
  React.useEffect(() => {
    if (selectedElement) {
      // Add highlight to selected element
      selectedElement.style.outline = '2px solid #3b82f6';
      selectedElement.style.outlineOffset = '2px';
      
      // Cleanup function to remove highlight
      return () => {
        selectedElement.style.outline = '';
        selectedElement.style.outlineOffset = '';
      };
    }
  }, [selectedElement]);

  // Get element type display name
  const getElementType = () => {
    if (!selectedElement) return 'No element selected';
    
    const tagName = selectedElement.tagName.toLowerCase();
    const elementTypes: { [key: string]: string } = {
      'h1': 'Heading 1',
      'h2': 'Heading 2',
      'h3': 'Heading 3',
      'h4': 'Heading 4',
      'h5': 'Heading 5',
      'h6': 'Heading 6',
      'p': 'Paragraph',
      'span': 'Text',
      'div': 'Container',
      'img': 'Image',
      'a': 'Link',
      'button': 'Button',
      'input': 'Input Field',
      'textarea': 'Text Area',
      'ul': 'Unordered List',
      'ol': 'Ordered List',
      'li': 'List Item'
    };

    return elementTypes[tagName] || `Element (${tagName})`;
  };

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      top: panelPos.top,
      left: panelPos.left,
    };
    document.body.style.userSelect = 'none';
  };

  React.useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      let newTop = dragStart.current.top + dy;
      let newLeft = dragStart.current.left + dx;
      // Optional: Boundaries
      newTop = Math.max(0, Math.min(window.innerHeight - 60, newTop));
      newLeft = Math.max(0, Math.min(window.innerWidth - 260, newLeft));
      setPanelPos({ top: newTop, left: newLeft });
    };
    const handleMouseUp = () => {
      setDragging(false);
      dragStart.current = null;
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const savedSelectionRef = useRef<Range | null>(null);

  // Save selection on mousedown in the main content area
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Only save if clicking inside the selected element
      if (selectedElement && selectedElement.contains(e.target as Node)) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
        }
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [selectedElement]);

  const handleTextStyle = (style: string) => {
    if (!selectedElement) return;

    // Try to restore the saved selection if available
    const selection = window.getSelection();
    if (savedSelectionRef.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelectionRef.current);
    }
    const range = selection && selection.rangeCount ? selection.getRangeAt(0) : null;

    // Only apply style if selection is inside selectedElement
    if (selection && range && !selectedElement.contains(range.commonAncestorContainer)) {
      return;
    }

    const isInlineStyle = ['bold', 'italic', 'underline'].includes(style);

    // If text is selected and inline style is requested, wrap and style only the selected text
    if (
      selection &&
      range &&
      !selection.isCollapsed &&
      isInlineStyle &&
      range.startContainer === range.endContainer &&
      range.startContainer.nodeType === Node.TEXT_NODE
    ) {
      const span = document.createElement('span');
      const currentStyles = window.getComputedStyle(selectedElement);
      switch (style) {
        case 'bold':
          span.style.fontWeight = currentStyles.fontWeight === '700' || currentStyles.fontWeight === 'bold'
            ? 'normal'
            : 'bold';
          break;
        case 'italic':
          span.style.fontStyle = currentStyles.fontStyle === 'italic'
            ? 'normal'
            : 'italic';
          break;
        case 'underline':
          span.style.textDecoration = currentStyles.textDecoration.includes('underline')
            ? 'none'
            : 'underline';
          break;
      }
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
      // Preserve selection
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
      // Update style changes
      onStyleChange({
        fontWeight: span.style.fontWeight,
        fontStyle: span.style.fontStyle,
        textDecoration: span.style.textDecoration
      });
      return;
    }

    // Always apply style to the selected element if it is selected (regardless of text selection/cursor)
    const currentStyles = window.getComputedStyle(selectedElement);
    let newStyles = {};
    switch (style) {
      case 'bold':
        selectedElement.style.setProperty('font-weight',
          currentStyles.fontWeight === '700' || currentStyles.fontWeight === 'bold'
            ? 'normal'
            : 'bold',
          'important'
        );
        newStyles = { fontWeight: selectedElement.style.fontWeight };
        break;
      case 'italic':
        selectedElement.style.setProperty('font-style',
          currentStyles.fontStyle === 'italic'
            ? 'normal'
            : 'italic',
          'important'
        );
        newStyles = { fontStyle: selectedElement.style.fontStyle };
        break;
      case 'underline':
        selectedElement.style.setProperty('text-decoration',
          currentStyles.textDecoration.includes('underline')
            ? 'none'
            : 'underline',
          'important'
        );
        newStyles = { textDecoration: selectedElement.style.textDecoration };
        break;
      case 'align-left':
        if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(selectedElement.tagName)) {
          selectedElement.style.setProperty('text-align', 'left', 'important');
          newStyles = { textAlign: 'left' };
        }
        break;
      case 'align-center':
        if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(selectedElement.tagName)) {
          selectedElement.style.setProperty('text-align', 'center', 'important');
          newStyles = { textAlign: 'center' };
        }
        break;
      case 'align-right':
        if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(selectedElement.tagName)) {
          selectedElement.style.setProperty('text-align', 'right', 'important');
          newStyles = { textAlign: 'right' };
        }
        break;
    }
    onStyleChange(newStyles);
  };

  const handleFontSize = (size: string) => {
    if (!selectedElement) return;
    selectedElement.style.fontSize = size;
    onStyleChange({ fontSize: size });
  };

  const handleColorButtonMouseDown = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      colorButtonSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const handleColorPick = (color: string) => {
    setCurrentColor(color);
    if (!selectedElement) return;

    // Try to apply color to selected text if possible
    const selection = window.getSelection();
    if (colorButtonSelectionRef.current && selection) {
      selection.removeAllRanges();
      selection.addRange(colorButtonSelectionRef.current);
    }
    const range = selection && selection.rangeCount ? selection.getRangeAt(0) : null;
    // Only allow styling if the selection is within a single text node
    if (
      selection &&
      range &&
      selectedElement.contains(range.commonAncestorContainer) &&
      range.startContainer === range.endContainer &&
      range.startContainer.nodeType === Node.TEXT_NODE &&
      !selection.isCollapsed
    ) {
      // If text is selected, wrap and color only the selected text
      const span = document.createElement('span');
      span.style.color = color;
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
      // Preserve selection
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
      onStyleChange({}); // No need to update the whole element's color
      return;
    }
    // Always apply color to the whole selected element if no text is selected
    selectedElement.style.color = color;
    onStyleChange({ color });
  };

  // Add click-away handler for color picker
  React.useEffect(() => {
    if (!showColorPicker) return;
    const handleClick = (e: MouseEvent) => {
      const picker = document.querySelector('.custom-color-picker-popover');
      if (picker && !picker.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showColorPicker]);

  const handleBackgroundChange = (color: string) => {
    if (!selectedElement) return;
    selectedElement.style.backgroundColor = color;
    onStyleChange({ backgroundColor: color });
    setShowColorPicker(false);
  };

  const handleHoverColorChange = (color: string) => {
    if (!selectedElement) return;
    selectedElement.style.setProperty('--hover-color', color);
    selectedElement.classList.add('custom-hover');
    onStyleChange({ '--hover-color': color });
    setShowColorPicker(false);
  };

  const handleLayoutChange = (property: any, value: string) => {
    if (!selectedElement) return;
    selectedElement.style[property] = value;
    onLayoutChange({ [property]: value });
  };

  const handleComponentAction = (action: string) => {
    onComponentAction(action);
  };

  const [openTextTypography, setOpenTextTypography] = useState(true);
  const [openTextColor, setOpenTextColor] = useState(false);
  const [openTextSpacing, setOpenTextSpacing] = useState(false);
  const [openStyleBackground, setOpenStyleBackground] = useState(true);
  const [openStyleBorder, setOpenStyleBorder] = useState(false);
  const [openStyleHover, setOpenStyleHover] = useState(false);
  const [openLayoutOrder, setOpenLayoutOrder] = useState(true);
  const [openLayoutPadding, setOpenLayoutPadding] = useState(false);
  const [openLayoutMargin, setOpenLayoutMargin] = useState(false);
  const [openImageActions, setOpenImageActions] = useState(true);
  const [openImageStyle, setOpenImageStyle] = useState(false);
  const [openPageActions, setOpenPageActions] = useState(true);

  // Save selection when color input is focused or clicked
  const handleColorInputFocus = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  // Add the downloadZip function
  const downloadZip = () => {
    const zip = new JSZip();
    // Demo: Add static HTML, CSS, and JS files. Replace with your actual build output if needed.
    zip.file('index.html', `<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Offline Demo Site</title>
  <link rel='stylesheet' href='style.css'>
</head>
<body>
  <header>
    <h1>Welcome to the Offline Demo Site</h1>
    <button id='demoBtn'>Click Me</button>
  </header>
  <main>
    <p>This is a static export. You can open this ZIP and run index.html offline.</p>
  </main>
  <script src='main.js'></script>
</body>
</html>`);
    zip.file('style.css', `body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; }
header { background: #1783b0; color: #fff; padding: 2rem; text-align: center; }
button { background: #fff; color: #1783b0; border: 2px solid #1783b0; padding: 0.5rem 1rem; border-radius: 6px; font-size: 1rem; cursor: pointer; }
button:hover { background: #1783b0; color: #fff; }
main { padding: 2rem; text-align: center; }`);
    zip.file('main.js', `document.getElementById('demoBtn').addEventListener('click', function() { alert('Button works offline!'); });`);
    zip.generateAsync({ type: 'blob' }).then(blob => {
      saveAs(blob, 'demo-site.zip');
    });
  };

  // Add section-specific reset handlers
  const resetTypography = () => {
    if (!selectedElement) return;
    selectedElement.style.fontWeight = '';
    selectedElement.style.fontStyle = '';
    selectedElement.style.textDecoration = '';
    selectedElement.style.fontSize = '';
    selectedElement.style.fontFamily = '';
    selectedElement.style.lineHeight = '';
    selectedElement.style.letterSpacing = '';
    onStyleChange({
      fontWeight: '', fontStyle: '', textDecoration: '', fontSize: '', fontFamily: '', lineHeight: '', letterSpacing: ''
    });
  };
  const resetColor = () => {
    if (!selectedElement) return;
    selectedElement.style.color = '';
    onStyleChange({ color: '' });
  };
  const resetSpacing = () => {
    if (!selectedElement) return;
    selectedElement.style.lineHeight = '';
    selectedElement.style.letterSpacing = '';
    onStyleChange({ lineHeight: '', letterSpacing: '' });
  };
  const resetPadding = () => {
    if (!selectedElement) return;
    selectedElement.style.paddingTop = '';
    selectedElement.style.paddingRight = '';
    selectedElement.style.paddingBottom = '';
    selectedElement.style.paddingLeft = '';
    onLayoutChange({ paddingTop: '', paddingRight: '', paddingBottom: '', paddingLeft: '' });
  };
  const resetMargin = () => {
    if (!selectedElement) return;
    selectedElement.style.marginTop = '';
    selectedElement.style.marginRight = '';
    selectedElement.style.marginBottom = '';
    selectedElement.style.marginLeft = '';
    onLayoutChange({ marginTop: '', marginRight: '', marginBottom: '', marginLeft: '' });
  };

  // Add deletedElements stack for undoing deletes
  const [deletedElements, setDeletedElements] = useState<{ element: HTMLElement, parent: Node, nextSibling: Node | null }[]>([]);

  // Delete handler: remove element and push to deletedElements stack
  const handleDelete = () => {
    if (!selectedElement) {
      console.log('Delete: No selectedElement');
      return;
    }
    const parent = selectedElement.parentNode;
    const nextSibling = selectedElement.nextSibling;
    if (parent) {
      setDeletedElements(stack => [
        { element: selectedElement, parent, nextSibling },
        ...stack
      ]);
      parent.removeChild(selectedElement);
      console.log('Deleted element:', selectedElement, 'from parent:', parent);
      onComponentAction('deselect');
    } else {
      console.log('Delete: No parent for selectedElement');
    }
  };

  // Undo handler: restore last deleted element
  const handleUndoDelete = () => {
    if (deletedElements.length === 0) {
      console.log('Undo: No deleted elements to restore');
      return;
    }
    const { element, parent, nextSibling } = deletedElements[0];
    setDeletedElements(stack => stack.slice(1));
    if (parent) {
      if (nextSibling) {
        parent.insertBefore(element, nextSibling);
        console.log('Restored element before nextSibling:', element, nextSibling);
      } else {
        parent.appendChild(element);
        console.log('Restored element at end of parent:', element, parent);
      }
      onComponentAction('select');
    } else {
      console.log('Undo: No parent to restore element to');
    }
  };

  // Helper to get current styles/layout of selected element
  const getCurrentElementStyles = () => {
    if (!selectedElement) return null;
    const computed = window.getComputedStyle(selectedElement);
    const styles = {
      style: {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        fontStyle: computed.fontStyle,
        textDecoration: computed.textDecoration,
        textAlign: computed.textAlign,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
        fontFamily: computed.fontFamily,
        opacity: computed.opacity,
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        marginTop: computed.marginTop,
        marginRight: computed.marginRight,
        marginBottom: computed.marginBottom,
        marginLeft: computed.marginLeft,
      } as { [key: string]: string }
    };
    console.log('Current styles:', styles);
    return styles;
  };

  return (
    <div
      className={`fixed bg-white rounded-lg shadow-lg p-4 w-64 z-50 ${className}`}
      style={{
        top: panelPos.top,
        left: panelPos.left,
        cursor: dragging ? 'move' : 'default',
        transition: dragging ? 'none' : 'box-shadow 0.2s',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      {/* Draggable Header */}
      <div
        className="flex items-center gap-2 mb-2 px-2 py-1 bg-blue-100 rounded-t cursor-move select-none"
        style={{ margin: '-1rem -1rem 0 -1rem', borderBottom: '1px solid #e5e7eb' }}
        onMouseDown={handleHeaderMouseDown}
      >
        <Move size={18} className="text-blue-500" />
        <span className="font-semibold text-blue-700">Edit Panel</span>
      </div>

      {/* Element Type Display */}
      <div className="mb-4 p-2 bg-gray-50 rounded">
        <div className="text-sm text-gray-600">Selected Element:</div>
        <div className="font-medium text-gray-800">{getElementType()}</div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`p-2 ${activeTab === 'text' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('text')}
        >
          <Type size={20} />
        </button>
        <button
          className={`p-2 ${activeTab === 'layout' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('layout')}
        >
          <Layout size={20} />
        </button>
        <button
          className={`p-2 ${activeTab === 'image' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('image')}
        >
          <ImageIcon size={20} />
        </button>
        <button
          className={`p-2 ${activeTab === 'style' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('style')}
        >
          <Palette size={20} />
        </button>
      </div>

      {/* Text Controls */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          {/* Typography Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2 relative"
              onClick={() => setOpenTextTypography((v) => !v)}
            >
              {openTextTypography ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2">Typography</span>
              <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-blue-500 px-2" onClick={e => { e.stopPropagation(); resetTypography(); }} title="Reset Typography">Reset</button>
            </button>
            {openTextTypography && (
              <div className="space-y-2 pl-4">
                <div className="flex gap-2">
                  <button onMouseDown={e => { e.preventDefault(); handleTextStyle('bold'); }} className="p-2 hover:bg-gray-100 rounded" title="Bold"><Bold size={16} /></button>
                  <button onMouseDown={e => { e.preventDefault(); handleTextStyle('italic'); }} className="p-2 hover:bg-gray-100 rounded" title="Italic"><Italic size={16} /></button>
                  <button onMouseDown={e => { e.preventDefault(); handleTextStyle('underline'); }} className="p-2 hover:bg-gray-100 rounded" title="Underline"><Underline size={16} /></button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleTextStyle('align-left')} className="p-2 hover:bg-gray-100 rounded" title="Align Left"><AlignLeft size={16} /></button>
                  <button onClick={() => handleTextStyle('align-center')} className="p-2 hover:bg-gray-100 rounded" title="Align Center"><AlignCenter size={16} /></button>
                  <button onClick={() => handleTextStyle('align-right')} className="p-2 hover:bg-gray-100 rounded" title="Align Right"><AlignRight size={16} /></button>
                </div>
                <select onChange={(e) => handleFontSize(e.target.value)} className="p-2 border rounded w-full">
                  <option value="">Font Size</option>
                  <option value="12px">Small</option>
                  <option value="16px">Normal</option>
                  <option value="20px">Large</option>
                  <option value="24px">Extra Large</option>
                </select>
                <select
                  onChange={(e) => {
                    if (!selectedElement) return;
                    selectedElement.style.fontFamily = e.target.value;
                    onStyleChange({ fontFamily: e.target.value });
                  }}
                  className="p-2 border rounded w-full"
                  defaultValue=""
                >
                  <option value="">Font Family</option>
                  <option value="Arial, sans-serif" style={{ fontFamily: 'Arial, sans-serif' }}>Arial</option>
                  <option value="Helvetica, sans-serif" style={{ fontFamily: 'Helvetica, sans-serif' }}>Helvetica</option>
                  <option value="Georgia, serif" style={{ fontFamily: 'Georgia, serif' }}>Georgia</option>
                  <option value="Times New Roman, Times, serif" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Times New Roman</option>
                  <option value="Courier New, Courier, monospace" style={{ fontFamily: 'Courier New, Courier, monospace' }}>Courier New</option>
                  <option value="Verdana, Geneva, sans-serif" style={{ fontFamily: 'Verdana, Geneva, sans-serif' }}>Verdana</option>
                  <option value="Trebuchet MS, sans-serif" style={{ fontFamily: 'Trebuchet MS, sans-serif' }}>Trebuchet MS</option>
                  <option value="Impact, Charcoal, sans-serif" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>Impact</option>
                  <option value="Comic Sans MS, cursive, sans-serif" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>Comic Sans MS</option>
                  <option value="Lucida Console, Monaco, monospace" style={{ fontFamily: 'Lucida Console, Monaco, monospace' }}>Lucida Console</option>
                </select>
              </div>
            )}
          </div>
          {/* Color Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2 relative"
              onClick={() => setOpenTextColor((v) => !v)}
            >
              {openTextColor ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2">Text Color</span>
              <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-blue-500 px-2" onClick={e => { e.stopPropagation(); resetColor(); }} title="Reset Color">Reset</button>
            </button>
            {openTextColor && (
              <div className="pl-4">
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input
                  type="color"
                  value={currentColor}
                  onChange={e => handleColorPick(e.target.value)}
                  className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer"
                  title="Pick text color"
                />
              </div>
            )}
          </div>
          {/* Spacing Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2 relative"
              onClick={() => setOpenTextSpacing((v) => !v)}
            >
              {openTextSpacing ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2">Spacing</span>
              <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-blue-500 px-2" onClick={e => { e.stopPropagation(); resetSpacing(); }} title="Reset Spacing">Reset</button>
            </button>
            {openTextSpacing && (
              <div className="space-y-2 pl-4">
                <label className="block text-sm font-medium">Line Height</label>
                <select onChange={(e) => handleLineHeightChange(e.target.value)} className="w-full p-2 border rounded" defaultValue="">
                  <option value="">Select line height...</option>
                  <option value="1">Single (1)</option>
                  <option value="1.2">Tight (1.2)</option>
                  <option value="1.5">Normal (1.5)</option>
                  <option value="1.8">Loose (1.8)</option>
                  <option value="2">Double (2)</option>
                </select>
                <label className="block text-sm font-medium">Letter Spacing</label>
                <select onChange={(e) => handleLetterSpacingChange(e.target.value)} className="w-full p-2 border rounded" defaultValue="">
                  <option value="">Select spacing...</option>
                  <option value="-0.05em">Tighter</option>
                  <option value="-0.025em">Tight</option>
                  <option value="0">Normal</option>
                  <option value="0.025em">Wide</option>
                  <option value="0.05em">Wider</option>
                  <option value="0.1em">Widest</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Layout Controls */}
      {activeTab === 'layout' && (
        <div className="space-y-4">
          {/* Position & Order Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2"
              onClick={() => setOpenLayoutOrder((v) => !v)}
            >
              {openLayoutOrder ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2 font-semibold">Delete & Undo</span>
            </button>
            {openLayoutOrder && (
              <div className="flex items-center gap-2 my-2 px-2">
                <button
                  onClick={handleUndoDelete}
                  className={`flex items-center gap-2 p-2 rounded-full bg-gray-50 hover:bg-blue-500 hover:text-white text-blue-500 transition font-semibold shadow-sm border border-blue-200 ${deletedElements.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={`Undo Delete (${deletedElements.length} available)`}
                  disabled={deletedElements.length === 0}
                  style={{ minWidth: 0 }}
                >
                  <Undo2 size={18} />
                  <span className="hidden sm:inline text-sm font-medium">Undo</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 p-2 rounded-full bg-red-50 hover:bg-red-500 hover:text-white text-red-500 transition font-semibold shadow-sm border border-red-200"
                  title="Delete"
                  style={{ minWidth: 0 }}
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline text-sm font-medium">Delete</span>
                </button>
              </div>
            )}
          </div>
          {/* Padding Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2 relative"
              onClick={() => setOpenLayoutPadding((v) => !v)}
            >
              {openLayoutPadding ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2">Padding</span>
              <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-blue-500 px-2" onClick={e => { e.stopPropagation(); resetPadding(); }} title="Reset Padding">Reset</button>
            </button>
            {openLayoutPadding && (
              <div className="grid grid-cols-2 gap-2 pl-4">
                <input type="number" placeholder="Horizontal" className="p-2 border rounded" onChange={(e) => handleLayoutChange('paddingLeft', `${e.target.value}px`)} />
                <input type="number" placeholder="Vertical" className="p-2 border rounded" onChange={(e) => handleLayoutChange('paddingTop', `${e.target.value}px`)} />
              </div>
            )}
          </div>
          {/* Margin Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2 relative"
              onClick={() => setOpenLayoutMargin((v) => !v)}
            >
              {openLayoutMargin ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2">Margin</span>
              <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-blue-500 px-2" onClick={e => { e.stopPropagation(); resetMargin(); }} title="Reset Margin">Reset</button>
            </button>
            {openLayoutMargin && (
              <div className="grid grid-cols-2 gap-2 pl-4">
                <input type="number" placeholder="Horizontal" className="p-2 border rounded" onChange={(e) => handleLayoutChange('marginLeft', `${e.target.value}px`)} />
                <input type="number" placeholder="Vertical" className="p-2 border rounded" onChange={(e) => handleLayoutChange('marginTop', `${e.target.value}px`)} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Controls */}
      {activeTab === 'image' && (
        <div className="space-y-4">
          {/* Image Actions Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2"
              onClick={() => setOpenImageActions((v) => !v)}
            >
              {openImageActions ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2">Image Actions</span>
            </button>
            {openImageActions && (
              <div className="space-y-2 pl-4">
                <button onClick={() => handleComponentAction('upload-image')} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Upload Image</button>
                <button onClick={() => handleComponentAction('crop-image')} className="w-full p-2 border rounded hover:bg-gray-100">Crop Image</button>
              </div>
            )}
          </div>
          {/* Image Style Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2"
              onClick={() => setOpenImageStyle((v) => !v)}
            >
              {openImageStyle ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2">Image Style</span>
            </button>
            {openImageStyle && (
              <div className="space-y-2 pl-4">
                <label className="block text-sm">Image Size</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Width" className="p-2 border rounded" onChange={(e) => handleLayoutChange('width', `${e.target.value}px`)} />
                  <input type="number" placeholder="Height" className="p-2 border rounded" onChange={(e) => handleLayoutChange('height', `${e.target.value}px`)} />
                </div>
                <label className="block text-sm">Border Radius</label>
                <input type="number" placeholder="Radius" className="w-full p-2 border rounded" onChange={(e) => handleLayoutChange('borderRadius', `${e.target.value}px`)} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Style Controls */}
      {activeTab === 'style' && (
        <div className="space-y-4">
          {/* Reset Styles Button */}
          <button
            onClick={handleResetStyles}
            className="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset Styles
          </button>
          {/* Background Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2"
              onClick={() => setOpenStyleBackground((v) => !v)}
            >
              {openStyleBackground ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2">Background</span>
            </button>
            {openStyleBackground && (
              <div className="pl-4">
                <label className="block text-sm font-medium">Background Color</label>
                <input
                  type="color"
                  onChange={(e) => handleBackgroundChange(e.target.value)}
                  className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer"
                  title="Pick background color"
                />
              </div>
            )}
          </div>
          {/* Border Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2"
              onClick={() => setOpenStyleBorder((v) => !v)}
            >
              {openStyleBorder ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2">Border</span>
            </button>
            {openStyleBorder && (
              <div className="space-y-2 pl-4">
                <input
                  type="number"
                  placeholder="Width"
                  className="p-2 border rounded"
                  onChange={(e) => handleLayoutChange('borderWidth', `${e.target.value}px`)}
                />
                <select
                  onChange={(e) => handleLayoutChange('borderStyle', e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="none">None</option>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
            )}
          </div>
          {/* Hover Effect Section */}
          <div>
            <button
              className="flex items-center w-full text-left font-semibold mb-2"
              onClick={() => setOpenStyleHover((v) => !v)}
            >
              {openStyleHover ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-2">Hover Effect</span>
            </button>
            {openStyleHover && (
              <div className="pl-4">
                <label className="block text-sm font-medium">Hover Color</label>
                <input
                  type="color"
                  value={selectedElement?.style.getPropertyValue('--hover-color') || '#f8f9fa'}
                  onChange={(e) => handleHoverColorChange(e.target.value)}
                  className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={downloadZip}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold mt-4"
        >
          Download Demo Site ZIP
        </button>
      </div>
    </div>
  );
};

export default EditModeControls;