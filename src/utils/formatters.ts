export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateCashTotal = (cashBreakdown: Record<string | number, any>): number => {
  return Object.entries(cashBreakdown).reduce((sum, [denom, count]) => {
    return sum + Number(denom) * (Number(count) || 0);
  }, 0);
};

export const calculateTotalNotes = (cashBreakdown: Record<string | number, any>): number => {
  return Object.values(cashBreakdown).reduce((sum, count) => sum + (Number(count) || 0), 0);
};
