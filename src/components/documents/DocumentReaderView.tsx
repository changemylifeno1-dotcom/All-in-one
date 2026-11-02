import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Bookmark, 
  Search, 
  X,
  Lock,
  Unlock,
  KeyRound,
  FileCheck,
  ArrowLeft,
  Share2,
  FolderOpen
} from 'lucide-react';

export const DocumentReaderView: React.FC<{ item?: MediaItem; onClose?: () => void }> = ({ item, onClose }) => {
  const { files, activeDoc, setActiveDoc, setActiveTab, t, language } = useApp();
  
  // Available document files
  const docFiles = files.filter(f => f.category === 'document' && !f.isInVault && !f.isDeleted);
  
  // Current document
  const [selectedDoc, setSelectedDoc] = useState<MediaItem | null>(item || activeDoc || docFiles[0] || null);
  
  // Reader states
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [docSearch, setDocSearch] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Password protection state for secure PDFs
  const isDocProtected = selectedDoc?.name.toLowerCase().includes('secure') || selectedDoc?.name.toLowerCase().includes('confidential');
  const [isUnlocked, setIsUnlocked] = useState(!isDocProtected);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Valid sample document password: 1234 or rohit
    if (passwordInput === '1234' || passwordInput.toLowerCase() === 'rohit') {
      setIsUnlocked(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  const isModal = Boolean(onClose);

  // If no document is selected and we are in Tab mode, render document list
  if (!selectedDoc) {
    return (
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">
              {language === 'hi' ? 'दस्तावेज़ व PDF रीडर' : 'Documents & PDF Reader'}
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            {docFiles.length} {language === 'hi' ? 'दस्तावेज़' : 'files'}
          </span>
        </div>

        {docFiles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2">
            <FileText className="w-12 h-12 text-zinc-600 mx-auto" />
            <p className="text-sm text-zinc-400">
              {language === 'hi' ? 'कोई दस्तावेज़ उपलब्ध नहीं है' : 'No documents found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {docFiles.map(doc => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc);
                  setCurrentPage(1);
                  setIsUnlocked(!doc.name.toLowerCase().includes('secure'));
                }}
                className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 transition cursor-pointer flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-zinc-100 truncate group-hover:text-blue-300">
                    {doc.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-1">
                    <span>PDF</span>
                    <span>•</span>
                    <span>{(doc.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const containerClasses = isModal
    ? "fixed inset-0 z-50 bg-black/95 flex flex-col justify-between select-none"
    : "rounded-3xl bg-zinc-950 border border-zinc-800/80 overflow-hidden flex flex-col min-h-[75vh] shadow-2xl select-none mb-20";

  return (
    <div className={containerClasses}>
      {/* Top Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-800 bg-zinc-950 text-white">
        <div className="flex items-center gap-3 min-w-0">
          {isModal ? (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setSelectedDoc(null)}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition"
              title="All Documents"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0">
            <h3 className="text-sm font-bold truncate max-w-xs md:max-w-md">
              {selectedDoc.name}
            </h3>
            <p className="text-[10px] text-zinc-400">
              PDF • {(selectedDoc.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>

        {/* Page Nav & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-zinc-900 rounded-xl p-0.5 border border-zinc-800">
            <button
              onClick={() => setZoomLevel(z => Math.max(60, z - 15))}
              className="p-1.5 text-zinc-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-zinc-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(z => Math.min(200, z + 15))}
              className="p-1.5 text-zinc-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition ${
              isBookmarked ? 'text-amber-400 border-amber-500/50' : 'text-zinc-400 hover:text-white'
            }`}
            title="Bookmark"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Main Document Content Area */}
      {!isUnlocked ? (
        /* PASSWORD PROMPT MODAL FOR PROTECTED PDFS */
        <div className="flex-1 flex items-center justify-center p-6 bg-zinc-900/40">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'hi' ? 'पासवर्ड सुरक्षित PDF' : 'Password Protected PDF'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {language === 'hi' 
                  ? 'यह दस्तावेज़ एन्क्रिप्टेड है। खोलने के लिए पासवर्ड दर्ज करें।' 
                  : 'This document is protected. Enter password to view content.'}
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-3">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                placeholder={language === 'hi' ? 'पासवर्ड दर्ज करें (उदा. 1234)' : 'Enter password (e.g. 1234)'}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white text-center font-mono focus:outline-none focus:border-indigo-500"
              />

              {passwordError && (
                <p className="text-[11px] text-rose-400 font-semibold">
                  {language === 'hi' ? 'गलत पासवर्ड! कृपया पुनः प्रयास करें।' : 'Incorrect password! Try 1234 or rohit.'}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{language === 'hi' ? 'दस्तावेज़ अनलॉक करें' : 'Unlock Document'}</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ACTIVE PDF CANVAS VIEW */
        <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-zinc-900/50">
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-200"
          >
            {/* Clean styled PDF page rendering */}
            <div className="w-[340px] sm:w-[500px] md:w-[650px] min-h-[700px] md:min-h-[850px] bg-white text-zinc-900 p-8 md:p-12 rounded-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-zinc-200">
                <div>
                  <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                    ROHIT ONE ECOSYSTEM
                  </span>
                  <h1 className="text-xl md:text-2xl font-black text-zinc-950 mt-1">
                    {selectedDoc.name.replace(/\.[^/.]+$/, "")}
                  </h1>
                </div>
                <div className="text-right text-xs text-zinc-500 font-mono">
                  SEC-DOC-2026<br />
                  Page {currentPage} of {totalPages}
                </div>
              </div>

              <div className="space-y-4 text-xs md:text-sm text-zinc-700 leading-relaxed">
                <h2 className="font-bold text-zinc-900 text-base">
                  1. Offline-First Privacy & Hardware Encryption
                </h2>
                <p>
                  ROHIT ONE operates entirely inside local device sandboxes. No advertising SDKs, tracking libraries, or telemetry frameworks are bundled within the release build. File operations interface directly with Android Storage Access Framework (SAF) and native Keystore.
                </p>

                <h2 className="font-bold text-zinc-900 text-base">
                  2. Intelligent Audio Language Selection (Hindi Priority)
                </h2>
                <p>
                  The native AndroidX Media3 ExoPlayer integration parses ISO 639-2 language tags (`hi`, `hin`) across all interleaved audio streams. When a multilingual container (e.g. MKV/MP4 with Dolby Atmos or 5.1 Surround) is loaded, the player automatically re-routes playback to the Hindi track without requiring manual user intervention.
                </p>

                <h2 className="font-bold text-zinc-900 text-base">
                  3. Dual Lock Mechanism & AMOLED True Black UI
                </h2>
                <p>
                  Mode 1 locks interface controls to prevent accidental menu triggers during active playback, while Mode 2 engages full touch surface locking. AMOLED display buffers utilize true black (#000000) primitives to maximize battery longevity on OLED panels.
                </p>
              </div>

              <div className="pt-8 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-400">
                <span>Confidential & Personal Use</span>
                <span>ROHIT ONE Version 1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Page Navigation Bar */}
      {isUnlocked && (
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-white text-xs max-w-lg mx-auto w-full">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="font-mono text-zinc-300">
            {t.page} {currentPage} {t.ofPages} {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
