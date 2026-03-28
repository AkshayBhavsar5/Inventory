import { createSlice } from '@reduxjs/toolkit';

const initialProducts = [
  { id: 1, sku: 'CHR-0092-MB', name: 'Chrono Lux V2 - Midnight Edition', category: 'Electronics', stock: 142, reorderPoint: 50, price: 289.99, cost: 185.00, status: 'In Stock', location: 'Warehouse A', lastUpdated: '2024-10-24' },
  { id: 2, sku: 'PSD-5000-SIL', name: 'ProStream Desktop 5000', category: 'Electronics', stock: 38, reorderPoint: 40, price: 369.00, cost: 220.00, status: 'Low Stock', location: 'Warehouse B', lastUpdated: '2024-10-23' },
  { id: 3, sku: 'SW-300-NC', name: 'SonicWave Noise Cancelling Gen 3', category: 'Audio', stock: 215, reorderPoint: 80, price: 149.99, cost: 72.00, status: 'In Stock', location: 'Warehouse A', lastUpdated: '2024-10-24' },
  { id: 4, sku: 'UW-34-BLK', name: 'Ultra Wide 34" Monitor', category: 'Displays', stock: 12, reorderPoint: 20, price: 749.00, cost: 480.00, status: 'Low Stock', location: 'Warehouse C', lastUpdated: '2024-10-22' },
  { id: 5, sku: 'MTP-PRO-SIL', name: 'Magic Trackpad Pro', category: 'Peripherals', stock: 8, reorderPoint: 25, price: 129.99, cost: 65.00, status: 'Low Stock', location: 'Warehouse A', lastUpdated: '2024-10-21' },
  { id: 6, sku: 'SLS-5M-RGB', name: 'Smart Light Strip (5m)', category: 'Smart Home', stock: 5, reorderPoint: 30, price: 49.99, cost: 18.00, status: 'Critical', location: 'Warehouse B', lastUpdated: '2024-10-20' },
  { id: 7, sku: 'PXG-2000-RD', name: 'PX-2000 Precision Gear', category: 'Gaming', stock: 340, reorderPoint: 100, price: 89.99, cost: 42.00, status: 'In Stock', location: 'Warehouse D', lastUpdated: '2024-10-24' },
  { id: 8, sku: 'USB-C-HUB-7', name: 'USB-C Hub 7-Port', category: 'Peripherals', stock: 0, reorderPoint: 60, price: 59.99, cost: 22.00, status: 'Out of Stock', location: 'Warehouse A', lastUpdated: '2024-10-18' },
  { id: 9, sku: 'LXM-9912', name: 'LX-Micro Sensor', category: 'Components', stock: 88, reorderPoint: 50, price: 34.50, cost: 12.00, status: 'In Stock', location: 'Warehouse C', lastUpdated: '2024-10-23' },
  { id: 10, sku: 'KB-MECH-TKL', name: 'Mechanical Keyboard TKL', category: 'Peripherals', stock: 175, reorderPoint: 60, price: 119.99, cost: 58.00, status: 'In Stock', location: 'Warehouse B', lastUpdated: '2024-10-24' },
];

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: initialProducts,
    selectedProduct: null,
    loading: false,
    error: null,
    filters: { search: '', category: 'All', status: 'All' },
    sortConfig: { field: 'name', direction: 'asc' },
  },
  reducers: {
    setLoading(state, action) { state.loading = action.payload; },
    setError(state, action) { state.error = action.payload; },
    addProduct(state, action) {
      const newId = Math.max(...state.items.map(p => p.id)) + 1;
      state.items.push({ ...action.payload, id: newId, lastUpdated: new Date().toISOString().split('T')[0] });
    },
    updateProduct(state, action) {
      const idx = state.items.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = { ...action.payload, lastUpdated: new Date().toISOString().split('T')[0] };
    },
    deleteProduct(state, action) {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
    setSelectedProduct(state, action) { state.selectedProduct = action.payload; },
    setFilters(state, action) { state.filters = { ...state.filters, ...action.payload }; },
    setSortConfig(state, action) { state.sortConfig = action.payload; },
  },
});

export const {
  setLoading, setError, addProduct, updateProduct, deleteProduct,
  setSelectedProduct, setFilters, setSortConfig
} = productsSlice.actions;

export default productsSlice.reducer;
