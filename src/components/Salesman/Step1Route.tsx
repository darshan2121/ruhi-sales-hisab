import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency } from '../../utils/formatters';
import { MapPin, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { Route } from '../../types';

interface Step1RouteProps {
  selectedRoute: Route | null;
  onSelectRoute: (route: Route) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step1Route: React.FC<Step1RouteProps> = ({
  selectedRoute,
  onSelectRoute,
  onNext,
  onBack,
}) => {
  const { routes, language } = useApp();
  const t = translations[language];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-600 font-extrabold text-sm hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>{t.backBtn}</span>
        </button>
        <span className="text-xs font-black bg-blue-100 text-[#4B5FC4] px-3 py-1 rounded-full">
          STEP 1 / 3
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900">{t.step1Title}</h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">{t.step1Sub}</p>
      </div>

      {/* Large Selectable Route Cards */}
      <div className="space-y-3">
        {routes.map((route) => {
          const isSelected = selectedRoute?.id === route.id;
          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(route)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'border-[#4B5FC4] bg-blue-50/70 shadow-md ring-2 ring-[#4B5FC4]/20 scale-[1.01]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${
                    isSelected
                      ? 'bg-[#4B5FC4] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base">{route.name}</div>
                  <div className="text-xs font-bold text-slate-500 mt-0.5">
                    {t.expectedAmount}: {formatCurrency(route.expectedCollection)}
                  </div>
                </div>
              </div>

              {isSelected && (
                <CheckCircle2 className="w-7 h-7 text-[#4B5FC4] flex-shrink-0 animate-in fade-in" />
              )}
            </button>
          );
        })}
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onNext}
        disabled={!selectedRoute}
        className={`w-full py-4 px-6 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
          selectedRoute
            ? 'bg-[#4B5FC4] hover:bg-blue-700 active:scale-98 text-white shadow-blue-500/30 cursor-pointer'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <span>{t.continueBtn}</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
