import {createSlice} from '@reduxjs/toolkit';

export const logoutEmptyState = {
  open: false,
  unauthorized: false,
};

export const logoutSlice = createSlice({
  name: 'logout',
  initialState: logoutEmptyState,
  reducers: {
    createLogout: (state, action) => {
      return action.payload;
    },
    modifyLogout: (state, action) => {
      return {...state, ...action.payload};
    },
    resetLogout: () => {
      return logoutEmptyState;
    },
  },
});

export const {createLogout, modifyLogout, resetLogout} = logoutSlice.actions;
