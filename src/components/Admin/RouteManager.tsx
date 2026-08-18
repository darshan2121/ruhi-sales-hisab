import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { formatCurrency } from '../../utils/formatters';
import type { Route } from '../../types';
import { ArrowLeft, Plus, MapPin, Edit2, Trash2, Check, X, AlertTriangle } from 'lucide-react';

interface RouteManagerProps {
  onBack: () => void;
}

export const RouteManager: React.FC<RouteManagerProps> = ({ onBack }) => {
  const { routes, addRoute, updateRoute, deleteRoute, language } = useApp();
  const t = translations[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [expectedCollection, setExpectedCollection] = useState(15000);

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setName('');
    setExpectedCollection(15000);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: Route) => {
    setEditingRoute(r);
    setName(r.name);
    setExpectedCollection(r.expectedCollection);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteRoute(id);
    setDeleteConfirmId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingRoute) {
      updateRoute(editingRoute.id, {
        name,
        expectedCollection: Number(expectedCollection),
      });
    } else {
      addRoute({
        name,
        expectedCollection: Number(expectedCollection),
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
          className="bg-[#4B5FC4] hover:bg-blue-700 active:scale-95 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>{t.addRoute}</span>
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900">{t.routeManagement}</h2>
      </div>

      {/* Routes Cards List */}
      <div className="space-y-3">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black">
                <MapPin size={20} />
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-base">{route.name}</h4>
                <span className="text-xs font-bold text-slate-500">
                  {t.expectedAmount}: {formatCurrency(route.expectedCollection)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenEdit(route)}
                title="સંપાદિત કરો (Edit)"
                className="p-2 text-slate-400 hover:text-[#4B5FC4] hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
              >
                <Edit2 size={16} />
              </button>

              <button
                onClick={() => setDeleteConfirmId(route.id)}
                title="ડિલીટ કરો (Delete)"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl text-center space-y-4 animate-in zoom-in-95 border-2 border-rose-400">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto font-black">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">શું તમે આ રૂટ ડિલીટ કરવા માંગો છો?</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">આ ક્રિયા રદ કરી શકાશે નહીં.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-xl font-extrabold text-xs cursor-pointer"
              >
                રદ કરો
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-black text-xs shadow-md cursor-pointer"
              >
                હા, ડિલીટ કરો
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {editingRoute ? 'રૂટ માહિતી સુધારો' : t.addRoute}
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
                <label className="text-slate-500 block mb-1">રૂટનું નામ (Route Name)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahmedabad East"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">
                  અપેક્ષિત કલેક્શન Target (Expected Amount ₹)
                </label>
                <input
                  type="number"
                  required
                  value={expectedCollection}
                  onChange={(e) => setExpectedCollection(parseInt(e.target.value, 10))}
                  placeholder="15000"
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
