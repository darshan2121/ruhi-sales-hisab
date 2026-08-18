import type { HisabEntry } from '../types';
import { formatCurrency, formatDate } from './formatters';

export const exportToCSV = (entries: HisabEntry[], filename = 'Ruhi_Sales_Daily_Hisab_Report.csv') => {
  const headers = [
    'Date',
    'Salesman Name',
    'Route Name',
    'Cash Collection (₹)',
    'Online Collection (₹)',
    'Total Collection (₹)',
    'Profit %',
    'Profit Amount (₹)',
    'Expected Collection (₹)',
    'Difference (₹)',
    'Status',
  ];

  const rows = entries.map((e) => [
    e.date,
    `"${e.salesmanName}"`,
    `"${e.routeName}"`,
    e.cashAmount,
    e.onlineAmount,
    e.totalAmount,
    `${e.profitPct}%`,
    e.profitAmount,
    e.expectedCollection,
    e.difference,
    e.status,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printSummaryReport = (entries: HisabEntry[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const totalColl = entries.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCash = entries.reduce((acc, curr) => acc + curr.cashAmount, 0);
  const totalOnline = entries.reduce((acc, curr) => acc + curr.onlineAmount, 0);
  const totalProfit = entries.reduce((acc, curr) => acc + curr.profitAmount, 0);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ruhi Sales - Daily Hisab Summary Report</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #1f2937; }
          h1 { color: #4B5FC4; margin-bottom: 4px; }
          .header-info { margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; }
          .kpi-container { display: flex; gap: 16px; margin-bottom: 24px; }
          .kpi-card { flex: 1; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; background: #f9fafb; }
          .kpi-title { font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; }
          .kpi-value { font-size: 20px; font-weight: bold; color: #111827; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 13px; }
          th { background-color: #4B5FC4; color: white; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .profit { font-weight: bold; color: #16a34a; }
        </style>
      </head>
      <body>
        <h1>Ruhi Sales – Daily Collection & Profit Report</h1>
        <div class="header-info">
          <div>Report Generated: ${new Date().toLocaleString('en-IN')}</div>
          <div>Total Records: ${entries.length}</div>
        </div>

        <div class="kpi-container">
          <div class="kpi-card">
            <div class="kpi-title">Total Collection</div>
            <div class="kpi-value">${formatCurrency(totalColl)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">Total Cash</div>
            <div class="kpi-value">${formatCurrency(totalCash)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">Total Online</div>
            <div class="kpi-value">${formatCurrency(totalOnline)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">Total Profit</div>
            <div class="kpi-value profit">${formatCurrency(totalProfit)}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Salesman</th>
              <th>Route</th>
              <th>Cash (₹)</th>
              <th>Online (₹)</th>
              <th>Total Collection (₹)</th>
              <th>Profit (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${entries
              .map(
                (e) => `
              <tr>
                <td>${formatDate(e.date)}</td>
                <td>${e.salesmanName}</td>
                <td>${e.routeName}</td>
                <td>${formatCurrency(e.cashAmount)}</td>
                <td>${formatCurrency(e.onlineAmount)}</td>
                <td><strong>${formatCurrency(e.totalAmount)}</strong></td>
                <td class="profit">${formatCurrency(e.profitAmount)} (${e.profitPct}%)</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
