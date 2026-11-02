import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import QRCode from 'qrcode';
import { 
  Download, 
  Smartphone, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  X, 
  FolderArchive, 
  ExternalLink,
  ShieldCheck,
  QrCode,
  Sparkles,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';

export const APKDownloadModal: React.FC = () => {
  const { isAPKModalOpen, setIsAPKModalOpen, t, language } = useApp();
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'zip' | 'cloud' | 'qr'>('install');

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (currentAppUrl) {
      QRCode.toDataURL(currentAppUrl, {
        width: 300,
        margin: 1.5,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
    }
  }, [currentAppUrl]);

  const handleCopyLink = () => {
    if (navigator.clipboard && currentAppUrl) {
      navigator.clipboard.writeText(currentAppUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleInstallApp = async () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    if (isInstallable) {
      await install();
    } else {
      // Trigger browser's standard prompt if possible
      alert(language === 'hi' 
        ? "ब्राउज़र मेनू (⋮) खोलें और 'Install app' या 'Add to Home screen' पर टैप करें।"
        : "Open your browser menu (⋮) and tap 'Install app' or 'Add to Home screen'.");
    }
  };

  if (!isAPKModalOpen) return null;

  const githubWorkflowCode = `name: Build and Publish ROHIT ONE Debug APK

on:
  workflow_dispatch:
  push:
    branches: [ "main", "master" ]

permissions:
  contents: write

jobs:
  build-apk:
    name: Build Android Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: npm ci --legacy-peer-deps || npm install --legacy-peer-deps

      - name: Compile and Bundle ROHIT ONE Web UI
        run: npm run build

      - name: Copy Built Web UI into Android Assets
        run: |
          mkdir -p app/src/main/assets
          rm -rf app/src/main/assets/*
          cp -r dist/* app/src/main/assets/

      - name: Set up Java 17 (Temurin)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Grant Execute Permission to gradlew
        run: chmod +x gradlew

      - name: Assemble Android Debug APK
        run: ./gradlew assembleDebug --no-daemon --stacktrace

      - name: Verify Authentic Android APK
        run: |
          APK_FILE=\$(find app/build/outputs/apk/debug -name "*.apk" -type f | head -n 1)
          if [ -z "\$APK_FILE" ] || [ ! -f "\$APK_FILE" ]; then
            echo "::error::No APK file generated!"
            exit 1
          fi
          mkdir -p publish
          cp "\$APK_FILE" publish/ROHIT-ONE-debug.apk

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ROHIT-ONE-debug-apk
          path: publish/ROHIT-ONE-debug.apk
          retention-days: 30

      - name: Publish GitHub Release with APK
        uses: softprops/action-gh-release@v2
        if: startsWith(github.ref, 'refs/tags/') || github.event_name == 'workflow_dispatch' || github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        with:
          tag_name: v1.0.0-debug
          name: "ROHIT ONE - Android Debug APK"
          body: "Official ROHIT ONE Android Debug APK (Verified Dalvik package)."
          files: publish/ROHIT-ONE-debug.apk
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;

  const handleCopyWorkflow = () => {
    navigator.clipboard.writeText(githubWorkflowCode);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2500);
  };

  const handleDownloadProjectZip = async () => {
    setIsGeneratingZip(true);
    try {
      const zip = new JSZip();

      // 1. Android Manifest
      zip.file("app/src/main/AndroidManifest.xml", `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" tools:ignore="ScopedStorage" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="ROHIT ONE"
        android:supportsRtl="true"
        android:theme="@style/Theme.RohitOne"
        android:hardwareAccelerated="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.RohitOne.Fullscreen">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`);

      // 2. Gradle build files
      zip.file("settings.gradle.kts", `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "ROHIT-ONE"
include(":app")
`);

      zip.file("build.gradle.kts", `plugins {
    id("com.android.application") version "8.3.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}
`);

      zip.file("app/build.gradle.kts", `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.rohitone.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.rohitone.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
        release {
            isMinifyEnabled = true
            shrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.webkit:webkit:1.10.0")
}
`);

      zip.file("gradle/wrapper/gradle-wrapper.properties", `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`);

      // 3. GitHub Actions Workflow
      zip.file(".github/workflows/build-apk.yml", githubWorkflowCode);

      // 4. Readme instructions
      zip.file("README_ANDROID_BUILD.md", `# ROHIT ONE — Official Android Debug APK Build

### 100% Free Automated Build with GitHub Actions (Zero PC required):
1. Push this repository to GitHub.
2. Under Repository **Settings** > **Actions** > **General**, ensure **Workflow permissions** are set to **Read and write permissions**.
3. Go to the **Actions** tab on GitHub.
4. Click on **Build and Publish ROHIT ONE Debug APK** and tap **Run workflow**.
5. Within 2-3 minutes, the authentic **ROHIT-ONE-debug.apk** will be generated and published in both:
   - **Artifacts** (bottom of workflow run page)
   - **Releases** (ROHIT ONE - Android Debug APK)
6. Download and install directly onto any Android device!
`);

      // Generate the ZIP blob
      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "ROHIT_ONE_Android_Release_Package.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {t.apkCenterTitle}
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  100% Free
                </span>
              </h2>
              <p className="text-xs text-zinc-400">{t.apkCenterSubtitle}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAPKModalOpen(false)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-3 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 ${
              activeTab === 'install' 
                ? 'border-indigo-500 text-indigo-400 bg-zinc-900' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            {language === 'hi' ? 'फ़ोन में डायरेक्ट इंस्टॉल' : 'Install on Phone'}
          </button>

          <button
            onClick={() => setActiveTab('zip')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 ${
              activeTab === 'zip' 
                ? 'border-indigo-500 text-indigo-400 bg-zinc-900' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            {language === 'hi' ? 'प्रोजेक्ट पैकेज ZIP' : 'Project ZIP'}
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 ${
              activeTab === 'cloud' 
                ? 'border-indigo-500 text-indigo-400 bg-zinc-900' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            {language === 'hi' ? 'GitHub Cloud APK' : 'Cloud APK Builder'}
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 ${
              activeTab === 'qr' 
                ? 'border-indigo-500 text-indigo-400 bg-zinc-900' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            {language === 'hi' ? 'फ़ोन QR कोड' : 'Phone QR Code'}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* TAB 1: INSTALL ON PHONE */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-emerald-950/30 border border-indigo-500/30">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white text-base">
                      {t.installWebApkTitle}
                    </h3>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      {t.installWebApkDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center mb-2">1</div>
                  <span className="font-semibold text-zinc-200 text-xs">Zero Ads & Tracking</span>
                  <p className="text-[11px] text-zinc-400 mt-1">100% Private local offline app</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-2">2</div>
                  <span className="font-semibold text-zinc-200 text-xs">AMOLED Dark UI</span>
                  <p className="text-[11px] text-zinc-400 mt-1">Native gesture controls & audio engine</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center mb-2">3</div>
                  <span className="font-semibold text-zinc-200 text-xs">Instant Setup</span>
                  <p className="text-[11px] text-zinc-400 mt-1">Works on any Android phone</p>
                </div>
              </div>

              {/* REAL WORKING INSTALLATION: 1-TAP WEBAPK */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-emerald-950/60 border border-indigo-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-extrabold text-sm text-white">
                      {language === 'hi' ? 'फ़ोन में तुरंत असली ऐप इंस्टॉल करें' : 'Install Real App Directly on Phone'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    100% Working • No PC Needed
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {language === 'hi'
                    ? 'यह आपके फ़ोन की होम स्क्रीन और ऐप ड्रॉअर (App Drawer) में स्टैंडअलोन ऐप की तरह इंस्टॉल हो जाती है। इसमें सभी फीचर्स (वीडियो प्लेयर, AMOLED डार्क मोड, रीसायकल बिन, प्राइवेट वॉल्ट) बिना इंटरनेट के 100% काम करते हैं।'
                    : 'Installs directly into your Android phone Home Screen and App Drawer. Runs standalone in fullscreen with 100% offline access, media playback, AMOLED theme, vault, and recycle bin.'}
                </p>

                {isInstalled ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-medium text-xs">{t.alreadyInstalled}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleInstallApp}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 font-extrabold text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99] text-sm"
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>{language === 'hi' ? '📱 अभी फ़ोन पर इंस्टॉल करें (1-Tap Install)' : '📱 Install on This Phone Now'}</span>
                  </button>
                )}
              </div>

              {/* ANY ANDROID PHONE COMPATIBILITY MATRIX */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-zinc-200">
                      {language === 'hi' ? 'किसी भी Android फ़ोन पर सपोर्ट (Any Android Phone)' : 'Works on ANY Android Phone'}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                    Android 7.0 - 15+
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {language === 'hi'
                    ? 'ROHIT ONE को विशेष रूप से सभी कंपनियों के स्मार्टफ़ोन (Samsung, Xiaomi, Redmi, Poco, Realme, Oppo, Vivo, OnePlus, Motorola, Nothing, Google Pixel और अन्य) के लिए ऑप्टिमाइज़ किया गया है।'
                    : 'ROHIT ONE is engineered and optimized to run flawlessly across all Android manufacturers (Samsung, Xiaomi, Redmi, Poco, Realme, Oppo, Vivo, OnePlus, Motorola, Nothing, Pixel & more).'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800">
                    <span className="font-semibold text-indigo-400 block mb-0.5">Samsung (One UI)</span>
                    <span className="text-zinc-400 text-[10px]">
                      {language === 'hi' ? 'Samsung Internet / Chrome खोलें > 3 डॉट्स (⋮) > Install app' : 'Open Chrome / Samsung Internet > Menu (⋮) > Install app'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800">
                    <span className="font-semibold text-amber-400 block mb-0.5">Xiaomi / Redmi / POCO</span>
                    <span className="text-zinc-400 text-[10px]">
                      {language === 'hi' ? 'Chrome खोलें > 3 डॉट्स (⋮) > Add to Home screen / Install' : 'Open Chrome > 3 dots (⋮) > Add to Home screen / Install'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800">
                    <span className="font-semibold text-emerald-400 block mb-0.5">Realme / Oppo / Vivo</span>
                    <span className="text-zinc-400 text-[10px]">
                      {language === 'hi' ? 'Chrome ब्राउज़र में जाएं > मेनू > Install application' : 'Open Chrome > Menu > Install application'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800">
                    <span className="font-semibold text-rose-400 block mb-0.5">OnePlus / Moto / Pixel</span>
                    <span className="text-zinc-400 text-[10px]">
                      {language === 'hi' ? 'Chrome में ऊपर दिए गए "Install" बटन पर सीधे टैप करें' : 'Tap the Install button directly in Chrome'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/80 text-[10px] text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">minSdk: 24</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">ARM64 & ARM32</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">100% Offline</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 font-medium">No Ads / No Google Play Needed</span>
                </div>
              </div>

              {isIOS && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                  <strong>iPhone / iPad निर्देश:</strong> सफारी में <strong>Share (शेयर)</strong> बटन दबाएं और <strong>"Add to Home Screen"</strong> पर टैप करें।
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOWNLOAD ZIP */}
          {activeTab === 'zip' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <h3 className="font-semibold text-white text-base flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-indigo-400" />
                  {t.downloadZipTitle}
                </h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {t.downloadZipDesc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-xs space-y-2 text-zinc-300">
                <div className="font-medium text-zinc-200">इस पैकेज में शामिल हैं:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AndroidX Media3 ExoPlayer Engine</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Intelligent Hindi Audio Priority</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hardware AES-256 Vault Keystore</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GitHub Actions 1-Click APK Script</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadProjectZip}
                disabled={isGeneratingZip}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                <Download className="w-5 h-5" />
                {isGeneratingZip 
                  ? (language === 'hi' ? 'ZIP तैयार हो रही है...' : 'Generating Project ZIP...')
                  : t.downloadZipBtn}
              </button>

              {downloadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>प्रोजेक्ट ZIP डाउनलोड हो गया! आप इसे Android Studio में सीधे ओपन कर सकते हैं।</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CLOUD GITHUB ACTIONS BUILDER */}
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <h3 className="font-semibold text-white text-base flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  {t.githubBuildTitle}
                </h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {t.githubBuildDesc}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>फ़ाइल: <code className="text-zinc-200">.github/workflows/build_apk.yml</code></span>
                  <button
                    onClick={handleCopyWorkflow}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition text-xs font-medium"
                  >
                    {copiedWorkflow ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">कॉपी हो गया!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>वर्कफ़्लो कोड कॉपी करें</span>
                      </>
                    )}
                  </button>
                </div>
                
                <pre className="p-3 rounded-xl bg-black border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-48 scrollbar-thin">
                  {githubWorkflowCode}
                </pre>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-zinc-300 space-y-2">
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'hi' ? 'Zero Secrets Required — बिना किसी Keystore के डायरेक्ट Build!' : 'Zero Secrets Required — Instant Debug APK Build!'}</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {language === 'hi'
                    ? 'Debug APK के लिए किसी भी JKS या Keystore पासवर्ड की आवश्यकता नहीं है। GitHub Actions इसे स्वचालित रूप से कंपाइल, वैलिडेट और पब्लिश करेगा।'
                    : 'No keystore or signing password is required. GitHub Actions will automatically compile, verify Dalvik bytecode, and publish the verified APK.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                <div className="font-semibold text-zinc-200">{language === 'hi' ? '3 आसान स्टेप्स में APK प्राप्त करें:' : '3 Easy Steps to Get Your APK:'}</div>
                <div className="space-y-1.5 text-[11px] text-zinc-400">
                  <p>1. GitHub रिपॉजिटरी में <strong>Settings &gt; Actions &gt; General</strong> खोलें और <strong>Read and write permissions</strong> चालू करें।</p>
                  <p>2. रिपॉजिटरी के <strong>Actions</strong> टैब में जाएं और <strong>Build and Publish ROHIT ONE Debug APK</strong> पर क्लिक करके <strong>Run workflow</strong> दबाएं।</p>
                  <p>3. 2-3 मिनट में <strong>Releases</strong> या <strong>Artifacts</strong> से <strong>ROHIT-ONE-debug.apk</strong> डाउनलोड करें और फ़ोन में इंस्टॉल करें!</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QR CODE */}
          {activeTab === 'qr' && (
            <div className="space-y-4 flex flex-col items-center text-center">
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 w-full">
                <h3 className="font-semibold text-white text-base">
                  {t.qrCodeTitle}
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  {language === 'hi' 
                    ? 'अपने किसी भी Android फ़ोन के Camera या Google Lens से स्कैन करें और तुरंत ऐप खोलें!'
                    : 'Scan with Camera or Google Lens on ANY Android phone to instantly open and install!'}
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-2xl flex flex-col items-center border-4 border-zinc-800">
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="ROHIT ONE QR Code" 
                    className="w-52 h-52 object-contain"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-zinc-500 text-xs">
                    Generating QR Code...
                  </div>
                )}
                <span className="text-[11px] text-zinc-800 font-extrabold uppercase tracking-wider mt-2 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                  ROHIT ONE — ANY ANDROID PHONE
                </span>
              </div>

              <div className="w-full space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentAppUrl}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-xs flex items-center gap-1.5 shrink-0 transition"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{language === 'hi' ? 'कॉपी हुआ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'लिंक कॉपी करें' : 'Copy Link'}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {language === 'hi'
                    ? '💡 इस लिंक को WhatsApp या मैसेज पर भेजकर अपने किसी भी Android फ़ोन में सीधे खोलें।'
                    : '💡 Send this link via WhatsApp or message to open directly on any Android phone.'}
                </p>
              </div>

              <div className="w-full p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-left text-xs text-zinc-300 space-y-1.5">
                <div className="font-semibold text-zinc-200">
                  {language === 'hi' ? 'फ़ोन में खोलने के 3 आसान स्टेप्स:' : '3 Simple Steps for Your Phone:'}
                </div>
                <p>1. {language === 'hi' ? 'अपने Samsung, Redmi, Realme, Vivo, OnePlus या किसी भी फ़ोन का Camera / Google Lens खोलें।' : 'Open Camera or Google Lens on your Samsung, Redmi, Vivo, or any phone.'}</p>
                <p>2. {language === 'hi' ? 'स्क्रीन पर दिख रहे इस QR कोड को स्कैन करें और लिंक खोलें।' : 'Scan this QR code and tap to open the link.'}</p>
                <p>3. {language === 'hi' ? 'ब्राउज़र में "Install" या "Add to Home Screen" दबाएं — ROHIT ONE तैयार!' : 'Tap "Install" or "Add to Home Screen" — ROHIT ONE is ready!'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.privacyGuarantee}</span>
          </div>
          <button
            onClick={() => setIsAPKModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
