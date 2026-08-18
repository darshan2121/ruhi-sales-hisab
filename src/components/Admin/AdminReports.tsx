import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV, printSummaryReport } from '../../utils/exportUtils';
import { ArrowLeft, Download, Printer, Edit2, FileSpreadsheet } from 'lucide-react';
import type { HisabEntry } from '../../types';

interface AdminReportsProps {
  onBack: () => void;
  onEditEntry?: (entry: HisabEntry) => void;
}

export const AdminReports: React.FC<AdminReportsProps> = ({ onBack, onEditEntry }) => {
  const { entries, salesmen, routes, language } = useApp();
  const t = translations[language];

  const [selectedSalesmanId, setSelectedSalesmanId] = useState<string>('all');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('all');

  const filteredEntries = entries.filter((e) => {
    if (selectedSalesmanId !== 'all' && e.salesmanId !== selectedSalesmanId) return false;
    if (selectedRouteId !== 'all' && e.routeId !== selectedRouteId) return false;
    return true;
  });

  const totalColl = filteredEntries.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCash = filteredEntries.reduce((acc, curr) => acc + curr.cashAmount, 0);
  const totalOnline = filteredEntries.reduce((acc, curr) => acc + curr.onlineAmount, 0);
  const totalProfit = filteredEntries.reduce((acc, curr) => acc + curr.profitAmount, 0);

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

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => exportToCSV(filteredEntries)}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all"
          >
            <Download size={14} />
            <span>CSV</span>
          </button>
          <button
            onClick={() => printSummaryReport(filteredEntries)}
            className="bg-[#4B5FC4] hover:bg-blue-700 active:scale-95 text-white font-black text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all"
          >
            <Printer size={14} />
            <span>પ્રિન્ટ</span>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-amber-600" />
          <span>રિપોર્ટ & એક્સપોર્ટ</span>
        </h2>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-xs font-bold">
        <div>
          <label className="text-slate-400 block mb-1">સેલ્સમેન (Filter)</label>
          <select
            value={selectedSalesmanId}
            onChange={(e) => setSelectedSalesmanId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-800 font-bold focus:outline-none"
          >
            <option value="all">બધા સેલ્સમેન (All)</option>
            {salesmen.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">રૂટ (Filter)</label>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-800 font-bold focus:outline-none"
          >
            <option value="all">બધા રૂટ (All)</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Aggregate Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-slate-400 font-bold uppercase block">{t.totalCollection}</span>
          <span className="text-xl font-black text-amber-300">{formatCurrency(totalColl)}</span>
        </div>
        <div>
          <span className="text-slate-400 font-bold uppercase block">{t.todaysProfit}</span>
          <span className="text-xl font-black text-emerald-400">{formatCurrency(totalProfit)}</span>
        </div>
        <div className="text-[11px] text-slate-300 font-medium">💵 Cash: {formatCurrency(totalCash)}</div>
        <div className="text-[11px] text-slate-300 font-medium">📱 Online: {formatCurrency(totalOnline)}</div>
      </div>

      {/* Table Records List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 font-bold text-sm">
          {t.noRecords}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-extrabold text-[#4B5FC4]">{formatDate(entry.date)}</div>
                <div className="font-black text-slate-900 text-sm">{entry.salesmanName}</div>
                <div className="text-slate-500 font-medium">{entry.routeName}</div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-black text-slate-900 text-base">
                  {formatCurrency(entry.totalAmount)}
                </div>
                <div className="font-extrabold text-emerald-600">
                  Profit: {formatCurrency(entry.profitAmount)}
                </div>
                {onEditEntry && (
                  <button
                    onClick={() => onEditEntry(entry)}
                    className="text-[11px] font-extrabold text-blue-600 flex items-center gap-0.5 ml-auto hover:underline"
                  >
                    <Edit2 size={12} />
                    <span>{t.edit}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
