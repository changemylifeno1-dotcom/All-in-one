import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem, FileCategory } from '../../types';
import { 
  Film, 
  Image as ImageIcon, 
  Music, 
  FileText, 
  Folder, 
  Shield, 
  HardDrive, 
  Play, 
  Sparkles, 
  Download, 
  Star, 
  Clock, 
  Plus, 
  ArrowRight,
  FolderOpen,
  Smartphone
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { 
    files, 
    setActiveTab, 
    setActiveVideo, 
    setActivePhoto, 
    setActiveDoc, 
    setDetailsItem, 
    setIsAPKModalOpen,
    addLocalFiles,
    t, 
    language 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const nonVaultFiles = files.filter(f => !f.isInVault && !f.isDeleted);

  // Category counts & sizes
  const videos = nonVaultFiles.filter(f => f.category === 'video');
  const photos = nonVaultFiles.filter(f => f.category === 'photo');
  const audio = nonVaultFiles.filter(f => f.category === 'audio');
  const docs = nonVaultFiles.filter(f => f.category === 'document');

  const totalUsedBytes = nonVaultFiles.reduce((acc, f) => acc + f.size, 0);
  const totalStorageBytes = 128 * 1024 * 1024 * 1024; // 128 GB simulated
  const usedGB = (totalUsedBytes / (1024 * 1024 * 1024)).toFixed(1);
  const freeGB = (128 - parseFloat(usedGB)).toFixed(1);
  const usedPercent = Math.min(100, Math.max(5, Math.round((totalUsedBytes / totalStorageBytes) * 100)));

  const handleOpenFile = (item: MediaItem) => {
    if (item.category === 'video') setActiveVideo(item);
    else if (item.category === 'photo') setActivePhoto(item);
    else if (item.category === 'document') setActiveDoc(item);
    else setDetailsItem(item);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addLocalFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* PROMINENT APK DOWNLOAD & INSTALL HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-zinc-950 to-emerald-950 border border-indigo-500/30 p-5 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                100% Free • Offline • No Ads
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-xs text-indigo-300 font-semibold">APK Build Center</span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
              {language === 'hi' ? 'अपने Android फ़ोन के लिए APK डाउनलोड करें' : 'Download Standalone APK for Your Android Phone'}
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {language === 'hi'
                ? 'सीधा 1-क्लिक फ़ोन इंस्टॉलेशन (WebAPK), प्रोजेक्ट ZIP पैकेज और मुफ़्त GitHub Cloud APK बिल्डर तैयार है।'
                : 'Direct 1-tap phone install, full native Android project ZIP, and free cloud GitHub APK builder.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAPKModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-black shadow-xl shadow-indigo-600/30 active:scale-95 transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>{language === 'hi' ? '📱 फ़ोन पर सीधे इंस्टॉल करें' : '📱 Install on Android Phone'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* STORAGE USAGE CARD */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t.internalStorage}</h3>
              <p className="text-[11px] text-zinc-400">
                {freeGB} GB {t.freeSpace}
              </p>
            </div>
          </div>
          <span className="text-sm font-bold font-mono text-indigo-400">
            {usedGB} GB / 128 GB
          </span>
        </div>

        {/* Multi-segmented storage progress bar */}
        <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden flex">
          <div className="bg-indigo-500 h-full" style={{ width: '40%' }} title="Videos" />
          <div className="bg-emerald-500 h-full" style={{ width: '25%' }} title="Photos" />
          <div className="bg-amber-500 h-full" style={{ width: '15%' }} title="Audio" />
          <div className="bg-blue-500 h-full" style={{ width: '10%' }} title="Documents" />
          <div className="bg-zinc-700 h-full" style={{ width: '10%' }} title="System" />
        </div>

        {/* Storage Legend */}
        <div className="grid grid-cols-4 gap-2 text-[11px] text-zinc-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>{t.catVideos} ({videos.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t.catPhotos} ({photos.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{t.catAudio} ({audio.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{t.catDocuments} ({docs.length})</span>
          </div>
        </div>
      </div>

      {/* MODULAR CATEGORY GRID */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-white">{t.catAll}</h3>
          <button
            onClick={() => setActiveTab('files')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {/* Videos */}
          <button
            onClick={() => setActiveTab('videos')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-indigo-500/50 hover:bg-zinc-900 transition flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <Film className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-200 mt-2">{t.catVideos}</span>
            <span className="text-[10px] text-zinc-500">{videos.length}</span>
          </button>

          {/* Photos */}
          <button
            onClick={() => setActiveTab('photos')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-emerald-500/50 hover:bg-zinc-900 transition flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-200 mt-2">{t.catPhotos}</span>
            <span className="text-[10px] text-zinc-500">{photos.length}</span>
          </button>

          {/* Music */}
          <button
            onClick={() => setActiveTab('music')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/50 hover:bg-zinc-900 transition flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Music className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-200 mt-2">{t.catAudio}</span>
            <span className="text-[10px] text-zinc-500">{audio.length}</span>
          </button>

          {/* Documents */}
          <button
            onClick={() => setActiveTab('documents')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-blue-500/50 hover:bg-zinc-900 transition flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-200 mt-2">{t.catDocuments}</span>
            <span className="text-[10px] text-zinc-500">{docs.length}</span>
          </button>

          {/* All Files */}
          <button
            onClick={() => setActiveTab('files')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-purple-500/50 hover:bg-zinc-900 transition flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <Folder className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-200 mt-2">{t.allFiles}</span>
            <span className="text-[10px] text-zinc-500">{nonVaultFiles.length}</span>
          </button>

          {/* Private Vault */}
          <button
            onClick={() => setActiveTab('vault')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-rose-500/50 hover:bg-zinc-900 transition flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-200 mt-2">{t.vault}</span>
            <span className="text-[10px] text-rose-400 font-mono">PIN Lock</span>
          </button>
        </div>
      </div>

      {/* QUICK IMPORTANT FOLDERS */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 px-1">{t.quickFolders}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: t.folderCamera, count: 6, icon: '📷' },
            { name: t.folderDownloads, count: 12, icon: '📥' },
            { name: t.folderMovies, count: 4, icon: '🎬' },
            { name: t.folderWhatsApp, count: 28, icon: '💬' },
          ].map((f) => (
            <div
              key={f.name}
              onClick={() => setActiveTab('files')}
              className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 flex items-center gap-3 cursor-pointer transition"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-zinc-100">{f.name}</h4>
                <span className="text-[10px] text-zinc-400">{f.count} items</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENTLY OPENED FILES */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">{t.recentFiles}</h3>
          </div>
          
          {/* Add file button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addFiles}</span>
          </button>
        </div>

        <div className="rounded-2xl bg-zinc-950 border border-zinc-800/80 divide-y divide-zinc-900 overflow-hidden">
          {nonVaultFiles.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenFile(item)}
              className="p-3 flex items-center justify-between hover:bg-zinc-900/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center shrink-0">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                  ) : item.category === 'video' ? (
                    <Film className="w-5 h-5 text-indigo-400" />
                  ) : item.category === 'photo' ? (
                    <ImageIcon className="w-5 h-5 text-emerald-400" />
                  ) : item.category === 'audio' ? (
                    <Music className="w-5 h-5 text-amber-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-400" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-zinc-100 truncate max-w-xs md:max-w-md">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                    <span>{item.folder}</span>
                    <span>•</span>
                    <span>{(item.size / 1024 / 1024).toFixed(1)} MB</span>
                    {item.duration && <span>• {item.duration}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.category === 'video' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold">
                    Hindi Audio
                  </span>
                )}
                <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
