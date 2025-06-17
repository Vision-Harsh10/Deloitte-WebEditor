import React, { useState, useRef } from 'react';
import ResizableImage from './ResizableImage';

interface ElementEditorProps {
  element: HTMLElement;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  isEditMode: boolean;
}

const ElementEditor: React.FC<ElementEditorProps> = ({ element, onUpdate, onClose, isEditMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [edits, setEdits] = useState({
    text: element.textContent || '',
    color: window.getComputedStyle(element).color,
    backgroundColor: window.getComputedStyle(element).backgroundColor,
    fontSize: window.getComputedStyle(element).fontSize,
    width: element.style.width || 'auto',
    height: element.style.height || 'auto',
    padding: element.style.padding || '0',
    margin: element.style.margin || '0',
    image: (element as HTMLImageElement).src || '',
  });

  const handleChange = (field: string, value: string) => {
    setEdits(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleChange('image', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageResize = (width: number, height: number) => {
    handleChange('width', `${width}px`);
    handleChange('height', `${height}px`);
  };

  const handleSave = () => {
    onUpdate(edits);
    onClose();
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 z-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Edit Element</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {element.tagName.toLowerCase() === 'img' ? (
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
              >
                Upload Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            {edits.image && (
              <div className="mt-4">
                <ResizableImage
                  src={edits.image}
                  alt="Preview"
                  className="max-w-full"
                  isEditMode={isEditMode}
                  onResize={handleImageResize}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">Text Content</label>
            <textarea
              value={edits.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <input
            type="color"
            value={edits.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <input
            type="color"
            value={edits.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Size</label>
          <select
            value={edits.fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="12px">Small</option>
            <option value="16px">Medium</option>
            <option value="20px">Large</option>
            <option value="24px">Extra Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Width</label>
          <select
            value={edits.width}
            onChange={(e) => handleChange('width', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="auto">Auto</option>
            <option value="100%">Full Width</option>
            <option value="50%">Half Width</option>
            <option value="25%">Quarter Width</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Height</label>
          <select
            value={edits.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="auto">Auto</option>
            <option value="100px">Small</option>
            <option value="200px">Medium</option>
            <option value="300px">Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Padding</label>
          <select
            value={edits.padding}
            onChange={(e) => handleChange('padding', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="0">None</option>
            <option value="1rem">Small</option>
            <option value="2rem">Medium</option>
            <option value="3rem">Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Margin</label>
          <select
            value={edits.margin}
            onChange={(e) => handleChange('margin', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="0">None</option>
            <option value="1rem">Small</option>
            <option value="2rem">Medium</option>
            <option value="3rem">Large</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ElementEditor; 