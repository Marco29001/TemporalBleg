import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  gatewaysRealTime: [],
};

const gatewayRealTimeSlice = createSlice({
  name: 'gatewaysRealTime',
  initialState: initialState,
  reducers: {
    setGatewaysRealTime: (state, {payload}) => {
      const gateway = JSON.parse(payload);
      const search = state.gatewaysRealTime.some(
        item => item.manufacturerData == gateway.manufacturerData,
      );

      if (!search) {
        state.gatewaysRealTime = [gateway, ...state.gatewaysRealTime];
      }
    },
  },
});

export const {setGatewaysRealTime} = gatewayRealTimeSlice.actions;

export const selectGatewaysRealTime = state =>
  state.gatewaysRealTime.gatewaysRealTime;

export default gatewayRealTimeSlice.reducer;
