import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { ArrowLeft, ArrowRight, Smartphone, Building2, CreditCard } from 'lucide-react';

interface Step3OnlineProps {
  onlineAmount: number;
  onlineMode: 'UPI' | 'Bank Transfer' | 'Other' | 'Combined';
  onChangeAmount: (amt: number) => void;
  onChangeMode: (mode: 'UPI' | 'Bank Transfer' | 'Other' | 'Combined') => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Online: React.FC<Step3OnlineProps> = ({
  onlineAmount,
  onlineMode,
  onChangeAmount,
  onChangeMode,
  onNext,
  onBack,
}) => {
  const { language } = useApp();
  const t = translations[language];

  const handleQuickAdd = (amtToAdd: number) => {
    onChangeAmount(onlineAmount + amtToAdd);
  };

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
        <span className="text-xs font-black bg-blue-100 text-[#4B5FC4] px-3 py-1 rounded-full">
          STEP 3 / 3
        </span>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900">{t.step3Title}</h2>
        <p className="text-sm font-extrabold text-[#4B5FC4] mt-1">{t.step3Question}</p>
      </div>

      {/* Large Input Container */}
      <div className="bg-white p-5 rounded-2xl border-2 border-blue-400 shadow-md">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
          {t.onlineCollection}
        </div>
        <div className="flex items-center gap-2 border-b-2 border-[#4B5FC4] pb-3">
          <span className="text-4xl font-black text-[#4B5FC4]">₹</span>
          <input
            type="number"
            inputMode="numeric"
            value={onlineAmount === 0 ? '' : onlineAmount}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChangeAmount(isNaN(val) ? 0 : val);
            }}
            placeholder="0"
            className="w-full text-4xl font-black text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-300"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs font-bold text-slate-400">ઉમેરો:</span>
          {[500, 1000, 2000, 5000].map((quick) => (
            <button
              key={quick}
              type="button"
              onClick={() => handleQuickAdd(quick)}
              className="bg-blue-50 hover:bg-blue-100 active:scale-95 text-[#4B5FC4] text-xs font-extrabold px-3 py-1.5 rounded-xl border border-blue-200 transition-all cursor-pointer"
            >
              +₹{quick}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Mode Selection */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-500">{t.paymentMode}</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'UPI', label: t.upi, icon: Smartphone },
            { id: 'Bank Transfer', label: t.bank, icon: Building2 },
            { id: 'Other', label: t.other, icon: CreditCard },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = onlineMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onChangeMode(mode.id as any)}
                className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'border-[#4B5FC4] bg-blue-50 text-[#4B5FC4] font-black shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs leading-tight">{mode.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onNext}
        className="w-full bg-[#4B5FC4] hover:bg-blue-700 active:scale-98 text-white py-4 px-6 rounded-2xl font-black text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-6"
      >
        <span>{t.continueBtn}</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
