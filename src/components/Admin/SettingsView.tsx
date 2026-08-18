import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import type { Language } from '../../types';
import { ArrowLeft, Save, Sliders, Globe } from 'lucide-react';

interface SettingsViewProps {
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const { settings, updateSettings, language, setLanguage } = useApp();
  const t = translations[language];

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [subtitle, setSubtitle] = useState(settings.subtitle);
  const [defaultProfitPct, setDefaultProfitPct] = useState(settings.defaultProfitPct);
  const [allowSalesmanProfitOverride, setAllowSalesmanProfitOverride] = useState(
    settings.allowSalesmanProfitOverride
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      businessName,
      subtitle,
      defaultProfitPct: Number(defaultProfitPct),
      allowSalesmanProfitOverride,
    });
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-600 font-extrabold text-sm hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>{t.backBtn}</span>
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-[#4B5FC4]" />
          <span>એડમિન સેટિંગ્સ</span>
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs font-extrabold">
        {/* Business Info Section */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
            વ્યાપાર માહિતી (Business Profile)
          </h3>

          <div>
            <label className="text-slate-500 block mb-1">પેઢીનું નામ (Business Name)</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="text-slate-500 block mb-1">સબટાઈટલ (Subtitle)</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Profit Percentage Config */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>{t.profitSettings}</span>
            <span className="text-[#4B5FC4] text-xs">{defaultProfitPct}%</span>
          </h3>

          <div>
            <label className="text-slate-500 block mb-2">{t.globalPct}</label>
            {/* Presets Grid */}
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {[5, 6, 7, 8, 10].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDefaultProfitPct(pct)}
                  className={`py-2 rounded-xl font-black text-sm transition-all cursor-pointer ${
                    defaultProfitPct === pct
                      ? 'bg-[#4B5FC4] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <input
              type="number"
              step="0.5"
              value={defaultProfitPct}
              onChange={(e) => setDefaultProfitPct(parseFloat(e.target.value))}
              placeholder="Custom %"
              className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <hr className="border-slate-100" />

          {/* Toggle Salesman Specific Rate */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-extrabold text-slate-900 text-xs block">
                સેલ્સમેન પ્રમાણે અલગ ટકાવારી (Salesman-specific rate)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                ખાસ સેલ્સમેન માટે અલગ નફો સેટ કરવા દો
              </span>
            </div>

            <input
              type="checkbox"
              checked={allowSalesmanProfitOverride}
              onChange={(e) => setAllowSalesmanProfitOverride(e.target.checked)}
              className="w-5 h-5 accent-[#4B5FC4] cursor-pointer"
            />
          </div>
        </div>

        {/* Language Preference */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Globe size={16} className="text-blue-600" />
            <span>ભાષા (Language)</span>
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'gu', label: 'ગુજરાતી' },
              { id: 'hi', label: 'हिंदी' },
              { id: 'en', label: 'English' },
            ].map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.id as Language)}
                className={`py-3 rounded-xl font-black text-sm transition-all cursor-pointer ${
                  language === lang.id
                    ? 'bg-[#4B5FC4] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-4 px-6 rounded-2xl font-black text-lg shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Save size={20} />
          <span>{t.saveSettings}</span>
        </button>
      </form>
    </div>
  );
};
