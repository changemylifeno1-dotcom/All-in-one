import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Fingerprint, 
  Eye, 
  EyeOff, 
  KeyRound, 
  FolderLock, 
  Trash2, 
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PrivateVaultView: React.FC = () => {
  const { 
    files, 
    restoreFromVault, 
    deleteFile, 
    setDetailsItem, 
    setActiveVideo, 
    setActivePhoto,
    isVaultUnlocked, 
    setIsVaultUnlocked, 
    vaultPin, 
    setVaultPin, 
    t, 
    language 
  } = useApp();

  const [enteredPin, setEnteredPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');

  const vaultFiles = files.filter(f => f.isInVault);

  const handleKeyPress = (num: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + num;
      setEnteredPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const verifyPin = (pin: string) => {
    if (pin === vaultPin) {
      confetti({ particleCount: 50, spread: 50 });
      setIsVaultUnlocked(true);
      setEnteredPin('');
      setErrorMessage('');
    } else {
      setErrorMessage(t.wrongPin);
      setTimeout(() => {
        setEnteredPin('');
        setErrorMessage('');
      }, 1000);
    }
  };

  const handleBiometricUnlock = async () => {
    // Biometric simulator / WebAuthn check
    try {
      confetti({ particleCount: 60, spread: 60 });
      setIsVaultUnlocked(true);
    } catch {
      setErrorMessage(t.biometricFailed);
    }
  };

  const handleSaveNewPin = () => {
    if (newPin.length === 4) {
      setVaultPin(newPin);
      setIsChangingPin(false);
      setNewPin('');
    }
  };

  if (!isVaultUnlocked) {
    return (
      <div className="max-w-md mx-auto py-8 px-4 text-center space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 via-indigo-600 to-emerald-500 p-0.5 shadow-xl shadow-rose-600/20">
            <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center">
              <Lock className="w-8 h-8 text-rose-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{t.vaultTitle}</h2>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
              {t.vaultSubtitle}
            </p>
          </div>
        </div>

        {/* PIN Dots Display */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5">
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  enteredPin.length > index
                    ? 'bg-gradient-to-r from-indigo-500 to-rose-500 scale-125'
                    : 'bg-zinc-800 border border-zinc-700'
                }`}
              />
            ))}
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 font-semibold animate-pulse">
              {errorMessage}
            </p>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleKeyPress(digit)}
                className="w-14 h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-lg font-bold text-white transition active:scale-90"
              >
                {digit}
              </button>
            ))}
            <button
              onClick={handleBiometricUnlock}
              className="w-14 h-14 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800 text-indigo-400 flex items-center justify-center transition active:scale-90"
              title="Biometric Fingerprint"
            >
              <Fingerprint className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleKeyPress('0')}
              className="w-14 h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-lg font-bold text-white transition active:scale-90"
            >
              0
            </button>
            <button
              onClick={() => setEnteredPin(prev => prev.slice(0, -1))}
              className="w-14 h-14 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs font-semibold transition active:scale-90"
            >
              ⌫
            </button>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 font-mono">
          {language === 'hi' ? 'डिफ़ॉल्ट पिन: 1234' : 'Default Demo PIN: 1234'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Vault Unlocked Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-indigo-950/40 border border-rose-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
            <Unlock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              {t.vaultTitle}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                {t.vaultEncryptedBadge}
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              {vaultFiles.length} {language === 'hi' ? 'सुरक्षित फ़ाइलें' : 'encrypted files'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsChangingPin(!isChangingPin)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium"
            title="Change PIN"
          >
            <KeyRound className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsVaultUnlocked(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/20"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{t.lockNow}</span>
          </button>
        </div>
      </div>

      {/* Change PIN Box */}
      {isChangingPin && (
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <h4 className="text-xs font-bold text-white">{t.createPin}</h4>
          <div className="flex items-center gap-2">
            <input
              type="password"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              placeholder="4-digit PIN"
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white tracking-widest text-center w-32 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSaveNewPin}
              disabled={newPin.length !== 4}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs disabled:opacity-40"
            >
              Save PIN
            </button>
          </div>
        </div>
      )}

      {/* Encrypted Vault Items */}
      {vaultFiles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
          <FolderLock className="w-12 h-12 text-zinc-600 mx-auto" />
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            {t.noVaultFiles}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {vaultFiles.map((file) => (
            <div
              key={file.id}
              className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2 flex flex-col justify-between"
            >
              <div 
                className="w-full h-24 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center cursor-pointer relative"
                onClick={() => {
                  if (file.category === 'video') setActiveVideo(file);
                  else if (file.category === 'photo') setActivePhoto(file);
                  else setDetailsItem(file);
                }}
              >
                {file.thumbnail ? (
                  <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover blur-[2px] hover:blur-none transition" />
                ) : (
                  <FolderLock className="w-8 h-8 text-rose-400" />
                )}
                <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80">
                  <Lock className="w-3 h-3 text-rose-400" />
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-zinc-200 truncate">{file.name}</h5>
                <span className="text-[10px] text-zinc-500 font-mono">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
                <button
                  onClick={() => restoreFromVault(file.id)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {t.unhideFromVault}
                </button>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="p-1 rounded text-zinc-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
