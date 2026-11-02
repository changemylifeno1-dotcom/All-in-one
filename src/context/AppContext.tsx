import React, { createContext, useContext, useState, useEffect } from 'react';
import { MediaItem, ActiveTab, ThemeMode, AppLanguage, AppSettings, AccentColor } from '../types';
import { initialMediaItems } from '../data/mockData';
import { translations, Translations } from '../i18n/translations';

const defaultSettings: AppSettings = {
  accentColor: 'indigo',
  homeLayout: 'standard',
  defaultViewMode: 'grid',
  thumbnailSize: 'medium',
  defaultSortBy: 'date',
  defaultVideoSpeed: 1.0,
  defaultAudioLanguage: 'hi',
  defaultSubtitles: 'hi',
  gestureSensitivity: 'medium',
  enableGestures: true,
  seekInterval: 10,
  showExifByDefault: true,
  slideshowSpeed: 5,
  showHiddenFiles: false,
  confirmBeforeDelete: true,
  vaultAutoLock: '5m',
  enableBiometrics: true,
  trashRetentionDays: 30, // 30-day default
  autoEmptyTrash: true,
  cacheAutoClean: true,
};

interface AppContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  t: Translations;
  
  files: MediaItem[];
  addLocalFiles: (newFiles: FileList | File[]) => void;
  addMediaItem: (item: MediaItem) => void;
  
  // Recycle Bin / Trash System
  deleteFile: (id: string) => void; // Moves to Recycle Bin by default!
  moveToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  restoreAllTrash: () => void;
  deletePermanently: (id: string) => void;
  emptyTrash: () => void;
  
  renameFile: (id: string, newName: string) => void;
  toggleFavorite: (id: string) => void;
  moveToVault: (id: string) => void;
  restoreFromVault: (id: string) => void;
  
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  activeVideo: MediaItem | null;
  setActiveVideo: (item: MediaItem | null) => void;
  
  activePhoto: MediaItem | null;
  setActivePhoto: (item: MediaItem | null) => void;
  
  activeDoc: MediaItem | null;
  setActiveDoc: (item: MediaItem | null) => void;
  
  detailsItem: MediaItem | null;
  setDetailsItem: (item: MediaItem | null) => void;
  
  isVaultUnlocked: boolean;
  setIsVaultUnlocked: (unlocked: boolean) => void;
  vaultPin: string;
  setVaultPin: (pin: string) => void;
  
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  
  sortBy: 'name' | 'date' | 'size' | 'type';
  setSortBy: (sort: 'name' | 'date' | 'size' | 'type') => void;
  
  isAPKModalOpen: boolean;
  setIsAPKModalOpen: (open: boolean) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('rohit_one_lang') as AppLanguage) || 'hi';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('rohit_one_theme') as ThemeMode) || 'dark';
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('rohit_one_settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [files, setFiles] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('rohit_one_files');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialMediaItems;
      }
    }
    return initialMediaItems;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);
  const [activePhoto, setActivePhoto] = useState<MediaItem | null>(null);
  const [activeDoc, setActiveDoc] = useState<MediaItem | null>(null);
  const [detailsItem, setDetailsItem] = useState<MediaItem | null>(null);

  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [vaultPin, setVaultPinState] = useState<string>(() => {
    return localStorage.getItem('rohit_one_vault_pin') || '1234';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => settings.defaultViewMode || 'grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>(() => settings.defaultSortBy || 'date');
  const [isAPKModalOpen, setIsAPKModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3500);
  };

  // Sync language
  useEffect(() => {
    localStorage.setItem('rohit_one_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  // Sync theme & accent color
  useEffect(() => {
    localStorage.setItem('rohit_one_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Sync settings
  useEffect(() => {
    localStorage.setItem('rohit_one_settings', JSON.stringify(settings));
    document.documentElement.setAttribute('data-accent', settings.accentColor);
  }, [settings]);

  // Save files to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rohit_one_files', JSON.stringify(files));
    } catch {
      // Storage quota exceeded or disabled
    }
  }, [files]);

  // AUTOMATIC 30-DAY RETENTION EXPIRATION CHECK
  useEffect(() => {
    const retentionDays = settings.trashRetentionDays || 30;
    const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
    const now = Date.now();

    setFiles(prev => {
      let expiredCount = 0;
      const updated = prev.filter(file => {
        if (file.isDeleted && file.deletedAt) {
          const deletedTime = new Date(file.deletedAt).getTime();
          if (now - deletedTime >= retentionMs) {
            expiredCount++;
            return false; // Automatically permanently delete expired items after 30 days!
          }
        }
        return true;
      });

      if (expiredCount > 0) {
        showToast(language === 'hi' 
          ? `${expiredCount} समाप्त हो चुकी फ़ाइलें रीसायकल बिन से स्वतः हटा दी गईं।`
          : `${expiredCount} expired files were automatically deleted from Recycle Bin.`);
      }
      return updated;
    });
  }, [settings.trashRetentionDays]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      return next;
    });
    showToast(translations[language].settingsSaved);
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'hi' ? 'en' : 'hi'));
  };

  const setVaultPin = (newPin: string) => {
    setVaultPinState(newPin);
    localStorage.setItem('rohit_one_vault_pin', newPin);
  };

  const addLocalFiles = (newFiles: FileList | File[]) => {
    const items: MediaItem[] = [];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    Array.from(newFiles).forEach((file, index) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let category: MediaItem['category'] = 'document';

      if (['mp4', 'mkv', 'avi', 'mov', 'webm', '3gp', 'm4v'].includes(ext)) {
        category = 'video';
      } else if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic'].includes(ext)) {
        category = 'photo';
      } else if (['mp3', 'aac', 'wav', 'flac', 'ogg', 'm4a'].includes(ext)) {
        category = 'audio';
      } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
        category = 'archive';
      }

      const fileUrl = URL.createObjectURL(file);

      items.push({
        id: `local-${Date.now()}-${index}`,
        name: file.name,
        category,
        url: fileUrl,
        thumbnail: category === 'photo' ? fileUrl : undefined,
        size: file.size,
        dateModified: now,
        mimeType: file.type || `application/${ext}`,
        duration: category === 'video' || category === 'audio' ? '00:03:30' : undefined,
        resolution: category === 'video' ? '1920x1080 (HD)' : category === 'photo' ? '4000x3000' : undefined,
        isFavorite: false,
        folder: 'Downloads',
        audioTracks: category === 'video' ? [
          {
            id: 'local-track-hi',
            name: 'Hindi Audio Track',
            language: 'hi',
            languageLabel: 'हिंदी (Hindi)',
            channels: 'Stereo',
            codec: 'AAC',
            isSelected: true,
          },
          {
            id: 'local-track-en',
            name: 'Original Audio Track',
            language: 'en',
            languageLabel: 'English',
            channels: 'Stereo',
            codec: 'AAC',
            isSelected: false,
          }
        ] : undefined
      });
    });

    setFiles(prev => [...items, ...prev]);
    showToast(language === 'hi' ? `${items.length} फ़ाइलें जोड़ी गईं` : `${items.length} files added`);
  };

  const addMediaItem = (item: MediaItem) => {
    setFiles(prev => [item, ...prev]);
    showToast(language === 'hi' ? 'फ़ोटो की कॉपी सहेजी गई' : 'Photo copy saved');
  };

  // 1. Move to Recycle Bin (30-day retention)
  const moveToTrash = (id: string) => {
    const now = new Date().toISOString();
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          isDeleted: true,
          deletedAt: now,
          originalFolder: f.folder,
        };
      }
      return f;
    }));
    showToast(translations[language].movedToTrash);
  };

  // Alias deleteFile to moveToTrash per requirement:
  // "Whenever a user deletes a video, photo, audio file or document through ROHIT ONE, move it to the Recycle Bin instead of permanently deleting it."
  const deleteFile = (id: string) => {
    moveToTrash(id);
  };

  // 2. Restore file from Recycle Bin
  const restoreFromTrash = (id: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          isDeleted: false,
          deletedAt: undefined,
          folder: f.originalFolder || f.folder,
        };
      }
      return f;
    }));
    showToast(translations[language].restoreSuccess);
  };

  // 3. Restore all files from Recycle Bin
  const restoreAllTrash = () => {
    setFiles(prev => prev.map(f => {
      if (f.isDeleted) {
        return {
          ...f,
          isDeleted: false,
          deletedAt: undefined,
          folder: f.originalFolder || f.folder,
        };
      }
      return f;
    }));
    showToast(language === 'hi' ? 'सभी फ़ाइलें सफलतापूर्वक रिस्टोर कर दी गईं!' : 'All files restored successfully!');
  };

  // 4. Delete permanently (individual)
  const deletePermanently = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    showToast(language === 'hi' ? 'फ़ाइल हमेशा के लिए हटा दी गई।' : 'File permanently deleted.');
  };

  // 5. Empty entire Recycle Bin
  const emptyTrash = () => {
    setFiles(prev => prev.filter(f => !f.isDeleted));
    showToast(translations[language].emptyTrashSuccess);
  };

  const renameFile = (id: string, newName: string) => {
    setFiles(prev => prev.map(f => (f.id === id ? { ...f, name: newName } : f)));
  };

  const toggleFavorite = (id: string) => {
    setFiles(prev => prev.map(f => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)));
  };

  const moveToVault = (id: string) => {
    setFiles(prev => prev.map(f => (f.id === id ? { ...f, isInVault: true } : f)));
  };

  const restoreFromVault = (id: string) => {
    setFiles(prev => prev.map(f => (f.id === id ? { ...f, isInVault: false } : f)));
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        settings,
        updateSettings,
        t,
        files,
        addLocalFiles,
        addMediaItem,
        deleteFile,
        moveToTrash,
        restoreFromTrash,
        restoreAllTrash,
        deletePermanently,
        emptyTrash,
        renameFile,
        toggleFavorite,
        moveToVault,
        restoreFromVault,
        activeTab,
        setActiveTab,
        activeVideo,
        setActiveVideo,
        activePhoto,
        setActivePhoto,
        activeDoc,
        setActiveDoc,
        detailsItem,
        setDetailsItem,
        isVaultUnlocked,
        setIsVaultUnlocked,
        vaultPin,
        setVaultPin,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        sortBy,
        setSortBy,
        isAPKModalOpen,
        setIsAPKModalOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
