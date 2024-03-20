import {createSlice} from '@reduxjs/toolkit';

export const dialogEmptyState = {
  open: false,
  type: '',
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
    createDialog: (state, {payload}) => {
      return {...state, ...payload};
    },
    resetDialog: () => {
      return dialogEmptyState;
    },
  },
});

export const selectDialog = state => state.dialog;
export const {createDialog, modifyDialog, resetDialog} = dialogSlice.actions;
