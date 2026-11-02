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
  ArrowRight,
  FolderOpen,
  Smartphone,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  CheckCircle2
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

  // Category subsets
  const videos = nonVaultFiles.filter(f => f.category === 'video');
  const photos = nonVaultFiles.filter(f => f.category === 'photo');
  const audio = nonVaultFiles.filter(f => f.category === 'audio');
  const docs = nonVaultFiles.filter(f => f.category === 'document');

  // Hero Featured Video (first video or fallback)
  const featuredVideo = videos[0] || {
    id: 'hero-vid-sample',
    name: 'Shershaah — Official 4K HDR Teaser (Hindi 5.1)',
    category: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    size: 420 * 1024 * 1024,
    dateModified: '2025-02-28 18:30',
    mimeType: 'video/mp4',
    duration: '02:45',
    resolution: '4K UHD HDR',
    folder: 'Movies',
    isFavorite: true,
  } as MediaItem;

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
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Hidden file selector for adding media */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        multiple
        className="hidden"
      />

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
                <span>{language === 'hi' ? 'वीडियो हब (Featured Video)' : 'Video Cinema Hub'}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  {videos.length} {language === 'hi' ? 'वीडियो' : 'Videos'}
                </span>
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

        {/* Cinematic Hero Video Card */}
        <div 
          onClick={() => setActiveVideo(featuredVideo)}
          className="group relative overflow-hidden rounded-3xl bg-zinc-950 border border-indigo-500/40 shadow-2xl shadow-indigo-950/40 cursor-pointer transition transform hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* Background Poster / Thumbnail with cinematic aspect ratio */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-80 overflow-hidden bg-zinc-900">
            <img 
              src={featuredVideo.thumbnail || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80'} 
              alt={featuredVideo.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-black shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>हिंदी ऑडियो प्राथमिकता / Hindi Track</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-indigo-300 border border-indigo-400/40 text-[10px] font-bold">
                  {featuredVideo.resolution || '4K UHD'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-zinc-300 text-[11px] font-mono">
                {featuredVideo.duration || '02:45'}
              </span>
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
                <h3 className="text-base sm:text-xl font-black text-white leading-tight drop-shadow-md">
                  {featuredVideo.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                  <span>{featuredVideo.folder}</span>
                  <span>•</span>
                  <span>{(featuredVideo.size / 1024 / 1024).toFixed(1)} MB</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">Dual Audio (Hindi + Eng)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVideo(featuredVideo);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-black text-xs shadow-xl active:scale-95 transition flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'hi' ? 'अभी चलाएं' : 'Play Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Reel / Quick Shelf */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {videos.slice(1, 5).map((vid) => (
            <div
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className="group p-2.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-indigo-500/50 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-900 mb-2">
                <img 
                  src={vid.thumbnail || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80'} 
                  alt={vid.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                  {vid.duration || '03:15'}
                </span>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/90 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition">
                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>
              <h4 className="text-xs font-bold text-zinc-100 truncate group-hover:text-indigo-300">
                {vid.name}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                <span>{vid.folder}</span>
                <span className="text-emerald-400 font-semibold">Hindi</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PHOTOS GALLERY SECTION (SECOND LARGEST PROMINENT SECTION)    */}
      {/* ============================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>{language === 'hi' ? 'फ़ोटो गैलरी व एडिटर' : 'Photo Studio & Gallery'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  {photos.length} {language === 'hi' ? 'फ़ोटो' : 'Photos'}
                </span>
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

        {/* Dynamic Photo Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {photos.slice(0, 5).map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-emerald-500/60 transition cursor-pointer shadow-lg"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                <img 
                  src={photo.thumbnail || photo.url} 
                  alt={photo.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-2.5 bg-gradient-to-t from-black via-zinc-950 to-transparent">
                <h4 className="text-xs font-semibold text-zinc-100 truncate group-hover:text-emerald-300">
                  {photo.name}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                  <span>{photo.resolution || '12 MP'}</span>
                  <span>{(photo.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SECONDARY SECTIONS (MUSIC, DOCS, FILES, VAULT, APK)          */}
      {/* Clean, compact, highly organized grid                          */}
      {/* ============================================================== */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          {language === 'hi' ? 'अतिरिक्त मीडिया व उपयोगिताएँ' : 'Media Utilities & Tools'}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Music / Audio */}
          <button
            onClick={() => setActiveTab('music')}
            className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/50 hover:bg-zinc-900 transition flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Music className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white block truncate">
                {t.catAudio}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {audio.length} {language === 'hi' ? 'गाने' : 'tracks'}
              </span>
            </div>
          </button>

          {/* Documents & PDF */}
          <button
            onClick={() => setActiveTab('documents')}
            className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-blue-500/50 hover:bg-zinc-900 transition flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white block truncate">
                {t.catDocuments}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {docs.length} {language === 'hi' ? 'फ़ाइलें' : 'files'}
              </span>
            </div>
          </button>

          {/* All Files Explorer */}
          <button
            onClick={() => setActiveTab('files')}
            className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-purple-500/50 hover:bg-zinc-900 transition flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Folder className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white block truncate">
                {t.allFiles}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {nonVaultFiles.length} {language === 'hi' ? 'कुल' : 'total'}
              </span>
            </div>
          </button>

          {/* Private Vault */}
          <button
            onClick={() => setActiveTab('vault')}
            className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-rose-500/50 hover:bg-zinc-900 transition flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
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

          {/* APK Center */}
          <button
            onClick={() => setIsAPKModalOpen(true)}
            className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-950/60 to-emerald-950/60 border border-indigo-500/40 hover:border-indigo-400 transition flex items-center gap-3 group text-left col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                APK Center
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                Install App
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. QUICK IMPORTANT FOLDERS                                     */}
      {/* ============================================================== */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          {t.quickFolders}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: t.folderCamera, count: photos.length, icon: '📷' },
            { name: t.folderMovies, count: videos.length, icon: '🎬' },
            { name: t.folderDownloads, count: 12, icon: '📥' },
            { name: t.folderWhatsApp, count: 28, icon: '💬' },
          ].map((f) => (
            <div
              key={f.name}
              onClick={() => setActiveTab('files')}
              className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 flex items-center gap-3 cursor-pointer transition"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-zinc-100">{f.name}</h4>
                <span className="text-[10px] text-zinc-400">{f.count} items</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. RECENTLY ACCESSED MEDIA (WITH DIRECT ADD MEDIA BUTTON)      */}
      {/* ============================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">{t.recentFiles}</h3>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
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
                {item.category === 'video' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold hidden sm:inline">
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
      </section>
    </div>
  );
};
