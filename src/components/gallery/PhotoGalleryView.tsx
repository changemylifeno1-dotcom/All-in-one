import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { PhotoEditorModal } from './PhotoEditorModal';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Star, 
  Share2, 
  Info, 
  Eye, 
  Play, 
  X,
  Maximize2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PhotoGalleryView: React.FC = () => {
  const { files, addMediaItem, deleteFile, toggleFavorite, setDetailsItem, moveToVault, t, language } = useApp();
  const [editingPhoto, setEditingPhoto] = useState<MediaItem | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<MediaItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'camera'>('all');

  const photos = files.filter(f => f.category === 'photo' && !f.isInVault && !f.isDeleted);

  const filteredPhotos = photos.filter(p => {
    if (activeFilter === 'favorites') return p.isFavorite;
    if (activeFilter === 'camera') return p.folder === 'Camera';
    return true;
  });

  const handleSaveEditedCopy = (dataUrl: string) => {
    confetti({ particleCount: 70, spread: 60 });
    const newId = `photo-edited-${Date.now()}`;
    const newName = `${editingPhoto?.name.replace(/\.[^/.]+$/, "")}_edited.jpg`;
    
    // Create new media item
    const newItem: MediaItem = {
      id: newId,
      name: newName,
      category: 'photo',
      url: dataUrl,
      thumbnail: dataUrl,
      size: Math.round(dataUrl.length * 0.75),
      dateModified: new Date().toISOString().replace('T', ' ').substring(0, 16),
      mimeType: 'image/jpeg',
      resolution: editingPhoto?.resolution || '4000x3000',
      isFavorite: false,
      folder: 'Camera'
    };

    // Save as copy via state dispatcher
    addMediaItem(newItem);
    setEditingPhoto(null);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Category Pills & Top Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeFilter === 'all' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {t.catAll} ({photos.length})
          </button>
          <button
            onClick={() => setActiveFilter('favorites')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeFilter === 'favorites' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            ⭐ {t.favorites} ({photos.filter(p => p.isFavorite).length})
          </button>
          <button
            onClick={() => setActiveFilter('camera')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeFilter === 'camera' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            📷 {t.folderCamera}
          </button>
        </div>

        <span className="text-xs text-zinc-400 font-medium">
          {filteredPhotos.length} {language === 'hi' ? 'फ़ोटो' : 'Photos'}
        </span>
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
          <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto" />
          <p className="text-sm text-zinc-400">
            {language === 'hi' ? 'कोई फ़ोटो नहीं मिली' : 'No photos found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-md aspect-square flex items-center justify-center cursor-pointer transition hover:scale-[1.01]"
              onClick={() => setPreviewPhoto(photo)}
            >
              <img
                src={photo.thumbnail || photo.url}
                alt={photo.name}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Top status bar overlay */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(photo.id);
                  }}
                  className={`p-1.5 rounded-lg backdrop-blur-md transition ${
                    photo.isFavorite ? 'bg-amber-500/80 text-white' : 'bg-black/60 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPhoto(photo);
                    }}
                    className="p-1.5 rounded-lg bg-indigo-600/90 text-white hover:bg-indigo-500 backdrop-blur-md transition"
                    title={t.editPhoto}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveToVault(photo.id);
                    }}
                    className="p-1.5 rounded-lg bg-black/60 text-zinc-300 hover:text-white backdrop-blur-md transition"
                    title={t.moveToVault}
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(photo.id);
                    }}
                    className="p-1.5 rounded-lg bg-black/60 text-rose-400 hover:text-rose-300 backdrop-blur-md transition"
                    title={t.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom label */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between">
                <span className="text-[11px] font-semibold text-white truncate max-w-[70%]">
                  {photo.name}
                </span>
                <span className="text-[9px] font-mono text-zinc-300">
                  {photo.resolution ? photo.resolution.split(' ')[0] : 'RAW'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Preview Modal with Zoom & Slide */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPreviewPhoto(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h4 className="text-sm font-bold truncate max-w-xs">{previewPhoto.name}</h4>
                <p className="text-[10px] text-zinc-400">{previewPhoto.dateModified}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const p = previewPhoto;
                  setPreviewPhoto(null);
                  setEditingPhoto(p);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition"
              >
                <Edit3 className="w-4 h-4" />
                <span>{t.editPhoto}</span>
              </button>
              <button
                onClick={() => setDetailsItem(previewPhoto)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 transition"
                title={t.details}
              >
                <Info className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  deleteFile(previewPhoto.id);
                  setPreviewPhoto(null);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-rose-400 transition"
                title={t.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
            <img
              src={previewPhoto.url}
              alt={previewPhoto.name}
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-zinc-400" onClick={(e) => e.stopPropagation()}>
            <span>{previewPhoto.resolution}</span>
            <span>•</span>
            <span>{(previewPhoto.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      )}

      {/* Photo Editor Modal */}
      {editingPhoto && (
        <PhotoEditorModal
          item={editingPhoto}
          onClose={() => setEditingPhoto(null)}
          onSaveCopy={handleSaveEditedCopy}
        />
      )}
    </div>
  );
};
