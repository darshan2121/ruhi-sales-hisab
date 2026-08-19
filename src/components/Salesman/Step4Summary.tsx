import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency, calculateCashTotal } from '../../utils/formatters';
import type { Route, CashBreakdown } from '../../types';
import { ArrowLeft, CheckCircle2, MapPin, AlertTriangle } from 'lucide-react';

interface Step4SummaryProps {
  route: Route;
  cashBreakdown: CashBreakdown;
  onlineAmount: number;
  onlineMode: string;
  marketOutstandingAmount?: number;
  onSave: () => void;
  onBack: () => void;
}

export const Step4Summary: React.FC<Step4SummaryProps> = ({
  route,
  cashBreakdown,
  onlineAmount,
  onlineMode,
  marketOutstandingAmount = 0,
  onSave,
  onBack,
}) => {
  const { language } = useApp();
  const t = translations[language];

  const cashAmount = calculateCashTotal(cashBreakdown);
  const collectedTotal = cashAmount + onlineAmount;
  const grandTotalAccounted = collectedTotal + marketOutstandingAmount;

  return (
    <div className="space-y-5 pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-600 font-extrabold text-sm hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>{t.backBtn}</span>
        </button>
        <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
          FINAL STEP
        </span>
      </div>

      {/* Title & Selected Route */}
      <div className="bg-[#4B5FC4] text-white p-4 rounded-2xl shadow-md">
        <div className="text-xs font-bold text-blue-200 uppercase tracking-wider">
          {t.step5Title || "Today's Final Hisab Summary"}
        </div>
        <h2 className="text-2xl font-black mt-0.5">{t.todaysHisab}</h2>
        <div className="flex items-center justify-between text-xs font-extrabold text-blue-100 bg-white/10 p-2.5 rounded-xl mt-2 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-amber-300" />
            <span>{route.name}</span>
          </div>
          <span className="text-[11px] font-black bg-amber-400 text-slate-900 px-2 py-0.5 rounded-md">
            અપેક્ષિત: {formatCurrency(route.expectedCollection)}
          </span>
        </div>
      </div>

      {/* Main Breakdown Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-4 space-y-3">
        {/* CASH Row */}
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">💵</span>
            <span className="font-extrabold text-emerald-950 text-sm">CASH</span>
          </div>
          <span className="text-xl font-black text-emerald-700">{formatCurrency(cashAmount)}</span>
        </div>

        {/* ONLINE Row */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">📱</span>
            <div>
              <span className="font-extrabold text-blue-950 text-sm">ONLINE</span>
              <span className="text-[10px] text-blue-700 font-bold block">({onlineMode})</span>
            </div>
          </div>
          <span className="text-xl font-black text-blue-700">{formatCurrency(onlineAmount)}</span>
        </div>

        {/* MARKET OUTSTANDING Row */}
        {marketOutstandingAmount > 0 && (
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <span className="font-extrabold text-amber-950 text-sm">માર્કેટ બાકી (PENDING)</span>
                <span className="text-[10px] text-amber-700 font-bold block">ગ્રાહકોની બાકી લેણી રકમ</span>
              </div>
            </div>
            <span className="text-xl font-black text-amber-700">{formatCurrency(marketOutstandingAmount)}</span>
          </div>
        )}

        <hr className="border-dashed border-slate-300" />

        {/* TOTAL COLLECTION & ACCOUNTED */}
        <div className="bg-slate-900 text-white rounded-xl shadow-md p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>કુલ જમા કલેક્શન (Cash + Online):</span>
            <span className="text-sm font-black text-emerald-400">{formatCurrency(collectedTotal)}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="font-black text-amber-400 text-base">કુલ હિસાબ (TOTAL ACCOUNTED)</span>
            </div>
            <span className="text-3xl font-black text-amber-300">{formatCurrency(grandTotalAccounted)}</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-4 px-6 rounded-2xl font-black text-xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-emerald-400/40"
      >
        <CheckCircle2 className="w-7 h-7" />
        <span>{t.saveHisabBtn}</span>
      </button>

      {/* Back Link */}
      <button
        onClick={onBack}
        className="w-full text-center text-slate-500 hover:text-slate-800 font-extrabold text-sm py-2"
      >
        {t.backBtn}
      </button>
    </div>
  );
};
