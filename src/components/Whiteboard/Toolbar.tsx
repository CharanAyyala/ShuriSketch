import React, { useState } from 'react';
import { Pen, Eraser, Square, Circle, XCircle, Download, Redo, Undo, Settings, Minus, Plus, Palette, Type, ArrowRightToLine as StraightLine } from 'lucide-react';
import { 
  Tool, DrawSettings, LineWidth, 
  ThemeType, WhiteboardSettings, HistoryState 
} from '../../types/whiteboard';
import ColorPicker from './ColorPicker';
import ToolSettings from './ToolSettings';
import SettingsPanel from './SettingsPanel';

interface ToolbarProps {
  drawSettings: DrawSettings;
  setDrawSettings: React.Dispatch<React.SetStateAction<DrawSettings>>;
  whiteboardSettings: WhiteboardSettings;
  setWhiteboardSettings: React.Dispatch<React.SetStateAction<WhiteboardSettings>>;
  historyState: HistoryState;
  setHistoryState: React.Dispatch<React.SetStateAction<HistoryState>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  clearCanvas: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  drawSettings,
  setDrawSettings,
  whiteboardSettings,
  setWhiteboardSettings,
  historyState,
  setHistoryState,
  canvasRef,
  clearCanvas
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showToolSettings, setShowToolSettings] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const handleToolChange = (tool: Tool) => {
    setDrawSettings(prev => ({
      ...prev,
      tool,
      mode: tool === 'eraser' ? 'erase' : 'draw'
    }));
    setShowToolSettings(true);
  };

  const handleSizeChange = (lineWidth: LineWidth) => {
    setDrawSettings(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        lineWidth
      }
    }));
  };

  const handleOpacityChange = (opacity: number) => {
    setDrawSettings(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        opacity
      }
    }));
  };

  const handleColorChange = (color: string) => {
    setDrawSettings(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        color
      }
    }));
  };

  const handleUndo = () => {
    if (historyState.past.length <= 1) return; // Keep at least initial state
    
    const newPast = [...historyState.past];
    const lastState = newPast.pop();
    
    if (lastState) {
      setHistoryState({
        past: newPast,
        future: [lastState, ...historyState.future]
      });
      
      // Apply the previous state to canvas
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (canvas && ctx && newPast.length > 0) {
        ctx.putImageData(newPast[newPast.length - 1], 0, 0);
      }
    }
  };

  const handleRedo = () => {
    if (historyState.future.length === 0) return;
    
    const [nextState, ...remainingFuture] = historyState.future;
    
    setHistoryState({
      past: [...historyState.past, nextState],
      future: remainingFuture
    });
    
    // Apply the next state to canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (canvas && ctx) {
      ctx.putImageData(nextState, 0, 0);
    }
  };

  const handleDownload = (format: 'png' | 'jpeg' | 'svg') => {
    const canvas = canvasRef.current;
    
    if (!canvas) return;
    
    if (format === 'svg') {
      alert('SVG export is not supported in this demo version.');
      return;
    }
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    
    // Set file type and quality for the export
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'png' ? 1 : 0.9;
    
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    link.href = dataUrl;
    link.download = `whiteboard-export.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setDownloadMenuOpen(false);
  };

  const toolButtons = [
    { icon: <Pen size={20} />, tool: 'pen' as Tool, label: 'Pen' },
    { icon: <StraightLine size={20} />, tool: 'line' as Tool, label: 'Line' },
    { icon: <Square size={20} />, tool: 'rectangle' as Tool, label: 'Rectangle' },
    { icon: <Circle size={20} />, tool: 'circle' as Tool, label: 'Circle' },
    { icon: <Type size={20} />, tool: 'text' as Tool, label: 'Text' },
    { icon: <Eraser size={20} />, tool: 'eraser' as Tool, label: 'Eraser' }
  ];

  const sizeOptions: LineWidth[] = [1, 3, 5, 8, 12, 16];

  return (
    <>
      {/* Main Toolbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-1.5 flex items-center z-40 transition-all">
        <div className="flex space-x-1">
          {toolButtons.map((btn) => (
            <button
              key={btn.tool}
              className={`p-2 rounded-full relative group ${
                drawSettings.tool === btn.tool
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => handleToolChange(btn.tool)}
              aria-label={btn.label}
            >
              {btn.icon}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                {btn.label}
              </span>
            </button>
          ))}

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 relative group"
            onClick={() => setShowColorPicker(!showColorPicker)}
            aria-label="Color Picker"
          >
            <Palette size={20} />
            <div 
              className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: drawSettings.settings.color }}
            />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              Color
            </span>
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

          <button
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${historyState.past.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''} relative group`}
            onClick={handleUndo}
            disabled={historyState.past.length <= 1}
            aria-label="Undo"
          >
            <Undo size={20} />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              Undo
            </span>
          </button>
          
          <button
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${historyState.future.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} relative group`}
            onClick={handleRedo}
            disabled={historyState.future.length === 0}
            aria-label="Redo"
          >
            <Redo size={20} />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              Redo
            </span>
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 relative group"
            onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
            aria-label="Download"
          >
            <Download size={20} />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              Download
            </span>
          </button>
          
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 text-gray-700 dark:text-gray-300 relative group"
            onClick={clearCanvas}
            aria-label="Clear Canvas"
          >
            <XCircle size={20} />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              Clear
            </span>
          </button>
          
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 relative group"
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            aria-label="Settings"
          >
            <Settings size={20} />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              Settings
            </span>
          </button>
        </div>
      </div>
      
      {/* Download Menu */}
      {downloadMenuOpen && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-50">
          <div className="flex flex-col">
            <button
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm text-left"
              onClick={() => handleDownload('png')}
            >
              Download as PNG
            </button>
            <button
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm text-left"
              onClick={() => handleDownload('jpeg')}
            >
              Download as JPEG
            </button>
            <button
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm text-left"
              onClick={() => handleDownload('svg')}
            >
              Download as SVG
            </button>
          </div>
        </div>
      )}
      
      {/* Size Control */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-1.5 flex items-center z-40">
        <div className="flex space-x-1">
          <Minus size={16} className="text-gray-500 dark:text-gray-400 mr-1" />
          
          {sizeOptions.map((size) => (
            <button
              key={size}
              className={`rounded-full relative group ${
                drawSettings.settings.lineWidth === size
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              style={{ 
                width: size * 1.25 + 10, 
                height: size * 1.25 + 10
              }}
              onClick={() => handleSizeChange(size)}
              aria-label={`Size ${size}`}
            >
              <div 
                className={`rounded-full bg-gray-800 dark:bg-gray-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                style={{ 
                  width: size, 
                  height: size
                }}
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                Size {size}
              </span>
            </button>
          ))}
          
          <Plus size={16} className="text-gray-500 dark:text-gray-400 ml-1" />
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2 self-center" />
          
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Opacity</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={drawSettings.settings.opacity}
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
              className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {Math.round(drawSettings.settings.opacity * 100)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Color Picker */}
      {showColorPicker && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <ColorPicker
            currentColor={drawSettings.settings.color}
            onChange={handleColorChange}
            onClose={() => setShowColorPicker(false)}
          />
        </div>
      )}
      
      {/* Tool Settings */}
      {showToolSettings && (
        <div className="fixed top-20 right-4 z-50">
          <ToolSettings
            drawSettings={drawSettings}
            setDrawSettings={setDrawSettings}
            onClose={() => setShowToolSettings(false)}
          />
        </div>
      )}
      
      {/* Settings Panel */}
      {showSettingsPanel && (
        <div className="fixed top-20 right-4 z-50">
          <SettingsPanel
            whiteboardSettings={whiteboardSettings}
            setWhiteboardSettings={setWhiteboardSettings}
            onClose={() => setShowSettingsPanel(false)}
          />
        </div>
      )}
    </>
  );
};

export default Toolbar;