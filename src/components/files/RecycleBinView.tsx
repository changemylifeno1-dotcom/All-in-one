import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Clock, 
  HardDrive, 
  Folder, 
  FileText, 
  Film, 
  Image as ImageIcon, 
  Music, 
  Archive, 
  CheckCircle2, 
  Info,
  ShieldAlert,
  CheckSquare,
  Square
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecycleBinView: React.FC = () => {
  const { 
    files, 
    restoreFromTrash, 
    restoreAllTrash, 
    deletePermanently, 
    emptyTrash, 
    settings,
    t, 
    language 
  } = useApp();

  const [confirmEmptyModal, setConfirmEmptyModal] = useState(false);
  const [permanentDeleteId, setPermanentDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // All files currently in Recycle Bin
  const trashFiles = files.filter(f => f.isDeleted);
  const retentionDays = settings.trashRetentionDays || 30;

  // Calculate remaining days for each file
  const getDaysRemaining = (deletedAt?: string) => {
    if (!deletedAt) return retentionDays;
    const deletedTime = new Date(deletedAt).getTime();
    const expiryTime = deletedTime + (retentionDays * 24 * 60 * 60 * 1000);
    const msRemaining = expiryTime - Date.now();
    const days = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
    return Math.max(0, days);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video': return <Film className="w-5 h-5 text-indigo-400" />;
      case 'photo': return <ImageIcon className="w-5 h-5 text-emerald-400" />;
      case 'audio': return <Music className="w-5 h-5 text-amber-400" />;
      case 'document': return <FileText className="w-5 h-5 text-blue-400" />;
      default: return <Archive className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleRestoreItem = (id: string) => {
    confetti({ particleCount: 40, spread: 45 });
    restoreFromTrash(id);
  };

  const handleRestoreSelected = () => {
    confetti({ particleCount: 60, spread: 60 });
    selectedIds.forEach(id => restoreFromTrash(id));
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach(id => deletePermanently(id));
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/40 via-zinc-950 to-amber-950/40 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {t.trashTitle}
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                {retentionDays} {language === 'hi' ? 'दिनों का ऑटो-डिलीट' : 'Days Auto-Expiry'}
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-md">
              {t.trashSubtitle}
            </p>
          </div>
        </div>

        {trashFiles.length > 0 && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => restoreAllTrash()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-emerald-400 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.restoreAll}</span>
            </button>

            <button
              onClick={() => setConfirmEmptyModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md shadow-rose-600/30"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.emptyTrash}</span>
            </button>
          </div>
        )}
      </div>

      {/* Select mode bar */}
      {trashFiles.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSelectMode(!isSelectMode);
                setSelectedIds([]);
              }}
              className={`px-3 py-1.5 rounded-xl border font-semibold transition ${
                isSelectMode ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
            >
              {isSelectMode ? t.cancel : t.select}
            </button>

            {isSelectMode && (
              <button
                onClick={() => {
                  if (selectedIds.length === trashFiles.length) setSelectedIds([]);
                  else setSelectedIds(trashFiles.map(f => f.id));
                }}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium"
              >
                {selectedIds.length === trashFiles.length ? 'Deselect All' : t.selectAll}
              </button>
            )}
          </div>

          <span className="text-[11px] text-zinc-400 font-mono">
            {trashFiles.length} {language === 'hi' ? 'फ़ाइलें ट्रैश में' : 'items in trash'}
          </span>
        </div>
      )}

      {/* Batch Actions Bar */}
      {isSelectMode && selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs animate-in fade-in">
          <span className="font-semibold text-rose-300">
            {selectedIds.length} {language === 'hi' ? 'फ़ाइलें चुनी गईं' : 'items selected'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestoreSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-400 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.restore} ({selectedIds.length})</span>
            </button>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.deletePermanently}</span>
            </button>
          </div>
        </div>
      )}

      {/* Trash Items List */}
      {trashFiles.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-zinc-950 border border-zinc-900 space-y-3">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-600">
            <Trash2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-300">{t.noTrashFiles}</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            {language === 'hi' 
              ? 'जब आप किसी वीडियो, फ़ोटो या फ़ाइल को डिलीट करेंगे, तो वह तुरंत हमेशा के लिए हटने की जगह यहाँ 30 दिनों तक सुरक्षित रहेगी।'
              : 'When you delete any video, photo, or file, it is safely stored here for 30 days before permanent deletion.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trashFiles.map((file) => {
            const daysLeft = getDaysRemaining(file.deletedAt);
            const isSelected = selectedIds.includes(file.id);

            return (
              <div
                key={file.id}
                className={`p-4 rounded-2xl bg-zinc-950 border transition flex flex-col justify-between space-y-3 ${
                  isSelected ? 'border-rose-500/80 bg-rose-950/20' : 'border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Select checkbox if in select mode */}
                  {isSelectMode ? (
                    <button onClick={() => toggleSelect(file.id)} className="pt-1">
                      {isSelected ? <CheckSquare className="w-5 h-5 text-rose-500" /> : <Square className="w-5 h-5 text-zinc-600" />}
                    </button>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden">
                      {file.thumbnail ? (
                        <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover opacity-70" />
                      ) : (
                        getCategoryIcon(file.category)
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-100 truncate">
                      {file.name}
                    </h4>

                    {/* Metadata details per requirement */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-zinc-400 mt-2 font-mono">
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500 font-sans">{t.fileSize}:</span>
                        <span>{formatSize(file.size)}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <span className="text-zinc-500 font-sans">{t.originalLocation}:</span>
                        <span className="truncate">{file.originalFolder || file.folder}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500 font-sans">{t.dateDeleted}:</span>
                        <span>{file.deletedAt ? file.deletedAt.substring(0, 10) : 'Recently'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500 font-sans">{t.mimeType}:</span>
                        <span className="uppercase">{file.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Days remaining badge & Actions */}
                <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs">
                  {/* 30-day Countdown Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {daysLeft === 0 
                        ? (language === 'hi' ? 'आज स्वतः हटेगा' : 'Expires today')
                        : `${daysLeft} ${t.daysRemaining}`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestoreItem(file.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 hover:text-emerald-300 font-semibold transition"
                      title={t.restore}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.restore}</span>
                    </button>

                    <button
                      onClick={() => setPermanentDeleteId(file.id)}
                      className="p-1.5 rounded-xl bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 transition"
                      title={t.deletePermanently}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INDIVIDUAL PERMANENT DELETE CONFIRM MODAL */}
      {permanentDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{t.deletePermanently}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {t.deletePermanentlyConfirm}
            </p>
            <div className="flex items-center justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setPermanentDeleteId(null)}
                className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  deletePermanently(permanentDeleteId);
                  setPermanentDeleteId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                {t.deletePermanently}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMPTY TRASH CONFIRM MODAL */}
      {confirmEmptyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{t.emptyTrash}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {t.emptyTrashConfirm}
            </p>
            <div className="flex items-center justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setConfirmEmptyModal(false)}
                className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  emptyTrash();
                  setConfirmEmptyModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                {t.emptyTrash}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
