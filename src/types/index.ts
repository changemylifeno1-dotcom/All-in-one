export type FileCategory = 'video' | 'photo' | 'audio' | 'document' | 'archive';

export interface AudioTrack {
  id: string;
  name: string;
  language: string; // 'hi', 'en', 'ta', 'te', etc.
  languageLabel: string;
  channels: string; // '5.1 Surround', 'Stereo 2.0'
  codec: string; // 'AAC', 'E-AC-3', 'FLAC'
  bitrate?: string;
  isSelected: boolean;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  url?: string;
  isSelected: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  category: FileCategory;
  url: string;
  thumbnail?: string;
  size: number; // in bytes
  dateModified: string;
  mimeType: string;
  duration?: string; // e.g. "02:14:30"
  resolution?: string; // e.g. "3840x2160 (4K UHD)"
  isFavorite: boolean;
  isInVault?: boolean;
  isDeleted?: boolean;
  deletedAt?: string; // ISO string when sent to Recycle Bin
  originalFolder?: string;
  folder: string;
  audioTracks?: AudioTrack[];
  subtitles?: SubtitleTrack[];
}

export type ActiveTab = 
  | 'home' 
  | 'videos' 
  | 'photos' 
  | 'music' 
  | 'documents' 
  | 'files' 
  | 'vault' 
  | 'trash'
  | 'settings'
  | 'apk_download';

export type ThemeMode = 'dark' | 'light' | 'system';
export type AppLanguage = 'hi' | 'en';
export type AccentColor = 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';

export interface AppSettings {
  accentColor: AccentColor;
  homeLayout: 'standard' | 'compact' | 'expanded';
  defaultViewMode: 'grid' | 'list';
  thumbnailSize: 'small' | 'medium' | 'large';
  defaultSortBy: 'name' | 'date' | 'size' | 'type';
  defaultVideoSpeed: number;
  defaultAudioLanguage: string;
  defaultSubtitles: 'off' | 'hi' | 'en' | 'auto';
  gestureSensitivity: 'low' | 'medium' | 'high';
  enableGestures: boolean;
  seekInterval: number;
  showExifByDefault: boolean;
  slideshowSpeed: number;
  showHiddenFiles: boolean;
  confirmBeforeDelete: boolean;
  vaultAutoLock: 'immediate' | '1m' | '5m' | 'never';
  enableBiometrics: boolean;
  trashRetentionDays: number;
  autoEmptyTrash: boolean;
  cacheAutoClean: boolean;
}

export interface DeviceStorageStats {
  totalStorage: number;
  freeStorage: number;
  usedStorage: number;
  totalRam: number;
  freeRam: number;
  usedRam: number;
}

declare global {
  interface Window {
    RohitNativeBridge?: {
      isNativeAndroid: () => boolean;
      checkStoragePermissions: () => boolean;
      requestStoragePermissions: () => void;
      getDeviceMedia: (category: string) => string;
      getStorageStats: () => string;
      deleteMediaItem: (contentUri: string) => boolean;
    };
  }
}
