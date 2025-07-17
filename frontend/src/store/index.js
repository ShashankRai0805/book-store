import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth';
import searchSlice from './search';

const store = configureStore({
  reducer: {
    auth: authSlice,
    search: searchSlice,
  },
});

export { store };
export default store;
