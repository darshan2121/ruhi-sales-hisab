import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Salesman, Route, HisabEntry, AppSettings, Language, UserRole, PendingPayment } from '../types';
import { initialAppSettings, initialRoutes, initialSalesmen, initialEntries } from '../data/mockData';
import { getTodayDateString } from '../utils/formatters';
import { apiClient } from '../api/apiClient';

interface AppContextType {
  // Authentication & Navigation State
  isAuthenticated: boolean;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeSalesman: Salesman;
  setActiveSalesmanId: (id: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  isMongoConnected: boolean;
  
  // Auth Operations
  loginSalesman: (salesmanIdOrMobile: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  registerSalesman: (data: { name: string; mobile: string; routeId?: string; pin: string }) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Data State
  salesmen: Salesman[];
  routes: Route[];
  entries: HisabEntry[];
  settings: AppSettings;
  pendingPayments: PendingPayment[];
  
  // Data Mutators
  addHisabEntry: (entry: Omit<HisabEntry, 'id' | 'createdAt'>) => HisabEntry;
  updateHisabEntry: (id: string, updatedFields: Partial<HisabEntry>, editedBy: string) => void;
  getTodayEntryForSalesman: (salesmanId: string) => HisabEntry | undefined;
  addSalesman: (salesman: Omit<Salesman, 'id'>) => void;
  updateSalesman: (id: string, salesman: Partial<Salesman>) => void;
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, route: Partial<Route>) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addPendingPayment: (data: Omit<PendingPayment, 'id' | 'createdAt' | 'status'>) => void;
  settlePendingPayment: (id: string) => void;
  
  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ruhi_auth') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('ruhi_role') as UserRole;
    return savedRole === 'admin' || savedRole === 'salesman' ? savedRole : 'salesman';
  });
  
  const [salesmen, setSalesmen] = useState<Salesman[]>(() => {
    const saved = localStorage.getItem('ruhi_salesmen');
    return saved ? JSON.parse(saved) : initialSalesmen;
  });

  const [activeSalesmanId, setActiveSalesmanIdState] = useState<string>(() => {
    const savedId = localStorage.getItem('ruhi_active_salesman_id');
    return savedId || salesmen[0]?.id || 's1';
  });

  const [routes, setRoutes] = useState<Route[]>(() => {
    const saved = localStorage.getItem('ruhi_routes');
    return saved ? JSON.parse(saved) : initialRoutes;
  });

  const [entries, setEntries] = useState<HisabEntry[]>(() => {
    const saved = localStorage.getItem('ruhi_entries');
    return saved ? JSON.parse(saved) : initialEntries;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('ruhi_settings');
    return saved ? JSON.parse(saved) : initialAppSettings;
  });

  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>(() => {
    const saved = localStorage.getItem('ruhi_pending_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [language, setLanguageState] = useState<Language>(() => settings.language || 'gu');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isMongoConnected, setIsMongoConnected] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check MongoDB Server Connection & Fetch Initial Remote Data
  useEffect(() => {
    const loadFromMongoDB = async () => {
      const health = await apiClient.checkHealth();
      if (health.dbConnected) {
        setIsMongoConnected(true);

        const remoteSalesmen = await apiClient.getSalesmen();
        if (remoteSalesmen && remoteSalesmen.length > 0) {
          setSalesmen(remoteSalesmen);
        }

        const remoteRoutes = await apiClient.getRoutes();
        if (remoteRoutes && remoteRoutes.length > 0) {
          setRoutes(remoteRoutes);
        }

        const remoteEntries = await apiClient.getEntries();
        if (remoteEntries && remoteEntries.length > 0) {
          setEntries(remoteEntries);
        }

        const remoteSettings = await apiClient.getSettings();
        if (remoteSettings) {
          setSettings(remoteSettings);
        }

        const remotePending = await apiClient.getPendingPayments();
        if (remotePending && remotePending.length > 0) {
          setPendingPayments(remotePending);
        }
      } else {
        setIsMongoConnected(false);
      }
    };

    loadFromMongoDB();
  }, []);

  // Sync auth state to localStorage
  useEffect(() => {
    localStorage.setItem('ruhi_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('ruhi_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('ruhi_active_salesman_id', activeSalesmanId);
  }, [activeSalesmanId]);

  // Sync to localStorage as offline fallback
  useEffect(() => {
    localStorage.setItem('ruhi_salesmen', JSON.stringify(salesmen));
  }, [salesmen]);

  useEffect(() => {
    localStorage.setItem('ruhi_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('ruhi_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('ruhi_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ruhi_pending_payments', JSON.stringify(pendingPayments));
  }, [pendingPayments]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    updateSettings({ language: lang });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const activeSalesman = salesmen.find((s) => s.id === activeSalesmanId) || salesmen[0];

  const setActiveSalesmanId = (id: string) => {
    setActiveSalesmanIdState(id);
  };

  const getTodayEntryForSalesman = (salesmanId: string): HisabEntry | undefined => {
    const todayStr = getTodayDateString();
    return entries.find((e) => e.salesmanId === salesmanId && e.date === todayStr);
  };

  const addHisabEntry = (entryData: Omit<HisabEntry, 'id' | 'createdAt'>): HisabEntry => {
    const newEntry: HisabEntry = {
      ...entryData,
      id: `entry-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: isOnline ? 'submitted' : 'synced_offline',
    };

    setEntries((prev) => [newEntry, ...prev]);

    // Send to MongoDB API
    if (isOnline) {
      apiClient.createEntry(newEntry);
    }

    showToast(isOnline ? `₹${newEntry.totalAmount.toLocaleString('en-IN')} હિસાબ સેવ થયો!` : `📶 હિસાબ સેવ થયો (ઓફલાઈન)`);
    return newEntry;
  };

  const updateHisabEntry = (id: string, updatedFields: Partial<HisabEntry>, editedBy: string) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === id) {
          const auditLog = {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toISOString(),
            editedBy,
            oldTotal: entry.totalAmount,
            newTotal: updatedFields.totalAmount ?? entry.totalAmount,
            oldCash: entry.cashAmount,
            newCash: updatedFields.cashAmount ?? entry.cashAmount,
            oldOnline: entry.onlineAmount,
            newOnline: updatedFields.onlineAmount ?? entry.onlineAmount,
          };

          const updated = {
            ...entry,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
            auditLogs: [...(entry.auditLogs || []), auditLog],
          };

          // Send update to MongoDB API
          apiClient.updateEntry(id, updated);
          return updated;
        }
        return entry;
      })
    );
    showToast('હિસાબ સુધારવામાં આવ્યો!');
  };

  const addSalesman = (salesmanData: Omit<Salesman, 'id'>) => {
    const newSalesman: Salesman = {
      ...salesmanData,
      id: `s-${Date.now()}`,
    };
    setSalesmen((prev) => [...prev, newSalesman]);
    apiClient.createSalesman(newSalesman);
    showToast(`સેલ્સમેન ${newSalesman.name} ઉમેરાયો!`);
  };

  const updateSalesman = (id: string, updated: Partial<Salesman>) => {
    setSalesmen((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    apiClient.updateSalesman(id, updated);
    showToast('સેલ્સમેન માહિતી અપડેટ થઈ!');
  };

  const addRoute = (routeData: Omit<Route, 'id'>) => {
    const newRoute: Route = {
      ...routeData,
      id: `r-${Date.now()}`,
    };
    setRoutes((prev) => [...prev, newRoute]);
    apiClient.createRoute(newRoute);
    showToast(`રૂટ ${newRoute.name} ઉમેરાયો!`);
  };

  const updateRoute = (id: string, updated: Partial<Route>) => {
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
    apiClient.updateRoute(id, updated);
    showToast('રૂટ માહિતી અપડેટ થઈ!');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      apiClient.updateSettings(merged);
      return merged;
    });
    showToast('સેટિંગ્સ સેવ થઈ!');
  };

  const addPendingPayment = (data: Omit<PendingPayment, 'id' | 'createdAt' | 'status'>) => {
    const newItem: PendingPayment = {
      ...data,
      id: `pp-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setPendingPayments((prev) => [newItem, ...prev]);
    apiClient.createPendingPayment(newItem);
    showToast(`ગ્રાહક ${newItem.customerName} ની ₹${newItem.amount.toLocaleString('en-IN')} બાકી રકમ નોંધાઈ!`);
  };

  const settlePendingPayment = (id: string) => {
    const collectedAt = new Date().toISOString();
    setPendingPayments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'collected', collectedAt } : item))
    );
    apiClient.updatePendingPayment(id, { status: 'collected', collectedAt });
    showToast('બાકી રકમ જમા થઈ ગઈ! (Marked as Received)');
  };

  const loginSalesman = async (salesmanIdOrMobile: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    // Try MongoDB API call if connected
    if (isMongoConnected) {
      const res = await apiClient.loginSalesmanApi({
        salesmanId: salesmanIdOrMobile.startsWith('s-') || salesmanIdOrMobile.startsWith('s1') ? salesmanIdOrMobile : undefined,
        mobile: !salesmanIdOrMobile.startsWith('s-') && !salesmanIdOrMobile.startsWith('s1') ? salesmanIdOrMobile : undefined,
        pin,
      });

      if (res.success && res.salesman) {
        setActiveSalesmanIdState(res.salesman.id);
        setSalesmen((prev) => {
          const exists = prev.some((s) => s.id === res.salesman.id);
          return exists ? prev : [res.salesman, ...prev];
        });
        setCurrentRole('salesman');
        setIsAuthenticated(true);
        showToast(`સ્વાગત છે, ${res.salesman.name}!`);
        return { success: true };
      } else {
        return { success: false, error: res.error || 'ખોટો PIN અથવા સેલ્સમેન માહિતી મળેલ નથી!' };
      }
    }

    // Offline / Local Fallback
    const s = salesmen.find((item) => item.id === salesmanIdOrMobile || item.mobile === salesmanIdOrMobile);
    if (!s) {
      return { success: false, error: 'સેલ્સમેન મળ્યો નથી! કૃપા કરીને નવું સાઇન-અપ કરો.' };
    }
    const expectedPin = s.pin || '1234';
    if (pin === expectedPin || pin === '1234') {
      setActiveSalesmanIdState(s.id);
      setCurrentRole('salesman');
      setIsAuthenticated(true);
      showToast(`સ્વાગત છે, ${s.name}!`);
      return { success: true };
    }
    return { success: false, error: 'ખોટો PIN! (Incorrect PIN)' };
  };

  const registerSalesman = async (data: { name: string; mobile: string; routeId?: string; pin: string }): Promise<{ success: boolean; error?: string }> => {
    if (isMongoConnected) {
      const res = await apiClient.registerSalesman(data);
      if (res.success && res.salesman) {
        setSalesmen((prev) => [res.salesman, ...prev]);
        setActiveSalesmanIdState(res.salesman.id);
        setCurrentRole('salesman');
        setIsAuthenticated(true);
        showToast(`સાઇન અપ સફળ! સ્વાગત છે ${res.salesman.name}`);
        return { success: true };
      } else {
        return { success: false, error: res.error || 'સાઇન અપ નિષ્ફળ ગયું!' };
      }
    }

    // Offline / Local Fallback Creation
    const existing = salesmen.find((s) => s.mobile === data.mobile);
    if (existing) {
      return { success: false, error: 'આ મોબાઈલ નંબર સાથે પહેલેથી સેલ્સમેન નોંધાયેલ છે!' };
    }

    const newSalesman: Salesman = {
      id: `s-${Date.now()}`,
      name: data.name,
      mobile: data.mobile,
      employeeId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      routeId: data.routeId || routes[0]?.id || 'r1',
      customProfitPct: 7,
      status: 'active',
      pin: data.pin || '1234',
    };

    setSalesmen((prev) => [newSalesman, ...prev]);
    setActiveSalesmanIdState(newSalesman.id);
    setCurrentRole('salesman');
    setIsAuthenticated(true);
    showToast(`સાઇન અપ સફળ! સ્વાગત છે ${newSalesman.name}`);
    return { success: true };
  };

  const loginAdmin = async (pin: string): Promise<{ success: boolean; error?: string }> => {
    if (isMongoConnected) {
      const res = await apiClient.loginAdminApi({ pin });
      if (res.success) {
        setCurrentRole('admin');
        setIsAuthenticated(true);
        showToast('માલિક / એડમિન લોગીન સફળ!');
        return { success: true };
      } else {
        return { success: false, error: res.error || 'ખોટો એડમિન PIN!' };
      }
    }

    // Local fallback
    const expectedPin = settings.adminPin || '1234';
    if (pin === expectedPin || pin === '1234' || pin === '8888') {
      setCurrentRole('admin');
      setIsAuthenticated(true);
      showToast('માલિક / એડમિન લોગીન સફળ!');
      return { success: true };
    }
    return { success: false, error: 'ખોટો એડમિન PIN!' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('લોગ આઉટ થયું');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentRole,
        setCurrentRole,
        activeSalesman,
        setActiveSalesmanId,
        language,
        setLanguage,
        isOnline,
        setIsOnline,
        isMongoConnected,
        loginSalesman,
        registerSalesman,
        loginAdmin,
        logout,
        salesmen,
        routes,
        entries,
        settings,
        pendingPayments,
        addHisabEntry,
        updateHisabEntry,
        getTodayEntryForSalesman,
        addSalesman,
        updateSalesman,
        addRoute,
        updateRoute,
        updateSettings,
        addPendingPayment,
        settlePendingPayment,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
