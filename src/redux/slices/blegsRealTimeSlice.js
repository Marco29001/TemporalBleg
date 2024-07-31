import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  blegsRealTime: [],
}

const blegRealTimeSlice = createSlice({
  name: 'blegsRealTime',
  initialState: initialState,
  reducers: {
    setBlegsRealTime: (state, { payload }) => {
      const bleg = JSON.parse(payload)
      const search = state.blegsRealTime.some(
        item => item.manufacturerData == bleg.manufacturerData,
      )

      if (!search) {
        state.blegsRealTime = [bleg, ...state.blegsRealTime]
      }
    },
  },
})

export const { setBlegsRealTime } = blegRealTimeSlice.actions

export const selectBlegsRealTime = state => state.blegsRealTime.blegsRealTime

export default blegRealTimeSlice.reducer
