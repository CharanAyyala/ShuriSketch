import React from 'react';
import { X } from 'lucide-react';
import { DrawSettings } from '../../types/whiteboard';

interface ToolSettingsProps {
  drawSettings: DrawSettings;
  setDrawSettings: React.Dispatch<React.SetStateAction<DrawSettings>>;
  onClose: () => void;
}

const ToolSettings: React.FC<ToolSettingsProps> = ({ 
  drawSettings, 
  setDrawSettings, 
  onClose 
}) => {
  // Tool-specific settings based on current tool
  const renderToolSpecificSettings = () => {
    switch (drawSettings.tool) {
      case 'pen':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pen Style
              </label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                value="round" // Default value
                onChange={() => {}} // Not implemented in this demo
              >
                <option value="round">Round</option>
                <option value="square">Square</option>
                <option value="butt">Flat</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Smoothing
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value="5" // Default value
                onChange={() => {}} // Not implemented in this demo
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </>
        );
      
      case 'eraser':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Eraser Type
              </label>
              <div className="flex space-x-2">
                <button
                  className={`flex-1 py-1.5 px-3 rounded text-sm font-medium ${
                    true // Default is "pixel"
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => {}} // Not implemented in this demo
                >
                  Pixel
                </button>
                <button
                  className={`flex-1 py-1.5 px-3 rounded text-sm font-medium ${
                    false // Default is not "object"
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => {}} // Not implemented in this demo
                >
                  Object
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hardness
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value="100" // Default value
                onChange={() => {}} // Not implemented in this demo
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </>
        );
      
      case 'rectangle':
      case 'circle':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fill Style
              </label>
              <div className="flex space-x-2">
                <button
                  className={`flex-1 py-1.5 px-3 rounded text-sm font-medium ${
                    true // Default is "outline"
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => {}} // Not implemented in this demo
                >
                  Outline
                </button>
                <button
                  className={`flex-1 py-1.5 px-3 rounded text-sm font-medium ${
                    false // Default is not "fill"
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => {}} // Not implemented in this demo
                >
                  Fill
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600"
                  checked={false} // Default value
                  onChange={() => {}} // Not implemented in this demo
                />
                Maintain aspect ratio
              </label>
            </div>
          </>
        );
      
      case 'line':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Line Style
              </label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                value="solid" // Default value
                onChange={() => {}} // Not implemented in this demo
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600"
                  checked={false} // Default value
                  onChange={() => {}} // Not implemented in this demo
                />
                Add arrow
              </label>
            </div>
          </>
        );
        
      case 'text':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Font Family
              </label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                value="sans" // Default value
                onChange={() => {}} // Not implemented in this demo
              >
                <option value="sans">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Font Size
              </label>
              <input
                type="range"
                min="10"
                max="72"
                value="24" // Default value
                onChange={() => {}} // Not implemented in this demo
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                24px
              </div>
            </div>
            <div className="flex space-x-2 mb-4">
              <button
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
                onClick={() => {}} // Not implemented in this demo
              >
                <span className="font-bold">B</span>
              </button>
              <button
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
                onClick={() => {}} // Not implemented in this demo
              >
                <span className="italic">I</span>
              </button>
              <button
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
                onClick={() => {}} // Not implemented in this demo
              >
                <span className="underline">U</span>
              </button>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-72">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
          {drawSettings.tool} Settings
        </h3>
        <button 
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      
      {renderToolSpecificSettings()}
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
        Note: Some advanced features are not fully implemented in this demo version.
      </div>
    </div>
  );
};

export default ToolSettings;