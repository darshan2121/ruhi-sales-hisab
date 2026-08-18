import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency } from '../../utils/formatters';
import type { HisabEntry } from '../../types';
import { CheckCircle, Home, Eye } from 'lucide-react';

interface SuccessModalProps {
  entry: HisabEntry;
  onGoHome: () => void;
  onViewHistory: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  entry,
  onGoHome,
  onViewHistory,
}) => {
  const { language } = useApp();
  const t = translations[language];

  useEffect(() => {
    // Fire confetti celebration animation!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-5 animate-in zoom-in-95 border-4 border-emerald-400">
        {/* Big Check Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-14 h-14" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">{t.successTitle}</h2>
          <p className="text-xs font-bold text-slate-500 mt-1">{entry.routeName}</p>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-slate-500">{t.totalCollection}</span>
            <span className="font-black text-slate-900 text-lg">
              {formatCurrency(entry.totalAmount)}
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onGoHome}
          className="w-full bg-[#4B5FC4] hover:bg-blue-700 active:scale-95 text-white py-4 px-6 rounded-2xl font-black text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Home size={20} />
          <span>{t.goHome}</span>
        </button>

        {/* Secondary View Details */}
        <button
          onClick={onViewHistory}
          className="w-full text-slate-600 hover:text-slate-900 font-extrabold text-sm flex items-center justify-center gap-1.5 py-1"
        >
          <Eye size={16} />
          <span>{t.viewDetails}</span>
        </button>
      </div>
    </div>
  );
};
