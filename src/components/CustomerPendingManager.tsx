import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowLeft,
  Phone,
  User,
  MapPin,
  Calendar,
  IndianRupee,
  MessageCircle,
} from 'lucide-react';
import type { PendingPayment } from '../types';

interface Props {
  onBack?: () => void;
}

export const CustomerPendingManager: React.FC<Props> = ({ onBack }) => {
  const { pendingPayments, routes, activeSalesman, addPendingPayment, settlePendingPayment, settings } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'collected'>('pending');

  // New Pending Payment Form State
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [routeName, setRouteName] = useState(routes[0]?.name || 'Ahmedabad East');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calculate totals
  const totalPendingAmount = pendingPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCollectedAmount = pendingPayments
    .filter((p) => p.status === 'collected')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = pendingPayments.filter((p) => p.status === 'pending').length;

  // Filtered List
  const filteredList = pendingPayments.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mobile.includes(searchQuery) ||
      item.routeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg('કૃપા કરીને ગ્રાહકનું નામ લખો (Customer Name required)');
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

    addPendingPayment({
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      amount: numAmount,
      routeName,
      salesmanId: activeSalesman?.id || 's1',
      salesmanName: activeSalesman?.name || 'Salesman',
      dueDate,
      notes: notes.trim(),
    });

    // Reset Form
    setCustomerName('');
    setMobile('');
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  // WhatsApp Reminder Generator
  const sendWhatsAppReminder = (item: PendingPayment) => {
    const cleanMobile = item.mobile.replace(/\D/g, '');
    const formattedMobile = cleanMobile.startsWith('91') ? cleanMobile : `91${cleanMobile}`;
    
    const msgText = `નમસ્તે ${item.customerName},\n\n` +
      `📌 *${settings.businessName || 'રૂહી સેલ્સ'} (Ruhi Sales)*\n` +
      `તમારું ₹${item.amount.toLocaleString('en-IN')} નો હિસાબ બાકી છે (રૂટ: ${item.routeName}).\n` +
      `ચૂકવણીની તારીખ: ${item.dueDate}\n\n` +
      `કૃપા કરીને જલ્દી ચૂકવણી કરવા વિનંતી. આભાર! 🙏`;

    const whatsappUrl = `https://wa.me/${formattedMobile}?text=${encodeURIComponent(msgText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="text-amber-500" size={24} />
              <span>બાકી લેણી રકમ અને રિમાઇન્ડર</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              ગ્રાહકોની બાકી રહેલી રકમ અને 1-ક્લિક વ્હોટ્સએપ રિમાઇન્ડર (Pending Customer Collection)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus size={18} />
          <span>+ નવી બાકી રકમ નોંધો</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-4 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute right-2 bottom-2 text-slate-950/10 pointer-events-none">
            <IndianRupee size={80} />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-950/80">કુલ બાકી રકમ (Total Outstanding)</span>
          <h3 className="text-2xl font-black mt-1">₹{totalPendingAmount.toLocaleString('en-IN')}</h3>
          <span className="text-[11px] font-bold text-slate-900/80 mt-1 block">
            ⚠️ {pendingCount} ગ્રાહકોની રકમ બાકી છે
          </span>
        </div>

        <div className="bg-white border-2 border-emerald-200 p-4 rounded-3xl shadow-sm">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">જમા થયેલી રકમ (Total Settled)</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">₹{totalCollectedAmount.toLocaleString('en-IN')}</h3>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
            ✅ કલેક્ટ થયેલી રકમ
          </span>
        </div>

        <div className="bg-white border-2 border-slate-200 p-4 rounded-3xl shadow-sm">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">કુલ પાર્ટીઓ (Total Parties)</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{pendingPayments.length}</h3>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
            કુલ રજીસ્ટર્ડ ગ્રાહક એન્ટ્રીઝ
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ગ્રાહક, મોબાઈલ કે રૂટથી શોધો..."
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
            {(['pending', 'collected', 'all'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  filterStatus === status
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'pending' ? '⚠️ બાકી (Pending)' : status === 'collected' ? '✅ જમા (Collected)' : 'બધા (All)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Items List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500">
            <Clock size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="font-extrabold text-sm text-slate-700">કોઈ બાકી રકમ મળેલ નથી!</p>
            <p className="text-xs text-slate-400 mt-0.5">કોઈપણ ગ્રાહકની બાકી રકમ ઉમેરવા માટે ઉપરનું બટન વાપરો.</p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className={`bg-white border-2 rounded-3xl p-4 shadow-sm transition-all hover:border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                item.status === 'collected' ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              {/* Left Side Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-base text-slate-900">{item.customerName}</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      item.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {item.status === 'pending' ? 'બાકી' : 'ચૂકવાઈ ગયું'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-slate-400" />
                    {item.mobile}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    {item.routeName}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={13} className="text-slate-400" />
                    {item.salesmanName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" />
                    તારીખ: {item.dueDate}
                  </span>
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/60 font-medium">
                    📝 નોંધ: {item.notes}
                  </p>
                )}
              </div>

              {/* Right Side Amount & Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">બાકી રકમ</span>
                  <span className="text-xl font-black text-slate-900">₹{item.amount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* WhatsApp Reminder Button */}
                  {item.status === 'pending' && (
                    <button
                      onClick={() => sendWhatsAppReminder(item)}
                      title="વ્હોટ્સએપ મેસેજ મોકલો"
                      className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold px-3 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <MessageCircle size={16} />
                      <span className="hidden sm:inline">📲 રિમાઇન્ડર</span>
                    </button>
                  )}

                  {/* Settle / Received Button */}
                  {item.status === 'pending' ? (
                    <button
                      onClick={() => settlePendingPayment(item.id)}
                      className="bg-slate-900 hover:bg-black active:scale-95 text-amber-400 font-extrabold px-3 py-2 rounded-2xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-amber-400/30"
                    >
                      <CheckCircle2 size={16} />
                      <span>ચૂકવાઈ ગયું</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-2 rounded-2xl flex items-center gap-1">
                      <CheckCircle2 size={16} />
                      <span>જમા થયેલ</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE NEW PENDING PAYMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 border-2 border-amber-400">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="text-amber-500" size={20} />
                <span>નવી બાકી રકમ નોધો</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-black p-1"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-300 text-rose-700 p-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  👤 ગ્રાહક અથવા દુકાનનું નામ (Customer / Party Name)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="દા.ત. જય અંબે સેલ્સ (Jay Ambe Store)"
                  className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  📱 વ્હોટ્સએપ / મોબાઈલ નંબર (Mobile Number)
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="૧૦-અંકનો નંબર (દા.ત. 9876543210)"
                  className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                    💰 બાકી રકમ (Amount ₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="દા.ત. 2500"
                    className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-black text-slate-900 text-sm focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                    📅 તારીખ (Due Date)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  🗺️ રૂટ (Route)
                </label>
                <select
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  📝 વધારાની નોંધ (Notes - Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="દા.ત. અડધી રકમ આપી છે, બાકી કાલે આપશે"
                  className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-extrabold cursor-pointer"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 rounded-2xl font-black shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  સેવ કરો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
