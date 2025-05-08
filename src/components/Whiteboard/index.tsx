import React, { useRef, useState } from 'react';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import { 
  DrawSettings, 
  ThemeType, 
  WhiteboardSettings, 
  HistoryState
} from '../../types/whiteboard';

const Whiteboard: React.FC = () => {
  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Drawing settings
  const [drawSettings, setDrawSettings] = useState<DrawSettings>({
    tool: 'pen',
    mode: 'draw',
    settings: {
      lineWidth: 3,
      opacity: 1,
      color: '#000000',
    },
  });
  
  // Whiteboard settings
  const [whiteboardSettings, setWhiteboardSettings] = useState<WhiteboardSettings>({
    theme: 'light',
    showGrid: false,
    snapToGrid: false,
    gridSize: 16,
    canvasBackground: '#ffffff',
  });
  
  // History for undo/redo
  const [historyState, setHistoryState] = useState<HistoryState>({
    past: [],
    future: [],
  });
  
  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (canvas && ctx) {
      // Clear canvas
      ctx.fillStyle = whiteboardSettings.canvasBackground;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Save this clear state to history
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistoryState({
        past: [imageData],
        future: [],
      });
    }
  };
  
  return (
    <div className="w-full h-full overflow-hidden">
      <Canvas
        drawSettings={drawSettings}
        whiteboardSettings={whiteboardSettings}
        historyState={historyState}
        setHistoryState={setHistoryState}
        canvasRef={canvasRef}
      />
      <Toolbar
        drawSettings={drawSettings}
        setDrawSettings={setDrawSettings}
        whiteboardSettings={whiteboardSettings}
        setWhiteboardSettings={setWhiteboardSettings}
        historyState={historyState}
        setHistoryState={setHistoryState}
        canvasRef={canvasRef}
        clearCanvas={clearCanvas}
      />
    </div>
  );
};

export default Whiteboard;