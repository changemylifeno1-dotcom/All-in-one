import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { PhotoGalleryView } from './components/gallery/PhotoGalleryView';
import { FileManagerView } from './components/files/FileManagerView';
import { PrivateVaultView } from './components/vault/PrivateVaultView';
import { RecycleBinView } from './components/files/RecycleBinView';
import { DocumentReaderView } from './components/documents/DocumentReaderView';
import { VideoPlayerView } from './components/player/VideoPlayerView';
import { FileDetailsModal } from './components/files/FileDetailsModal';
import { APKDownloadModal } from './components/apk/APKDownloadModal';
import { SettingsView } from './components/settings/SettingsView';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    activeVideo, 
    setActiveVideo, 
    activeDoc, 
    setActiveDoc,
    theme,
    toastMessage,
    setIsAPKModalOpen
  } = useApp();

  // Check URL parameters for direct install center trigger
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('install') === '1' || params.has('apk')) {
        setIsAPKModalOpen(true);
      }
    }
  }, [setIsAPKModalOpen]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-zinc-100' : 'bg-slate-50 text-zinc-900'} flex flex-col transition-colors duration-200`}>
      {/* Top Header */}
      <Header />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'videos' && <FileManagerView initialCategory="video" />}
        {activeTab === 'photos' && <PhotoGalleryView />}
        {activeTab === 'music' && <FileManagerView initialCategory="audio" />}
        {activeTab === 'documents' && <DocumentReaderView />}
        {activeTab === 'files' && <FileManagerView initialCategory="all" />}
        {activeTab === 'vault' && <PrivateVaultView />}
        {activeTab === 'trash' && <RecycleBinView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav />

      {/* Android-style Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 text-zinc-100 text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fullscreen Video Player Modal */}
      {activeVideo && (
        <VideoPlayerView
          item={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {/* Fullscreen Document Viewer Modal */}
      {activeDoc && (
        <DocumentReaderView
          item={activeDoc}
          onClose={() => setActiveDoc(null)}
        />
      )}

      {/* File Details Modal */}
      <FileDetailsModal />

      {/* APK Build & Download Center Modal */}
      <APKDownloadModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
