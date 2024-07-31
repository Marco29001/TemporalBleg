import { useEffect, useState } from 'react'
import { Platform, Linking } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { openSettings } from 'react-native-permissions'
import usePermissions from './usePermission'
import useDialog from './useDialog'
import {
  BLUETOOTH_ENABLED_DIALOG,
  BLUETOOTH_PERMISSION_DIALOG,
  LOCATION_SETIINGS_DIALOG,
  LOCATION_PERMISSION_DIALOG,
  ALL_PERMISSION_DIALOG,
} from '../utils/Constants'
import { useNavigation } from '@react-navigation/native'

let resolveCallback
function useBluetooth(manager) {
  const navigation = useNavigation()
  const [statusBluetooth, setStatusBluetooth] = useState(false)
  const [isScanPermited, setIsScanPermited] = useState(false)
  const { acceptDialog } = useDialog()
  const { PERMISSION_TYPE, checkPermission } = usePermissions()

  const validatePermissions = async () => {
    let locationPermission = await checkPermission(PERMISSION_TYPE.location)
    let permissionBluetoothScan = true
    let permissionBluetoothConnect = true

    if (Platform.OS == 'android' && Platform.Version >= 31) {
      permissionBluetoothScan = await checkPermission(
        PERMISSION_TYPE.bluetoothScan,
      )
      permissionBluetoothConnect = await checkPermission(
        PERMISSION_TYPE.bluetoothConnect,
      )
    }

    if (
      !locationPermission &&
      !permissionBluetoothScan &&
      !permissionBluetoothConnect
    ) {
      showDialog(ALL_PERMISSION_DIALOG, openSettingsDevice)
    } else if (!locationPermission) {
      showDialog(LOCATION_PERMISSION_DIALOG, openSettingsDevice)
    } else if (!permissionBluetoothScan || !permissionBluetoothConnect) {
      showDialog(BLUETOOTH_PERMISSION_DIALOG, openSettingsDevice)
    } else {
      setIsScanPermited(true)
    }

    return new Promise((res, rej) => {
      resolveCallback = res
    })
  }

  const validateLocationEnabled = async () => {
    const locationEnabled = await DeviceInfo.isLocationEnabled()
    if (!locationEnabled) {
      showDialog(LOCATION_SETIINGS_DIALOG, async () => {
        if (Platform.OS == 'android') {
          await Linking.sendIntent(
            'android.settings.LOCATION_SOURCE_SETTINGS',
            null,
          )
        } else {
          await Linking.openURL('App-Prefs:Privacy&path=LOCATION')
        }
      })
    } else {
      setIsScanPermited(true)
    }

    return new Promise((res, rej) => {
      resolveCallback = res
    })
  }

  const validateBluetoothEnabled = () => {
    if (statusBluetooth === 'PoweredOff') {
      showDialog(BLUETOOTH_ENABLED_DIALOG, async () => {
        if (Platform.OS == 'android') {
          await Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS', null)
        } else {
          await Linking.openURL('App-Prefs:Bluetooth&path')
        }
      })
    } else {
      setIsScanPermited(true)
    }

    return new Promise((res, rej) => {
      resolveCallback = res
    })
  }

  const showDialog = async (config, action) => {
    const isAccept = await acceptDialog(config)

    if (isAccept) {
      resolveCallback(false)
      action()
    } else {
      resolveCallback(false)
    }
  }

  const openSettingsDevice = () => {
    openSettings().catch(() => console.warn('cannot open settings'))
  }

  useEffect(() => {
    manager.onStateChange(state => {
      setStatusBluetooth(state)
    }, true)
  }, [])

  useEffect(() => {
    if (isScanPermited) {
      resolveCallback(true)
      setIsScanPermited(false)
    }
  }, [isScanPermited])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const isPermited = await validatePermissions()
      if (!isPermited) {
        navigation.navigate('BlegsListScreen')
      }
    })

    return unsubscribe
  }, [navigation])

  return {
    statusBluetooth,
    isScanPermited,
    validateBluetoothEnabled,
    validateLocationEnabled,
  }
}

export default useBluetooth
