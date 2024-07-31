import { i18n } from '../assets/locale/i18n'

export const TOKEN = 'token'
export const SENSOR_MANAGER_SERVICE = '00002a67-0000-1000-8000-00805f9b34fb'
export const SENSOR_CHARACTERISTIC = '00001817-0000-1000-8000-00805f9b34fb'
export const NAME_Bleg = 'Gateway BLE'
export const LOCATION_PERMISSION_DIALOG = {
  open: true,
  type: 'LOCATION_PERMISSION_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle: i18n.t('Constants.LocationPermission'),
  isAccept: true,
  txtAccept: i18n.t('Constants.GoToConfiguration'),
  isCancel: true,
  txtCancel: i18n.t('Constants.NoThanks'),
}
export const LOCATION_SETIINGS_DIALOG = {
  open: true,
  type: 'LOCATION_SETIINGS_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle: i18n.t('Constants.LocationSettings'),
  isAccept: true,
  txtAccept: i18n.t('Constants.GoToConfiguration'),
  isCancel: true,
  txtCancel: i18n.t('Constants.NoThanks'),
}
export const BLUETOOTH_NOSUPPORT_DIALOG = {
  open: true,
  type: 'BLUETOOTH_NOSUPPORT_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle: i18n.t('Constants.BluetoothNotSupport'),
  isAccept: true,
  txtAccept: i18n.t('Constants.Accept'),
  isCancel: false,
  txtCancel: '',
}
export const BLUETOOTH_PERMISSION_DIALOG = {
  open: true,
  type: 'BLUETOOTH_PERMISSION_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle: i18n.t('Constants.BluetoothPermission'),
  isAccept: true,
  txtAccept: i18n.t('Constants.GoToConfiguration'),
  isCancel: true,
  txtCancel: i18n.t('Constants.NoThanks'),
}
export const BLUETOOTH_ENABLED_DIALOG = {
  open: true,
  type: 'BLUETOOTH_ENABLED_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle: i18n.t('Constants.BluetoothEnabled'),
  isAccept: true,
  txtAccept: i18n.t('Constants.BluetoothTurnOn'),
  isCancel: true,
  txtCancel: i18n.t('Constants.NoThanks'),
}
export const CAMERA_PERMISSION_DIALOG = {
  open: true,
  type: 'CAMERA_PERMISSION_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle: i18n.t('Constants.CameraPermission'),
  isAccept: true,
  txtAccept: i18n.t('Constants.GoToConfiguration'),
  isCancel: true,
  txtCancel: i18n.t('Constants.NoThanks'),
}
export const ALL_PERMISSION_DIALOG = {
  open: true,
  type: 'ALL_PERMISSION_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle: i18n.t('Constants.AllPermission'),
  isAccept: true,
  txtAccept: i18n.t('Constants.GoToConfiguration'),
  isCancel: true,
  txtCancel: i18n.t('Constants.NoThanks'),
}
export const DELETE_SENSOR_DIALOG = {
  open: true,
  type: 'WARNING',
  subtitle: '',
  isAccept: true,
  txtAccept: i18n.t('Constants.Delete'),
  isCancel: true,
  txtCancel: i18n.t('Constants.Cancel'),
}
export const DISCONNECT_BLEG_DIALOG = {
  open: true,
  type: 'WARNING',
  subtitle: i18n.t('Constants.BluetoothConnectedQuestion'),
  isAccept: true,
  txtAccept: i18n.t('Constants.Accept'),
  isCancel: true,
  txtCancel: i18n.t('Constants.Cancel'),
}
export const OK_DIALOG = {
  open: true,
  type: 'OK',
  title: '',
  subtitle: '',
  isAccept: true,
  txtAccept: i18n.t('Constants.Accept'),
  isCancel: false,
  txtCancel: '',
}
export const WARNING_DIALOG = {
  open: true,
  type: 'WARNING',
  title: '',
  subtitle: '',
  isAccept: true,
  txtAccept: i18n.t('Constants.Accept'),
  isCancel: false,
  txtCancel: '',
}

//--------------------------
export const DIALOGS = []
