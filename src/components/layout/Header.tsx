import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Languages, 
  Download, 
  Search, 
  Plus, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Smartphone,
  FolderOpen,
  Trash2
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
    setIsAPKModalOpen,
    setActiveTab,
    files,
    addLocalFiles
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const trashCount = files.filter(f => f.isDeleted).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addLocalFiles(e.target.files);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-black/90 dark:bg-black/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
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
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Android Pro
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Mobile Actions: Trash, Language, APK */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Mobile Trash */}
            <button
              onClick={() => setActiveTab('trash')}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 relative transition"
              title={t.trashTitle}
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              {trashCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                  {trashCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsAPKModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>APK</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 active:scale-95 transition"
            >
              {language === 'hi' ? 'EN' : 'हिंदी'}
            </button>
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

        {/* Actions & Utilities */}
        <div className="hidden md:flex items-center gap-2">
          {/* Recycle Bin Button */}
          <button
            onClick={() => setActiveTab('trash')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 relative transition"
            title={t.trashTitle}
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>{t.trash}</span>
            {trashCount > 0 && (
              <span className="w-4 h-4 bg-rose-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                {trashCount}
              </span>
            )}
          </button>

          {/* Add / Import Local Files */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition"
            title="Import from phone/PC"
          >
            <FolderOpen className="w-4 h-4 text-indigo-400" />
            <span>{t.addFiles}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition"
            title="Toggle Hindi / English"
          >
            <Languages className="w-4 h-4 text-emerald-400" />
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

          {/* APK Build & Download Button */}
          <button
            onClick={() => setIsAPKModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>{t.apkDownloadBtn}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded-md font-mono">
              APK
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
