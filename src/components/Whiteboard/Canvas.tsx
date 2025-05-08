import React, { useRef, useEffect, useState } from 'react';
import { Point, DrawState, DrawSettings, HistoryState, WhiteboardSettings } from '../../types/whiteboard';

interface CanvasProps {
  drawSettings: DrawSettings;
  whiteboardSettings: WhiteboardSettings;
  historyState: HistoryState;
  setHistoryState: React.Dispatch<React.SetStateAction<HistoryState>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const Canvas: React.FC<CanvasProps> = ({
  drawSettings,
  whiteboardSettings,
  historyState,
  setHistoryState,
  canvasRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawState, setDrawState] = useState<DrawState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
  });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState<HTMLTextAreaElement | null>(null);

  // Setup canvas size based on container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
        
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        
        // Redraw canvas with current state
        const ctx = canvasRef.current.getContext('2d');
        if (ctx && historyState.past.length > 0) {
          ctx.putImageData(historyState.past[historyState.past.length - 1], 0, 0);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [historyState.past]);

  // Handle text input
  const createTextInput = (x: number, y: number) => {
    if (textInput) {
      textInput.remove();
      setTextInput(null);
    }

    const textarea = document.createElement('textarea');
    textarea.style.position = 'absolute';
    textarea.style.left = `${x}px`;
    textarea.style.top = `${y}px`;
    textarea.style.padding = '4px';
    textarea.style.margin = '0';
    textarea.style.border = '1px solid #000';
    textarea.style.outline = 'none';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'transparent';
    textarea.style.color = drawSettings.settings.color;
    textarea.style.fontSize = '16px';
    textarea.style.fontFamily = 'sans-serif';
    textarea.style.resize = 'none';
    textarea.style.minWidth = '100px';
    textarea.style.minHeight = '24px';
    textarea.style.zIndex = '1000';

    containerRef.current?.appendChild(textarea);
    textarea.focus();
    setTextInput(textarea);

    const handleBlur = () => {
      if (!textarea.value.trim()) {
        textarea.remove();
        setTextInput(null);
        return;
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      ctx.font = '16px sans-serif';
      ctx.fillStyle = drawSettings.settings.color;
      ctx.globalAlpha = drawSettings.settings.opacity;
      ctx.fillText(textarea.value, x, y + 16);

      // Save to history
      const imageData = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      setHistoryState(prev => ({
        past: [...prev.past, imageData],
        future: []
      }));

      textarea.remove();
      setTextInput(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        textarea.blur();
      }
    };

    textarea.addEventListener('blur', handleBlur);
    textarea.addEventListener('keydown', handleKeyDown);
  };

  // Handle drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const saveCurrentState = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistoryState(prev => ({
        past: [...prev.past, imageData],
        future: []
      }));
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale - offset.x;
      const y = (e.clientY - rect.top) / scale - offset.y;

      if (drawSettings.tool === 'text') {
        createTextInput(x, y);
        return;
      }

      const startPoint = { x, y };
      
      setDrawState({
        isDrawing: true,
        startPoint,
        currentPoint: startPoint,
      });

      // Start new operation
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Set styles based on current tool
      if (drawSettings.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = drawSettings.settings.lineWidth * 2; // Make eraser slightly larger
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = drawSettings.settings.color;
        ctx.lineWidth = drawSettings.settings.lineWidth;
        ctx.globalAlpha = drawSettings.settings.opacity;
      }

      if (drawSettings.tool === 'pen' || drawSettings.tool === 'eraser') {
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(startPoint.x, startPoint.y);
        ctx.stroke();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawState.isDrawing || !drawState.startPoint || drawSettings.tool === 'text') return;

      const rect = canvas.getBoundingClientRect();
      const currentPoint = {
        x: (e.clientX - rect.left) / scale - offset.x,
        y: (e.clientY - rect.top) / scale - offset.y
      };

      setDrawState(prev => ({
        ...prev,
        currentPoint,
      }));

      if (drawSettings.tool === 'pen' || drawSettings.tool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(drawState.startPoint.x, drawState.startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        
        // Update start point for next segment
        setDrawState(prev => ({
          ...prev,
          startPoint: currentPoint,
        }));
      } else if (drawSettings.tool === 'line' || drawSettings.tool === 'rectangle' || drawSettings.tool === 'circle') {
        // For shape tools, redraw from temporary canvas on each move
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx && historyState.past.length > 0) {
          // Draw the previous state
          tempCtx.putImageData(historyState.past[historyState.past.length - 1], 0, 0);
          
          // Then draw the current shape
          tempCtx.lineCap = 'round';
          tempCtx.lineJoin = 'round';
          tempCtx.strokeStyle = drawSettings.settings.color;
          tempCtx.lineWidth = drawSettings.settings.lineWidth;
          tempCtx.globalAlpha = drawSettings.settings.opacity;
          
          tempCtx.beginPath();
          if (drawSettings.tool === 'line') {
            tempCtx.moveTo(drawState.startPoint.x, drawState.startPoint.y);
            tempCtx.lineTo(currentPoint.x, currentPoint.y);
          } else if (drawSettings.tool === 'rectangle') {
            const width = currentPoint.x - drawState.startPoint.x;
            const height = currentPoint.y - drawState.startPoint.y;
            tempCtx.rect(drawState.startPoint.x, drawState.startPoint.y, width, height);
          } else if (drawSettings.tool === 'circle') {
            const radius = Math.sqrt(
              Math.pow(currentPoint.x - drawState.startPoint.x, 2) +
              Math.pow(currentPoint.y - drawState.startPoint.y, 2)
            );
            tempCtx.arc(drawState.startPoint.x, drawState.startPoint.y, radius, 0, 2 * Math.PI);
          }
          tempCtx.stroke();
          
          // Clear main canvas and copy from temp canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }
    };

    const handleMouseUp = () => {
      if (!drawState.isDrawing || drawSettings.tool === 'text') return;
      
      if (drawSettings.tool !== 'pen' && drawSettings.tool !== 'eraser') {
        // For shape tools, finalize the shape
        if (drawState.startPoint && drawState.currentPoint) {
          ctx.beginPath();
          
          if (drawSettings.tool === 'line') {
            ctx.moveTo(drawState.startPoint.x, drawState.startPoint.y);
            ctx.lineTo(drawState.currentPoint.x, drawState.currentPoint.y);
          } else if (drawSettings.tool === 'rectangle') {
            const width = drawState.currentPoint.x - drawState.startPoint.x;
            const height = drawState.currentPoint.y - drawState.startPoint.y;
            ctx.rect(drawState.startPoint.x, drawState.startPoint.y, width, height);
          } else if (drawSettings.tool === 'circle') {
            const radius = Math.sqrt(
              Math.pow(drawState.currentPoint.x - drawState.startPoint.x, 2) +
              Math.pow(drawState.currentPoint.y - drawState.startPoint.y, 2)
            );
            ctx.arc(drawState.startPoint.x, drawState.startPoint.y, radius, 0, 2 * Math.PI);
          }
          ctx.stroke();
        }
      }
      
      // Reset drawing state
      setDrawState({
        isDrawing: false,
        startPoint: null,
        currentPoint: null,
      });
      
      // Reset context properties
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      
      // Save the current state for undo
      saveCurrentState();
    };

    // Attach event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    // Initial canvas setup if empty
    if (historyState.past.length === 0) {
      // Set background based on theme
      ctx.fillStyle = whiteboardSettings.canvasBackground;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Save initial blank state
      saveCurrentState();
    }

    return () => {
      // Clean up event listeners
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [
    drawSettings, 
    whiteboardSettings, 
    drawState, 
    canvasRef, 
    scale, 
    offset, 
    setHistoryState,
    historyState.past.length
  ]);

  // Draw grid if enabled
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx || !whiteboardSettings.showGrid) return;

    // Restore last saved state before drawing grid
    if (historyState.past.length > 0) {
      ctx.putImageData(historyState.past[historyState.past.length - 1], 0, 0);
    }

    // Draw grid over the canvas
    const { width, height } = canvas;
    const { gridSize } = whiteboardSettings;
    
    ctx.save();
    ctx.strokeStyle = whiteboardSettings.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    ctx.restore();
  }, [whiteboardSettings.showGrid, whiteboardSettings.gridSize, whiteboardSettings.theme, canvasSize]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-hidden relative"
      style={{ 
        backgroundColor: whiteboardSettings.canvasBackground,
        cursor: drawSettings.tool === 'text' 
          ? 'text'
          : drawSettings.tool === 'eraser' 
            ? 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'6\' fill=\'none\' stroke=\'%23000\' stroke-width=\'2\'/%3E%3C/svg%3E") 12 12, auto'
            : 'crosshair'
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{
          transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
          transformOrigin: '0 0',
        }}
      />
    </div>
  );
};

export default Canvas;