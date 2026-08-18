import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import type { Language } from '../types';
import { Store, Lock, AlertCircle, KeyRound, ArrowRight, UserPlus, LogIn, Phone, User, MapPin } from 'lucide-react';
import { UserCheck as UserIcon, ShieldCheck as AdminIcon } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { salesmen, routes, settings, language, setLanguage, loginSalesman, registerSalesman, loginAdmin } = useApp();
  const t = translations[language];

  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [roleMode, setRoleMode] = useState<'salesman' | 'admin'>('salesman');

  // Login Form States
  const [loginType, setLoginType] = useState<'select' | 'mobile'>('select');
  const [selectedSalesmanId, setSelectedSalesmanId] = useState<string>(salesmen[0]?.id || 's1');
  const [loginMobile, setLoginMobile] = useState<string>('');
  const [salesmanPin, setSalesmanPin] = useState<string>('');
  const [adminPin, setAdminPin] = useState<string>('');

  // Sign Up Form States
  const [signupName, setSignupName] = useState<string>('');
  const [signupMobile, setSignupMobile] = useState<string>('');
  const [signupRouteId, setSignupRouteId] = useState<string>(routes[0]?.id || 'r1');
  const [signupPin, setSignupPin] = useState<string>('');

  // Status & Loading
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Salesman Login Submit
  const handleSalesmanLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!salesmanPin) {
      setErrorMsg('કૃપા કરીને PIN દાખલ કરો (Enter 4-digit PIN)');
      return;
    }

    const targetIdOrMobile = loginType === 'select' ? selectedSalesmanId : loginMobile;
    if (!targetIdOrMobile) {
      setErrorMsg('કૃપા કરીને સેલ્સમેન અથવા મોબાઈલ પસંદ કરો');
      return;
    }

    setIsSubmitting(true);
    const res = await loginSalesman(targetIdOrMobile, salesmanPin);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'ખોટો PIN! સાચો PIN દાખલ કરો.');
    }
  };

  // Handle Salesman Sign Up Submit
  const handleSalesmanSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!signupName.trim()) {
      setErrorMsg('કૃપા કરીને પૂરું નામ લખો (Enter Full Name)');
      return;
    }
    if (!signupMobile.trim() || signupMobile.length < 10) {
      setErrorMsg('કૃપા કરીને ૧૦-અંકનો મોબાઈલ નંબર નાખો (Valid Mobile Required)');
      return;
    }
    if (!signupPin || signupPin.length < 4) {
      setErrorMsg('કૃપા કરીને ૪-અંકનો PIN કોડ બનાવો (4-digit PIN required)');
      return;
    }

    setIsSubmitting(true);
    const res = await registerSalesman({
      name: signupName,
      mobile: signupMobile,
      routeId: signupRouteId,
      pin: signupPin,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'સાઇન અપ નિષ્ફળ ગયું!');
    }
  };

  // Handle Admin Login Submit
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!adminPin) {
      setErrorMsg('કૃપા કરીને એડમિન PIN દાખલ કરો');
      return;
    }

    setIsSubmitting(true);
    const res = await loginAdmin(adminPin);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'ખોટો એડમિન PIN! (Try 1234)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-3 sm:p-6">
      {/* Container Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Top Header */}
        <div className="bg-[#4B5FC4] text-white p-6 text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mx-auto mb-2 shadow-inner">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">{settings.businessName || t.appName}</h1>
            <p className="text-xs text-blue-100 font-medium mt-0.5">{settings.subtitle || t.appSubtitle}</p>

            {/* Language Switcher Pills */}
            <div className="flex items-center justify-center gap-1 mt-3 bg-blue-900/40 p-1 rounded-full w-fit mx-auto border border-white/20">
              {(['gu', 'hi', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-xs font-black rounded-full transition-all ${
                    language === lang
                      ? 'bg-white text-[#4B5FC4] shadow-sm scale-105'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  {lang === 'gu' ? 'ગુજરાતી' : lang === 'hi' ? 'हिंदी' : 'EN'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Role Selector Tabs (Salesman vs Admin) */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setRoleMode('salesman');
              setErrorMsg(null);
            }}
            className={`py-3 px-2 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              roleMode === 'salesman'
                ? 'bg-white text-[#4B5FC4] shadow-md border border-slate-200/80 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserIcon size={16} className={roleMode === 'salesman' ? 'text-[#4B5FC4]' : 'text-slate-400'} />
            <span>{t.salesmanRole}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleMode('admin');
              setErrorMsg(null);
            }}
            className={`py-3 px-2 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              roleMode === 'admin'
                ? 'bg-white text-amber-600 shadow-md border border-slate-200/80 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AdminIcon size={16} className={roleMode === 'admin' ? 'text-amber-600' : 'text-slate-400'} />
            <span>{t.adminRole}</span>
          </button>
        </div>

        {/* Dynamic Auth Action Pills for Salesman (Login vs Register) */}
        {roleMode === 'salesman' && (
          <div className="flex bg-slate-50 border-b border-slate-200 p-1.5 text-xs font-black">
            <button
              type="button"
              onClick={() => {
                setAuthTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authTab === 'login'
                  ? 'bg-[#4B5FC4] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <LogIn size={14} />
              <span>લોગીન (Login)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthTab('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authTab === 'signup'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <UserPlus size={14} />
              <span>નવું સાઇન અપ (Sign Up)</span>
            </button>
          </div>
        )}

        {/* Form Body Container */}
        <div className="p-5 space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 border-2 border-rose-300 text-rose-700 p-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 animate-shake">
              <AlertCircle size={18} className="flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* DYNAMIC SALESMAN LOGIN FORM */}
          {roleMode === 'salesman' && authTab === 'login' && (
            <form onSubmit={handleSalesmanLoginSubmit} className="space-y-4">
              {/* Option toggle: Select Name OR Enter Mobile */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                <span>લોગીન રીત પસંદ કરો:</span>
                <div className="flex gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setLoginType('select')}
                    className={`px-2 py-0.5 rounded-lg border ${
                      loginType === 'select'
                        ? 'bg-[#4B5FC4] text-white border-[#4B5FC4]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    નામથી
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginType('mobile')}
                    className={`px-2 py-0.5 rounded-lg border ${
                      loginType === 'mobile'
                        ? 'bg-[#4B5FC4] text-white border-[#4B5FC4]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    મોબાઈલથી
                  </button>
                </div>
              </div>

              {loginType === 'select' ? (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    👤 સેલ્સમેન પસંદ કરો (Select Salesman)
                  </label>
                  <select
                    value={selectedSalesmanId}
                    onChange={(e) => setSelectedSalesmanId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-extrabold text-sm rounded-2xl p-3 focus:outline-none focus:border-[#4B5FC4] transition-all cursor-pointer"
                  >
                    {salesmen.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.employeeId})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    📱 નોંધાયેલ મોબાઈલ નંબર (Mobile Number)
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      maxLength={10}
                      value={loginMobile}
                      onChange={(e) => setLoginMobile(e.target.value)}
                      placeholder="દા.ત. 9876543210"
                      className="w-full bg-slate-50 border-2 border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-sm font-black text-slate-900 focus:outline-none focus:border-[#4B5FC4] transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  🔑 ૪-અંકનો PIN (PIN Code)
                </label>
                <div className="relative">
                  <KeyRound size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    maxLength={4}
                    value={salesmanPin}
                    onChange={(e) => setSalesmanPin(e.target.value)}
                    placeholder="દા.ત. 1234"
                    className="w-full bg-slate-50 border-2 border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-base font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#4B5FC4] transition-all"
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                  💡 ડિફોલ્ટ PIN: <strong className="text-slate-700">1234</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#4B5FC4] hover:bg-blue-700 active:scale-[0.98] text-white py-3.5 px-6 rounded-2xl font-black text-base shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-blue-400/30 mt-2"
              >
                <span>{isSubmitting ? 'ચકાસણી થઈ રહી છે...' : `${t.loginBtn} કરો (Salesman Login)`}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* DYNAMIC SALESMAN SIGN UP FORM */}
          {roleMode === 'salesman' && authTab === 'signup' && (
            <form onSubmit={handleSalesmanSignUpSubmit} className="space-y-3.5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 text-xs text-emerald-950 font-bold">
                ✨ નવું એકાઉન્ટ બનાવો. માહિતી સબ્મિટ કરીને તરત લોગીન થાઓ!
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  👤 તમારું પૂરું નામ (Full Name)
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="દા.ત. રમેશ પટેલ (Ramesh Patel)"
                    className="w-full bg-slate-50 border-2 border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl text-sm font-extrabold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  📱 મોબાઈલ નંબર (Mobile Number)
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    placeholder="૧૦-અંકનો નંબર"
                    className="w-full bg-slate-50 border-2 border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl text-sm font-extrabold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  🗺️ રૂટ પસંદ કરો (Assigned Route)
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <select
                    value={signupRouteId}
                    onChange={(e) => setSignupRouteId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl text-sm font-extrabold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  🔑 ૪-અંકનો PIN બનાવો (Create 4-digit PIN)
                </label>
                <div className="relative">
                  <KeyRound size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    maxLength={4}
                    value={signupPin}
                    onChange={(e) => setSignupPin(e.target.value)}
                    placeholder="દા.ત. 1234"
                    className="w-full bg-slate-50 border-2 border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl text-base font-black tracking-widest text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3.5 px-6 rounded-2xl font-black text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-emerald-400/30 mt-2"
              >
                <UserPlus size={18} />
                <span>{isSubmitting ? 'રજીસ્ટ્રેશન થઈ રહ્યું છે...' : 'સાઇન અપ કરો (Sign Up Now)'}</span>
              </button>
            </form>
          )}

          {/* DYNAMIC OWNER / ADMIN LOGIN FORM */}
          {roleMode === 'admin' && (
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-bold">
                🛡️ માલિક અને એડમિન માટે સુરક્ષિત પ્રવેશ (Owner Access)
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  🔐 એડમિન PIN / પાસવર્ડ (Admin PIN)
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3.5 text-amber-500" />
                  <input
                    type="password"
                    maxLength={6}
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="દા.ત. 1234"
                    className="w-full bg-slate-50 border-2 border-slate-200 pl-10 pr-4 py-3.5 rounded-2xl text-base font-black tracking-widest text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                  💡 ડિફોલ્ટ એડમિન PIN: <strong className="text-amber-700">1234</strong> (અથવા 8888)
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-black active:scale-[0.98] text-amber-400 py-4 px-6 rounded-2xl font-black text-base shadow-lg shadow-slate-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-amber-400/40 mt-2"
              >
                <span>{isSubmitting ? 'ચકાસણી...' : 'એડમિન પ્રવેશ (Admin Login)'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
