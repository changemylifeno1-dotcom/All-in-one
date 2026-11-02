import React from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { 
  FileText, 
  HardDrive, 
  Calendar, 
  Clock, 
  Monitor, 
  Folder, 
  Code, 
  X,
  Star,
  ShieldAlert
} from 'lucide-react';

export const FileDetailsModal: React.FC = () => {
  const { detailsItem, setDetailsItem, t } = useApp();

  if (!detailsItem) return null;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white truncate max-w-xs">
              {detailsItem.name}
            </h3>
          </div>
          <button
            onClick={() => setDetailsItem(null)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 space-y-3.5 text-xs">
          <div className="flex items-start justify-between py-2 border-b border-zinc-800/60">
            <span className="text-zinc-400 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              {t.fileName}:
            </span>
            <span className="text-zinc-100 font-semibold text-right break-all max-w-[60%]">
              {detailsItem.name}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
            <span className="text-zinc-400 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              {t.fileSize}:
            </span>
            <span className="text-zinc-100 font-semibold font-mono">
              {formatSize(detailsItem.size)} ({detailsItem.size.toLocaleString()} bytes)
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
            <span className="text-zinc-400 flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              {t.fileLocation}:
            </span>
            <span className="text-zinc-100 font-mono">
              /Internal Storage/{detailsItem.folder}/
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
            <span className="text-zinc-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              {t.dateModified}:
            </span>
            <span className="text-zinc-100 font-semibold">
              {detailsItem.dateModified}
            </span>
          </div>

          {detailsItem.resolution && (
            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400 flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                {t.resolution}:
              </span>
              <span className="text-zinc-100 font-semibold">
                {detailsItem.resolution}
              </span>
            </div>
          )}

          {detailsItem.duration && (
            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                {t.duration}:
              </span>
              <span className="text-zinc-100 font-semibold font-mono">
                {detailsItem.duration}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
            <span className="text-zinc-400 flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-blue-400" />
              {t.mimeType}:
            </span>
            <span className="text-zinc-300 font-mono text-[11px]">
              {detailsItem.mimeType}
            </span>
          </div>

          {detailsItem.audioTracks && detailsItem.audioTracks.length > 0 && (
            <div className="py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400 block mb-1.5 font-medium">
                Audio Tracks ({detailsItem.audioTracks.length}):
              </span>
              <div className="space-y-1">
                {detailsItem.audioTracks.map((tr) => (
                  <div key={tr.id} className="p-2 rounded-lg bg-zinc-900 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-200">{tr.name}</span>
                    <span className="text-indigo-400 font-mono">{tr.channels} • {tr.codec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/40 flex justify-end">
          <button
            onClick={() => setDetailsItem(null)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition text-xs"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
