import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Thunks ──────────────────────────────────────────────────────────────────
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/transactions', { params });
      return data.data; // { transactions, meta }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch transactions',
      );
    }
  },
);

export const fetchTransactionById = createAsyncThunk(
  'transactions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/transactions/${id}`);
      return data.data.transaction;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch transaction',
      );
    }
  },
);

export const createPurchaseAPI = createAsyncThunk(
  'transactions/purchase',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/transactions/purchase', payload);
      return data.data.transaction;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to record purchase',
      );
    }
  },
);

export const createSaleAPI = createAsyncThunk(
  'transactions/sale',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/transactions/sale', payload);
      return data.data.transaction;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to record sale',
      );
    }
  },
);

// ── Slice ────────────────────────────────────────────────────────────────────
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    meta: null,
    selectedTransaction: null,
    loading: false,
    error: null,
    filters: { search: '', type: 'All', dateFrom: '', dateTo: '' },
    newPurchase: {
      sku: '',
      productName: '',
      qty: '',
      unitPrice: '',
      reference: '',
    },
    newSale: {
      sku: '',
      productName: '',
      qty: '',
      unitPrice: '',
      reference: '',
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setNewPurchase(state, action) {
      state.newPurchase = { ...state.newPurchase, ...action.payload };
    },
    setNewSale(state, action) {
      state.newSale = { ...state.newSale, ...action.payload };
    },
    resetNewPurchase(state) {
      state.newPurchase = {
        sku: '',
        productName: '',
        qty: '',
        unitPrice: '',
        reference: '',
      };
    },
    resetNewSale(state) {
      state.newSale = {
        sku: '',
        productName: '',
        qty: '',
        unitPrice: '',
        reference: '',
      };
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(fetchTransactions.pending, pending)
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.transactions;
        state.meta = action.payload.meta || null;
      })
      .addCase(fetchTransactions.rejected, rejected)

      .addCase(fetchTransactionById.pending, pending)
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, rejected)

      .addCase(createPurchaseAPI.pending, pending)
      .addCase(createPurchaseAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createPurchaseAPI.rejected, rejected)

      .addCase(createSaleAPI.pending, pending)
      .addCase(createSaleAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createSaleAPI.rejected, rejected);
  },
});

export const {
  setFilters,
  setNewPurchase,
  setNewSale,
  resetNewPurchase,
  resetNewSale,
  clearError,
} = transactionsSlice.actions;
export default transactionsSlice.reducer;
