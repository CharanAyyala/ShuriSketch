import React from 'react';
import { X, Check } from 'lucide-react';
import { ThemeType, WhiteboardSettings } from '../../types/whiteboard';

interface SettingsPanelProps {
  whiteboardSettings: WhiteboardSettings;
  setWhiteboardSettings: React.Dispatch<React.SetStateAction<WhiteboardSettings>>;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  whiteboardSettings,
  setWhiteboardSettings,
  onClose
}) => {
  const themes: {
    id: ThemeType;
    name: string;
    background: string;
    textColor: string;
  }[] = [
    { id: 'light', name: 'Light', background: '#ffffff', textColor: '#000000' },
    { id: 'dark', name: 'Dark', background: '#1f2937', textColor: '#ffffff' },
    { id: 'sepia', name: 'Sepia', background: '#f8f0e3', textColor: '#433422' },
    { id: 'blue', name: 'Blue', background: '#eef6ff', textColor: '#1e3a8a' },
    { id: 'green', name: 'Green', background: '#ecfdf5', textColor: '#065f46' },
    { id: 'custom', name: 'Custom', background: whiteboardSettings.canvasBackground, textColor: '#000000' },
  ];

  const handleThemeChange = (theme: ThemeType) => {
    const selectedTheme = themes.find((t) => t.id === theme);
    
    if (selectedTheme) {
      setWhiteboardSettings({
        ...whiteboardSettings,
        theme,
        canvasBackground: selectedTheme.background,
      });
    }
  };

  const handleToggleGrid = () => {
    setWhiteboardSettings({
      ...whiteboardSettings,
      showGrid: !whiteboardSettings.showGrid,
    });
  };

  const handleToggleSnapToGrid = () => {
    setWhiteboardSettings({
      ...whiteboardSettings,
      snapToGrid: !whiteboardSettings.snapToGrid,
    });
  };

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    if (!isNaN(size) && size >= 8 && size <= 64) {
      setWhiteboardSettings({
        ...whiteboardSettings,
        gridSize: size,
      });
    }
  };

  const handleCustomBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setWhiteboardSettings({
      ...whiteboardSettings,
      theme: 'custom',
      canvasBackground: color,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-72">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Settings
        </h3>
        <button 
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`p-2 rounded-md border relative ${
                whiteboardSettings.theme === theme.id 
                  ? 'ring-2 ring-blue-500 border-blue-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{ backgroundColor: theme.background }}
              onClick={() => handleThemeChange(theme.id)}
            >
              <span 
                className="text-xs font-medium"
                style={{ color: theme.textColor }}
              >
                {theme.name}
              </span>
              {whiteboardSettings.theme === theme.id && (
                <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {whiteboardSettings.theme === 'custom' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Background
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={whiteboardSettings.canvasBackground}
              onChange={handleCustomBackground}
              className="w-8 h-8 cursor-pointer"
            />
            <input
              type="text"
              value={whiteboardSettings.canvasBackground}
              onChange={handleCustomBackground}
              className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
          <input 
            type="checkbox" 
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600"
            checked={whiteboardSettings.showGrid}
            onChange={handleToggleGrid}
          />
          Show grid
        </label>
      </div>
      
      {whiteboardSettings.showGrid && (
        <>
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                type="checkbox" 
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600"
                checked={whiteboardSettings.snapToGrid}
                onChange={handleToggleSnapToGrid}
              />
              Snap to grid
            </label>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grid Size: {whiteboardSettings.gridSize}px
            </label>
            <input
              type="range"
              min="8"
              max="64"
              step="8"
              value={whiteboardSettings.gridSize}
              onChange={handleGridSizeChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>8px</span>
              <span>64px</span>
            </div>
          </div>
        </>
      )}
      
      <div className="mb-4">
        <button
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          onClick={() => {
            // Reset to defaults
            setWhiteboardSettings({
              theme: 'light',
              showGrid: false,
              snapToGrid: false,
              gridSize: 16,
              canvasBackground: '#ffffff',
            });
          }}
        >
          Reset to Defaults
        </button>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 italic">
        Settings are not saved between sessions in this demo version.
      </div>
    </div>
  );
};

export default SettingsPanel;