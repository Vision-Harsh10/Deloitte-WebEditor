import React, { useEffect, useState } from 'react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (command: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
        <div className="p-4 border-b">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands..."
            className="w-full p-2 border rounded"
            autoFocus
          />
        </div>
        <div className="p-2">
          <button
            onClick={() => onSelect('edit-mode')}
            className="w-full text-left p-2 hover:bg-gray-100 rounded"
          >
            Enter Edit Mode
          </button>
          <button
            onClick={() => onSelect('preview-mode')}
            className="w-full text-left p-2 hover:bg-gray-100 rounded"
          >
            Exit Edit Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette; 