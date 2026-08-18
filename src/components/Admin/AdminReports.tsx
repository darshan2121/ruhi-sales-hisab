import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV, printSummaryReport } from '../../utils/exportUtils';
import { ArrowLeft, Download, Printer, Edit2, Trash2, FileSpreadsheet, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import type { HisabEntry } from '../../types';

interface AdminReportsProps {
  onBack: () => void;
  onEditEntry?: (entry: HisabEntry) => void;
}

export const AdminReports: React.FC<AdminReportsProps> = ({ onBack, onEditEntry }) => {
  const { entries, salesmen, routes, deleteHisabEntry, deleteMultipleHisabEntries, language } = useApp();
  const t = translations[language];

  const [selectedSalesmanId, setSelectedSalesmanId] = useState<string>('all');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('all');

  // Multi-select state
  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([]);
  const [deleteConfirmSingleId, setDeleteConfirmSingleId] = useState<string | null>(null);
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);

  const filteredEntries = entries.filter((e) => {
    if (selectedSalesmanId !== 'all' && e.salesmanId !== selectedSalesmanId) return false;
    if (selectedRouteId !== 'all' && e.routeId !== selectedRouteId) return false;
    return true;
  });

  const totalColl = filteredEntries.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCash = filteredEntries.reduce((acc, curr) => acc + curr.cashAmount, 0);
  const totalOnline = filteredEntries.reduce((acc, curr) => acc + curr.onlineAmount, 0);
  const totalProfit = filteredEntries.reduce((acc, curr) => acc + curr.profitAmount, 0);

  // Checkbox Handlers
  const isAllSelected =
    filteredEntries.length > 0 && filteredEntries.every((e) => selectedEntryIds.includes(e.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedEntryIds([]);
    } else {
      setSelectedEntryIds(filteredEntries.map((e) => e.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedEntryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete Actions
  const handleConfirmSingleDelete = () => {
    if (deleteConfirmSingleId) {
      deleteHisabEntry(deleteConfirmSingleId);
      setSelectedEntryIds((prev) => prev.filter((id) => id !== deleteConfirmSingleId));
      setDeleteConfirmSingleId(null);
    }
  };

  const handleConfirmBatchDelete = () => {
    if (selectedEntryIds.length > 0) {
      deleteMultipleHisabEntries(selectedEntryIds);
      setSelectedEntryIds([]);
      setShowBatchDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-600 font-extrabold text-sm hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>{t.backBtn}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => exportToCSV(filteredEntries)}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>CSV</span>
          </button>
          <button
            onClick={() => printSummaryReport(filteredEntries)}
            className="bg-[#4B5FC4] hover:bg-blue-700 active:scale-95 text-white font-black text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          >
            <Printer size={14} />
            <span>પ્રિન્ટ</span>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-amber-600" />
          <span>રિપોર્ટ અને હિસાબ હિસ્ટ્રી</span>
        </h2>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-xs font-bold shadow-sm">
        <div>
          <label className="text-slate-400 block mb-1">સેલ્સમેન (Filter)</label>
          <select
            value={selectedSalesmanId}
            onChange={(e) => setSelectedSalesmanId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-800 font-bold focus:outline-none cursor-pointer"
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
            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-800 font-bold focus:outline-none cursor-pointer"
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

      {/* Multi-Select & Batch Actions Toolbar */}
      {filteredEntries.length > 0 && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2 text-xs">
          <button
            onClick={handleToggleSelectAll}
            className="flex items-center gap-2 text-slate-700 font-extrabold cursor-pointer hover:text-slate-900"
          >
            {isAllSelected ? (
              <CheckSquare size={18} className="text-[#4B5FC4]" />
            ) : (
              <Square size={18} className="text-slate-400" />
            )}
            <span>
              {isAllSelected ? 'બધા બિનપસંદ કરો' : 'બધા પસંદ કરો (Select All)'}
            </span>
          </button>

          {selectedEntryIds.length > 0 && (
            <button
              onClick={() => setShowBatchDeleteConfirm(true)}
              className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Trash2 size={15} />
              <span>{selectedEntryIds.length} પસંદ કરેલ ડિલીટ કરો</span>
            </button>
          )}
        </div>
      )}

      {/* Table Records List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 font-bold text-sm">
          {t.noRecords}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredEntries.map((entry) => {
            const isSelected = selectedEntryIds.includes(entry.id);

            return (
              <div
                key={entry.id}
                className={`bg-white p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-xs gap-3 ${
                  isSelected ? 'border-[#4B5FC4] bg-blue-50/30 shadow-md' : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Select Checkbox & Info */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleSelectOne(entry.id)}
                    className="text-slate-400 hover:text-[#4B5FC4] cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare size={20} className="text-[#4B5FC4]" />
                    ) : (
                      <Square size={20} className="text-slate-300" />
                    )}
                  </button>

                  <div>
                    <div className="font-extrabold text-[#4B5FC4]">{formatDate(entry.date)}</div>
                    <div className="font-black text-slate-900 text-sm">{entry.salesmanName}</div>
                    <div className="text-slate-500 font-medium">{entry.routeName}</div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="text-right space-y-1">
                  <div className="font-black text-slate-900 text-base">
                    {formatCurrency(entry.totalAmount)}
                  </div>
                  <div className="font-extrabold text-emerald-600">
                    Profit: {formatCurrency(entry.profitAmount)}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {onEditEntry && (
                      <button
                        onClick={() => onEditEntry(entry)}
                        title="સુધારો (Edit)"
                        className="text-slate-400 hover:text-[#4B5FC4] p-1 rounded-lg hover:bg-blue-50 transition-all cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteConfirmSingleId(entry.id)}
                      title="ડિલીટ કરો (Delete)"
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SINGLE ENTRY DELETE CONFIRM MODAL */}
      {deleteConfirmSingleId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl text-center space-y-4 animate-in zoom-in-95 border-2 border-rose-400">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto font-black">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">શું તમે આ એન્ટ્રી ડિલીટ કરવા માંગો છો?</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">આ હિસાબ સિસ્ટમમાંથી કાયમી ધોરણે દૂર થશે.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmSingleId(null)}
                className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-xl font-extrabold text-xs cursor-pointer"
              >
                રદ કરો
              </button>
              <button
                onClick={handleConfirmSingleDelete}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-black text-xs shadow-md cursor-pointer"
              >
                હા, ડિલીટ કરો
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BATCH MULTI-DELETE CONFIRM MODAL */}
      {showBatchDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl text-center space-y-4 animate-in zoom-in-95 border-2 border-rose-400">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto font-black">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                શું તમે {selectedEntryIds.length} એન્ટ્રીઝ એકસાથે ડિલીટ કરવા માંગો છો?
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                પસંદ કરેલ તમામ એન્ટ્રીઝ કાયમી ધોરણે ડિલીટ થશે.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowBatchDeleteConfirm(false)}
                className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-xl font-extrabold text-xs cursor-pointer"
              >
                રદ કરો
              </button>
              <button
                onClick={handleConfirmBatchDelete}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-black text-xs shadow-md cursor-pointer"
              >
                હા, {selectedEntryIds.length} ડિલીટ કરો
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
