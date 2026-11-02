import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { 
  X, 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical, 
  Sliders, 
  Paintbrush, 
  Type, 
  Square, 
  Circle, 
  ArrowRight, 
  Smile, 
  Undo, 
  Redo, 
  Save, 
  Download,
  Sparkles,
  Check
} from 'lucide-react';

interface PhotoEditorModalProps {
  item: MediaItem;
  onClose: () => void;
  onSaveCopy: (dataUrl: string) => void;
}

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({ item, onClose, onSaveCopy }) => {
  const { t, language } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Tools: 'adjust' | 'draw' | 'text' | 'shapes' | 'stickers'
  const [activeTool, setActiveTool] = useState<'adjust' | 'draw' | 'text' | 'shapes' | 'stickers'>('adjust');

  // Adjustments
  const [brightness, setBrightness] = useState(100); // 0 - 200
  const [contrast, setContrast] = useState(100);   // 0 - 200
  const [saturation, setSaturation] = useState(100); // 0 - 200
  const [warmth, setWarmth] = useState(0);         // -50 to 50
  const [filterType, setFilterType] = useState<'normal' | 'grayscale' | 'sepia' | 'vintage' | 'cool'>('normal');

  // Transformations
  const [rotation, setRotation] = useState(0); // in degrees
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Drawing settings
  const [brushColor, setBrushColor] = useState('#6366f1');
  const [brushSize, setBrushSize] = useState(6);
  const [isDrawing, setIsDrawing] = useState(false);

  // Creative overlays (texts, shapes, stickers)
  interface OverlayItem {
    type: 'text' | 'rect' | 'circle' | 'arrow' | 'sticker';
    x: number;
    y: number;
    width?: number;
    height?: number;
    content?: string;
    color: string;
    size?: number;
  }
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);
  const [undoStack, setUndoStack] = useState<OverlayItem[][]>([]);
  const [redoStack, setRedoStack] = useState<OverlayItem[][]>([]);

  // Text input
  const [textInput, setTextInput] = useState('');
  const [selectedShape, setSelectedShape] = useState<'rect' | 'circle' | 'arrow'>('rect');
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  // Load image once
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = item.url;
    img.onload = () => {
      setLoadedImage(img);
    };
  }, [item.url]);

  // Redraw canvas whenever adjustments or overlays change
  useEffect(() => {
    if (!loadedImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const isRotatedQuarter = Math.abs(rotation % 180) === 90;
    canvas.width = isRotatedQuarter ? loadedImage.height : loadedImage.width;
    canvas.height = isRotatedQuarter ? loadedImage.width : loadedImage.height;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply rotation & flip transforms
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // Filters: brightness, contrast, saturation, sepia, grayscale
    let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    if (filterType === 'grayscale') filterString += ' grayscale(100%)';
    if (filterType === 'sepia') filterString += ' sepia(90%)';
    if (filterType === 'vintage') filterString += ' sepia(40%) contrast(120%)';
    if (filterType === 'cool') filterString += ' hue-rotate(180deg)';

    ctx.filter = filterString;
    ctx.drawImage(loadedImage, -loadedImage.width / 2, -loadedImage.height / 2);
    ctx.restore();

    // Warmth tint overlay
    if (warmth !== 0) {
      ctx.save();
      ctx.fillStyle = warmth > 0 ? `rgba(255, 140, 0, ${warmth / 200})` : `rgba(0, 150, 255, ${Math.abs(warmth) / 200})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // Draw Overlays
    overlays.forEach(item => {
      ctx.save();
      if (item.type === 'text' && item.content) {
        ctx.font = `bold ${item.size || 36}px system-ui, sans-serif`;
        ctx.fillStyle = item.color;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.fillText(item.content, item.x, item.y);
      } else if (item.type === 'rect') {
        ctx.strokeStyle = item.color;
        ctx.lineWidth = item.size || 6;
        ctx.strokeRect(item.x - 50, item.y - 30, 100, 60);
      } else if (item.type === 'circle') {
        ctx.strokeStyle = item.color;
        ctx.lineWidth = item.size || 6;
        ctx.beginPath();
        ctx.arc(item.x, item.y, 45, 0, Math.PI * 2);
        ctx.stroke();
      } else if (item.type === 'arrow') {
        ctx.strokeStyle = item.color;
        ctx.fillStyle = item.color;
        ctx.lineWidth = item.size || 6;
        // Simple arrow
        ctx.beginPath();
        ctx.moveTo(item.x - 50, item.y);
        ctx.lineTo(item.x + 50, item.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(item.x + 50, item.y);
        ctx.lineTo(item.x + 30, item.y - 15);
        ctx.lineTo(item.x + 30, item.y + 15);
        ctx.fill();
      } else if (item.type === 'sticker' && item.content) {
        ctx.font = `${item.size || 50}px serif`;
        ctx.fillText(item.content, item.x, item.y);
      }
      ctx.restore();
    });

  }, [loadedImage, brightness, contrast, saturation, warmth, filterType, rotation, flipH, flipV, overlays]);

  // Handle canvas click to place text, shapes, or stickers
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (activeTool === 'text' && textInput.trim()) {
      pushUndo();
      setOverlays(prev => [...prev, {
        type: 'text',
        x,
        y,
        content: textInput,
        color: brushColor,
        size: brushSize * 6,
      }]);
      setTextInput('');
    } else if (activeTool === 'shapes') {
      pushUndo();
      setOverlays(prev => [...prev, {
        type: selectedShape,
        x,
        y,
        color: brushColor,
        size: brushSize,
      }]);
    }
  };

  const addSticker = (emoji: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    pushUndo();
    setOverlays(prev => [...prev, {
      type: 'sticker',
      x: canvas.width / 2 - 25,
      y: canvas.height / 2,
      content: emoji,
      color: '#fff',
      size: 64,
    }]);
  };

  const pushUndo = () => {
    setUndoStack(prev => [...prev, [...overlays]]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, [...overlays]]);
    setOverlays(previous);
    setUndoStack(prev => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, [...overlays]]);
    setOverlays(next);
    setRedoStack(prev => prev.slice(0, prev.length - 1));
  };

  const handleSaveCopy = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onSaveCopy(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-white">{t.editPhoto}</h3>
            <p className="text-[10px] text-zinc-400">{item.name}</p>
          </div>
        </div>

        {/* Undo / Redo & Save Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 transition"
            title={t.undo}
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 transition"
            title={t.redo}
          >
            <Redo className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 font-bold text-white text-xs shadow-lg shadow-emerald-600/30 transition"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveCopy}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="max-h-[65vh] max-w-full rounded-xl shadow-2xl border border-zinc-800 bg-zinc-950 cursor-crosshair object-contain"
        />
      </div>

      {/* Tools Controller Bar */}
      <div className="bg-zinc-950 border-t border-zinc-800 p-3 space-y-3">
        {/* Tool Specific Sliders & Inputs */}
        <div className="max-w-xl mx-auto">
          {activeTool === 'adjust' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-400 w-20">{t.brightness}: {brightness}%</span>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-400 w-20">{t.contrast}: {contrast}%</span>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-400 w-20">{t.saturation}: {saturation}%</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTool === 'text' && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t.addTextPrompt}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'फ़ोटो पर क्लिक करके लगाएं' : 'Click on photo to place'}
              </span>
            </div>
          )}

          {activeTool === 'shapes' && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSelectedShape('rect')}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs ${
                  selectedShape === 'rect' ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                <Square className="w-4 h-4" />
                <span>Rectangle</span>
              </button>

              <button
                onClick={() => setSelectedShape('circle')}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs ${
                  selectedShape === 'circle' ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                <Circle className="w-4 h-4" />
                <span>Circle</span>
              </button>

              <button
                onClick={() => setSelectedShape('arrow')}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs ${
                  selectedShape === 'arrow' ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
                <span>Arrow</span>
              </button>
            </div>
          )}

          {activeTool === 'stickers' && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
              {['🔥', '✨', '❤️', '👍', '🌟', '🎯', '🚀', '💯', '📸', '⚡'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addSticker(emoji)}
                  className="p-2 text-xl hover:scale-125 transition active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Palette & Transforms */}
        <div className="flex items-center justify-between max-w-xl mx-auto pt-1 border-t border-zinc-900">
          <div className="flex items-center gap-1.5">
            {['#ffffff', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map((c) => (
              <button
                key={c}
                onClick={() => setBrushColor(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full border-2 transition ${brushColor === c ? 'border-white scale-110 shadow-md' : 'border-transparent'}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setRotation(r => r - 90)}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white"
              title="Rotate Left"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotation(r => r + 90)}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white"
              title="Rotate Right"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFlipH(!flipH)}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white"
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFlipV(!flipV)}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white"
              title="Flip Vertical"
            >
              <FlipVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Category Selector */}
        <div className="flex items-center justify-around max-w-md mx-auto pt-1">
          <button
            onClick={() => setActiveTool('adjust')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-xl transition ${
              activeTool === 'adjust' ? 'text-indigo-400 bg-zinc-900' : 'text-zinc-400'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t.adjust}</span>
          </button>

          <button
            onClick={() => setActiveTool('text')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-xl transition ${
              activeTool === 'text' ? 'text-indigo-400 bg-zinc-900' : 'text-zinc-400'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>{t.text}</span>
          </button>

          <button
            onClick={() => setActiveTool('shapes')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-xl transition ${
              activeTool === 'shapes' ? 'text-indigo-400 bg-zinc-900' : 'text-zinc-400'
            }`}
          >
            <Square className="w-4 h-4" />
            <span>{t.shapes}</span>
          </button>

          <button
            onClick={() => setActiveTool('stickers')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-xl transition ${
              activeTool === 'stickers' ? 'text-indigo-400 bg-zinc-900' : 'text-zinc-400'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>{t.stickers}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
