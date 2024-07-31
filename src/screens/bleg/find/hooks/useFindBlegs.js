import { useState, useEffect, useReducer } from 'react'
import { BleManager } from 'react-native-ble-plx'
import { useGlobalContext } from '../../../../context/GlobalContext'
import useBluetooth from '../../../../hooks/useBluetooth'
import { NAME_Bleg } from '../../../../utils/Constants'
import { convertBase64ToHex } from '../../../../utils/Common'

const manager = new BleManager()

const reducer = (state, action) => {
  const { bleg } = action
  switch (action.type) {
    case 'add_bleg':
      if (
        bleg &&
        !state.some(gat => gat.manufacturerData == bleg.manufacturerData)
      ) {
        return [...state, bleg]
      }

      return state
    case 'clear':
      return []
    default:
      return state
  }
}

function useFindBlegs() {
  const {
    listBlegs,
    listBlegsRealTime,
    setListBlegsRealTime,
    setBlegRealTime,
  } = useGlobalContext()
  const [scannedBlegs, dispatch] = useReducer(reducer, [])
  const [scanning, setScanning] = useState(false)
  const { statusBluetooth, validateLocationEnabled, validateBluetoothEnabled } =
    useBluetooth(manager)

  //scan devices
  const scanBlegs = async () => {
    const isLocationEnabled = await validateLocationEnabled()
    const isBluetoothEnabled = await validateBluetoothEnabled()

    if (isLocationEnabled && isBluetoothEnabled) {
      setListBlegsRealTime([])
      setScanning(true)

      manager.startDeviceScan(null, null, (err, device) => {
        if (err) {
          console.log('error al escanear Bleg', err)
        }

        if (device) {
          if (
            device.manufacturerData &&
            (device.name === NAME_Bleg || device.localName === NAME_Bleg)
          ) {
            let macAddress = convertBase64ToHex(device.manufacturerData)
            let bleg = listBlegs.find(item => item.mac == macAddress)
            if (bleg) {
              console.log('entra a agregar el bleg')
              device.blegId = bleg.id
              device.manufacturerData = macAddress
              device.totalSensors = bleg.totalSensors
              device.device = bleg.device
              dispatch({ type: 'add_bleg', bleg: device })
            }
          }
        }
      })

      // stop scanning Blegs after 20 seconds
      setTimeout(() => {
        stopScanBlegs()
      }, 60000)
    }
  }

  const stopScanBlegs = () => {
    manager.stopDeviceScan()
    setScanning(false)
  }

  useEffect(() => {
    if (statusBluetooth == 'PoweredOff') {
      stopScanBlegs()
    }
  }, [statusBluetooth])

  useEffect(() => {
    if (scannedBlegs.length != 0) {
      setListBlegsRealTime(scannedBlegs)
    }
  }, [scannedBlegs])

  return {
    scanning,
    statusBluetooth,
    listBlegsRealTime,
    setBlegRealTime,
    scanBlegs,
    stopScanBlegs,
  }
}

export default useFindBlegs
