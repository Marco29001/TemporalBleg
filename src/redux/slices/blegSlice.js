import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bleg: true,
}

const blegSlice = createSlice({
  name: 'bleg',
  initialState: initialState,
  reducers: {
    createBleg: (state, { payload }) => {
      state.bleg = payload
    },
  },
})

export const { createBleg } = blegSlice.actions

export const selectBleg = state => state.bleg.bleg

export default blegSlice.reducer
