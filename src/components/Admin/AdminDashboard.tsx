import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency, getTodayDateString } from '../../utils/formatters';
import { Send, CheckCircle2, AlertTriangle, PieChart, Users, MapPin, FileSpreadsheet, Settings as SettingsIcon } from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: 'salesmen' | 'routes' | 'reports' | 'settings') => void;
  onEditEntry?: (entry: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
}) => {
  const { entries, salesmen, routes, language, showToast, settings } = useApp();
  const t = translations[language];

  const todayStr = getTodayDateString();

  // Today's Entries
  const todaysEntries = entries.filter((e) => e.date === todayStr);

  const totalCollection = todaysEntries.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCash = todaysEntries.reduce((acc, curr) => acc + curr.cashAmount, 0);
  const totalOnline = todaysEntries.reduce((acc, curr) => acc + curr.onlineAmount, 0);
  const totalEstimatedProfit = todaysEntries.reduce((acc, curr) => acc + curr.profitAmount, 0);

  // Cash vs Online Percentage
  const cashPct = totalCollection > 0 ? Math.round((totalCash / totalCollection) * 100) : 50;
  const onlinePct = 100 - cashPct;

  // Expected vs Actual calculation for today
  const totalExpected = routes.reduce((acc, curr) => acc + curr.expectedCollection, 0);
  const diffExpectedActual = totalCollection - totalExpected;

  // Salesmen status map
  const activeSalesmen = salesmen.filter((s) => s.status === 'active');
  const submittedCount = todaysEntries.length;
  const pendingCount = Math.max(0, activeSalesmen.length - submittedCount);

  const handleSendReminder = (salesmanName: string) => {
    showToast(`${salesmanName} ને રિમાઇન્ડર મોકલ્યું! 📲`);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top Admin Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-black text-slate-900">{t.adminDashboardTitle}</h2>
          <span className="text-xs font-bold text-[#4B5FC4] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {todayStr}
          </span>
        </div>

        {/* 4-KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Today Total Collection */}
          <div className="bg-[#4B5FC4] text-white p-4 rounded-2xl shadow-md border border-blue-500 col-span-2">
            <div className="text-xs font-black uppercase text-blue-100">{t.todaysOverview}</div>
            <div className="text-3xl font-black tracking-tight mt-1">
              {formatCurrency(totalCollection)}
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-100 mt-2 border-t border-white/20 pt-2">
              <span>{submittedCount}/{activeSalesmen.length} સેવ થયા</span>
              <span>{pendingCount} બાકી</span>
            </div>
          </div>

          {/* Cash Card */}
          <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-sm border border-emerald-500">
            <div className="text-[11px] font-extrabold uppercase text-emerald-100">💵 {t.cash}</div>
            <div className="text-xl font-black mt-0.5">{formatCurrency(totalCash)}</div>
          </div>

          {/* Online Card */}
          <div className="bg-blue-600 text-white p-3.5 rounded-2xl shadow-sm border border-blue-500">
            <div className="text-[11px] font-extrabold uppercase text-blue-100">📱 {t.onlineCollection}</div>
            <div className="text-xl font-black mt-0.5">{formatCurrency(totalOnline)}</div>
          </div>

          {/* Estimated Profit */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 col-span-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-extrabold uppercase text-amber-400">{t.estProfit}</div>
              <div className="text-2xl font-black text-amber-300 mt-0.5">
                {formatCurrency(totalEstimatedProfit)}
              </div>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-center">
              <span className="text-xs font-bold text-white">~{settings.defaultProfitPct}% Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ADMIN NAVIGATION SHORTCUTS */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onNavigateTab('salesmen')}
          className="bg-white hover:bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 shadow-sm text-center flex flex-col items-center justify-center gap-1 transition-all"
        >
          <Users size={20} className="text-[#4B5FC4]" />
          <span className="text-[11px] font-extrabold text-slate-800">સેલ્સમેન</span>
        </button>

        <button
          onClick={() => onNavigateTab('routes')}
          className="bg-white hover:bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 shadow-sm text-center flex flex-col items-center justify-center gap-1 transition-all"
        >
          <MapPin size={20} className="text-emerald-600" />
          <span className="text-[11px] font-extrabold text-slate-800">રૂટ</span>
        </button>

        <button
          onClick={() => onNavigateTab('reports')}
          className="bg-white hover:bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 shadow-sm text-center flex flex-col items-center justify-center gap-1 transition-all"
        >
          <FileSpreadsheet size={20} className="text-amber-600" />
          <span className="text-[11px] font-extrabold text-slate-800">રિપોર્ટ</span>
        </button>

        <button
          onClick={() => onNavigateTab('settings')}
          className="bg-white hover:bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 shadow-sm text-center flex flex-col items-center justify-center gap-1 transition-all"
        >
          <SettingsIcon size={20} className="text-slate-600" />
          <span className="text-[11px] font-extrabold text-slate-800">સેટિંગ્સ</span>
        </button>
      </div>

      {/* CASH VS ONLINE SPLIT PROGRESS BAR */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-slate-700 flex items-center gap-1">
            <PieChart size={14} className="text-[#4B5FC4]" />
            <span>{t.cashVsOnlineSplit}</span>
          </span>
          <span className="text-slate-500">Total: {formatCurrency(totalCollection)}</span>
        </div>

        {/* Visual Split Bar */}
        <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden flex font-black text-[10px] text-white">
          <div
            style={{ width: `${cashPct}%` }}
            className="bg-emerald-600 h-full flex items-center justify-center transition-all duration-500"
          >
            {cashPct}% Cash
          </div>
          <div
            style={{ width: `${onlinePct}%` }}
            className="bg-blue-600 h-full flex items-center justify-center transition-all duration-500"
          >
            {onlinePct}% Online
          </div>
        </div>

        <div className="flex justify-between text-xs font-bold pt-1">
          <span className="text-emerald-700">💵 {formatCurrency(totalCash)} ({cashPct}%)</span>
          <span className="text-blue-700">📱 {formatCurrency(totalOnline)} ({onlinePct}%)</span>
        </div>
      </div>

      {/* EXPECTED VS ACTUAL VARIANCE TRACKER */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm space-y-2">
        <div className="text-xs font-black uppercase text-slate-500 tracking-wider">
          અપેક્ષિત vs ખરેખર કલેક્શન (Target Variance)
        </div>

        <div className="flex items-center justify-between text-sm pt-1">
          <div>
            <span className="text-xs font-bold text-slate-500 block">{t.expectedAmount}</span>
            <span className="font-black text-slate-800 text-lg">{formatCurrency(totalExpected)}</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 block">{t.actualAmount}</span>
            <span className="font-black text-slate-900 text-lg">{formatCurrency(totalCollection)}</span>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl font-extrabold text-xs flex items-center justify-between ${
            diffExpectedActual >= 0
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-amber-50 text-amber-900 border border-amber-200'
          }`}
        >
          <span>{t.difference}:</span>
          <span className="text-sm font-black">
            {diffExpectedActual >= 0
              ? `${t.extraAmount} ${formatCurrency(diffExpectedActual)}`
              : `${t.shortAmount} ${formatCurrency(Math.abs(diffExpectedActual))}`}
          </span>
        </div>
      </div>

      {/* SALESMEN STATUS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">
            {t.salesmenStatus}
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {submittedCount} Done / {pendingCount} Pending
          </span>
        </div>

        <div className="space-y-2.5">
          {activeSalesmen.map((salesman) => {
            const entry = todaysEntries.find((e) => e.salesmanId === salesman.id);
            const isSubmitted = !!entry;

            const route = routes.find((r) => r.id === salesman.routeId);

            return (
              <div
                key={salesman.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isSubmitted
                    ? 'bg-white border-emerald-300 shadow-sm'
                    : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center ${
                      isSubmitted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {salesman.name.charAt(0)}
                  </div>

                  <div>
                    <div className="font-black text-slate-900 text-sm">{salesman.name}</div>
                    <div className="text-xs font-semibold text-slate-500">
                      {route?.name || 'No Route'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {isSubmitted ? (
                    <div>
                      <div className="font-black text-slate-900 text-sm">
                        {formatCurrency(entry.totalAmount)}
                      </div>
                      <div className="text-[11px] font-extrabold text-emerald-600 flex items-center justify-end gap-1">
                        <CheckCircle2 size={12} />
                        <span>{t.submitted}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[11px] font-extrabold text-amber-700 flex items-center justify-end gap-1 mb-1">
                        <AlertTriangle size={12} />
                        <span>{t.pending}</span>
                      </div>
                      <button
                        onClick={() => handleSendReminder(salesman.name)}
                        className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Send size={11} />
                        <span>{t.sendReminder}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
