import {createSlice} from '@reduxjs/toolkit';

export const dialogEmptyState = {
  open: false,
  type: 0,
  title: '',
  subtitle: '',
  isAccept: false,
  txtAccept: '',
  isCancel: false,
  txtCancel: '',
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: dialogEmptyState,
  reducers: {
    createDialog: (state, action) => {
      return action.payload;
    },
    modifyDialog: (state, action) => {
      return {...state, ...action.payload};
    },
    resetDialog: () => {
      return dialogEmptyState;
    },
  },
});

export const {createDialog, modifyDialog, resetDialog} = dialogSlice.actions;
