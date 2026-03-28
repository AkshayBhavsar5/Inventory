import { createSlice } from '@reduxjs/toolkit';

const initialTransactions = [
  { id: 'TXN-001', type: 'Purchase', sku: 'CHR-0092-MB', productName: 'Chrono Lux V2 - Midnight Edition', qty: 200, unitPrice: 185.00, total: 37000, date: '2024-10-24', reference: 'PO-2844', status: 'Completed', by: 'Alex R.' },
  { id: 'TXN-002', type: 'Sale', sku: 'PSD-5000-SIL', productName: 'ProStream Desktop 5000', qty: 15, unitPrice: 369.00, total: 5535, date: '2024-10-24', reference: 'SO-1102', status: 'Completed', by: 'System' },
  { id: 'TXN-003', type: 'Sale', sku: 'SW-300-NC', productName: 'SonicWave Noise Cancelling Gen 3', qty: 50, unitPrice: 149.99, total: 7499.5, date: '2024-10-23', reference: 'SO-1100', status: 'Completed', by: 'Maria S.' },
  { id: 'TXN-004', type: 'Purchase', sku: 'PXG-2000-RD', productName: 'PX-2000 Precision Gear', qty: 500, unitPrice: 42.00, total: 21000, date: '2024-10-23', reference: 'PO-2843', status: 'Completed', by: 'Alex R.' },
  { id: 'TXN-005', type: 'Sale', sku: 'LXM-9912', productName: 'LX-Micro Sensor', qty: 12, unitPrice: 34.50, total: 414, date: '2024-10-22', reference: 'SO-1099', status: 'Completed', by: 'System' },
  { id: 'TXN-006', type: 'Adjustment', sku: 'USB-C-HUB-7', productName: 'USB-C Hub 7-Port', qty: -60, unitPrice: 0, total: 0, date: '2024-10-18', reference: 'ADJ-055', status: 'Completed', by: 'System Alert' },
  { id: 'TXN-007', type: 'Sale', sku: 'CHR-0092-MB', productName: 'Chrono Lux V2 - Midnight Edition', qty: 25, unitPrice: 289.99, total: 7249.75, date: '2024-10-21', reference: 'SO-1095', status: 'Completed', by: 'James T.' },
  { id: 'TXN-008', type: 'Purchase', sku: 'UW-34-BLK', productName: 'Ultra Wide 34" Monitor', qty: 30, unitPrice: 480.00, total: 14400, date: '2024-10-20', reference: 'PO-2840', status: 'In Transit', by: 'Alex R.' },
];

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: initialTransactions,
    loading: false,
    error: null,
    filters: { search: '', type: 'All', dateFrom: '', dateTo: '' },
    newPurchase: { sku: '', productName: '', qty: '', unitPrice: '', reference: '' },
    newSale: { sku: '', productName: '', qty: '', unitPrice: '', reference: '' },
  },
  reducers: {
    setLoading(state, action) { state.loading = action.payload; },
    setError(state, action) { state.error = action.payload; },
    addTransaction(state, action) {
      state.items.unshift({ ...action.payload, id: `TXN-${String(state.items.length + 1).padStart(3, '0')}`, date: new Date().toISOString().split('T')[0], status: 'Completed' });
    },
    setFilters(state, action) { state.filters = { ...state.filters, ...action.payload }; },
    setNewPurchase(state, action) { state.newPurchase = { ...state.newPurchase, ...action.payload }; },
    setNewSale(state, action) { state.newSale = { ...state.newSale, ...action.payload }; },
    resetNewPurchase(state) { state.newPurchase = { sku: '', productName: '', qty: '', unitPrice: '', reference: '' }; },
    resetNewSale(state) { state.newSale = { sku: '', productName: '', qty: '', unitPrice: '', reference: '' }; },
  },
});

export const {
  setLoading, setError, addTransaction, setFilters,
  setNewPurchase, setNewSale, resetNewPurchase, resetNewSale
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
