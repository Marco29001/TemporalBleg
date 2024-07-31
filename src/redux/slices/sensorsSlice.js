import { createSlice } from '@reduxjs/toolkit'
import { convertMacAddress } from '../../utils/Common'

const initialState = {
  sensors: [],
  variables: [],
  variablesSensor: [],
  variableObserver: null,
  openHistory: false,
}

export const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    setVariables: (state, { payload }) => {
      state.variables = payload
    },
    setVariableObserver: (state, { payload }) => {
      let variable = JSON.parse(payload)
      state.variableObserver = variable
    },
    setOpenHistory: (state, { payload }) => {
      state.openHistory = payload
    },
    processSensors: (state, { payload }) => {
      let infoSensor = JSON.parse(payload)
      let { NM, MC, BT, SG, LA } = infoSensor
      MC = convertMacAddress(MC)

      if (!MC) {
        return
      }

      const newState = state.sensors.map(sensor => ({ ...sensor }))

      const sensorExisted = newState.find(item => item.MC == MC)
      if (sensorExisted) {
        sensorExisted.NM = NM
        sensorExisted.BT = BT
        sensorExisted.SG = SG
        sensorExisted.LA = LA
      } else {
        const newSensor = {
          ...infoSensor,
          MC,
          reference: '',
        }

        newState.push(newSensor)
      }

      state.sensors = newState
    },
    processVariablesSensor: (state, { payload }) => {
      let infoSensor = JSON.parse(payload)
      let { ID, MC, VL } = infoSensor
      MC = convertMacAddress(MC)
      //let date = new Date()
      let time = new Date().getTime()
      const newState = state.variablesSensor.map(variable => ({ ...variable }))

      let variableInfo = state.variables.find(item => item.id == ID)
      let variableExisted = newState.find(
        item => item.id == ID && item.macSensor == MC,
      )
      if (variableExisted) {
        let lastEntry =
          variableExisted.history[variableExisted.history.length - 1]

        if (lastEntry.y == VL && time - lastEntry.x > 15000) {
          variableExisted.history.push({ x: time, y: VL })
          if (state.variableObserver && state.variableObserver.id == ID) {
            state.variableObserver = variableExisted
          }
        } else if (lastEntry.y != VL) {
          variableExisted.history.push({ x: time, y: VL })
          if (state.variableObserver && state.variableObserver.id == ID) {
            state.variableObserver = variableExisted
          }
        }

        // Remove points older than 5 minutes
        const fiveMinutesAgo = new Date().getTime() - 5 * 60 * 1000
        variableExisted.history = variableExisted.history.filter(
          point => point.x >= fiveMinutesAgo,
        )
      } else {
        const newVariable = {
          id: ID,
          macSensor: MC,
          name: variableInfo?.name ?? 'Sin asignar',
          nameEn: variableInfo?.nameEn ?? '',
          unit: variableInfo?.unit ?? '',
          unitType: variableInfo?.unitType ?? 0,
          history: [{ x: time, y: VL }],
        }

        newState.push(newVariable)
      }

      state.variablesSensor = newState.sort()
    },
    resetSensors: state => {
      return {
        sensors: [],
        variables: state.variables,
        variablesSensor: [],
        variableObserver: null,
        openHistory: false,
      }
    },
  },
})

export const selectSensors = state => state.sensors.sensors
export const selectVariablesSensors = state => state.sensors.variablesSensor
export const selectVariableObserver = state => state.sensors.variableObserver
export const selectOpenHistory = state => state.sensors.openHistory
export const {
  setVariables,
  setVariableObserver,
  setOpenHistory,
  processSensors,
  processVariablesSensor,
  resetSensors,
} = sensorsSlice.actions
