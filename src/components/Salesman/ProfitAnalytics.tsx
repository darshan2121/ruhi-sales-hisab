import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowLeft, TrendingUp, Calendar, Award } from 'lucide-react';

interface ProfitAnalyticsProps {
  onBack: () => void;
}

export const ProfitAnalytics: React.FC<ProfitAnalyticsProps> = ({ onBack }) => {
  const { entries, activeSalesman, language } = useApp();
  const t = translations[language];

  const [tab, setTab] = useState<'week' | 'month'>('week');

  // Filter entries for active salesman
  const salesmanEntries = entries.filter((e) => e.salesmanId === activeSalesman.id);

  // Compute days threshold
  const daysLimit = tab === 'week' ? 7 : 30;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysLimit);

  const periodEntries = salesmanEntries.filter(
    (e) => new Date(e.date) >= cutoffDate
  );

  const totalCollection = periodEntries.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalProfit = periodEntries.reduce((acc, curr) => acc + curr.profitAmount, 0);
  const daysWorked = periodEntries.length;
  const avgPerDay = daysWorked > 0 ? Math.round(totalCollection / daysWorked) : 0;

  // Max value for scaling visual bar charts
  const maxCollection = Math.max(...periodEntries.map((e) => e.totalAmount), 1);

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

        {/* Tab Switcher */}
        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setTab('week')}
            className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
              tab === 'week' ? 'bg-[#4B5FC4] text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            {t.filterThisWeek}
          </button>
          <button
            onClick={() => setTab('month')}
            className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
              tab === 'month' ? 'bg-[#4B5FC4] text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            {t.filterThisMonth}
          </button>
        </div>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          <span>{tab === 'week' ? t.weeklyTitle : t.monthlyTitle}</span>
        </h2>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Profit Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-md border border-emerald-500 col-span-2">
          <div className="text-xs font-extrabold uppercase text-emerald-100 flex items-center gap-1.5">
            <Award size={16} />
            <span>{t.todaysProfit}</span>
          </div>
          <div className="text-3xl font-black tracking-tight mt-1">
            {formatCurrency(totalProfit)}
          </div>
          <div className="text-xs font-bold text-emerald-100 mt-2 flex items-center justify-between border-t border-white/20 pt-2">
            <span>{t.totalCollection}: {formatCurrency(totalCollection)}</span>
            <span>{activeSalesman.customProfitPct || 7}% Rate</span>
          </div>
        </div>

        {/* Days Worked Card */}
        <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm text-center">
          <div className="text-[11px] font-extrabold text-slate-500 uppercase">{t.totalWorkDays}</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{daysWorked} દિવસ</div>
        </div>

        {/* Average per Day Card */}
        <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm text-center">
          <div className="text-[11px] font-extrabold text-slate-500 uppercase">{t.avgPerDay}</div>
          <div className="text-xl font-black text-[#4B5FC4] mt-0.5">{formatCurrency(avgPerDay)}</div>
        </div>
      </div>

      {/* Daily Visual Bar Chart */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
            દૈનિક હિસાબ ગ્રાફ (Daily Trend)
          </h3>
          <Calendar size={14} className="text-slate-400" />
        </div>

        {periodEntries.length === 0 ? (
          <div className="text-center py-6 text-slate-400 font-bold text-xs">{t.noRecords}</div>
        ) : (
          <div className="space-y-2.5 pt-2">
            {periodEntries.slice(0, 10).map((entry) => {
              return (
                <div key={entry.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{formatDate(entry.date)} ({entry.routeName.split(' ')[0]})</span>
                    <span className="font-black text-slate-900">{formatCurrency(entry.totalAmount)}</span>
                  </div>

                  <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden flex">
                    {/* Cash Portion Bar */}
                    <div
                      style={{
                        width: `${Math.round((entry.cashAmount / maxCollection) * 100)}%`,
                      }}
                      className="bg-emerald-500 h-full transition-all duration-500"
                      title={`Cash: ${formatCurrency(entry.cashAmount)}`}
                    />
                    {/* Online Portion Bar */}
                    <div
                      style={{
                        width: `${Math.round((entry.onlineAmount / maxCollection) * 100)}%`,
                      }}
                      className="bg-blue-500 h-full transition-all duration-500"
                      title={`Online: ${formatCurrency(entry.onlineAmount)}`}
                    />
                  </div>
                  <div className="text-[10px] text-right font-extrabold text-emerald-600">
                    + {formatCurrency(entry.profitAmount)} profit
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Cash</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
