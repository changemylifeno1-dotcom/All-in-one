import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Languages, 
  Search, 
  Moon, 
  Sun, 
  FolderOpen, 
  Trash2, 
  MoreVertical, 
  Settings, 
  ChevronRight, 
  RefreshCw,
  HardDrive
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    t, 
    language, 
    toggleLanguage, 
    theme, 
    setTheme, 
    searchQuery, 
    setSearchQuery, 
    setActiveTab, 
    files, 
    addLocalFiles,
    refreshDeviceMedia,
    isNativeAndroid,
    showToast
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const trashCount = files.filter(f => f.isDeleted).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addLocalFiles(e.target.files);
    }
  };

  const handleRescanMedia = async () => {
    setIsScanning(true);
    setIsMenuOpen(false);
    showToast(language === 'hi' ? 'फ़ोन मीडिया स्कैन हो रहा है...' : 'Scanning phone media...');
    try {
      await refreshDeviceMedia();
      showToast(language === 'hi' ? 'मीडिया सूची अपडेट हो गई!' : 'Media library updated!');
    } catch {
      showToast(language === 'hi' ? 'स्कैन पूरा हुआ' : 'Scan completed');
    } finally {
      setIsScanning(false);
    }
  };

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleOpenTrash = () => {
    setActiveTab('trash');
    setIsMenuOpen(false);
  };

  const handleOpenSettings = () => {
    setActiveTab('settings');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-black/90 dark:bg-black/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Hidden File Input for Local Import */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
        />

        {/* Brand & Tagline (Clickable to go Home) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                  <span className="font-black text-sm bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                    R1
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black" title="Offline Protected" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white group-hover:text-indigo-300 transition">
                  ROHIT ONE
                </h1>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Mobile Right Controls: Android Three-Dot Overflow Menu (⋮) */}
          <div className="flex items-center gap-1.5 md:hidden">
            {isNativeAndroid && (
              <button
                onClick={handleRescanMedia}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition"
                title="Rescan Storage"
              >
                <RefreshCw className={`w-4 h-4 text-indigo-400 ${isScanning ? 'animate-spin' : ''}`} />
              </button>
            )}

            {/* Android 3-Dot Overflow Menu Button */}
            <div className="relative" ref={!isMenuOpen ? undefined : menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl border transition relative ${
                  isMenuOpen 
                    ? 'bg-zinc-800 border-zinc-700 text-white' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
                title={t.overflowMenu}
                aria-label="Overflow menu"
              >
                <MoreVertical className="w-4 h-4" />
                {trashCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Universal Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* Desktop Actions & Three-Dot Overflow Menu (⋮) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Add / Import Local Files */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition"
            title="Import from phone/PC"
          >
            <FolderOpen className="w-4 h-4 text-indigo-400" />
            <span>{t.addFiles}</span>
          </button>

          {/* Rescan Device Media */}
          <button
            onClick={handleRescanMedia}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition"
            title="Scan Phone Storage"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{language === 'hi' ? 'री-स्कैन' : 'Rescan'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition"
            title="Toggle Hindi / English"
          >
            <Languages className="w-4 h-4 text-indigo-400" />
            <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition"
            title="Toggle AMOLED Dark / Clean White"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Android Three-Dot Overflow Menu Button (Desktop) */}
          <div className="relative" ref={isMenuOpen ? menuRef : undefined}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl border transition relative ${
                isMenuOpen 
                  ? 'bg-zinc-800 border-zinc-700 text-white' 
                  : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300'
              }`}
              title={t.overflowMenu}
              aria-label="Overflow menu"
            >
              <MoreVertical className="w-4 h-4" />
              {trashCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ANDROID OVERFLOW MENU DROPDOWN (Accessible on both Mobile & Desktop) */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute right-4 top-14 w-72 md:w-80 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl shadow-black/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
        >
          {/* Header indicator */}
          <div className="px-3.5 py-2 border-b border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {t.overflowMenu}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              ROHIT ONE
            </span>
          </div>

          <div className="p-1.5 space-y-1">
            {/* 1. RECYCLE BIN / RECENTLY DELETED (Accessible at all times) */}
            <button
              onClick={handleOpenTrash}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-950/30 active:bg-rose-950/50 transition group text-left border border-transparent hover:border-rose-500/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-rose-300 transition">
                      {language === 'hi' ? 'रीसायकल बिन (Recycle Bin)' : 'Recycle Bin'}
                    </span>
                    {trashCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-rose-600 text-white font-mono text-[9px] font-bold rounded-full">
                        {trashCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 group-hover:text-zinc-300">
                    {language === 'hi' ? '30-दिनों का हाल ही में हटाया गया डेटा' : 'Recently deleted (30-day retention)'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-rose-400 transition shrink-0" />
            </button>

            {/* 2. RESCAN DEVICE MEDIA */}
            <button
              onClick={handleRescanMedia}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900 active:bg-zinc-800 transition group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-white">
                    {language === 'hi' ? 'फ़ोन मीडिया री-स्कैन' : 'Rescan Phone Storage'}
                  </span>
                  <p className="text-[10px] text-zinc-500">
                    {language === 'hi' ? 'नए वीडियो व फ़ोटो तुरंत लोड करें' : 'Refresh local device files'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition shrink-0" />
            </button>

            {/* 3. SETTINGS */}
            <button
              onClick={handleOpenSettings}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900 active:bg-zinc-800 transition group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-white">
                    {t.settings}
                  </span>
                  <p className="text-[10px] text-zinc-500">
                    {language === 'hi' ? 'स्टोरेज स्थिति, कस्टमाइज़ेशन व वॉल्ट' : 'Storage status, preferences, vault'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition shrink-0" />
            </button>

            {/* 4. IMPORT / ADD FILES */}
            <button
              onClick={() => {
                fileInputRef.current?.click();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900 active:bg-zinc-800 transition group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-white">
                    {t.addFiles}
                  </span>
                  <p className="text-[10px] text-zinc-500">
                    {language === 'hi' ? 'डिवाइस से फ़ाइलें जोड़ें' : 'Select files from device'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition shrink-0" />
            </button>
          </div>

          <div className="my-1.5 border-t border-zinc-900" />

          {/* Quick Controls in Menu */}
          <div className="px-2 py-1 flex items-center justify-between gap-2">
            <button
              onClick={toggleLanguage}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
