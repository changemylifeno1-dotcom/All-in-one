import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem, AudioTrack, SubtitleTrack } from '../../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Sun, 
  Lock, 
  Unlock, 
  Maximize, 
  Minimize, 
  X, 
  Languages, 
  Subtitles, 
  FastForward, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  SlidersHorizontal,
  PictureInPicture,
  Tv
} from 'lucide-react';

export const VideoPlayerView: React.FC<{ item: MediaItem; onClose: () => void }> = ({ item, onClose }) => {
  const { t, language, settings } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const seekStep = settings?.seekInterval || 10;
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [brightness, setBrightness] = useState(1); // 0.2 to 1.5
  const [playbackSpeed, setPlaybackSpeed] = useState(settings?.defaultVideoSpeed || 1);
  const [isSpeedBoosted, setIsSpeedBoosted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  // Gesture HUD states
  const [gestureIndicator, setGestureIndicator] = useState<{
    type: 'brightness' | 'volume' | 'seek' | 'speed' | null;
    value: string | number;
  }>({ type: null, value: '' });

  // Dual Lock System
  // 'none' | 'interface' (controls hidden, gestures work) | 'touch' (all touch disabled)
  const [lockMode, setLockMode] = useState<'none' | 'interface' | 'touch'>('none');
  const [unlockTapCount, setUnlockTapCount] = useState(0);

  // Audio tracks & intelligent Hindi selection
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(() => {
    return item.audioTracks || [
      {
        id: 'track-1',
        name: 'Hindi Audio Track (Default)',
        language: 'hi',
        languageLabel: 'हिंदी (Hindi)',
        channels: '5.1 Surround',
        codec: 'AAC',
        isSelected: true,
      },
      {
        id: 'track-2',
        name: 'English Original',
        language: 'en',
        languageLabel: 'English',
        channels: 'Stereo',
        codec: 'AAC',
        isSelected: false,
      }
    ];
  });
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [hindiPriorityNotification, setHindiPriorityNotification] = useState<string | null>(null);

  // Subtitles
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>(() => {
    return item.subtitles || [
      { id: 'sub-off', label: 'Off', language: 'none', isSelected: true },
      { id: 'sub-hi', label: 'Hindi (हिंदी)', language: 'hi', isSelected: false },
      { id: 'sub-en', label: 'English', language: 'en', isSelected: false }
    ];
  });
  const [showSubtitleModal, setShowSubtitleModal] = useState(false);

  // Aspect ratio modes: 'contain' | 'cover' | 'fill'
  const [aspectMode, setAspectMode] = useState<'contain' | 'cover' | 'fill'>('contain');

  // AI Hindi Dubbing Simulator modal
  const [showAIDubModal, setShowAIDubModal] = useState(false);
  const [aiDubProgress, setAiDubProgress] = useState(0);
  const [isAiDubbing, setIsAiDubbing] = useState(false);

  // Auto-hide controls
  const resetControlsTimer = () => {
    if (lockMode === 'touch') return;
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 4000);
    setControlsTimeout(timer);
  };

  useEffect(() => {
    // Check if Hindi track exists and auto-prioritize it!
    const hindiTrack = audioTracks.find(t => t.language === 'hi');
    if (hindiTrack) {
      setAudioTracks(prev => prev.map(t => ({ ...t, isSelected: t.id === hindiTrack.id })));
      setHindiPriorityNotification(t.hindiPriorityApplied);
      setTimeout(() => setHindiPriorityNotification(null), 4000);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
      resetControlsTimer();
    }
  };

  const seekRelative = (seconds: number) => {
    if (videoRef.current) {
      const target = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = target;
      setCurrentTime(target);
      setGestureIndicator({
        type: 'seek',
        value: `${seconds > 0 ? '+' : ''}${seconds}s (${formatTime(target)})`
      });
      setTimeout(() => setGestureIndicator({ type: null, value: '' }), 1200);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const hrs = Math.floor(timeInSeconds / 3600);
    const mins = Math.floor((timeInSeconds % 3600) / 60);
    const secs = Math.floor(timeInSeconds % 60);
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Touch gesture state handling
  const touchStartRef = useRef<{ x: number; y: number; time: number; initialVol: number; initialBri: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (lockMode === 'touch') return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      initialVol: volume,
      initialBri: brightness
    };

    // Long press detection for 2x playback speed booster!
    longPressTimerRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 2.0;
        setIsSpeedBoosted(true);
        setGestureIndicator({ type: 'speed', value: '2.0x SPEED BOOST' });
      }
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (lockMode === 'touch' || !touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // If moved, cancel long press
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const isLeftSide = touchStartRef.current.x < rect.width / 2;

    // Vertical drag: left side = brightness, right side = volume
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 15) {
      const deltaPercent = -deltaY / (rect.height * 0.7);
      if (isLeftSide) {
        // Brightness
        const newBri = Math.max(0.2, Math.min(1.5, touchStartRef.current.initialBri + deltaPercent));
        setBrightness(newBri);
        setGestureIndicator({ type: 'brightness', value: `${Math.round((newBri / 1.5) * 100)}%` });
      } else {
        // Volume
        const newVol = Math.max(0, Math.min(1, touchStartRef.current.initialVol + deltaPercent));
        setVolume(newVol);
        if (videoRef.current) videoRef.current.volume = newVol;
        setGestureIndicator({ type: 'volume', value: `${Math.round(newVol * 100)}%` });
      }
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    if (isSpeedBoosted) {
      if (videoRef.current) videoRef.current.playbackRate = playbackSpeed;
      setIsSpeedBoosted(false);
      setGestureIndicator({ type: null, value: '' });
    } else {
      setTimeout(() => setGestureIndicator({ type: null, value: '' }), 800);
    }
    touchStartRef.current = null;
  };

  // Double tap handler
  const lastTapRef = useRef<{ x: number; time: number } | null>(null);
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lockMode === 'touch') return;
    const now = Date.now();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;

    if (lastTapRef.current && (now - lastTapRef.current.time) < 300) {
      // Double tap detected!
      if (x < rect.width * 0.35) {
        seekRelative(-seekStep);
      } else if (x > rect.width * 0.65) {
        seekRelative(seekStep);
      } else {
        togglePlay();
      }
      lastTapRef.current = null;
    } else {
      lastTapRef.current = { x, time: now };
      resetControlsTimer();
    }
  };

  const handleUnlockTouch = () => {
    setUnlockTapCount(prev => {
      const next = prev + 1;
      if (next >= 2) {
        setLockMode('none');
        setShowControls(true);
        return 0;
      }
      return next;
    });
    setTimeout(() => setUnlockTapCount(0), 1000);
  };

  const startAiDubbing = () => {
    setIsAiDubbing(true);
    setAiDubProgress(5);
    const interval = setInterval(() => {
      setAiDubProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsAiDubbing(false);
          // Add generated Hindi track
          const newTrack: AudioTrack = {
            id: `ai-dub-${Date.now()}`,
            name: 'AI Generated Hindi Dubbing (Synchronized)',
            language: 'hi',
            languageLabel: 'हिंदी AI (Dubbed)',
            channels: 'Stereo 2.0',
            codec: 'Neural TTS',
            isSelected: true,
          };
          setAudioTracks(prev => [newTrack, ...prev.map(t => ({ ...t, isSelected: false }))]);
          setShowAIDubModal(false);
          setHindiPriorityNotification('AI हिंदी डबिंग ऑडियो सफलतापूर्वक लागू हो गया!');
          setTimeout(() => setHindiPriorityNotification(null), 3500);
          return 100;
        }
        return p + 15;
      });
    }, 400);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={resetControlsTimer}
      onClick={handleContainerClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden touch-none no-pull-refresh"
    >
      {/* Video Element with Brightness Filter & Aspect Mode */}
      <video
        ref={videoRef}
        src={item.url}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        style={{
          filter: `brightness(${brightness})`,
          objectFit: aspectMode as any,
        }}
        className="w-full h-full max-h-screen bg-black transition-filter duration-100"
      />

      {/* Hindi Auto Priority Notification Badge */}
      {hindiPriorityNotification && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-indigo-600/90 backdrop-blur-md text-white text-xs font-semibold shadow-xl border border-indigo-400/30 flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>{hindiPriorityNotification}</span>
        </div>
      )}

      {/* Active Gesture HUD Overlay */}
      {gestureIndicator.type && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="px-6 py-4 rounded-2xl bg-black/85 backdrop-blur-md border border-zinc-700 text-white flex flex-col items-center gap-2 shadow-2xl animate-in zoom-in-95 duration-150">
            {gestureIndicator.type === 'brightness' && <Sun className="w-8 h-8 text-amber-400" />}
            {gestureIndicator.type === 'volume' && <Volume2 className="w-8 h-8 text-indigo-400" />}
            {gestureIndicator.type === 'seek' && <FastForward className="w-8 h-8 text-emerald-400" />}
            {gestureIndicator.type === 'speed' && <FastForward className="w-8 h-8 text-rose-400 animate-pulse" />}
            <span className="text-sm font-bold tracking-wide">{gestureIndicator.value}</span>
          </div>
        </div>
      )}

      {/* TOTAL TOUCH LOCK INDICATOR & UNLOCK BUTTON */}
      {lockMode === 'touch' && (
        <div className="absolute top-6 right-6 z-40">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUnlockTouch();
            }}
            className="p-3.5 rounded-full bg-black/80 border border-zinc-700 text-white shadow-2xl hover:bg-zinc-900 transition flex items-center gap-2"
          >
            <Lock className="w-6 h-6 text-indigo-400" />
            <span className="text-xs font-bold text-zinc-200">
              {unlockTapCount > 0 ? (language === 'hi' ? 'एक बार और टैप करें' : 'Tap once more') : t.unlockHint}
            </span>
          </button>
        </div>
      )}

      {/* PLAYER HUD CONTROLS */}
      {showControls && lockMode !== 'touch' && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-20 flex flex-col justify-between bg-gradient-to-t from-black/90 via-black/20 to-black/80 p-4 md:p-6 transition-opacity duration-300"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-sm md:text-base font-bold truncate max-w-xs md:max-w-md">
                  {item.name}
                </h2>
                <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-medium">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                    {item.resolution || '4K UHD'}
                  </span>
                  <span>•</span>
                  <span>{audioTracks.find(t => t.isSelected)?.languageLabel || 'Hindi'}</span>
                </div>
              </div>
            </div>

            {/* Top Right Quick Controls */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {/* Audio Track Selector */}
              <button
                onClick={() => setShowAudioModal(true)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-medium flex items-center gap-1.5 transition"
                title={t.audioTrack}
              >
                <Languages className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">{t.audioTrack}</span>
              </button>

              {/* Subtitle Selector */}
              <button
                onClick={() => setShowSubtitleModal(true)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-medium flex items-center gap-1.5 transition"
                title={t.subtitles}
              >
                <Subtitles className="w-4 h-4 text-indigo-400" />
                <span className="hidden md:inline">{t.subtitles}</span>
              </button>

              {/* Aspect Ratio Toggle */}
              <button
                onClick={() => {
                  setAspectMode(prev => prev === 'contain' ? 'cover' : prev === 'cover' ? 'fill' : 'contain');
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
                title={t.aspectRatio}
              >
                <Maximize className="w-4 h-4" />
              </button>

              {/* Lock Mode Switcher (Dual Lock) */}
              <button
                onClick={() => {
                  if (lockMode === 'none') {
                    setLockMode('interface');
                  } else if (lockMode === 'interface') {
                    setLockMode('touch');
                    setShowControls(false);
                  } else {
                    setLockMode('none');
                  }
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition"
                title="Dual Lock System"
              >
                {lockMode === 'interface' ? (
                  <Lock className="w-4 h-4 text-amber-400" />
                ) : (
                  <Unlock className="w-4 h-4 text-zinc-300" />
                )}
              </button>
            </div>
          </div>

          {/* Center Playback Icon with Rewind / Forward */}
          <div className="flex items-center justify-center gap-8 md:gap-14">
            <button
              onClick={() => seekRelative(-seekStep)}
              className="p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition active:scale-95"
              title={`${seekStep}s Rewind`}
            >
              <RotateCcw className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <button
              onClick={togglePlay}
              className="p-5 md:p-6 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/50 transition active:scale-95"
            >
              {isPlaying ? <Pause className="w-8 h-8 md:w-10 md:h-10" /> : <Play className="w-8 h-8 md:w-10 md:h-10 fill-current" />}
            </button>

            <button
              onClick={() => seekRelative(seekStep)}
              className="p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition active:scale-95"
              title={`${seekStep}s Forward`}
            >
              <RotateCw className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Bottom Bar: Timeline & Controls */}
          <div className="space-y-2 text-white">
            {/* Timeline Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-300 w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (videoRef.current) videoRef.current.currentTime = val;
                }}
                className="w-full h-1.5 bg-zinc-700 rounded-lg cursor-pointer accent-indigo-500"
              />
              <span className="text-xs font-mono text-zinc-300 w-12">
                {formatTime(duration)}
              </span>
            </div>

            {/* Bottom Row Controls */}
            <div className="flex items-center justify-between text-xs pt-1">
              {/* Volume & Brightness sliders */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      setIsMuted(false);
                      if (videoRef.current) videoRef.current.volume = v;
                    }}
                    className="w-16 md:w-24 h-1 bg-zinc-700 rounded accent-indigo-500"
                  />
                </div>

                <div className="hidden sm:flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <input
                    type="range"
                    min="0.3"
                    max="1.5"
                    step="0.05"
                    value={brightness}
                    onChange={(e) => setBrightness(parseFloat(e.target.value))}
                    className="w-16 md:w-24 h-1 bg-zinc-700 rounded accent-amber-500"
                  />
                </div>
              </div>

              {/* Speed & Lock Info */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  {lockMode === 'interface' ? t.lockInterface : ''}
                </span>

                {/* Playback speed selector */}
                <div className="flex items-center bg-white/10 rounded-lg p-0.5">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setPlaybackSpeed(s);
                        if (videoRef.current) videoRef.current.playbackRate = s;
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        playbackSpeed === s ? 'bg-indigo-600 text-white' : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {/* Picture in Picture */}
                <button
                  onClick={() => {
                    if (document.pictureInPictureElement) {
                      document.exitPictureInPicture();
                    } else if (videoRef.current) {
                      videoRef.current.requestPictureInPicture?.();
                    }
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  title="Picture-in-Picture"
                >
                  <Tv className="w-4 h-4 text-zinc-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTELLIGENT AUDIO TRACK SELECTION MODAL */}
      {showAudioModal && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">{t.audioTrack}</h3>
              </div>
              <button 
                onClick={() => setShowAudioModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hindi Priority Highlight Card */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-950/50 to-emerald-950/50 border border-indigo-500/30 text-xs text-zinc-300">
              <span className="font-semibold text-emerald-400 block mb-0.5">
                {language === 'hi' ? 'स्मार्ट ऑडियो प्राथमिकता:' : 'Intelligent Audio Priority:'}
              </span>
              <span>
                {language === 'hi' 
                  ? 'ROHIT ONE हिंदी ऑडियो ट्रैक को हमेशा पहली प्राथमिकता देता है।' 
                  : 'ROHIT ONE automatically prioritizes Hindi audio tracks on video start.'}
              </span>
            </div>

            {/* Audio Track List */}
            <div className="space-y-2">
              {audioTracks.map((tr) => (
                <button
                  key={tr.id}
                  onClick={() => {
                    setAudioTracks(prev => prev.map(t => ({ ...t, isSelected: t.id === tr.id })));
                    setShowAudioModal(false);
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition text-left ${
                    tr.isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>{tr.name}</span>
                      {tr.language === 'hi' && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-semibold">
                          Hindi Preferred
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {tr.channels} • Codec: {tr.codec} {tr.bitrate ? `• ${tr.bitrate}` : ''}
                    </div>
                  </div>
                  {tr.isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>

            {/* Optional AI Hindi Dubbing option if video lacks Hindi */}
            <div className="pt-2 border-t border-zinc-800">
              <button
                onClick={() => {
                  setShowAudioModal(false);
                  setShowAIDubModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-indigo-300 flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>{t.aiDubbing}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTITLE SELECTION MODAL */}
      {showSubtitleModal && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
        >
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Subtitles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">{t.subtitles}</h3>
              </div>
              <button 
                onClick={() => setShowSubtitleModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {subtitles.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSubtitles(prev => prev.map(s => ({ ...s, isSelected: s.id === sub.id })));
                    setShowSubtitleModal(false);
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition text-left text-xs ${
                    sub.isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <span>{sub.label}</span>
                  {sub.isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI HINDI DUBBING SIMULATOR MODAL */}
      {showAIDubModal && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">{t.aiDubbing}</h3>
              </div>
              <button 
                onClick={() => setShowAIDubModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {t.aiDubbingDesc}
            </p>

            <div className="p-3 rounded-xl bg-zinc-900 text-[11px] text-zinc-400 space-y-1">
              <div>1. Speech Recognition & Transcription</div>
              <div>2. Hindi Contextual Translation</div>
              <div>3. Neural Hindi Voice Synthesis (TTS)</div>
              <div>4. Lip-sync & Timeline Synchronization</div>
            </div>

            {isAiDubbing ? (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-indigo-300">
                  <span>डबिंग प्रक्रिया जारी है...</span>
                  <span>{aiDubProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${aiDubProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={startAiDubbing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI हिंदी डबिंग शुरू करें</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
