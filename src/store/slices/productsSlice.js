import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products', { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch products',
      );
    }
  },
);
export const fetchProductsById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch product',
      );
    }
  },
);

export const createProductAPI = createAsyncThunk(
  'products/createproduct',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/products`, payload);
      return data.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create product',
      );
    }
  },
);

export const updateProductAPI = createAsyncThunk(
  'products/updateproduct',
  async ({ id, data: payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/products/${id}`, payload);
      return data.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to Update product',
      );
    }
  },
);

export const deleteProductAPI = createAsyncThunk(
  'products/deleteproduct',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/products/${id}`);
      return data.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to Delete product',
      );
    }
  },
);

export const adjustStockAPI = createAsyncThunk(
  'products/adjustStock',
  async ({ id, quantity, note }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/products/${id}/stock`, {
        quantity,
        note,
      });
      return data.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to adjust stock',
      );
    }
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    meta: null,
    selectedProduct: null,
    loading: false,
    error: null,
    filters: { search: '', category: 'All', status: 'All' },
    sortConfig: { field: 'name', direction: 'asc' },
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addProduct(state, action) {
      const newId = Math.max(...state.items.map((p) => p.id)) + 1;
      state.items.push({
        ...action.payload,
        id: newId,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    },
    updateProduct(state, action) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1)
        state.items[idx] = {
          ...action.payload,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
    },
    deleteProduct(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortConfig(state, action) {
      state.sortConfig = action.payload;
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
      // fetchAll
      .addCase(fetchProducts.pending, pending)
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.meta = action.payload.meta || null;
      })
      .addCase(fetchProducts.rejected, rejected)
      // fetchById
      .addCase(fetchProductsById.pending, pending)
      .addCase(fetchProductsById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductsById.rejected, rejected)
      // create
      .addCase(createProductAPI.pending, pending)
      .addCase(createProductAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProductAPI.rejected, rejected)
      // update
      .addCase(updateProductAPI.pending, pending)
      .addCase(updateProductAPI.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateProductAPI.rejected, rejected)
      // delete
      .addCase(deleteProductAPI.pending, pending)
      .addCase(deleteProductAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProductAPI.rejected, rejected)
      // adjustStock
      .addCase(adjustStockAPI.pending, pending)
      .addCase(adjustStockAPI.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(adjustStockAPI.rejected, rejected);
  },
});

export const {
  setLoading,
  setError,
  addProduct,
  updateProduct,
  deleteProduct,
  setSelectedProduct,
  setFilters,
  setSortConfig,
} = productsSlice.actions;

export default productsSlice.reducer;
