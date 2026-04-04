import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDashboardOverview = createAsyncThunk(
  'dashboard/overview',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/reports/overview', { params });
      return data.data.report;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch overview',
      );
    }
  },
);
export const fetchTrends = createAsyncThunk(
  'dashboard/trends',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/reports/trends', { params });
      return data.data.trends;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch trends',
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: {},
    monthlySalesData: [],
    categoryShare: [],
    topProducts: [],
    recentActivity: [],
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
    updateSummary(state, action) {
      state.summary = { ...state.summary, ...action.payload };
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
        state.summary = {
          totalInventoryValue: action.payload.totalInventoryValue,
          lowStockItems: action.payload.lowStockItems,
          totalRevenue: action.payload.totalRevenue,
          costOfGoods: action.payload.costOfGoods,
          grossProfit: action.payload.grossProfit,
          netMargin: action.payload.netMargin,
          avgMargin: action.payload.avgMargin,
        };
        state.topProducts = action.payload.topProducts || [];
        state.categoryShare = action.payload.categoryShare || [];
        state.recentActivity = action.payload.recentActivity || [];
      })
      .addCase(fetchDashboardOverview.rejected, rejected)
      .addCase(fetchTrends.pending, pending)
      .addCase(fetchTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlySalesData = action.payload;
      })
      .addCase(fetchTrends.rejected, rejected);
  },
});
export const { setLoading, setError, updateSummary } = dashboardSlice.actions;
export default dashboardSlice.reducer;
