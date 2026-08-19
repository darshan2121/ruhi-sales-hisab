import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency } from '../../utils/formatters';
import type { Route, PendingPayment } from '../../types';
import { ArrowLeft, ArrowRight, AlertTriangle, Plus, Trash2, User, Phone, IndianRupee, Calendar, CheckCircle2, Clock } from 'lucide-react';

export type PendingPaymentDraft = Omit<PendingPayment, 'id' | 'createdAt' | 'status'>;

interface Step4MarketOutstandingProps {
  route: Route;
  cashAmount: number;
  onlineAmount: number;
  pendingPayments: PendingPaymentDraft[];
  onAddPendingPayment: (payment: PendingPaymentDraft) => void;
  onRemovePendingPayment: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4MarketOutstanding: React.FC<Step4MarketOutstandingProps> = ({
  route,
  cashAmount,
  onlineAmount,
  pendingPayments,
  onAddPendingPayment,
  onRemovePendingPayment,
  onNext,
  onBack,
}) => {
  const { language, activeSalesman } = useApp();
  const t = translations[language];

  const totalCollectedSoFar = cashAmount + onlineAmount;
  const expectedCollection = route.expectedCollection || 0;
  const totalSessionPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  
  // Calculate remaining gap between expected collection and total (collected + pending)
  const remainingGap = Math.max(0, expectedCollection - totalCollectedSoFar - totalSessionPending);

  // Form State for adding a pending customer
  const [showAddForm, setShowAddForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState(remainingGap > 0 ? remainingGap.toString() : '');
  const [dueDate, setDueDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg('કૃપા કરીને ગ્રાહકનું નામ લખો');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setErrorMsg('કૃપા કરીને ૧૦-અંકનો સાચો મોબાઈલ નંબર દાખલ કરો');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('કૃપા કરીને યોગ્ય બાકી રકમ લખો');
      return;
    }

    onAddPendingPayment({
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      amount: numAmount,
      routeName: route.name,
      salesmanId: activeSalesman.id,
      salesmanName: activeSalesman.name,
      dueDate,
      notes: notes.trim(),
    });

    // Reset Form
    setCustomerName('');
    setMobile('');
    setAmount('');
    setNotes('');
    setShowAddForm(false);
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
        <span className="text-xs font-black bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
          STEP 4 / 4
        </span>
      </div>

      {/* Screen Title */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-200" />
          <h2 className="text-xl font-black">{t.step4Title}</h2>
        </div>
        <p className="text-xs font-medium text-amber-100 mt-1">{t.step4Sub}</p>
      </div>

      {/* Route Expected vs Collection Tracker Card */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>રૂટ અપેક્ષિત કલેક્શન (Expected):</span>
          <span className="font-black text-slate-900">{formatCurrency(expectedCollection)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
            <span className="text-emerald-800 font-bold block">રોકડ + ઓનલાઈન</span>
            <span className="text-emerald-700 font-black text-base">{formatCurrency(totalCollectedSoFar)}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
            <span className="text-amber-800 font-bold block">માર્કેટ બાકી (Added)</span>
            <span className="text-amber-700 font-black text-base">{formatCurrency(totalSessionPending)}</span>
          </div>
        </div>

        {remainingGap > 0 && (
          <div className="bg-amber-100/70 border border-amber-300 p-2.5 rounded-xl flex items-center justify-between text-amber-900 text-xs font-extrabold">
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-amber-700" />
              <span>{t.remainingGap}:</span>
            </div>
            <span className="text-sm font-black text-amber-900">{formatCurrency(remainingGap)}</span>
          </div>
        )}
      </div>

      {/* Added Pending Payments List */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
            આજના બાકી ગ્રાહકો ({pendingPayments.length})
          </h3>
          {!showAddForm && (
            <button
              onClick={() => {
                if (remainingGap > 0 && !amount) {
                  setAmount(remainingGap.toString());
                }
                setShowAddForm(true);
              }}
              className="flex items-center gap-1 text-xs font-black bg-[#4B5FC4] text-white px-3 py-1.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Plus size={15} />
              <span>{t.addPendingCustomer}</span>
            </button>
          )}
        </div>

        {/* Form to add pending payment inline */}
        {showAddForm && (
          <form onSubmit={handleAdd} className="bg-white p-4 rounded-2xl border-2 border-blue-400 shadow-md space-y-3 mb-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-2 border-slate-100">
              <span className="text-xs font-black text-[#4B5FC4] uppercase tracking-wider">
                📝 બાકી લેણી રકમ એડ કરો
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕ બંધ કરો
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2 rounded-xl font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            <div>
              <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                ગ્રાહકનું નામ (Customer Name) *
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="દા.ત. શર્મા જનરલ સ્ટોર"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#4B5FC4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                  મોબાઈલ નંબર *
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#4B5FC4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                  બાકી રકમ (₹) *
                </label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#4B5FC4]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                  ચૂકવણી તારીખ (Due Date)
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#4B5FC4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                  નોંધ (ઓપ્શનલ)
                </label>
                <input
                  type="text"
                  placeholder="દા.ત. કાલે આપશે"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#4B5FC4]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4B5FC4] hover:bg-blue-700 active:scale-95 text-white font-black text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              <span>આજના હિસાબમાં એડ કરો</span>
            </button>
          </form>
        )}

        {/* Existing Added Pending Payments */}
        {pendingPayments.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-75" />
            <div className="text-xs font-bold text-slate-600">
              આજના રૂટ પર કોઈ ગ્રાહકની બાકી રકમ નથી?
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              જો કોઈ ગ્રાહક પૈસા આપવાના બાકી હોય તો ઉપર "બાકી ગ્રાહક ઉમેરો" પર ક્લિક કરો, અથવા ફાઈનલ સમરી પર આગળ વધો.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingPayments.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{item.customerName}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      📱 {item.mobile}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    ચૂકવણી: {item.dueDate} {item.notes && `• ${item.notes}`}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-amber-700">
                    {formatCurrency(item.amount)}
                  </span>
                  <button
                    onClick={() => onRemovePendingPayment(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Primary Action Button to Continue to Summary */}
      <button
        onClick={onNext}
        className="w-full bg-[#4B5FC4] hover:bg-blue-700 active:scale-98 text-white py-4 px-6 rounded-2xl font-black text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-6"
      >
        <span>ફાઈનલ સમરી જુઓ →</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
