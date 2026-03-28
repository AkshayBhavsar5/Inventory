import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import transactionsReducer from './slices/transactionsSlice';
import dashboardReducer from './slices/dashboardSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    transactions: transactionsReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
