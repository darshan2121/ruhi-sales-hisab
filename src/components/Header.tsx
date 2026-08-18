import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import type { Language } from '../types';
import { Store, UserCheck, ShieldCheck, LogOut, Wifi, WifiOff, Database } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    activeSalesman,
    language,
    setLanguage,
    isOnline,
    setIsOnline,
    isMongoConnected,
    toastMessage,
    settings,
    logout,
  } = useApp();

  const t = translations[language];

  return (
    <header className="bg-[#4B5FC4] text-white shadow-md sticky top-0 z-40">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-500 text-white text-center py-2 px-4 text-sm font-bold animate-bounce shadow-inner flex items-center justify-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Status Warning Bar */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-900 text-center py-1 px-3 text-xs font-bold flex items-center justify-center gap-2">
          <WifiOff size={14} />
          <span>{t.offlineMsg}</span>
        </div>
      )}

      {/* Main Top Header */}
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-2.5">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white">
              {settings.businessName || t.appName}
            </h1>
            <p className="text-[11px] text-blue-100 font-medium tracking-wide mt-0.5">
              {settings.subtitle || t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Language Switcher Pills */}
        <div className="flex items-center bg-blue-900/40 p-1 rounded-full border border-blue-300/20">
          {(['gu', 'hi', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2.5 py-1 text-xs font-extrabold rounded-full transition-all ${
                language === lang
                  ? 'bg-white text-[#4B5FC4] shadow-sm scale-105'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              {lang === 'gu' ? 'ગુજરાતી' : lang === 'hi' ? 'हिंदी' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      {/* Active User Session & Database Status Bar */}
      <div className="bg-blue-900/60 border-t border-blue-400/20 py-2 px-4 text-xs">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* User Badge & DB status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-blue-950/50 px-3 py-1.5 rounded-xl border border-white/10">
              {currentRole === 'salesman' ? (
                <>
                  <UserCheck size={15} className="text-emerald-400" />
                  <span className="font-extrabold text-white text-xs truncate max-w-[130px]">
                    👤 {activeSalesman?.name || t.salesmanRole}
                  </span>
                </>
              ) : (
                <>
                  <ShieldCheck size={15} className="text-amber-400" />
                  <span className="font-extrabold text-amber-300 text-xs">
                    🛡️ {t.adminRole}
                  </span>
                </>
              )}
            </div>

            {/* DB Connection Indicator Badge */}
            <div
              title={isMongoConnected ? 'Connected to MongoDB Cloud' : 'Running on Local Storage'}
              className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border ${
                isMongoConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  : 'bg-slate-700/50 text-slate-300 border-slate-600'
              }`}
            >
              <Database size={11} />
              <span>{isMongoConnected ? 'MongoDB Live' : 'Local DB'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Offline toggle button */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              title={isOnline ? t.online : t.offline}
              className={`p-1.5 rounded-lg border transition-all ${
                isOnline
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                  : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
              }`}
            >
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1 bg-rose-600/90 hover:bg-rose-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm active:scale-95"
            >
              <LogOut size={14} />
              <span>લોગ આઉટ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
