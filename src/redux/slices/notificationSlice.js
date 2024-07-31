import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notification: null,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    createNotification: (state, { payload }) => {
      state.notification = payload
    },
  },
})

export const { createNotification } = notificationSlice.actions

export const selectNotification = state => state.notification.notification

export default notificationSlice.reducer
