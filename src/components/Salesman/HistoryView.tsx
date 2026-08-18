import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency, formatDate, getTodayDateString } from '../../utils/formatters';
import { ArrowLeft, Calendar, Filter, Edit2, Search } from 'lucide-react';
import type { HisabEntry } from '../../types';

interface HistoryViewProps {
  onBack: () => void;
  onEditEntry?: (entry: HisabEntry) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onBack, onEditEntry }) => {
  const { entries, activeSalesman, currentRole, language } = useApp();
  const t = translations[language];

  const [activeFilter, setActiveFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter entries based on role, date filter chip, and search query
  const filteredEntries = entries.filter((e) => {
    // If salesman role, show only active salesman entries
    if (currentRole === 'salesman' && e.salesmanId !== activeSalesman.id) {
      return false;
    }

    // Search query
    if (
      searchQuery &&
      !e.routeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !e.salesmanName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    const todayStr = getTodayDateString();
    const entryDate = new Date(e.date);
    const todayDate = new Date(todayStr);

    if (activeFilter === 'today') {
      return e.date === todayStr;
    }
    if (activeFilter === 'yesterday') {
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      return e.date === yesterdayStr;
    }
    if (activeFilter === 'week') {
      const sevenDaysAgo = new Date(todayDate);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return entryDate >= sevenDaysAgo;
    }
    if (activeFilter === 'month') {
      const thirtyDaysAgo = new Date(todayDate);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    }

    return true;
  });

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
        <span className="text-xs font-black text-slate-400">
          {filteredEntries.length} RECORDS
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#4B5FC4]" />
          <span>{t.historyTitle}</span>
        </h2>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: t.filterAll },
          { id: 'today', label: t.filterToday },
          { id: 'yesterday', label: t.filterYesterday },
          { id: 'week', label: t.filterThisWeek },
          { id: 'month', label: t.filterThisMonth },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-3.5 py-1.5 rounded-full font-black text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === f.id
                ? 'bg-[#4B5FC4] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="રૂટ અથવા નામથી શોધો..."
          className="w-full bg-white pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Record Cards List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
          <Filter size={32} className="mx-auto text-slate-300" />
          <p className="text-slate-500 font-bold text-sm">{t.noRecords}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-3"
            >
              {/* Header: Date & Route */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-xs font-extrabold text-[#4B5FC4]">
                    {formatDate(entry.date)}
                  </span>
                  <h4 className="font-black text-slate-900 text-base">{entry.routeName}</h4>
                </div>
                {onEditEntry && (
                  <button
                    onClick={() => onEditEntry(entry)}
                    className="p-2 text-slate-400 hover:text-[#4B5FC4] hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>

              {/* Amount Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 block">
                    💵 CASH
                  </span>
                  <span className="font-black text-emerald-900 text-sm">
                    {formatCurrency(entry.cashAmount)}
                  </span>
                </div>

                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-extrabold uppercase text-blue-700 block">
                    📱 ONLINE
                  </span>
                  <span className="font-black text-blue-900 text-sm">
                    {formatCurrency(entry.onlineAmount)}
                  </span>
                </div>
              </div>

              {/* Total & Profit Footer */}
              <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                    {t.totalCollection}
                  </span>
                  <span className="font-black text-amber-300 text-lg">
                    {formatCurrency(entry.totalAmount)}
                  </span>
                </div>
                {currentRole === 'admin' && (
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-emerald-400 uppercase block">
                      {t.todaysProfit} ({entry.profitPct}%)
                    </span>
                    <span className="font-black text-emerald-300 text-lg">
                      {formatCurrency(entry.profitAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
