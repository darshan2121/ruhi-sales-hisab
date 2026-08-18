import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/formatters';
import type { HisabEntry } from '../types';
import { X, Check, History, Edit3 } from 'lucide-react';

interface EditHisabModalProps {
  entry: HisabEntry;
  onClose: () => void;
}

export const EditHisabModal: React.FC<EditHisabModalProps> = ({ entry, onClose }) => {
  const { updateHisabEntry, currentRole, activeSalesman, language } = useApp();
  const t = translations[language];

  const [cashAmount, setCashAmount] = useState(entry.cashAmount);
  const [onlineAmount, setOnlineAmount] = useState(entry.onlineAmount);

  const totalAmount = cashAmount + onlineAmount;
  const profitAmount = Math.round(totalAmount * (entry.profitPct / 100));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const editorName = currentRole === 'admin' ? 'Owner / Admin' : activeSalesman.name;

    updateHisabEntry(
      entry.id,
      {
        cashAmount,
        onlineAmount,
        totalAmount,
        profitAmount,
        difference: totalAmount - entry.expectedCollection,
      },
      editorName
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 border-2 border-blue-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#4B5FC4]">
            <Edit3 size={20} />
            <h3 className="text-lg font-black text-slate-900">હિસાબ સુધારો (Edit Entry)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800">
            <X size={20} />
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 p-2 rounded-xl">
          {entry.salesmanName} • {entry.routeName} ({entry.date})
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs font-extrabold">
          <div>
            <label className="text-slate-500 block mb-1">💵 CASH AMOUNT (₹)</label>
            <input
              type="number"
              required
              value={cashAmount}
              onChange={(e) => setCashAmount(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl font-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="text-slate-500 block mb-1">📱 ONLINE AMOUNT (₹)</label>
            <input
              type="number"
              required
              value={onlineAmount}
              onChange={(e) => setOnlineAmount(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl font-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Recalculated Summary Box */}
          <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-400">નવો કુલ સરવાળો (New Total):</span>
              <span className="font-black text-lg text-amber-300">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-400">નવો નફો ({entry.profitPct}%):</span>
              <span className="font-black text-sm text-emerald-300">
                {formatCurrency(profitAmount)}
              </span>
            </div>
          </div>

          {/* Audit Logs History */}
          {entry.auditLogs && entry.auditLogs.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-black text-slate-500 flex items-center gap-1">
                <History size={12} />
                <span>ઓડિટ લોગ (Audit Log Trail)</span>
              </span>
              <div className="max-h-24 overflow-y-auto space-y-1 bg-slate-50 p-2 rounded-xl border text-[10px]">
                {entry.auditLogs.map((log) => (
                  <div key={log.id} className="text-slate-600 border-b border-slate-200 pb-1">
                    <span className="font-bold">{log.editedBy}</span> on{' '}
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    : {formatCurrency(log.oldTotal)} → {formatCurrency(log.newTotal)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-black text-sm"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="w-full bg-[#4B5FC4] text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-1 shadow-md"
            >
              <Check size={16} />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
