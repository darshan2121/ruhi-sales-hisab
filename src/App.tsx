import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { SalesmanHome } from './components/Salesman/SalesmanHome';
import { Step1Route } from './components/Salesman/Step1Route';
import { Step2CashCounter } from './components/Salesman/Step2CashCounter';
import { Step3Online } from './components/Salesman/Step3Online';
import { Step4MarketOutstanding, type PendingPaymentDraft } from './components/Salesman/Step4MarketOutstanding';
import { Step4Summary } from './components/Salesman/Step4Summary';
import { SuccessModal } from './components/Salesman/SuccessModal';
import { HistoryView } from './components/Salesman/HistoryView';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { SalesmanManager } from './components/Admin/SalesmanManager';
import { RouteManager } from './components/Admin/RouteManager';
import { AdminReports } from './components/Admin/AdminReports';
import { SettingsView } from './components/Admin/SettingsView';
import { EditHisabModal } from './components/EditHisabModal';
import { CustomerPendingManager } from './components/CustomerPendingManager';

import type { Route, CashBreakdown, HisabEntry } from './types';
import { calculateCashTotal, getTodayDateString } from './utils/formatters';
import { AlertCircle } from 'lucide-react';

const INITIAL_CASH_BREAKDOWN: CashBreakdown = {
  500: 0,
  200: 0,
  100: 0,
  50: 0,
  20: 0,
  10: 0,
  5: 0,
  2: 0,
  1: 0,
};

const MainContent: React.FC = () => {
  const {
    isAuthenticated,
    currentRole,
    activeSalesman,
    routes,
    addHisabEntry,
    addPendingPayment,
    getTodayEntryForSalesman,
    settings,
  } = useApp();

  // If not authenticated, display LoginView
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Salesman Navigation view state
  const [salesmanView, setSalesmanView] = useState<
    'home' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'history' | 'pending'
  >('home');

  // Admin Navigation tab state
  const [adminTab, setAdminTab] = useState<'dashboard' | 'salesmen' | 'routes' | 'reports' | 'settings' | 'pending'>(
    'dashboard'
  );

  // Wizard temporary state
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [cashBreakdown, setCashBreakdown] = useState<CashBreakdown>(INITIAL_CASH_BREAKDOWN);
  const [onlineAmount, setOnlineAmount] = useState<number>(0);
  const [onlineMode, setOnlineMode] = useState<'UPI' | 'Bank Transfer' | 'Other' | 'Combined'>('UPI');
  const [sessionPendingPayments, setSessionPendingPayments] = useState<PendingPaymentDraft[]>([]);

  // Completed entry for success modal
  const [lastSavedEntry, setLastSavedEntry] = useState<HisabEntry | null>(null);

  // Duplicate entry warning modal state
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Edit record modal state
  const [editingEntry, setEditingEntry] = useState<HisabEntry | null>(null);

  // Start new Hisab flow
  const handleStartHisab = () => {
    const existing = getTodayEntryForSalesman(activeSalesman.id);
    if (existing) {
      setShowDuplicateModal(true);
      return;
    }

    // Pre-select default salesman route if available
    const defaultRoute = routes.find((r) => r.id === activeSalesman.routeId) || routes[0] || null;
    setSelectedRoute(defaultRoute);
    setCashBreakdown(INITIAL_CASH_BREAKDOWN);
    setOnlineAmount(0);
    setOnlineMode('UPI');
    setSessionPendingPayments([]);
    setSalesmanView('step1');
  };

  // Save entry handler
  const handleSaveHisab = () => {
    if (!selectedRoute) return;

    const cashAmount = calculateCashTotal(cashBreakdown);
    const totalAmount = cashAmount + onlineAmount;
    const marketOutstandingAmount = sessionPendingPayments.reduce((sum, p) => sum + p.amount, 0);
    const profitPct = activeSalesman.customProfitPct ?? settings.defaultProfitPct;
    const profitAmount = Math.round(totalAmount * (profitPct / 100));

    // Save added market outstanding (pending payments) to database & context
    sessionPendingPayments.forEach((pending) => {
      addPendingPayment(pending);
    });

    const created = addHisabEntry({
      salesmanId: activeSalesman.id,
      salesmanName: activeSalesman.name,
      routeId: selectedRoute.id,
      routeName: selectedRoute.name,
      date: getTodayDateString(),
      cashBreakdown,
      cashAmount,
      onlineAmount,
      marketOutstandingAmount,
      onlineMode,
      totalAmount,
      profitPct,
      profitAmount,
      expectedCollection: selectedRoute.expectedCollection,
      difference: totalAmount - selectedRoute.expectedCollection,
      status: 'submitted',
    });

    setLastSavedEntry(created);
    setSessionPendingPayments([]);
    setSalesmanView('home');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col w-full">
      <Header />

      {/* Content Body Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 overflow-y-auto">
          {/* SALESMAN ROLE VIEWS */}
          {currentRole === 'salesman' && (
            <>
              {salesmanView === 'home' && (
                <SalesmanHome
                  onStartHisab={handleStartHisab}
                  onViewHistory={() => setSalesmanView('history')}
                  onViewPending={() => setSalesmanView('pending')}
                  onEditTodayHisab={() => {
                    const todayEntry = getTodayEntryForSalesman(activeSalesman.id);
                    if (todayEntry) setEditingEntry(todayEntry);
                  }}
                />
              )}

              {salesmanView === 'step1' && (
                <Step1Route
                  selectedRoute={selectedRoute}
                  onSelectRoute={(r) => setSelectedRoute(r)}
                  onNext={() => setSalesmanView('step2')}
                  onBack={() => setSalesmanView('home')}
                />
              )}

              {salesmanView === 'step2' && (
                <Step2CashCounter
                  cashBreakdown={cashBreakdown}
                  onChangeBreakdown={(b) => setCashBreakdown(b)}
                  onNext={() => setSalesmanView('step3')}
                  onBack={() => setSalesmanView('step1')}
                />
              )}

              {salesmanView === 'step3' && (
                <Step3Online
                  onlineAmount={onlineAmount}
                  onlineMode={onlineMode}
                  onChangeAmount={(amt) => setOnlineAmount(amt)}
                  onChangeMode={(m) => setOnlineMode(m)}
                  onNext={() => setSalesmanView('step4')}
                  onBack={() => setSalesmanView('step2')}
                />
              )}

              {salesmanView === 'step4' && selectedRoute && (
                <Step4MarketOutstanding
                  route={selectedRoute}
                  cashAmount={calculateCashTotal(cashBreakdown)}
                  onlineAmount={onlineAmount}
                  pendingPayments={sessionPendingPayments}
                  onAddPendingPayment={(item) =>
                    setSessionPendingPayments((prev) => [...prev, item])
                  }
                  onRemovePendingPayment={(idx) =>
                    setSessionPendingPayments((prev) => prev.filter((_, i) => i !== idx))
                  }
                  onNext={() => setSalesmanView('step5')}
                  onBack={() => setSalesmanView('step3')}
                />
              )}

              {salesmanView === 'step5' && selectedRoute && (
                <Step4Summary
                  route={selectedRoute}
                  cashBreakdown={cashBreakdown}
                  onlineAmount={onlineAmount}
                  onlineMode={onlineMode}
                  marketOutstandingAmount={sessionPendingPayments.reduce((sum, p) => sum + p.amount, 0)}
                  onSave={handleSaveHisab}
                  onBack={() => setSalesmanView('step4')}
                />
              )}

              {salesmanView === 'history' && (
                <HistoryView
                  onBack={() => setSalesmanView('home')}
                  onEditEntry={(entry) => setEditingEntry(entry)}
                />
              )}

              {salesmanView === 'pending' && (
                <CustomerPendingManager onBack={() => setSalesmanView('home')} />
              )}
            </>
          )}

          {/* ADMIN ROLE VIEWS */}
          {currentRole === 'admin' && (
            <>
              {adminTab === 'dashboard' && (
                <AdminDashboard
                  onNavigateTab={(tab) => setAdminTab(tab)}
                  onEditEntry={(entry) => setEditingEntry(entry)}
                />
              )}

              {adminTab === 'salesmen' && (
                <SalesmanManager onBack={() => setAdminTab('dashboard')} />
              )}

              {adminTab === 'routes' && (
                <RouteManager onBack={() => setAdminTab('dashboard')} />
              )}

              {adminTab === 'reports' && (
                <AdminReports
                  onBack={() => setAdminTab('dashboard')}
                  onEditEntry={(entry) => setEditingEntry(entry)}
                />
              )}

              {adminTab === 'settings' && (
                <SettingsView onBack={() => setAdminTab('dashboard')} />
              )}

              {adminTab === 'pending' && (
                <CustomerPendingManager onBack={() => setAdminTab('dashboard')} />
              )}
            </>
          )}
        </main>

      {/* SUCCESS CONFIRMATION MODAL */}
      {lastSavedEntry && (
        <SuccessModal
          entry={lastSavedEntry}
          onGoHome={() => {
            setLastSavedEntry(null);
            setSalesmanView('home');
          }}
          onViewHistory={() => {
            setLastSavedEntry(null);
            setSalesmanView('history');
          }}
        />
      )}

      {/* DUPLICATE ENTRY PROMPT MODAL */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 border-2 border-amber-400">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={36} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                આજનો હિસાબ પહેલેથી સેવ છે!
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-1">
                તમે આજે {activeSalesman.name} નો હિસાબ પૂર્ણ કરી લીધો છે.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  const existing = getTodayEntryForSalesman(activeSalesman.id);
                  if (existing) setEditingEntry(existing);
                }}
                className="w-full bg-[#4B5FC4] text-white py-3.5 rounded-2xl font-black text-sm shadow-md"
              >
                જોવો / સુધારો (View & Edit)
              </button>

              <button
                onClick={() => setShowDuplicateModal(false)}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-2xl font-black text-sm"
              >
                રદ કરો (Cancel)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ENTRY MODAL */}
      {editingEntry && (
        <EditHisabModal entry={editingEntry} onClose={() => setEditingEntry(null)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
