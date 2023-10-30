import {configureStore} from '@reduxjs/toolkit';
import {logoutSlice} from './slices/logout';
import {dialogSlice} from './slices/dialog';
import gatewaysRealTimeReducer from './slices/gatewaysRealTimeSlice';

const Store = configureStore({
  reducer: {
    logout: logoutSlice.reducer,
    dialog: dialogSlice.reducer,
    gatewaysRealTime: gatewaysRealTimeReducer,
  },
});

export default Store;
