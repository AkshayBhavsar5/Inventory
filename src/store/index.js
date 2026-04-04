import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import transactionsReducer from './slices/transactionsSlice';
import dashboardReducer from './slices/dashboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    transactions: transactionsReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
