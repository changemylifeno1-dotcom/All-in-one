import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AccentColor } from '../../types';
import { 
  Languages, 
  Moon, 
  Sun, 
  Film, 
  ShieldCheck, 
  Trash2, 
  Download, 
  Info, 
  Sparkles, 
  Check, 
  Smartphone,
  HardDrive,
  Palette,
  Layout,
  Grid,
  List,
  Sliders,
  SlidersHorizontal,
  Lock,
  Clock,
  Eye,
  Volume2,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SettingsView: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    settings,
    updateSettings,
    setIsAPKModalOpen, 
    vaultPin,
    setVaultPin,
    setActiveTab,
    files,
    t 
  } = useApp();

  const [cacheMessage, setCacheMessage] = useState(false);
  const [editingPin, setEditingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const trashCount = files.filter(f => f.isDeleted).length;

  const handleClearCache = () => {
    confetti({ particleCount: 40, spread: 40 });
    setCacheMessage(true);
    setTimeout(() => setCacheMessage(false), 3000);
  };

  const handleSavePin = () => {
    if (newPinInput.length === 4) {
      setVaultPin(newPinInput);
      setEditingPin(false);
      setNewPinInput('');
      confetti({ particleCount: 30, spread: 30 });
    }
  };

  const accentColors: { id: AccentColor; label: string; bg: string; border: string }[] = [
    { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600', border: 'border-indigo-500' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600', border: 'border-emerald-500' },
    { id: 'violet', label: 'Violet', bg: 'bg-purple-600', border: 'border-purple-500' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-600', border: 'border-amber-500' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-600', border: 'border-rose-500' },
    { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-600', border: 'border-cyan-500' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-28 text-xs">
      {/* 1. Language System */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-5 space-y-3 shadow-xl">
        <div className="flex items-center gap-2.5">
          <Languages className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">{t.language}</h3>
            <p className="text-[11px] text-zinc-400">
              {language === 'hi' ? 'ऐप की मुख्य भाषा चुनें (हिंदी व अंग्रेज़ी)' : 'Select primary language (Hindi & English)'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setLanguage('hi')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between font-bold transition ${
              language === 'hi'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <span>🇮🇳 {t.langHindi}</span>
            {language === 'hi' && <Check className="w-4 h-4 text-indigo-400" />}
          </button>

          <button
            onClick={() => setLanguage('en')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between font-bold transition ${
              language === 'en'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <span>🌐 {t.langEnglish}</span>
            {language === 'en' && <Check className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* 2. Theme & Accent Color System */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <Palette className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-white">{t.theme} & {t.accentColor}</h3>
            <p className="text-[11px] text-zinc-400">
              {language === 'hi' ? 'AMOLED डार्क मोड, क्लीन लाइट मोड व पसंदीदा एक्सेन्ट रंग' : 'AMOLED true black, clean light mode & accents'}
            </p>
          </div>
        </div>

        {/* Theme Mode */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
              theme === 'dark'
                ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-black border border-zinc-700" />
            <span className="text-[11px]">{t.themeDark}</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
              theme === 'light'
                ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white border border-zinc-300" />
            <span className="text-[11px]">{t.themeLight}</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
              theme === 'system'
                ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-[11px]">{t.themeSystem}</span>
          </button>
        </div>

        {/* Accent Colors Palette */}
        <div className="pt-2 border-t border-zinc-900">
          <span className="text-zinc-300 font-semibold block mb-2">{t.accentColor}:</span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {accentColors.map((color) => (
              <button
                key={color.id}
                onClick={() => updateSettings({ accentColor: color.id })}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition ${
                  settings.accentColor === color.id
                    ? `${color.border} bg-zinc-900 text-white font-bold scale-105 shadow-md`
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${color.bg}`} />
                <span className="text-[11px] capitalize">{color.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recycle Bin / Trash System Settings (FEATURE 1 & 2) */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <Trash2 className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="text-sm font-bold text-white">{t.recycleBinSettings}</h3>
            <p className="text-[11px] text-zinc-400">
              {language === 'hi' 
                ? 'डिलीट की गई फ़ाइलों को सुरक्षित रखने की समय-सीमा (डिफ़ॉल्ट 30 दिन)'
                : 'Deleted files retention duration before permanent automatic deletion'}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* Retention Period Selection */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">{t.trashRetentionDays}</span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' 
                  ? 'इतने दिनों बाद रीसायकल बिन से फ़ाइलें स्वतः हमेशा के लिए हट जाएंगी' 
                  : 'Files automatically expire after this period'}
              </span>
            </div>
            <select
              value={settings.trashRetentionDays || 30}
              onChange={(e) => updateSettings({ trashRetentionDays: parseInt(e.target.value) })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200 font-bold focus:outline-none"
            >
              <option value="7">7 {language === 'hi' ? 'दिन' : 'Days'}</option>
              <option value="14">14 {language === 'hi' ? 'दिन' : 'Days'}</option>
              <option value="30">30 {language === 'hi' ? 'दिन (अनुशंसित)' : 'Days (Default)'}</option>
              <option value="60">60 {language === 'hi' ? 'दिन' : 'Days'}</option>
            </select>
          </div>

          {/* Auto-Empty Expired Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">
                {language === 'hi' ? 'समाप्त फ़ाइलों का स्वतः निष्कासन' : 'Auto-delete expired trash'}
              </span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'अवधि पूरी होने पर बैकग्राउंड में स्वतः हटाएगा' : 'Automatically purge items past retention window'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoEmptyTrash}
              onChange={(e) => updateSettings({ autoEmptyTrash: e.target.checked })}
              className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Video Player & Intelligent Audio Settings */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <Film className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">{t.videoSettings}</h3>
            <p className="text-[11px] text-zinc-400">
              {language === 'hi' ? 'हिंदी ऑडियो प्राथमिकता, प्लेबैक स्पीड व जेस्चर' : 'Hindi audio priority, speed & player gestures'}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* Default Audio Language (Hindi Priority) */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">{t.defaultAudioLang}</span>
              <span className="text-[11px] text-emerald-400">
                {language === 'hi' ? 'हिंदी ऑडियो मिलने पर स्वतः प्राथमिकता देता है' : 'Always auto-selects Hindi track when present'}
              </span>
            </div>
            <select
              value={settings.defaultAudioLanguage || 'hi'}
              onChange={(e) => updateSettings({ defaultAudioLanguage: e.target.value })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200 font-semibold"
            >
              <option value="hi">हिंदी (Hindi Priority)</option>
              <option value="en">English (Original)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Default Video Playback Speed */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">
                {language === 'hi' ? 'डिफ़ॉल्ट प्लेबैक स्पीड' : 'Default Playback Speed'}
              </span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'वीडियो शुरू होने की गति' : 'Initial video play rate'}
              </span>
            </div>
            <select
              value={settings.defaultVideoSpeed || 1.0}
              onChange={(e) => updateSettings({ defaultVideoSpeed: parseFloat(e.target.value) })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200 font-semibold"
            >
              <option value="0.75">0.75x</option>
              <option value="1.0">1.0x (Normal)</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2.0">2.0x</option>
            </select>
          </div>

          {/* Seek Interval */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">{t.seekInterval}</span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'डबल टैप सीक का समय' : 'Double tap seek interval'}
              </span>
            </div>
            <select
              value={settings.seekInterval || 10}
              onChange={(e) => updateSettings({ seekInterval: parseInt(e.target.value) })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200"
            >
              <option value="5">5s</option>
              <option value="10">10s (Standard)</option>
              <option value="15">15s</option>
              <option value="30">30s</option>
            </select>
          </div>

          {/* Brightness & Volume Gestures */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">{t.brightnessVolumeGestures}</span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'बाएँ स्वाइप से ब्राइटनेस व दाएँ स्वाइप से वॉल्यूम' : 'Swipe left for brightness, right for volume'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.enableGestures}
              onChange={(e) => updateSettings({ enableGestures: e.target.checked })}
              className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Gesture Sensitivity */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">{t.gestureSensitivity}</span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'स्क्रीन स्वाइप की संवेदनशीलता' : 'Touch drag response threshold'}
              </span>
            </div>
            <select
              value={settings.gestureSensitivity || 'medium'}
              onChange={(e) => updateSettings({ gestureSensitivity: e.target.value as any })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200"
            >
              <option value="low">{language === 'hi' ? 'कम (Low)' : 'Low'}</option>
              <option value="medium">{language === 'hi' ? 'मध्यम (Medium)' : 'Medium'}</option>
              <option value="high">{language === 'hi' ? 'अधिक (High)' : 'High'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Home Dashboard & File Manager Preferences */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <Layout className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white">{t.fileManagerPrefs}</h3>
            <p className="text-[11px] text-zinc-400">
              {language === 'hi' ? 'होम स्क्रीन लेआउट, थंबनेल आकार व डिफ़ॉल्ट छंटाई' : 'Home layout, thumbnail size & default sort'}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* Home Screen Layout */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">{t.homeLayout}</span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'होम स्क्रीन कार्ड का दृश्य' : 'Dashboard density and cards'}
              </span>
            </div>
            <select
              value={settings.homeLayout || 'standard'}
              onChange={(e) => updateSettings({ homeLayout: e.target.value as any })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200"
            >
              <option value="compact">{language === 'hi' ? 'कॉम्पैक्ट (Compact)' : 'Compact'}</option>
              <option value="standard">{language === 'hi' ? 'मानक (Standard)' : 'Standard'}</option>
              <option value="expanded">{language === 'hi' ? 'विस्तृत (Expanded)' : 'Expanded'}</option>
            </select>
          </div>

          {/* Default View Mode */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">
                {language === 'hi' ? 'डिफ़ॉल्ट दृश्य (View Mode)' : 'Default View Mode'}
              </span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'फ़ाइल मैनेजर का प्रारंभिक दृश्य' : 'Grid or List representation'}
              </span>
            </div>
            <div className="flex bg-zinc-900 rounded-xl p-0.5 border border-zinc-800">
              <button
                onClick={() => updateSettings({ defaultViewMode: 'grid' })}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  settings.defaultViewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-zinc-400'
                }`}
              >
                {t.gridView}
              </button>
              <button
                onClick={() => updateSettings({ defaultViewMode: 'list' })}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  settings.defaultViewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-zinc-400'
                }`}
              >
                {t.listView}
              </button>
            </div>
          </div>

          {/* Thumbnail Size */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">{t.thumbnailSize}</span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'गैलरी व ग्रिड में थंबनेल का आकार' : 'Size of preview cards'}
              </span>
            </div>
            <select
              value={settings.thumbnailSize || 'medium'}
              onChange={(e) => updateSettings({ thumbnailSize: e.target.value as any })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200"
            >
              <option value="small">{language === 'hi' ? 'छोटा (Small)' : 'Small'}</option>
              <option value="medium">{language === 'hi' ? 'मध्यम (Medium)' : 'Medium'}</option>
              <option value="large">{language === 'hi' ? 'बड़ा (Large)' : 'Large'}</option>
            </select>
          </div>

          {/* Default Sorting */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">{t.sortBy}</span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'फ़ाइलों को व्यवस्थित करने का क्रम' : 'Initial file ordering'}
              </span>
            </div>
            <select
              value={settings.defaultSortBy || 'date'}
              onChange={(e) => updateSettings({ defaultSortBy: e.target.value as any })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200"
            >
              <option value="date">{t.sortDate}</option>
              <option value="name">{t.sortName}</option>
              <option value="size">{t.sortSize}</option>
              <option value="type">{t.sortType}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. Privacy & Vault Settings */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="text-sm font-bold text-white">{t.privacySecurity}</h3>
            <p className="text-[11px] text-zinc-400">
              {language === 'hi' ? 'वॉल्ट पिन, बायोमेट्रिक व ऑटो-लॉक अवधि' : 'Vault PIN, biometric lock and timeout'}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* Change PIN */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">
                {language === 'hi' ? 'प्राइवेट वॉल्ट पिन' : 'Private Vault PIN'}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {language === 'hi' ? 'वर्तमान पिन सेट है' : 'Current PIN configured'}
              </span>
            </div>
            {editingPin ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="password"
                  maxLength={4}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="4 digits"
                  className="w-24 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-center text-xs font-mono text-white"
                />
                <button
                  onClick={handleSavePin}
                  disabled={newPinInput.length !== 4}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold disabled:opacity-40"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingPin(true)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold"
              >
                {language === 'hi' ? 'पिन बदलें' : 'Change PIN'}
              </button>
            )}
          </div>

          {/* Biometrics Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">{t.unlockBiometric}</span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'फ़िंगरप्रिंट या फ़ेस अनलॉक का उपयोग करें' : 'Enable device biometrics for vault'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.enableBiometrics}
              onChange={(e) => updateSettings({ enableBiometrics: e.target.checked })}
              className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Auto Lock Timer */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-200 font-semibold block">{t.vaultAutoLock}</span>
              <span className="text-[11px] text-zinc-400">
                {language === 'hi' ? 'निष्क्रिय रहने पर वॉल्ट लॉक होने का समय' : 'Lock timeout on inactivity'}
              </span>
            </div>
            <select
              value={settings.vaultAutoLock || '5m'}
              onChange={(e) => updateSettings({ vaultAutoLock: e.target.value as any })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200"
            >
              <option value="immediate">{language === 'hi' ? 'तुरंत (Immediate)' : 'Immediate'}</option>
              <option value="1m">1 {language === 'hi' ? 'मिनट' : 'Minute'}</option>
              <option value="5m">5 {language === 'hi' ? 'मिनट (अनुशंसित)' : 'Minutes (Default)'}</option>
              <option value="never">{language === 'hi' ? 'कभी नहीं' : 'Never'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 7. Recycle Bin (Recently Deleted) Submenu */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {language === 'hi' ? 'रीसायकल बिन (हाल ही में हटाए गए)' : 'Recycle Bin (Recently Deleted)'}
                </h3>
                {trashCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 font-mono text-[10px] font-bold">
                    {trashCount} {language === 'hi' ? 'फ़ाइलें' : 'items'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                {language === 'hi'
                  ? 'डिलीट की गई फ़ाइलें 30 दिनों तक सुरक्षित रहती हैं। यहाँ से कभी भी रिस्टोर करें।'
                  : 'Deleted files are retained for 30 days before permanent deletion. Restore anytime.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('trash')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs transition shadow-md shadow-rose-600/20 shrink-0 self-start sm:self-auto"
          >
            <span>{t.openRecycleBin}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-3 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{language === 'hi' ? '30-दिनों की ऑटो-रिटेंशन सुरक्षा' : '30-Day Auto Retention Guarantee'}</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{language === 'hi' ? '1-क्लिक मूल फ़ोल्डर रिस्टोर' : '1-Tap Original Location Restore'}</span>
          </div>
        </div>
      </div>

      {/* 8. APK Download & Install Center Launcher */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-emerald-950/60 border border-indigo-500/40 p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">{t.apkCenterTitle}</h3>
              <p className="text-[11px] text-zinc-300">
                {language === 'hi' ? 'सीधा WebAPK इंस्टॉलर और मुफ़्त क्लाउड बिल्डर' : 'Direct WebAPK and Free Cloud APK'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAPKModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/30"
          >
            {t.apkDownloadBtn}
          </button>
        </div>
      </div>

      {/* 8. Storage, Cache & Cleanup */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">{t.autoCleanup}</h3>
            <p className="text-[11px] text-zinc-400">
              {t.privacyGuarantee}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-zinc-200 font-semibold block">{t.clearCache}</span>
            <span className="text-[11px] text-zinc-500">
              {language === 'hi' ? 'थंबनेल और अस्थायी कैश मिटाएं' : 'Free temporary thumbnails'}
            </span>
          </div>
          <button
            onClick={handleClearCache}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium transition"
          >
            {t.clearCache}
          </button>
        </div>

        {cacheMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            {t.cacheCleared}
          </div>
        )}
      </div>

      {/* 9. About App */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-5 space-y-2 text-center text-zinc-400 shadow-xl">
        <h4 className="text-sm font-black text-white">ROHIT ONE</h4>
        <p className="text-[11px] text-zinc-400">{t.version}</p>
        <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed pt-1">
          {language === 'hi' 
            ? 'प्रीमियम पर्सनल मीडिया इकोसिस्टम। बिना विज्ञापन, बिना ट्रैकिंग, 100% सुरक्षित और स्थानीय।'
            : 'Premium Personal Media Ecosystem. Zero ads, zero tracking, 100% private and local.'}
        </p>
      </div>
    </div>
  );
};
