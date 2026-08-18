import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import type { Salesman } from '../../types';
import { ArrowLeft, UserPlus, Edit2, Phone, MapPin, Percent, Check, X } from 'lucide-react';

interface SalesmanManagerProps {
  onBack: () => void;
}

export const SalesmanManager: React.FC<SalesmanManagerProps> = ({ onBack }) => {
  const { salesmen, routes, addSalesman, updateSalesman, language, settings } = useApp();
  const t = translations[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalesman, setEditingSalesman] = useState<Salesman | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [customProfitPct, setCustomProfitPct] = useState<number | undefined>(undefined);

  const handleOpenAdd = () => {
    setEditingSalesman(null);
    setName('');
    setMobile('');
    setEmployeeId(`EMP-${100 + salesmen.length + 1}`);
    setRouteId(routes[0]?.id || '');
    setCustomProfitPct(settings.defaultProfitPct);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Salesman) => {
    setEditingSalesman(s);
    setName(s.name);
    setMobile(s.mobile);
    setEmployeeId(s.employeeId);
    setRouteId(s.routeId);
    setCustomProfitPct(s.customProfitPct);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;

    if (editingSalesman) {
      updateSalesman(editingSalesman.id, {
        name,
        mobile,
        employeeId,
        routeId,
        customProfitPct: customProfitPct ? Number(customProfitPct) : undefined,
      });
    } else {
      addSalesman({
        name,
        mobile,
        employeeId,
        routeId,
        customProfitPct: customProfitPct ? Number(customProfitPct) : undefined,
        status: 'active',
        pin: '1234',
      });
    }

    setIsModalOpen(false);
  };

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

        <button
          onClick={handleOpenAdd}
          className="bg-[#4B5FC4] hover:bg-blue-700 active:scale-95 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
        >
          <UserPlus size={16} />
          <span>{t.addSalesman}</span>
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900">{t.salesmenManagement}</h2>
      </div>

      {/* Salesmen Cards List */}
      <div className="space-y-3">
        {salesmen.map((salesman) => {
          const route = routes.find((r) => r.id === salesman.routeId);
          const profit = salesman.customProfitPct ?? settings.defaultProfitPct;

          return (
            <div
              key={salesman.id}
              className={`p-4 rounded-2xl border-2 transition-all space-y-2.5 ${
                salesman.status === 'active'
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-[#4B5FC4] font-black rounded-xl flex items-center justify-center">
                    {salesman.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{salesman.name}</h4>
                    <span className="text-xs font-bold text-slate-400">{salesman.employeeId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateSalesman(salesman.id, {
                        status: salesman.status === 'active' ? 'inactive' : 'active',
                      })
                    }
                    className={`text-xs font-black px-2.5 py-1 rounded-lg transition-all ${
                      salesman.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {salesman.status === 'active' ? t.active : t.inactive}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(salesman)}
                    className="p-1.5 text-slate-400 hover:text-[#4B5FC4] hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-400" />
                  <span>{salesman.mobile}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{route?.name || 'No Route'}</span>
                </div>

                <div className="flex items-center gap-1.5 col-span-2 text-emerald-700 font-extrabold">
                  <Percent size={13} />
                  <span>Profit Rate: {profit}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {editingSalesman ? 'સેલ્સમેન માહિતી સુધારો' : t.addSalesman}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-extrabold">
              <div>
                <label className="text-slate-500 block mb-1">નામ (Name)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">મોબાઈલ નંબર (Mobile)</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">રૂટ પસંદ કરો (Assigned Route)</label>
                <select
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">નફો ટકાવારી % (Profit Rate)</label>
                <input
                  type="number"
                  value={customProfitPct ?? ''}
                  onChange={(e) => setCustomProfitPct(parseFloat(e.target.value))}
                  placeholder={`Default: ${settings.defaultProfitPct}%`}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
      )}
    </div>
  );
};
