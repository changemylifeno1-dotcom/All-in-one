import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { 
  Home, 
  Film, 
  Image as ImageIcon, 
  Music, 
  FileText, 
  Folder, 
  Shield, 
  Settings,
  Download
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, setIsAPKModalOpen } = useApp();

  const navItems: { tab: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'home', label: t.home, icon: Home },
    { tab: 'videos', label: t.videos, icon: Film },
    { tab: 'photos', label: t.photos, icon: ImageIcon },
    { tab: 'music', label: t.music, icon: Music },
    { tab: 'files', label: t.allFiles, icon: Folder },
    { tab: 'vault', label: t.vault, icon: Shield },
    { tab: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 dark:bg-black/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5 max-w-lg md:max-w-3xl mx-auto rounded-t-2xl md:rounded-2xl md:bottom-3 md:shadow-2xl md:shadow-black">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 relative ${
                isActive 
                  ? 'text-indigo-400 font-bold scale-105' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-5 h-1 bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight line-clamp-1">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Floating Quick APK Center Icon */}
        <button
          onClick={() => setIsAPKModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-emerald-400 hover:text-emerald-300 transition"
          title="Build / Download APK"
        >
          <div className="relative">
            <Download className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold">APK</span>
        </button>
      </div>
    </nav>
  );
};
