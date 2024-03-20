export const TOKEN = 'token';
export const SENSOR_MANAGER_SERVICE = '00002a67-0000-1000-8000-00805f9b34fb';
export const SENSOR_CHARACTERISTIC = '00001817-0000-1000-8000-00805f9b34fb';
export const NAME_GATEWAY = 'Gateway BLE';
export const LOCATION_PERMISSION_DIALOG = {
  open: true,
  type: 'LOCATION_PERMISSION_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle:
    'necesita permiso para acceder a tu ubicación, para darte un mejor servicio en tiempo real',
  isAccept: true,
  txtAccept: 'Ir a configuraciones',
  isCancel: true,
  txtCancel: 'No, gracias',
};
export const LOCATION_SETIINGS_DIALOG = {
  open: true,
  type: 'LOCATION_SETIINGS_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle:
    'necesita que enciendas tu ubicación actual para un buen funcionamiento del bluetooth y conexión',
  isAccept: true,
  txtAccept: 'Ir a configuraciones',
  isCancel: true,
  txtCancel: 'No, gracias',
};
export const BLUETOOTH_NOSUPPORT_DIALOG = {
  open: true,
  type: 'BLUETOOTH_NOSUPPORT_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle:
    'Tu dispositivo no tiene soporte para Bluetooth Low Energy, no puedes acceder a tiempo real',
  isAccept: true,
  txtAccept: 'Encender Bluetooth',
  isCancel: true,
  txtCancel: 'No, gracias',
};
export const BLUETOOTH_PERMISSION_DIALOG = {
  open: true,
  type: 'BLUETOOTH_PERMISSION_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle:
    'necesita permisos para la detección de dispositivos cercanos, para darte un mejor servicio en tiempo real',
  isAccept: true,
  txtAccept: 'Ir a configuración',
  isCancel: true,
  txtCancel: 'No, gracias',
};
export const BLUETOOTH_ENABLED_DIALOG = {
  open: true,
  type: 'BLUETOOTH_ENABLED_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle:
    'necesita que enciendas bluetooth en tu dispositivo para utilizar el tiempo real',
  isAccept: true,
  txtAccept: 'Encender Bluetooth',
  isCancel: true,
  txtCancel: 'No, gracias',
};
export const CAMERA_PERMISSION_DIALOG = {
  open: true,
  type: 'CAMERA_PERMISSION_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle:
    'necesita acceso a la cámara de tu teléfono, para leer el QR de los dispositivos',
  isAccept: true,
  txtAccept: 'Encender Bluetooth',
  isCancel: true,
  txtCancel: 'No, gracias',
};
export const ALL_PERMISSION_DIALOG = {
  open: true,
  type: 'ALL_PERMISSION_DIALOG',
  title: 'Didcom Bluetooth Manager',
  subtitle:
    'necesita permisos para acceder a varias características de tu dispositivo para funcionar correctamente, recuerda dar los accesos necesarios',
  isAccept: true,
  txtAccept: 'aceptar',
  isCancel: true,
  txtCancel: 'No, gracias',
};
export const DELETE_SENSOR_DIALOG = {
  open: true,
  type: 'WARNING',
  subtitle: '',
  isAccept: true,
  txtAccept: 'Si, eliminar',
  isCancel: true,
  txtCancel: 'No, eliminar',
};
export const OK_DIALOG = {
  open: true,
  type: 'OK',
  title: '',
  subtitle: '',
  isAccept: true,
  txtAccept: 'Aceptar',
  isCancel: false,
  txtCancel: '',
};
export const WARNING_DIALOG = {
  open: true,
  type: 'WARNING',
  title: '',
  subtitle: '',
  isAccept: true,
  txtAccept: 'Aceptar',
  isCancel: false,
  txtCancel: '',
};

//--------------------------
export const DIALOGS = [];
