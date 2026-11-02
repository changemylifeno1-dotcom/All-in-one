import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem, FileCategory } from '../../types';
import { 
  Folder, 
  Film, 
  Image as ImageIcon, 
  Music, 
  FileText, 
  Archive, 
  MoreVertical, 
  Grid, 
  List, 
  ArrowUpDown, 
  Trash2, 
  Edit3, 
  Star, 
  Info, 
  Lock, 
  CheckSquare, 
  Square,
  Search,
  Check,
  FolderOpen
} from 'lucide-react';

export const FileManagerView: React.FC<{ initialCategory?: FileCategory | 'all' }> = ({ initialCategory = 'all' }) => {
  const { 
    files, 
    deleteFile, 
    renameFile, 
    toggleFavorite, 
    moveToVault, 
    setDetailsItem, 
    setActiveVideo, 
    setActivePhoto, 
    setActiveDoc,
    searchQuery,
    t, 
    language 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<FileCategory | 'all'>(initialCategory);
  const [selectedFolder, setSelectedFolder] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Rename modal
  const [renamingItem, setRenamingItem] = useState<MediaItem | null>(null);
  const [newNameInput, setNewNameInput] = useState('');

  // Delete confirm modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Available folders
  const folders = ['Camera', 'Downloads', 'Movies', 'Music', 'Documents', 'WhatsApp'];

  // Filtered files
  const filtered = files
    .filter(f => !f.isInVault && !f.isDeleted)
    .filter(f => selectedCategory === 'all' || f.category === selectedCategory)
    .filter(f => selectedFolder === 'all' || f.folder === selectedFolder)
    .filter(f => searchQuery.trim() === '' || f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return b.dateModified.localeCompare(a.dateModified);
      if (sortBy === 'size') return b.size - a.size;
      if (sortBy === 'type') return a.category.localeCompare(b.category);
      return 0;
    });

  const getCategoryIcon = (cat: FileCategory) => {
    switch (cat) {
      case 'video': return <Film className="w-4 h-4 text-indigo-400" />;
      case 'photo': return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'audio': return <Music className="w-4 h-4 text-amber-400" />;
      case 'document': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'archive': return <Archive className="w-4 h-4 text-purple-400" />;
      default: return <Folder className="w-4 h-4 text-zinc-400" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleOpenFile = (item: MediaItem) => {
    if (isSelectMode) {
      toggleSelectItem(item.id);
      return;
    }
    if (item.category === 'video') setActiveVideo(item);
    else if (item.category === 'photo') setActivePhoto(item);
    else if (item.category === 'document') setActiveDoc(item);
    else setDetailsItem(item);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(f => f.id));
    }
  };

  const handleBatchDelete = () => {
    selectedIds.forEach(id => deleteFile(id));
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  const handleBatchMoveToVault = () => {
    selectedIds.forEach(id => moveToVault(id));
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: t.catAll },
          { id: 'video', label: t.catVideos },
          { id: 'photo', label: t.catPhotos },
          { id: 'audio', label: t.catAudio },
          { id: 'document', label: t.catDocuments },
          { id: 'archive', label: t.catArchives },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id as any)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
              selectedCategory === c.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Folder Sub-filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-zinc-400">
        <span className="font-semibold text-zinc-500 pl-1">Folders:</span>
        <button
          onClick={() => setSelectedFolder('all')}
          className={`px-2 py-0.8 rounded-lg transition ${selectedFolder === 'all' ? 'bg-zinc-800 text-indigo-400 font-bold' : 'hover:text-zinc-200'}`}
        >
          All
        </button>
        {folders.map(f => (
          <button
            key={f}
            onClick={() => setSelectedFolder(f)}
            className={`px-2 py-0.8 rounded-lg transition ${selectedFolder === f ? 'bg-zinc-800 text-indigo-400 font-bold' : 'hover:text-zinc-200'}`}
          >
            📁 {f}
          </button>
        ))}
      </div>

      {/* Control bar: Sort, View mode, Select mode */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              setSelectedIds([]);
            }}
            className={`px-2.5 py-1.5 rounded-xl border font-medium transition ${
              isSelectMode ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
            }`}
          >
            {isSelectMode ? t.cancel : t.select}
          </button>

          {isSelectMode && (
            <>
              <button
                onClick={handleSelectAll}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium"
              >
                {selectedIds.length === filtered.length ? 'Deselect All' : t.selectAll}
              </button>
              <span className="text-[11px] text-zinc-400">
                {selectedIds.length} {language === 'hi' ? 'चुनी गई' : 'selected'}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
          >
            <option value="date">{t.sortDate}</option>
            <option value="name">{t.sortName}</option>
            <option value="size">{t.sortSize}</option>
            <option value="type">{t.sortType}</option>
          </select>

          {/* Grid vs List */}
          <div className="flex bg-zinc-900 rounded-xl p-0.5 border border-zinc-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-lg ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-lg ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Batch Operations Bar */}
      {isSelectMode && selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs">
          <span className="font-semibold text-indigo-300">
            {selectedIds.length} {language === 'hi' ? 'फ़ाइलें चुनी गईं' : 'items selected'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchMoveToVault}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.moveToVault}</span>
            </button>
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-semibold shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.delete}</span>
            </button>
          </div>
        </div>
      )}

      {/* File Listings */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2">
          <FolderOpen className="w-12 h-12 text-zinc-600 mx-auto" />
          <p className="text-sm text-zinc-400">
            {language === 'hi' ? 'इस श्रेणी में कोई फ़ाइल मौजूद नहीं है' : 'No files found in this category'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleOpenFile(item)}
                className={`group relative rounded-2xl p-3 bg-zinc-950 border transition cursor-pointer flex flex-col justify-between h-40 ${
                  isSelected ? 'border-indigo-500 bg-indigo-950/20' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Select checkbox if mode active */}
                {isSelectMode && (
                  <div className="absolute top-2 left-2 z-10">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                )}

                {/* Top preview / icon */}
                <div className="relative w-full h-20 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-3 rounded-2xl bg-zinc-800">
                      {getCategoryIcon(item.category)}
                    </div>
                  )}

                  {item.duration && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono text-zinc-200">
                      {item.duration}
                    </span>
                  )}
                </div>

                {/* File info */}
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-zinc-100 truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-0.5">
                    <span>{formatSize(item.size)}</span>
                    <span>{item.folder}</span>
                  </div>
                </div>

                {/* Quick actions popup */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailsItem(item);
                    }}
                    className="p-1 rounded-md bg-black/70 text-zinc-300 hover:text-white"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(item.id);
                    }}
                    className="p-1 rounded-md bg-black/70 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 divide-y divide-zinc-900 overflow-hidden">
          {filtered.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleOpenFile(item)}
                className={`p-3 flex items-center justify-between hover:bg-zinc-900/60 transition cursor-pointer ${
                  isSelected ? 'bg-indigo-950/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {isSelectMode ? (
                    <div onClick={(e) => { e.stopPropagation(); toggleSelectItem(item.id); }}>
                      {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4 text-zinc-500" />}
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-zinc-100 truncate max-w-xs md:max-w-md">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                      <span>{formatSize(item.size)}</span>
                      <span>•</span>
                      <span>{item.dateModified}</span>
                      <span>•</span>
                      <span>{item.folder}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 transition ${
                      item.isFavorite ? 'text-amber-400' : ''
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={() => setDetailsItem(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition"
                    title={t.details}
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setRenamingItem(item);
                      setNewNameInput(item.name);
                    }}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition"
                    title={t.rename}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 transition"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RENAME MODAL */}
      {renamingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">{t.rename}</h3>
            <input
              type="text"
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setRenamingItem(null)}
                className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  if (newNameInput.trim()) {
                    renameFile(renamingItem.id, newNameInput.trim());
                  }
                  setRenamingItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
              >
                {t.rename}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-rose-400">{t.delete}</h3>
            <p className="text-xs text-zinc-300">{t.deleteConfirm}</p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  deleteFile(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
