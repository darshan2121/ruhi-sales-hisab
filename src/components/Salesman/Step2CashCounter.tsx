import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency, calculateCashTotal, calculateTotalNotes } from '../../utils/formatters';
import type { CashBreakdown } from '../../types';
import { ArrowLeft, ArrowRight, Plus, Minus, Banknote } from 'lucide-react';

interface Step2CashCounterProps {
  cashBreakdown: CashBreakdown;
  onChangeBreakdown: (breakdown: CashBreakdown) => void;
  onNext: () => void;
  onBack: () => void;
}

const DENOMINATIONS: (keyof CashBreakdown)[] = [500, 200, 100, 50, 20, 10, 5, 2, 1];

export const Step2CashCounter: React.FC<Step2CashCounterProps> = ({
  cashBreakdown,
  onChangeBreakdown,
  onNext,
  onBack,
}) => {
  const { language } = useApp();
  const t = translations[language];

  const handleIncrement = (denom: keyof CashBreakdown) => {
    onChangeBreakdown({
      ...cashBreakdown,
      [denom]: (cashBreakdown[denom] || 0) + 1,
    });
  };

  const handleDecrement = (denom: keyof CashBreakdown) => {
    const current = cashBreakdown[denom] || 0;
    if (current > 0) {
      onChangeBreakdown({
        ...cashBreakdown,
        [denom]: current - 1,
      });
    }
  };

  const handleInputChange = (denom: keyof CashBreakdown, val: string) => {
    const parsed = parseInt(val, 10);
    onChangeBreakdown({
      ...cashBreakdown,
      [denom]: isNaN(parsed) || parsed < 0 ? 0 : parsed,
    });
  };

  const totalCash = calculateCashTotal(cashBreakdown);
  const totalNotes = calculateTotalNotes(cashBreakdown);

  return (
    <div className="space-y-4 pb-28">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-600 font-extrabold text-sm hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>{t.backBtn}</span>
        </button>
        <span className="text-xs font-black bg-blue-100 text-[#4B5FC4] px-3 py-1 rounded-full">
          STEP 2 / 3
        </span>
      </div>

      {/* Screen Title */}
      <div className="bg-[#4B5FC4] text-white p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <Banknote className="w-6 h-6 text-amber-300" />
          <h2 className="text-xl font-black">{t.step2Title}</h2>
        </div>
        <p className="text-xs font-medium text-blue-100 mt-1">{t.step2Sub}</p>
      </div>

      {/* Note-wise Denomination Input Rows */}
      <div className="space-y-2.5">
        {DENOMINATIONS.map((denom) => {
          const count = cashBreakdown[denom] || 0;
          const rowSubtotal = count * denom;

          return (
            <div
              key={denom}
              className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between ${
                count > 0
                  ? 'bg-white border-blue-400 shadow-sm ring-1 ring-blue-300/50'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* Denomination Pill */}
              <div className="flex items-center gap-3 w-28">
                <div
                  className={`px-3 py-1.5 rounded-xl font-black text-base ${
                    denom >= 100
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-amber-600 text-white shadow-sm'
                  }`}
                >
                  ₹{denom}
                </div>
              </div>

              {/* Incremental Touch Controls & Direct Input */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleDecrement(denom)}
                  className="w-10 h-10 bg-slate-200 hover:bg-slate-300 active:scale-90 text-slate-800 font-black rounded-xl flex items-center justify-center transition-all cursor-pointer"
                >
                  <Minus size={18} />
                </button>

                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={count === 0 ? '' : count}
                  placeholder="0"
                  onChange={(e) => handleInputChange(denom, e.target.value)}
                  className="w-16 h-10 text-center font-black text-lg bg-white border-2 border-slate-300 rounded-xl focus:border-[#4B5FC4] focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-inner"
                />

                <button
                  type="button"
                  onClick={() => handleIncrement(denom)}
                  className="w-10 h-10 bg-[#4B5FC4] hover:bg-blue-700 active:scale-90 text-white font-black rounded-xl flex items-center justify-center shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Subtotal Display */}
              <div className="text-right min-w-[75px]">
                <div className="text-xs font-bold text-slate-400">× ₹{denom}</div>
                <div
                  className={`font-black text-sm ${
                    rowSubtotal > 0 ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {formatCurrency(rowSubtotal)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Bar for Live Total & Next Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 p-4 shadow-2xl z-30 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-black uppercase text-slate-500">{t.totalCash}</div>
            <div className="text-2xl font-black text-emerald-600">{formatCurrency(totalCash)}</div>
          </div>
          <div className="text-right bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase">{t.totalNotes}</div>
            <div className="text-base font-black text-slate-800">{totalNotes} નોટો</div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-[#4B5FC4] hover:bg-blue-700 active:scale-98 text-white py-3.5 px-6 rounded-2xl font-black text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
