export type Tool = 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text';

export type LineWidth = 1 | 3 | 5 | 8 | 12 | 16;

export type DrawingMode = 'draw' | 'erase' | 'select';

export type ThemeType = 'light' | 'dark' | 'sepia' | 'blue' | 'green' | 'custom';

export interface ToolSettings {
  lineWidth: LineWidth;
  opacity: number;
  color: string;
}

export interface DrawSettings {
  tool: Tool;
  mode: DrawingMode;
  settings: ToolSettings;
}

export interface Point {
  x: number;
  y: number;
}

export interface DrawState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
}

export interface HistoryState {
  past: ImageData[];
  future: ImageData[];
}

export interface WhiteboardSettings {
  theme: ThemeType;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  canvasBackground: string;
}

export type ExportFormat = 'png' | 'jpeg' | 'svg';

export interface ExportSettings {
  format: ExportFormat;
  quality: number;
  filename: string;
  includeBackground: boolean;
}