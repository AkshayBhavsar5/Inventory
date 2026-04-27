import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDashboardOverview = createAsyncThunk(
  'dashboard/overview',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/dashboard/overview', { params });
      return data.data?.overview;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch overview',
      );
    }
  },
);

export const fetchSalesVsPurchase = createAsyncThunk(
  'dashboard/salesvspurchase',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/dashboard/sales-vs-purchase', {
        params,
      });
      return data.data?.comparison;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch sales-vs-purchase',
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    overview: {
      totalStockOverview: {
        totalStockValue: 0,
        totalProducts: 0,
        totalStockQty: 0,
      },
      totalSales: 0,
      totalPurchase: 0,
      netProfit: 0,
    },
    comparison: {
      sales: 0,
      purchase: 0,
      bars: [
        {
          label: '',
          value: 0,
        },
        {
          label: '',
          value: 0,
        },
      ],
    },
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
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

      .addCase(fetchDashboardOverview.pending, pending)
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = { ...state.overview, ...action.payload };
      })
      .addCase(fetchDashboardOverview.rejected, rejected)

      .addCase(fetchSalesVsPurchase.pending, pending)
      .addCase(fetchSalesVsPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.comparison = { ...state.comparison, ...action.payload };
      })
      .addCase(fetchSalesVsPurchase.rejected, rejected);
  },
});
export const { setLoading, setError, updateSummary } = dashboardSlice.actions;
export default dashboardSlice.reducer;
