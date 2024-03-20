import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  gateway: true,
};

const gatewaySlice = createSlice({
  name: 'gateway',
  initialState: initialState,
  reducers: {
    createGateway: (state, {payload}) => {
      state.gateway = payload;
    },
  },
});

export const {createGateway} = gatewaySlice.actions;

export const selectGateway = state => state.gateway.gateway;

export default gatewaySlice.reducer;
