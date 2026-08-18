import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency } from '../../utils/formatters';
import { PlusCircle, Calendar, AlertTriangle, CheckCircle2, Edit2 } from 'lucide-react';

interface SalesmanHomeProps {
  onStartHisab: () => void;
  onViewHistory: () => void;
  onEditTodayHisab: () => void;
}

export const SalesmanHome: React.FC<SalesmanHomeProps> = ({
  onStartHisab,
  onViewHistory,
  onEditTodayHisab,
}) => {
  const { activeSalesman, language, getTodayEntryForSalesman } = useApp();
  const t = translations[language];

  const todayEntry = getTodayEntryForSalesman(activeSalesman.id);

  const cashAmount = todayEntry ? todayEntry.cashAmount : 0;
  const onlineAmount = todayEntry ? todayEntry.onlineAmount : 0;
  const totalAmount = todayEntry ? todayEntry.totalAmount : 0;

  return (
    <div className="space-y-5 pb-8">
      {/* Greeting Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#4B5FC4] uppercase tracking-wider">
            {t.salesmanRole}
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">
            {t.welcome}, {activeSalesman.name.split(' ')[0]} 👋
          </h2>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-[#4B5FC4] font-black text-xl rounded-full flex items-center justify-center border-2 border-blue-100 shadow-inner">
          {activeSalesman.name.charAt(0)}
        </div>
      </div>

      {/* Today's Entry Status Alert */}
      {todayEntry ? (
        <div className="bg-emerald-50 border-2 border-emerald-400/40 p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="font-extrabold text-emerald-950 text-sm">{t.alreadySubmitted}</div>
              <div className="text-xs font-medium text-emerald-800">
                {todayEntry.routeName} • {formatCurrency(todayEntry.totalAmount)}
              </div>
            </div>
          </div>
          <button
            onClick={onEditTodayHisab}
            className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-3 py-2 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
          >
            <Edit2 size={13} />
            <span>{t.viewEdit}</span>
          </button>
        </div>
      ) : (
        <div className="bg-amber-50 border-2 border-amber-300 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <div className="font-extrabold text-amber-950 text-sm">{t.pendingWarning}</div>
            <div className="text-xs font-medium text-amber-800">{t.pendingWarningDesc}</div>
          </div>
        </div>
      )}

      {/* TODAY'S HISAB SECTION */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider mb-2.5 px-1">
          {t.todaysHisab}
        </h3>

        {/* Three Large Cards Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* CASH CARD */}
          <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-sm text-center border border-emerald-500">
            <div className="text-[11px] font-black uppercase tracking-wider text-emerald-100 mb-1 flex items-center justify-center gap-1">
              <span>💵</span>
              <span>CASH</span>
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-tight leading-none drop-shadow-sm">
              {formatCurrency(cashAmount)}
            </div>
          </div>

          {/* ONLINE CARD */}
          <div className="bg-blue-600 text-white p-3.5 rounded-2xl shadow-sm text-center border border-blue-500">
            <div className="text-[11px] font-black uppercase tracking-wider text-blue-100 mb-1 flex items-center justify-center gap-1">
              <span>📱</span>
              <span>ONLINE</span>
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-tight leading-none drop-shadow-sm">
              {formatCurrency(onlineAmount)}
            </div>
          </div>

          {/* TOTAL CARD */}
          <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-md text-center border border-slate-800">
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-1 flex items-center justify-center gap-1">
              <span>💰</span>
              <span>TOTAL</span>
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-tight leading-none text-amber-300">
              {formatCurrency(totalAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY CTA BUTTON: + TODAY'S HISAB */}
      <button
        onClick={onStartHisab}
        className="w-full bg-[#4B5FC4] hover:bg-blue-700 active:scale-[0.98] text-white py-4 px-6 rounded-2xl font-black text-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-blue-400/30"
      >
        <PlusCircle className="w-7 h-7" />
        <span>{t.startHisabBtn}</span>
      </button>

      {/* SECONDARY ACTION: PAST RECORDS */}
      <div>
        <button
          onClick={onViewHistory}
          className="w-full bg-white hover:bg-slate-50 active:scale-95 text-slate-800 py-3.5 px-4 rounded-2xl font-black text-sm border-2 border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Calendar className="w-5 h-5 text-[#4B5FC4]" />
          <span>{t.pastRecordsBtn}</span>
        </button>
      </div>
    </div>
  );
};
