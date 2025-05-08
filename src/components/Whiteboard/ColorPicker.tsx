import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface ColorPickerProps {
  currentColor: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onChange, onClose }) => {
  const [color, setColor] = useState(currentColor);
  const [recentColors, setRecentColors] = useState<string[]>([
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'
  ]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
  };

  const saveColor = () => {
    onChange(color);
    
    // Add to recent colors if not already there
    if (!recentColors.includes(color)) {
      setRecentColors(prev => [color, ...prev.slice(0, 7)]);
    }
    
    onClose();
  };

  const presetColors = [
    '#000000', '#343a40', '#495057', '#6c757d', '#adb5bd', '#ced4da', '#dee2e6', '#e9ecef', '#f8f9fa', '#FFFFFF',
    '#c92a2a', '#e03131', '#f03e3e', '#fa5252', '#ff6b6b', '#ff8787', '#ffa8a8', '#ffc9c9', '#ffe3e3', '#fff5f5',
    '#a61e4d', '#c2255c', '#d6336c', '#e64980', '#f06595', '#f783ac', '#faa2c1', '#fcc2d7', '#ffdeeb', '#fff0f6',
    '#862e9c', '#9c36b5', '#ae3ec9', '#be4bdb', '#cc5de8', '#da77f2', '#e599f7', '#eebefa', '#f3d9fa', '#f8f0fc',
    '#5f3dc4', '#6741d9', '#7048e8', '#7950f2', '#845ef7', '#9775fa', '#b197fc', '#d0bfff', '#e5dbff', '#f3f0ff',
    '#364fc7', '#3b5bdb', '#4263eb', '#4c6ef5', '#5c7cfa', '#748ffc', '#91a7ff', '#bac8ff', '#dbe4ff', '#edf2ff',
    '#1864ab', '#1971c2', '#1c7ed6', '#228be6', '#339af0', '#4dabf7', '#74c0fc', '#a5d8ff', '#d0ebff', '#e7f5ff',
    '#0b7285', '#0c8599', '#0ca678', '#12b886', '#20c997', '#38d9a9', '#63e6be', '#96f2d7', '#c3fae8', '#e6fcf5',
    '#087f5b', '#099268', '#0ca678', '#12b886', '#20c997', '#38d9a9', '#63e6be', '#96f2d7', '#c3fae8', '#e6fcf5',
    '#2b8a3e', '#2f9e44', '#37b24d', '#40c057', '#51cf66', '#69db7c', '#8ce99a', '#b2f2bb', '#d3f9d8', '#ebfbee',
    '#5c940d', '#66a80f', '#74b816', '#82c91e', '#94d82d', '#a9e34b', '#c0eb75', '#d8f5a2', '#e9fac8', '#f4fce3',
    '#e67700', '#f08c00', '#f59f00', '#fab005', '#fcc419', '#ffd43b', '#ffe066', '#ffec99', '#fff3bf', '#fff9db',
    '#d9480f', '#e8590c', '#f76707', '#fd7e14', '#ff922b', '#ffa94d', '#ffbc80', '#ffd8a8', '#ffe8cc', '#fff4e6'
  ];

  return (
    <div className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-72">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Color Picker</h3>
        <button 
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Current Color
        </label>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: color }}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
          />
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Recent Colors
        </label>
        <div className="flex flex-wrap gap-2">
          {recentColors.map((recentColor, index) => (
            <div
              key={`recent-${index}`}
              className={`w-6 h-6 rounded-md cursor-pointer border ${
                recentColor === color 
                  ? 'ring-2 ring-blue-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{ backgroundColor: recentColor }}
              onClick={() => handleColorSelect(recentColor)}
            />
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Preset Colors
        </label>
        <div className="grid grid-cols-10 gap-1">
          {presetColors.map((presetColor, index) => (
            <div
              key={`preset-${index}`}
              className={`w-5 h-5 rounded-sm cursor-pointer border ${
                presetColor === color 
                  ? 'ring-2 ring-blue-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{ backgroundColor: presetColor }}
              onClick={() => handleColorSelect(presetColor)}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
          onClick={saveColor}
        >
          <Check size={16} />
          Apply
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;