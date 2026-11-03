import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { 
  Film, 
  Image as ImageIcon, 
  Music, 
  FileText, 
  Folder, 
  Shield, 
  Play, 
  Sparkles, 
  Clock, 
  Plus, 
  ChevronRight, 
  FolderOpen,
  RefreshCw,
  HardDrive,
  Camera,
  FolderArchive,
  Music2
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { 
    files, 
    setActiveTab, 
    setActiveVideo, 
    setActivePhoto, 
    setActiveDoc, 
    setDetailsItem, 
    addLocalFiles,
    refreshDeviceMedia,
    hasStoragePermission,
    requestStoragePermission,
    isNativeAndroid,
    t, 
    language 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const nonVaultFiles = files.filter(f => !f.isInVault && !f.isDeleted);

  // Category subsets from real device files
  const videos = nonVaultFiles.filter(f => f.category === 'video');
  const photos = nonVaultFiles.filter(f => f.category === 'photo');
  const audio = nonVaultFiles.filter(f => f.category === 'audio');
  const docs = nonVaultFiles.filter(f => f.category === 'document');

  // Hero Featured Video (first actual real video)
  const featuredVideo = videos.length > 0 ? videos[0] : null;

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

  // Dynamically compute real folders from loaded files
  const realFolderMap = new Map<string, number>();
  nonVaultFiles.forEach(f => {
    const folderName = f.folder || 'Downloads';
    realFolderMap.set(folderName, (realFolderMap.get(folderName) || 0) + 1);
  });
  const dynamicFolders = Array.from(realFolderMap.entries()).slice(0, 4);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Hidden file selector for adding media */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        multiple
        className="hidden"
      />

      {/* Permission Banner if Storage permission is not granted on Android */}
      {isNativeAndroid && !hasStoragePermission && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">
                {language === 'hi' ? 'फ़ोन स्टोरेज अनुमति आवश्यक है' : 'Storage Permission Needed'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {language === 'hi'
                  ? 'अपने फ़ोन के सभी वीडियो, फ़ोटो और फ़ाइलें देखने के लिए अनुमति दें।'
                  : 'Grant storage permission to access and display your phone files.'}
              </p>
            </div>
          </div>
          <button
            onClick={requestStoragePermission}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition shadow-md self-start sm:self-auto shrink-0"
          >
            {language === 'hi' ? 'अनुमति दें' : 'Grant Permission'}
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. HERO VIDEO SECTION (LARGEST & MOST PROMINENT)                */}
      {/* ============================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>{language === 'hi' ? 'वीडियो हब (Cinema Hub)' : 'Video Cinema Hub'}</span>
                {videos.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                    {videos.length} {language === 'hi' ? 'वीडियो' : 'Videos'}
                  </span>
                )}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('videos')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredVideo ? (
          /* Real Device Featured Video Card */
          <div 
            onClick={() => setActiveVideo(featuredVideo)}
            className="group relative overflow-hidden rounded-3xl bg-zinc-950 border border-indigo-500/40 shadow-2xl shadow-indigo-950/40 cursor-pointer transition transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-80 overflow-hidden bg-zinc-900">
              {featuredVideo.thumbnail ? (
                <img 
                  src={featuredVideo.thumbnail} 
                  alt={featuredVideo.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-85 group-hover:brightness-95"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-zinc-950 via-indigo-950/30 to-zinc-900">
                  <Film className="w-16 h-16 text-indigo-500/30" />
                </div>
              )}
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-black shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'hi' ? 'हिंदी ऑडियो प्राथमिकता' : 'Hindi Audio First'}</span>
                  </span>
                  {featuredVideo.resolution && (
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-indigo-300 border border-indigo-400/40 text-[10px] font-bold">
                      {featuredVideo.resolution}
                    </span>
                  )}
                </div>
                {featuredVideo.duration && (
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-zinc-300 text-[11px] font-mono">
                    {featuredVideo.duration}
                  </span>
                )}
              </div>

              {/* Big Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 group-hover:scale-110 group-hover:bg-indigo-500 transition duration-300">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Info Bar inside Hero */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1 max-w-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {language === 'hi' ? 'तुरंत चलाएं • जेस्चर प्लेयर' : 'Resume Playback • Gesture Player'}
                  </span>
                  <h3 className="text-base sm:text-xl font-black text-white leading-tight drop-shadow-md truncate">
                    {featuredVideo.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>{featuredVideo.folder}</span>
                    <span>•</span>
                    <span>{(featuredVideo.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveVideo(featuredVideo);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition"
                  >
                    {language === 'hi' ? 'चलाएं' : 'Play Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State for Videos - ZERO Mock Data */
          <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
              <Film className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">
                {language === 'hi' ? 'डिवाइस पर कोई वीडियो नहीं मिला' : 'No videos found on device'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                {language === 'hi'
                  ? 'अपने फ़ोन से वीडियो लोड करने के लिए नीचे दिए गए बटन पर टैप करें।'
                  : 'Tap below to rescan your phone storage or select videos manually.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={refreshDeviceMedia}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === 'hi' ? 'री-स्कैन करें' : 'Scan Storage'}</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addFiles}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 2. PHOTOS SECTION (SECOND-LARGEST SECTION)                     */}
      {/* ============================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <span>{t.photos}</span>
                {photos.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    {photos.length}
                  </span>
                )}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('photos')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => setActivePhoto(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-emerald-500/50 cursor-pointer shadow-lg transition"
              >
                <img
                  src={item.thumbnail || item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                  <p className="text-xs font-bold text-white truncate">{item.name}</p>
                  <span className="text-[10px] text-zinc-300">{item.folder}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-zinc-950 border border-zinc-800/80 p-6 text-center space-y-2">
            <Camera className="w-8 h-8 text-emerald-400/50 mx-auto" />
            <p className="text-xs font-semibold text-zinc-300">
              {language === 'hi' ? 'डिवाइस पर कोई फ़ोटो नहीं मिली' : 'No photos found on device'}
            </p>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 3. SECONDARY SECTIONS: AUDIO, DOCS, FILES, VAULT (COMPACT)      */}
      {/* ============================================================== */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          {language === 'hi' ? 'त्वरित लाइब्रेरी व साधन' : 'Quick Libraries & Tools'}
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Audio Library */}
          <button
            onClick={() => setActiveTab('music')}
            className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/50 transition flex items-center gap-3 group text-left shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Music className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white block truncate">
                {t.music}
              </span>
              <span className="text-[10px] text-zinc-500">
                {audio.length} {language === 'hi' ? 'ट्रैक' : 'Tracks'}
              </span>
            </div>
          </button>

          {/* Document Reader */}
          <button
            onClick={() => setActiveTab('documents')}
            className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-blue-500/50 transition flex items-center gap-3 group text-left shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white block truncate">
                {language === 'hi' ? 'दस्तावेज़' : 'Documents'}
              </span>
              <span className="text-[10px] text-zinc-500">
                {docs.length} {language === 'hi' ? 'फ़ाइलें' : 'Files'}
              </span>
            </div>
          </button>

          {/* All Files Explorer */}
          <button
            onClick={() => setActiveTab('files')}
            className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-indigo-500/50 transition flex items-center gap-3 group text-left shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Folder className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white block truncate">
                {t.allFiles}
              </span>
              <span className="text-[10px] text-zinc-500">
                {nonVaultFiles.length} {language === 'hi' ? 'कुल' : 'Total'}
              </span>
            </div>
          </button>

          {/* Private Vault (PIN Lock) */}
          <button
            onClick={() => setActiveTab('vault')}
            className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-rose-500/50 transition flex items-center gap-3 group text-left shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white block truncate">
                {t.vault}
              </span>
              <span className="text-[10px] text-rose-400 font-mono">
                PIN Lock
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. REAL FOLDERS (DYNAMICALLY DERIVED FROM DEVICE STORAGE)       */}
      {/* ============================================================== */}
      {dynamicFolders.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
            {t.quickFolders}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dynamicFolders.map(([folderName, count]) => (
              <div
                key={folderName}
                onClick={() => setActiveTab('files')}
                className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 flex items-center gap-3 cursor-pointer transition shadow-md"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-300">
                  <FolderOpen className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-zinc-100 truncate">{folderName}</h4>
                  <span className="text-[10px] text-zinc-500">{count} {language === 'hi' ? 'फ़ाइलें' : 'items'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 5. RECENTLY ACCESSED MEDIA                                     */}
      {/* ============================================================== */}
      {nonVaultFiles.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">{t.recentFiles}</h3>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addFiles}</span>
            </button>
          </div>

          <div className="rounded-2xl bg-zinc-950 border border-zinc-800/80 divide-y divide-zinc-900 overflow-hidden shadow-xl">
            {nonVaultFiles.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenFile(item)}
                className="p-3 flex items-center justify-between hover:bg-zinc-900/60 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
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

                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-100 truncate">
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

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
