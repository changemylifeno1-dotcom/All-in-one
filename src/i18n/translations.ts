export interface Translations {
  appName: string;
  tagline: string;
  // Tabs
  home: string;
  videos: string;
  photos: string;
  music: string;
  documents: string;
  allFiles: string;
  vault: string;
  trash: string;
  settings: string;
  apkDownload: string;
  apkDownloadBtn: string;
  
  // Dashboard
  searchPlaceholder: string;
  internalStorage: string;
  storageUsed: string;
  freeSpace: string;
  recentFiles: string;
  quickFolders: string;
  favorites: string;
  viewAll: string;
  addFiles: string;
  
  // File Categories
  catVideos: string;
  catPhotos: string;
  catAudio: string;
  catDocuments: string;
  catArchives: string;
  catAll: string;
  
  // Folders
  folderCamera: string;
  folderDownloads: string;
  folderMovies: string;
  folderMusic: string;
  folderWhatsApp: string;
  
  // File Manager
  sortBy: string;
  sortName: string;
  sortDate: string;
  sortSize: string;
  sortType: string;
  gridView: string;
  listView: string;
  select: string;
  selectAll: string;
  cancel: string;
  delete: string;
  deleteConfirm: string;
  rename: string;
  details: string;
  moveToVault: string;
  unhideFromVault: string;
  fileDetails: string;
  fileName: string;
  fileSize: string;
  fileLocation: string;
  dateModified: string;
  resolution: string;
  duration: string;
  mimeType: string;
  close: string;
  
  // Video Player
  playerTitle: string;
  audioTrack: string;
  subtitles: string;
  hindiPriorityApplied: string;
  speed: string;
  aspectRatio: string;
  lockInterface: string;
  lockTouch: string;
  unlockHint: string;
  brightness: string;
  volume: string;
  speedBooster: string;
  aiDubbing: string;
  aiDubbingDesc: string;
  fitToScreen: string;
  cropToFill: string;
  originalAspect: string;
  rewind10: string;
  forward10: string;
  
  // Photo Gallery & Editor
  editPhoto: string;
  saveCopy: string;
  savedSuccess: string;
  crop: string;
  rotate: string;
  adjust: string;
  filters: string;
  draw: string;
  text: string;
  shapes: string;
  stickers: string;
  contrast: string;
  saturation: string;
  warmth: string;
  undo: string;
  redo: string;
  brushColor: string;
  brushSize: string;
  addTextPrompt: string;
  
  // Document Reader
  documentTitle: string;
  page: string;
  ofPages: string;
  zoomIn: string;
  zoomOut: string;
  fitPage: string;
  searchDoc: string;
  
  // Private Vault
  vaultTitle: string;
  vaultSubtitle: string;
  enterPin: string;
  createPin: string;
  wrongPin: string;
  unlockBiometric: string;
  biometricSuccess: string;
  biometricFailed: string;
  lockNow: string;
  noVaultFiles: string;
  vaultEncryptedBadge: string;

  // Recycle Bin / Trash
  trashTitle: string;
  trashSubtitle: string;
  restore: string;
  restoreAll: string;
  restoreSuccess: string;
  deletePermanently: string;
  deletePermanentlyConfirm: string;
  emptyTrash: string;
  emptyTrashConfirm: string;
  emptyTrashSuccess: string;
  dateDeleted: string;
  daysRemaining: string;
  originalLocation: string;
  noTrashFiles: string;
  trashRetentionNotice: string;
  movedToTrash: string;
  storagePermissionMsg: string;
  
  // APK Build & Install Center
  apkCenterTitle: string;
  apkCenterSubtitle: string;
  installWebApkTitle: string;
  installWebApkDesc: string;
  installWebApkBtn: string;
  downloadZipTitle: string;
  downloadZipDesc: string;
  downloadZipBtn: string;
  githubBuildTitle: string;
  githubBuildDesc: string;
  copyWorkflowBtn: string;
  qrCodeTitle: string;
  qrCodeDesc: string;
  alreadyInstalled: string;
  
  // Settings & Customization
  language: string;
  langHindi: string;
  langEnglish: string;
  theme: string;
  themeDark: string;
  themeLight: string;
  themeSystem: string;
  accentColor: string;
  homeLayout: string;
  thumbnailSize: string;
  videoSettings: string;
  defaultAudioLang: string;
  seekInterval: string;
  gestureSensitivity: string;
  brightnessVolumeGestures: string;
  photoGalleryPrefs: string;
  fileManagerPrefs: string;
  privacySecurity: string;
  vaultAutoLock: string;
  recycleBinSettings: string;
  trashRetentionDays: string;
  autoCleanup: string;
  clearCache: string;
  cacheCleared: string;
  aboutTitle: string;
  version: string;
  privacyGuarantee: string;
  settingsSaved: string;
}

export const translations: Record<'hi' | 'en', Translations> = {
  hi: {
    appName: "ROHIT ONE",
    tagline: "आपकी ज़रूरत की हर चीज़। एक सुरक्षित जगह।",
    home: "होम",
    videos: "वीडियो",
    photos: "फ़ोटो",
    music: "म्यूज़िक",
    documents: "दस्तावेज़",
    allFiles: "सभी फ़ाइलें",
    vault: "प्राइवेट वॉल्ट",
    trash: "रीसायकल बिन",
    settings: "सेटिंग्स",
    apkDownload: "APK बिल्ड व डाउनलोड",
    apkDownloadBtn: "APK डाउनलोड करें",

    searchPlaceholder: "वीडियो, फ़ोटो, गाने और फ़ाइलें खोजें...",
    internalStorage: "इंटरनल स्टोरेज",
    storageUsed: "उपयोग किया गया स्टोरेज",
    freeSpace: "खाली स्थान",
    recentFiles: "हाल ही में खोली गई फ़ाइलें",
    quickFolders: "ज़रूरी फ़ोल्डर्स",
    favorites: "पसंदीदा",
    viewAll: "सभी देखें",
    addFiles: "फ़ाइलें जोड़ें",

    catVideos: "वीडियो",
    catPhotos: "फ़ोटो",
    catAudio: "ऑडियो",
    catDocuments: "दस्तावेज़",
    catArchives: "ज़िप / आर्काइव",
    catAll: "सभी फ़ाइलें",

    folderCamera: "कैमरा",
    folderDownloads: "डाउनलोड्स",
    folderMovies: "मूवीज़",
    folderMusic: "म्यूज़िक",
    folderWhatsApp: "व्हाट्सएप मीडिया",

    sortBy: "क्रमबद्ध करें",
    sortName: "नाम (A to Z)",
    sortDate: "तारीख (नई पहले)",
    sortSize: "साइज़ (बड़ी पहले)",
    sortType: "फ़ाइल प्रकार",
    gridView: "ग्रिड दृश्य",
    listView: "सूची दृश्य",
    select: "चुनें",
    selectAll: "सभी चुनें",
    cancel: "रद्द करें",
    delete: "ट्रैश में डालें",
    deleteConfirm: "क्या आप इस फ़ाइल को रीसायकल बिन में भेजना चाहते हैं?",
    rename: "नाम बदलें",
    details: "विवरण",
    moveToVault: "वॉल्ट में छुपाएं",
    unhideFromVault: "वॉल्ट से बाहर निकालें",
    fileDetails: "फ़ाइल का विवरण",
    fileName: "फ़ाइल का नाम",
    fileSize: "साइज़",
    fileLocation: "स्थान",
    dateModified: "संशोधित तारीख",
    resolution: "रिज़ॉल्यूशन / आयाम",
    duration: "कुल समय (अवधि)",
    mimeType: "फ़ाइल फॉर्मेट (MIME)",
    close: "बंद करें",

    playerTitle: "प्रीमियम वीडियो प्लेयर",
    audioTrack: "ऑडियो ट्रैक",
    subtitles: "सबटाइटल्स",
    hindiPriorityApplied: "हिंदी ऑडियो ट्रैक स्वचालित रूप से चुना गया",
    speed: "प्लेबैक स्पीड",
    aspectRatio: "स्क्रीन अनुपात",
    lockInterface: "इंटरफ़ेस लॉक (जेस्चर चालू)",
    lockTouch: "स्क्रीन टच लॉक (पूरी स्क्रीन लॉक)",
    unlockHint: "अनलॉक करने के लिए दो बार टैप करें",
    brightness: "ब्राइटनेस",
    volume: "आवाज़",
    speedBooster: "2x स्पीड चालू",
    aiDubbing: "AI हिंदी डबिंग / भाषा रूपांतरण",
    aiDubbingDesc: "अगर वीडियो में हिंदी ऑडियो नहीं है, तो AI द्वारा हिंदी वॉयस तैयार करें।",
    fitToScreen: "स्क्रीन में फिट करें",
    cropToFill: "पूरी स्क्रीन भरें (Crop)",
    originalAspect: "मूल अनुपात (Original)",
    rewind10: "10 सेकेंड पीछे",
    forward10: "10 सेकेंड आगे",

    editPhoto: "फ़ोटो एडिट करें",
    saveCopy: "नई कॉपी सुरक्षित करें",
    savedSuccess: "नई फ़ोटो सुरक्षित हो गई!",
    crop: "क्रॉप",
    rotate: "घुमाएं (Rotate)",
    adjust: "रंग व चमक",
    filters: "फ़िल्टर",
    draw: "पेंसिल / ब्रश",
    text: "टेक्स्ट जोड़ें",
    shapes: "आकृतियां (Shapes)",
    stickers: "स्टिकर्स",
    contrast: "कंट्रास्ट",
    saturation: "सैचुरेशन",
    warmth: "वॉर्मथ",
    undo: "पूर्ववत (Undo)",
    redo: "फिर से (Redo)",
    brushColor: "रंग",
    brushSize: "मोटाई",
    addTextPrompt: "अपना टेक्स्ट लिखें...",

    documentTitle: "दस्तावेज़ व PDF रीडर",
    page: "पेज",
    ofPages: "कुल",
    zoomIn: "बड़ा करें",
    zoomOut: "छोटा करें",
    fitPage: "पेज फिट",
    searchDoc: "दस्तावेज़ में खोजें...",

    vaultTitle: "प्राइवेट वॉल्ट (Private Vault)",
    vaultSubtitle: "हार्डवेयर एन्क्रिप्शन के साथ आपकी निजी फाइलें पूरी तरह सुरक्षित",
    enterPin: "4 अंकों का सुरक्षा पिन दर्ज करें",
    createPin: "नया 4 अंकों का पिन सेट करें",
    wrongPin: "गलत पिन! कृपया पुनः प्रयास करें।",
    unlockBiometric: "फिंगरप्रिंट / फेस अनलॉक",
    biometricSuccess: "बायोमेट्रिक प्रमाणीकरण सफल!",
    biometricFailed: "बायोमेट्रिक पहचान नहीं हो सकी",
    lockNow: "वॉल्ट लॉक करें",
    noVaultFiles: "वॉल्ट में अभी कोई फ़ाइल नहीं है। अपनी निजी फ़ोटो या वीडियो यहाँ छुपाएं।",
    vaultEncryptedBadge: "AES-256 एन्क्रिप्टेड",

    trashTitle: "रीसायकल बिन (Recycle Bin)",
    trashSubtitle: "डिलीट की गई फ़ाइलें 30 दिनों तक सुरक्षित रहती हैं। इसके बाद स्वतः हट जाती हैं।",
    restore: "वापस लाएं (Restore)",
    restoreAll: "सभी फ़ाइलें रिस्टोर करें",
    restoreSuccess: "फ़ाइल को अपने मूल फ़ोल्डर में सफलतापूर्वक रिस्टोर कर दिया गया है!",
    deletePermanently: "हमेशा के लिए हटाएं",
    deletePermanentlyConfirm: "क्या आप वाकई इस फ़ाइल को हमेशा के लिए हटाना चाहते हैं? यह क्रिया वापस नहीं होगी।",
    emptyTrash: "रीसायकल बिन खाली करें",
    emptyTrashConfirm: "क्या आप रीसायकल बिन की सभी फ़ाइलें हमेशा के लिए हटाना चाहते हैं?",
    emptyTrashSuccess: "रीसायकल बिन खाली कर दिया गया!",
    dateDeleted: "डिलीट करने की तारीख",
    daysRemaining: "दिन शेष",
    originalLocation: "मूल फ़ोल्डर",
    noTrashFiles: "रीसायकल बिन खाली है। यहाँ कोई डिलीट की गई फ़ाइल नहीं है।",
    trashRetentionNotice: "फ़ाइलें 30 दिनों बाद स्वतः हमेशा के लिए हट जाएंगी।",
    movedToTrash: "फ़ाइल रीसायकल बिन में भेज दी गई (30 दिनों में स्वतः हटेगी)",
    storagePermissionMsg: "Android स्टोरेज परमिशन की आवश्यकता है। कृपया फ़ाइल एक्सेस अनुमति दें।",

    apkCenterTitle: "ROHIT ONE APK बिल्ड और डाउनलोड केंद्र",
    apkCenterSubtitle: "अपने फ़ोन पर ऐप इंस्टॉल करें या 100% मुफ़्त में सीधा APK तैयार करें",
    installWebApkTitle: "1. फ़ोन में डायरेक्ट ऐप इंस्टॉल करें (WebAPK)",
    installWebApkDesc: "बिना किसी डाउनलोड के सीधे होम स्क्रीन पर असली Android ऐप की तरह इंस्टॉल करें (ऑफ़लाइन और फुलस्क्रीन चलेगी)।",
    installWebApkBtn: "फ़ोन में इंस्टॉल करें (Install App)",
    downloadZipTitle: "2. संपूर्ण Android प्रोजेक्ट पैकेज डाउनलोड करें (ZIP)",
    downloadZipDesc: "तैयार Android Studio / Gradle / Flutter प्रोजेक्ट की ZIP फ़ाइल तुरंत डाउनलोड करें।",
    downloadZipBtn: "प्रोजेक्ट ZIP डाउनलोड करें",
    githubBuildTitle: "3. मुफ़्त GitHub Actions Cloud APK बिल्डर",
    githubBuildDesc: "GitHub के क्लाउड सर्वर पर सिर्फ एक क्लिक में `ROHIT-ONE.apk` बिल्ड करें और सीधे डाउनलोड करें।",
    copyWorkflowBtn: "बिल्ड कोड कॉपी करें",
    qrCodeTitle: "4. फ़ोन से QR कोड स्कैन करें",
    qrCodeDesc: "अपने मोबाइल कैमरे से यह QR स्कैन करें और तुरंत ऐप खोलें।",
    alreadyInstalled: "ऐप पहले से ही आपके डिवाइस में इंस्टॉल्ड है!",

    language: "भाषा (Language)",
    langHindi: "हिंदी (Hindi)",
    langEnglish: "English (अंग्रेज़ी)",
    theme: "थीम (Theme)",
    themeDark: "डार्क मोड (AMOLED Black)",
    themeLight: "लाइट मोड (Clean White)",
    themeSystem: "सिस्टम के अनुसार",
    accentColor: "एक्सेन्ट रंग (Accent Color)",
    homeLayout: "होम स्क्रीन लेआउट",
    thumbnailSize: "थंबनेल का आकार",
    videoSettings: "वीडियो प्लेयर सेटिंग्स",
    defaultAudioLang: "प्राथमिक ऑडियो भाषा (Hindi Priority)",
    seekInterval: "सीक अंतराल (Seek Interval)",
    gestureSensitivity: "जेस्चर संवेदनशीलता (Gesture Sensitivity)",
    brightnessVolumeGestures: "ब्राइटनेस व वॉल्यूम जेस्चर्स",
    photoGalleryPrefs: "फ़ोटो गैलरी प्राथमिकताएँ",
    fileManagerPrefs: "फ़ाइल मैनेजर प्राथमिकताएँ",
    privacySecurity: "गोपनीयता व सुरक्षा",
    vaultAutoLock: "वॉल्ट ऑटो-लॉक",
    recycleBinSettings: "रीसायकल बिन सेटिंग्स",
    trashRetentionDays: "ट्रैश फ़ाइलें रखने की अवधि",
    autoCleanup: "स्वचालित कैशे सफ़ाई",
    clearCache: "कैश साफ़ करें",
    cacheCleared: "कैश सफलतापूर्वक साफ़ किया गया!",
    aboutTitle: "ROHIT ONE के बारे में",
    version: "संस्करण 1.0.0 (रिलीज़ बिल्ड)",
    privacyGuarantee: "100% गोपनीयता: कोई विज्ञापन नहीं, कोई ट्रैकिंग नहीं, सभी डेटा आपके डिवाइस पर रहता है।",
    settingsSaved: "सेटिंग्स सुरक्षित कर ली गईं!"
  },
  en: {
    appName: "ROHIT ONE",
    tagline: "Everything You Need. One Private Place.",
    home: "Home",
    videos: "Videos",
    photos: "Photos",
    music: "Music",
    documents: "Documents",
    allFiles: "All Files",
    vault: "Private Vault",
    trash: "Recycle Bin",
    settings: "Settings",
    apkDownload: "APK Build & Download",
    apkDownloadBtn: "Download APK",

    searchPlaceholder: "Search videos, photos, music, files...",
    internalStorage: "Internal Storage",
    storageUsed: "Storage Used",
    freeSpace: "Free Space",
    recentFiles: "Recently Opened",
    quickFolders: "Quick Folders",
    favorites: "Favorites",
    viewAll: "View All",
    addFiles: "Add Files",

    catVideos: "Videos",
    catPhotos: "Photos",
    catAudio: "Audio",
    catDocuments: "Documents",
    catArchives: "Archives (ZIP)",
    catAll: "All Files",

    folderCamera: "Camera",
    folderDownloads: "Downloads",
    folderMovies: "Movies",
    folderMusic: "Music",
    folderWhatsApp: "WhatsApp Media",

    sortBy: "Sort By",
    sortName: "Name (A to Z)",
    sortDate: "Date (Newest First)",
    sortSize: "Size (Largest First)",
    sortType: "File Type",
    gridView: "Grid View",
    listView: "List View",
    select: "Select",
    selectAll: "Select All",
    cancel: "Cancel",
    delete: "Move to Trash",
    deleteConfirm: "Are you sure you want to move this file to Recycle Bin?",
    rename: "Rename",
    details: "Details",
    moveToVault: "Move to Vault",
    unhideFromVault: "Restore from Vault",
    fileDetails: "File Details",
    fileName: "File Name",
    fileSize: "Size",
    fileLocation: "Location",
    dateModified: "Date Modified",
    resolution: "Resolution / Dimensions",
    duration: "Duration",
    mimeType: "MIME Type",
    close: "Close",

    playerTitle: "Premium Video Player",
    audioTrack: "Audio Track",
    subtitles: "Subtitles",
    hindiPriorityApplied: "Hindi audio track automatically selected",
    speed: "Playback Speed",
    aspectRatio: "Aspect Ratio",
    lockInterface: "Interface Lock (Gestures Active)",
    lockTouch: "Total Touch Lock (Screen Locked)",
    unlockHint: "Double tap to unlock",
    brightness: "Brightness",
    volume: "Volume",
    speedBooster: "2x Speed Active",
    aiDubbing: "AI Hindi Dubbing & Translation",
    aiDubbingDesc: "Generate synchronized Hindi dubbing if the file lacks a native Hindi track.",
    fitToScreen: "Fit to Screen",
    cropToFill: "Crop to Fill",
    originalAspect: "Original Aspect",
    rewind10: "Rewind 10s",
    forward10: "Forward 10s",

    editPhoto: "Edit Photo",
    saveCopy: "Save as Copy",
    savedSuccess: "Edited photo saved successfully!",
    crop: "Crop",
    rotate: "Rotate",
    adjust: "Adjustments",
    filters: "Filters",
    draw: "Brush / Draw",
    text: "Add Text",
    shapes: "Shapes",
    stickers: "Stickers",
    contrast: "Contrast",
    saturation: "Saturation",
    warmth: "Warmth",
    undo: "Undo",
    redo: "Redo",
    brushColor: "Color",
    brushSize: "Size",
    addTextPrompt: "Enter text here...",

    documentTitle: "Document & PDF Reader",
    page: "Page",
    ofPages: "of",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    fitPage: "Fit Page",
    searchDoc: "Search in document...",

    vaultTitle: "Private Vault",
    vaultSubtitle: "Hardware-grade AES-256 local encrypted protection for your private files",
    enterPin: "Enter 4-Digit Security PIN",
    createPin: "Set New 4-Digit PIN",
    wrongPin: "Incorrect PIN! Please try again.",
    unlockBiometric: "Fingerprint / Face Unlock",
    biometricSuccess: "Biometric authentication successful!",
    biometricFailed: "Biometric authentication failed",
    lockNow: "Lock Vault",
    noVaultFiles: "No encrypted files in vault. Move private photos or videos here.",
    vaultEncryptedBadge: "AES-256 Encrypted",

    trashTitle: "Recycle Bin",
    trashSubtitle: "Deleted files are kept for 30 days before permanent removal.",
    restore: "Restore",
    restoreAll: "Restore All",
    restoreSuccess: "File successfully restored to original location!",
    deletePermanently: "Delete Permanently",
    deletePermanentlyConfirm: "Are you sure you want to permanently delete this file? This cannot be undone.",
    emptyTrash: "Empty Trash",
    emptyTrashConfirm: "Are you sure you want to permanently delete all items in Recycle Bin?",
    emptyTrashSuccess: "Recycle Bin emptied successfully!",
    dateDeleted: "Date Deleted",
    daysRemaining: "Days Remaining",
    originalLocation: "Original Location",
    noTrashFiles: "Recycle Bin is empty. No deleted files found.",
    trashRetentionNotice: "Items are automatically permanently deleted after 30 days.",
    movedToTrash: "File moved to Recycle Bin (30-day auto-expiry)",
    storagePermissionMsg: "Storage permission required. Please grant storage access.",

    apkCenterTitle: "ROHIT ONE APK Build & Download Center",
    apkCenterSubtitle: "Install directly on your phone or build standalone APK for 100% free",
    installWebApkTitle: "1. Install Direct Android App (WebAPK)",
    installWebApkDesc: "Install directly to your Android home screen with zero download time. Works offline with AMOLED theme.",
    installWebApkBtn: "Install App on Phone",
    downloadZipTitle: "2. Download Complete Android Project Package (ZIP)",
    downloadZipDesc: "Instant download of the complete Android Studio / Gradle / Flutter source code archive.",
    downloadZipBtn: "Download Project ZIP",
    githubBuildTitle: "3. Free GitHub Actions Cloud APK Builder",
    githubBuildDesc: "Compile the APK on GitHub's free cloud runners and download `ROHIT-ONE.apk` directly.",
    copyWorkflowBtn: "Copy Build Workflow",
    qrCodeTitle: "4. Scan QR Code on Mobile",
    qrCodeDesc: "Scan with your phone camera to launch ROHIT ONE directly on Android.",
    alreadyInstalled: "Application is already installed on this device!",

    language: "Language",
    langHindi: "हिंदी (Hindi)",
    langEnglish: "English",
    theme: "Theme",
    themeDark: "Dark Mode (AMOLED Black)",
    themeLight: "Light Mode (Clean White)",
    themeSystem: "Follow System",
    accentColor: "Accent Color",
    homeLayout: "Home Screen Layout",
    thumbnailSize: "Thumbnail Size",
    videoSettings: "Video Player Preferences",
    defaultAudioLang: "Preferred Audio Language (Hindi Priority)",
    seekInterval: "Seek Interval",
    gestureSensitivity: "Gesture Sensitivity",
    brightnessVolumeGestures: "Brightness & Volume Gestures",
    photoGalleryPrefs: "Photo Gallery Preferences",
    fileManagerPrefs: "File Manager Preferences",
    privacySecurity: "Privacy & Security",
    vaultAutoLock: "Vault Auto-Lock",
    recycleBinSettings: "Recycle Bin Settings",
    trashRetentionDays: "Trash Retention Period",
    autoCleanup: "Automatic Cache Cleanup",
    clearCache: "Clear Cache",
    cacheCleared: "Cache cleared successfully!",
    aboutTitle: "About ROHIT ONE",
    version: "Version 1.0.0 (Release Build)",
    privacyGuarantee: "100% Private: No ads, no tracking, zero telemetry. All files stay strictly on your device.",
    settingsSaved: "Settings saved successfully!"
  }
};
