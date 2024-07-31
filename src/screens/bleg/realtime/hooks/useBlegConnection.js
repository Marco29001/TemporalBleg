import { useEffect, useState, useRef } from 'react'
import { BleError, BleManager } from 'react-native-ble-plx'
import { useDispatch } from 'react-redux'
import {
  processSensors,
  processVariablesSensor,
  resetSensors,
} from '../../../../redux/slices/sensorsSlice'
import { useGlobalContext } from '../../../../context/GlobalContext'
import {
  SENSOR_MANAGER_SERVICE,
  SENSOR_CHARACTERISTIC,
} from '../../../../utils/Constants'
import { convertBase64ToString } from '../../../../utils/Common'

const manager = new BleManager()

function useBlegConnection() {
  const { BlegRealTime } = useGlobalContext()
  const dispatch = useDispatch()
  const timer = useRef(null)
  const [isWaiting, setIsWaiting] = useState(false)
  const [statusConnect, setStatusConnect] = useState(0) //status 0 connecting, 1 disconnected, 2 connected
  const [sensorService, setSensorService] = useState(null)
  const [rssiBleg, setRssiBleg] = useState(BlegRealTime?.rssi * -1 ?? 0)

  useEffect(() => {
    if (sensorService) {
      timer.current = setInterval(() => {
        getCharacteristic(sensorService)
        getRssiBleg()
      }, 1500)
    }

    if (isWaiting) {
      clearInterval(timer.current)
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [sensorService, isWaiting])

  const connectionBleg = async Bleg => {
    try {
      // Validate connection to bleg
      const validateConnection = await Bleg.isConnected()

      if (!validateConnection) {
        setStatusConnect(0)
        // Connect to device
        const connectedBleg = await Bleg.connect()
        console.log('Device is connected')
        // Discover all device services and characteristics
        const allServicesAndCharacteristics =
          await connectedBleg.discoverAllServicesAndCharacteristics()
        //Discovered manager service
        const discoveredServices =
          await allServicesAndCharacteristics.services()
        //Find service
        const service = discoveredServices.find(
          item => item.uuid == SENSOR_MANAGER_SERVICE,
        )

        if (service) {
          // Read characteristic
          await getCharacteristic(service)
          setSensorService(service)
          setStatusConnect(2)
        }
      } else {
        setStatusConnect(2)
      }
    } catch (error) {
      setStatusConnect(1)
      console.log('ocurrió un error al conectar', error)
    }
  }

  const disconnectBleg = async Bleg => {
    try {
      await manager.cancelDeviceConnection(Bleg.id)
      console.log('device is disconnected')

      emptyVariables()
    } catch (error) {
      console.log('No disconnecting device', error)
    }
  }

  const getCharacteristic = async service => {
    try {
      const characteristic = await service.readCharacteristic(
        SENSOR_CHARACTERISTIC,
      )
      const characteristicValue = convertBase64ToString(characteristic.value)
      const serializableObject = JSON.stringify(characteristicValue)
      console.log('object bleg respond', serializableObject)
      dispatch(processSensors(serializableObject))
      dispatch(processVariablesSensor(serializableObject))
    } catch (error) {
      if (error instanceof BleError) {
        console.log('ocurrió un error con bleg', error)
        emptyVariables()
      } else if (error instanceof SyntaxError) {
        console.log('ocurrió un error al obtener la característica', error)
      }
    }
  }

  const getRssiBleg = async () => {
    try {
      const Bleg = await BlegRealTime.readRSSI()
      setRssiBleg(Bleg.rssi * -1)
    } catch (error) {
      console.log('Error rssi', error)
    }
  }

  const emptyVariables = () => {
    setStatusConnect(1)
    setSensorService(null)
    dispatch(resetSensors())
    clearInterval(timer.current)
  }

  return {
    statusConnect,
    rssiBleg,
    setIsWaiting,
    connectionBleg,
    disconnectBleg,
  }
}

export default useBlegConnection
