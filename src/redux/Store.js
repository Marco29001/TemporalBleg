import { configureStore } from '@reduxjs/toolkit'
import { logoutSlice } from './slices/logout'
import { dialogSlice } from './slices/dialog'
import blegReducer from './slices/blegSlice'
import blegsRealTimeReducer from './slices/blegsRealTimeSlice'
import { sensorsSlice } from './slices/sensorsSlice'
import NotificationReducer from './slices/notificationSlice'

const Store = configureStore({
  reducer: {
    logout: logoutSlice.reducer,
    dialog: dialogSlice.reducer,
    bleg: blegReducer,
    blegsRealTime: blegsRealTimeReducer,
    sensors: sensorsSlice.reducer,
    notification: NotificationReducer,
  },
})

export default Store
