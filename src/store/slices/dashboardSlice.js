import { createSlice } from '@reduxjs/toolkit';

const monthlySalesData = [
  { month: 'May', sales: 68000, purchases: 42000, profit: 26000 },
  { month: 'Jun', sales: 72000, purchases: 38000, profit: 34000 },
  { month: 'Jul', sales: 81000, purchases: 45000, profit: 36000 },
  { month: 'Aug', sales: 76000, purchases: 51000, profit: 25000 },
  { month: 'Sep', sales: 94000, purchases: 58000, profit: 36000 },
  { month: 'Oct', sales: 128430, purchases: 42150, profit: 86280 },
];

const categoryShare = [
  { name: 'Electronics', value: 58, color: '#00488d' },
  { name: 'Audio', value: 18, color: '#005fb8' },
  { name: 'Peripherals', value: 12, color: '#a8c8ff' },
  { name: 'Gaming', value: 7, color: '#bac8d8' },
  { name: 'Others', value: 5, color: '#e1e3e4' },
];

const topProducts = [
  { sku: 'CHR-0092-MB', name: 'Chrono Lux V2 - Midnight Edition', unitsSold: 842, revenue: 24100, margin: 36.1 },
  { sku: 'PSD-5000-SIL', name: 'ProStream Desktop 5000', unitsSold: 512, revenue: 18900, margin: 40.4 },
  { sku: 'SW-300-NC', name: 'SonicWave Noise Cancelling Gen 3', unitsSold: 1029, revenue: 15430, margin: 52.0 },
  { sku: 'PXG-2000-RD', name: 'PX-2000 Precision Gear', unitsSold: 879, revenue: 12430, margin: 53.3 },
  { sku: 'KB-MECH-TKL', name: 'Mechanical Keyboard TKL', unitsSold: 320, revenue: 9800, margin: 51.7 },
];

const recentActivity = [
  { id: 1, icon: 'local_shipping', title: 'Shipment #2844 Received', subtitle: '2 hours ago • By Alex R.', type: 'success' },
  { id: 2, icon: 'price_change', title: 'Price Update: Watch V2', subtitle: '5 hours ago • Automated', type: 'info' },
  { id: 3, icon: 'warning', title: 'Stock Out: USB-C Hubs', subtitle: 'Yesterday • System Alert', type: 'error' },
  { id: 4, icon: 'add_shopping_cart', title: 'New PO: UW-34 Monitors', subtitle: '2 days ago • By Maria S.', type: 'info' },
];

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: {
      totalInventoryValue: 1452890,
      lowStockItems: 24,
      activeShipments: 12,
      inventoryHealth: 98.2,
      totalRevenue: 128430,
      costOfGoods: 42150.25,
      grossProfit: 86279.75,
      netMargin: 67.2,
      avgMargin: 34.2,
      projectedQ4: 420000,
      dailyVolume: 18400,
      netChange: -320,
    },
    monthlySalesData,
    categoryShare,
    topProducts,
    recentActivity,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state, action) { state.loading = action.payload; },
    setError(state, action) { state.error = action.payload; },
    updateSummary(state, action) { state.summary = { ...state.summary, ...action.payload }; },
  },
});

export const { setLoading, setError, updateSummary } = dashboardSlice.actions;
export default dashboardSlice.reducer;
