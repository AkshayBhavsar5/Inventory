import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// fetchReportOverview => http://localhost:5000/api/reports/overview
// fetchProductReport => http://localhost:5000/api/reports/product/69cb7e96cdc694d4aadc2261?&startDate=31/03/2025&endDate=5/04/2025
// fetchReportTrands => http://localhost:5000/api/reports/trends/69cb7e96cdc694d4aadc2261?&startDate=31/03/2025&endDate=5/04/2025&groupBy=day

export const fetchReportOverview = createAsyncThunk(
  "report/overview",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reports/overview", { params });
      return data.data?.report || {};
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch reports overview",
      );
    }
  },
);

export const fetchProductReport = createAsyncThunk(
  "report/ProductReport",
  async ({ id, startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reports/product/${id}`, {
        params: { startDate, endDate },
      });
      return data.data?.report || {};
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product reports",
      );
    }
  },
);

export const fetchReportTrends = createAsyncThunk(
  "report/trends",
  async ({ id, startDate, endDate, groupBy } = {}, { rejectWithValue }) => {
    try {
      const endpoint = id ? `/reports/trends/${id}` : "/reports/trends";
      const { data } = await api.get(endpoint, {
        params: { startDate, endDate, groupBy },
      });
      return data.data?.trends || data.data?.report || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch trends reports",
      );
    }
  },
);

const initialState = {
  overview: {
    totalSales: 0,
    totalPurchases: 0,
    salesCount: 0,
    purchasesCount: 0,
    totalSalesQty: 0,
    totalPurchasesQty: 0,
    profitOrLoss: 0,
    totalStockValue: 0,
    totalProducts: 0,
    totalStockQty: 0,
  },
  productReport: {
    totalPurchaseAmount: 0,
    totalSalesAmount: 0,
    totalPurchasedQty: 0,
    totalSoldQty: 0,
    purchasesCount: 0,
    salesCount: 0,
    profitOrLoss: 0,
    product: {
      id: "",
      name: "",
      sku: "",
      category: "",
      currentStock: 0,
      costPrice: 0,
      sellingPrice: 0,
    },
  },
  trends: [],
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = { ...state.overview, ...action.payload };
      })
      .addCase(fetchReportOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReport.fulfilled, (state, action) => {
        state.loading = false;
        state.productReport = { ...state.productReport, ...action.payload };
      })
      .addCase(fetchProductReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchReportTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
      })
      .addCase(fetchReportTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;
