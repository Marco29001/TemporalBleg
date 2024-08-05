export const LOCALE = {
  en: {
    Login: {
      SignIn: 'Sign in',
      User: 'User',
      Password: 'Password',
      Database: 'Database',
      Login: 'Login',
    },
    Logout: {
      QuestionLogout: 'Are you sure you want to log out?',
      SessionInvalid: 'The session is not valid, please log in again',
      Accept: 'Accept',
      YesLeave: 'Yes, leave',
      Cancel: 'Cancel',
    },
    Header: {
      AssetTracker: 'Asset tracking',
    },
    UserProfile: {
      Database: 'Database',
      VersionApp: 'Application version',
    },
    BlegDetail: {
      TitleHeader: 'BLEG Detail',
      Synchronized: 'BLEG synchronized correctly.',
      NotSynchronized: 'BLEG is not synchronized.',
      NotConfigured: 'The BLEG is not configured',
      LastSynchronized: 'Last synchronization',
      NoSerieBleg: 'BLEG Serial No.',
      VehicleAssigned: 'Assigned vehicle',
      Unit: 'Vehicle',
      NoSerieGo: 'GO Serial No.',
      Sensors: 'Sensors',
      Synchronize: 'Synchronize BLEG',
      UpdatedSynchronize: 'Modules updated correctly',
      ErrorSynchronize: 'Configuration error',
      ModulesLastVersion: 'Modules were already at the latest version',
      TimeExpired: 'Time expired, no response',
      QuestionDeleteBleg:
        'Are you sure you want to delete the sensor with serial number ',
      EmptySensors: 'No sensors found',
      RemovedSuccessfully: 'Removed successfully',
      SerialNumber: 'Serial number',
      SendCommand: 'Sending command',
      WaitingAnswer: 'Waiting for response',
      ErrorSynchronize: 'Failed to synchronize BLEG with serial number: ',
    },
    BlegFind: {
      TitleHeader: 'Scan BLEG',
      Message: 'Select a BLEG to view its status and internal information',
      ActiveBluetooth: 'Bluetooth active',
      InactiveBluetooth: 'Bluetooth inactive',
      StartSearch: 'Start search',
      EndSearch: 'End search',
      NearBleg: 'Searching for nearby BLEGs',
      Unit: 'Vehicle',
      NoSerieGo: 'GO Serial No.',
      Sensors: 'Sensors',
    },
    BlegList: {
      TitleHeader: 'BLEG',
      EmptyBleg: 'No Blegs found',
      Unit: 'Vehicle',
      NoSerieGo: 'GO Serial No.',
      Sensors: 'Sensors',
      Search: 'Search',
    },
    BlegRealtime: {
      MacAddress: 'MAC Address',
      Status: 'Status',
      Connecting: 'Connecting',
      Connected: 'Connected',
      Disconnected: 'Disconnected',
      Sensor: 'Sensor',
      Reference: 'Reference',
    },
    BlegRegister: {
      TitleHeader: 'Assign BLEG',
      TitleHeaderAdd: 'Add BLEG',
      ValidSerialNumber: 'The BLEG was validated correctly',
      EmptyFields: 'Please complete all the fields',
      NoSerieBleg: 'BLEG Serial No.',
      MacAddressBleg: 'MAC Address',
      Validate: 'Validate',
      SelectUnit: 'Select a vehicle',
      Unit: 'Vehicle',
      NoSerieGo: 'GO Serial No.',
      Assign: 'Assign',
      Add: 'Add',
      Units: 'Vehicles',
      SelectUnit: 'Select a vehicle',
      Search: 'Search',
      NoSearchUnits: 'No vehicles found',
      AddBleg: 'BLEG added successfully',
      EditBleg: 'BLEG successfully updated',
    },
    Permissions: {
      TitleHeader: 'User permissions',
      Subtitle:
        'The following permissions will be requested for the correct functionality of the application:',
      PermissionQr:
        'The use of the camera will be requested to read QR codes when registering a BLEG or sensors.',
      PermissionLocation:
        'Access to your current location will be requested to provide you with better service in detecting bluetooth devices and it will not be shared at any time.',
      PermissionBluetooth:
        'Bluetooth access will be requested to provide you with better service (this may not be requested if your device does not have android 12 or higher).',
      WarningFooter: 'You can make changes later in the device settings',
      Next: 'Next',
    },
    QrScanner: {
      TitleHeader: 'Place the camera over the QR',
      Error400Bleg:
        'The code format is incorrect, so the information could not be obtained',
      Error409Bleg: 'The BLEG you are trying to add is in another database',
      Error404Bleg: 'The BLEG you are trying to add is not found',
      Error400Sensor:
        'The code format is incorrect, so the information could not be obtained',
      Error409Sensor:
        'A problem occurred, the sensor you are trying to add is already assigned to this BLEG',
      ErrorServer: 'Server error',
    },
    SensorEdit: {
      TitleHeader: 'Edit sensor',
      SerialNumber: 'Sensor Serial No.',
      TypeSensor: 'Sensor type',
      Reference: 'Reference',
      AddReference: 'Enter reference',
      Parameters: 'Configure parameters',
      SaveChanges: 'Save changes',
      SelectParameter: 'Select a parameter',
      Search: 'Search',
      SensorUpdated: 'Sensor updated correctly, sensor serial number: ',
      Error409Sensor:
        'An error occurred when editing, you may have added a parameter already assigned to another sensor',
    },
    SensorRegister: {
      TitleHeader: 'Register sensor',
      EmptyFields: 'Fill in all the fields',
      SerialNumber: 'Identifier',
      InputSerialNumber: 'Enter sensor serial number',
      MessageSerialNumber: 'Enter the serial number of the device (17 digits)',
      MacAddress: 'MAC Address',
      InputMacAddress: 'Enter MAC address',
      MessageMacAddress: 'Enter the MAC address in format 00:00:00:00:00:00',
      Reference: 'Reference',
      InputReference: 'Enter reference',
      TypeSensor: 'Sensor type',
      Add: 'Add',
      Parameters: 'Parameters',
      SelectType: 'Select a sensor type',
      SelectParameter: 'Select a parameter',
      Search: 'Search',
      Tooltip:
        'If the sensor was purchased from Didcom, enter the serial number on the sensor label. If purchased elsewhere, you can enter any data.',
      SensorRegister: 'Sensor added successfully, added sensor serial number: ',
      Error409Sensor:
        'A problem occurred, the sensor you are trying to add is already assigned to this BLEG',
    },
    AssetTracker: {
      AssetTracker: 'Asset tracking',
      Frequency: 'Send frequency',
      Seconds: 'Seconds',
      MaxSensors: 'Maximum detected sensors',
      Prefix: 'Prefix',
      Variable: 'Variable',
      Variables: 'Variables',
      Save: 'Save',
      Identifier: 'Identifier',
      Sensors: 'Sensors',
      TypesSensor: 'Sensor types',
      SelectTypeSensor: 'Select a sensor type',
      Search: 'Search',
      UseIdentifier: 'Use as identifier',
      Add: 'Add',
      Cancel: 'Cancel',
      ExistsVariable: 'A sensor with that variable already exists',
      SavedCorrectly: 'Saved correctly',
      ErrorFrequency:
        'The frequency must be greater than or equal to 10 and less than or equal to 120',
      ErrorMaxSensors:
        'The maximum sensors must be greater than or equal to 1 and less than or equal to 100',
      ErrorCalculate:
        'The number of configured messages exceeds the number of messages allowed by Geotab',
    },
    History: {
      Graphic: 'Graphic',
      Detail: 'Detail',
    },
    Messages: {
      EmptyFields: 'Fill in all the fields',
    },
    Status: {
      ServerError: 'Server error',
      Unauthorized: 'Unauthorized',
      NoConnection: 'No connection',
      Error: 'An error occurred, please check your internet connection',
    },
    RegisterModal: {
      AssignBleg: 'Assign BLEG to a vehicle',
      AddSensor: 'Add new sensor',
      ReadQr: 'Read QR code',
      ManualCode: 'Manual code',
    },
    Constants: {
      LocationPermission:
        'needs permission to access your location to provide you with better real-time service',
      LocationService:
        'needs you to turn on your current location for proper bluetooth and connection functionality',
      BluetoothPermission:
        'needs permissions for detecting nearby devices to provide you with better real-time service',
      BluetoothEnabled:
        'needs you to turn on bluetooth on your device to use real-time',
      BluetoothNotSupport:
        'Your device does not support Bluetooth Low Energy, you cannot access real-time',
      CameraPermission:
        "needs access to your phone's camera to read the devices' QR",
      AllPermission:
        'needs permissions to access various features of your device to function correctly, remember to grant the necessary accesses',
      BluetoothConnectedQuestion:
        'Are you connected to a BLEG? Do you want to disconnect?',
      BluetoothTurnOn: 'Turn on Bluetooth',
      GoToConfiguration: 'Go to settings',
      NoThanks: 'No, thanks',
      Accept: 'Accept',
      Delete: 'Delete',
      Cancel: 'Cancel',
    },
  },

  es: {
    Login: {
      SignIn: 'Iniciar de sesión',
      User: 'Usuario',
      Password: 'Contraseña',
      Database: 'Base de datos',
      Login: 'Acceder',
    },
    Logout: {
      QuestionLogout: '¿Estas seguro de que quieres cerrar la sesión?',
      SessionInvalid: 'La sesión no es valida, vuelve a iniciar la sesión',
      Accept: 'Aceptar',
      YesLeave: 'Si, salir',
      Cancel: 'Cancelar',
    },
    Header: {
      AssetTracker: 'Seguimiento de activos',
    },
    UserProfile: {
      Database: 'Base de datos',
      VersionApp: 'Version de la aplicación',
    },
    BlegDetail: {
      TitleHeader: 'Detalle BLEG',
      Synchronized: 'BLEG sincronizado correctamente. ',
      NotSynchronized: 'BLEG no esta sincronizado. ',
      NotConfigured: 'El BLEG no esta configurado',
      LastSynchronized: 'Última sincronización',
      NoSerieBleg: 'No. Serie BLEG',
      VehicleAssigned: 'Vehículo asignado',
      Unit: 'Vehículo',
      NoSerieGo: 'No.Serie GO',
      Sensors: 'Sensores',
      Synchronize: 'Sincronizar BLEG',
      UpdatedSynchronize: 'Módulos actualizados correctamente',
      ErrorSynchronize: 'Error en las configuraciones',
      ModulesLastVersion: 'Módulos ya estaban en la última version',
      TimeExpired: 'Tiempo expirado, no hubo respuesta',
      QuestionDeleteBleg:
        '¿Estas seguro que deseas eliminar el sensor con número de serie ',
      EmptySensors: 'No se encontraron sensores',
      RemovedSuccessfully: 'Eliminado correctamente',
      SerialNumber: 'Número de serie',
      SendCommand: 'Enviando comando',
      WaitingAnswer: 'Esperando respuesta',
      ErrorSynchronize: 'No se logro sincronizar BLEG con numero de serie: ',
    },
    BlegFind: {
      TitleHeader: 'Escanear BLEG',
      Message: 'Selecciona un BLEG para ver su status e información interna',
      ActiveBluetooth: 'Bluetooth  activo',
      InactiveBluetooth: 'Bluetooth inactivo',
      StartSearch: 'Iniciar búsqueda',
      EndSearch: 'Finalizar búsqueda',
      NearBleg: ' Buscando BLEG cercanos',
      Unit: 'Vehículo',
      NoSerieGo: 'No.Serie GO',
      Sensors: 'Sensores',
    },
    BlegList: {
      TitleHeader: 'BLEG',
      EmptyBleg: 'No se encontraron Blegs',
      Unit: 'Vehículo',
      NoSerieGo: 'No.Serie GO',
      Sensors: 'Sensores',
      Search: 'Buscar',
    },
    BlegRealtime: {
      MacAddress: 'Dirección MAC',
      Status: 'Estatus',
      Connecting: 'Conectando',
      Connected: 'Conectado',
      Disconnected: 'Desconectado',
      Sensor: 'Sensor',
      Reference: 'Referencia',
    },
    BlegRegister: {
      TitleHeader: 'Asignar BLEG',
      TitleHeaderAdd: 'Agregar BLEG',
      ValidSerialNumber: 'El BLEG fue validado correctamente',
      EmptyFields: 'Llena todos los campos por favor',
      NoSerieBleg: 'No. Serie BLEG',
      MacAddressBleg: 'Dirección MAC',
      Validate: 'Validar',
      SelectUnit: 'Selecciona un vehículo',
      Unit: 'Vehículo',
      NoSerieGo: 'No.Serie GO',
      Assign: 'Asignar',
      Add: 'Agregar',
      Units: 'Vehículos',
      SelectUnit: 'Selecciona un vehículo',
      Search: 'Buscar',
      NoSearchUnits: 'No se encontraron vehículos',
      AddBleg: 'BLEG agregado con éxito',
      EditBleg: 'BLEG actualizado con éxito',
    },
    Permissions: {
      TitleHeader: 'Permisos de usuario',
      Subtitle:
        'Se solicitaran los permisos siguientes para la correcta funcionalidad de la aplicación:',
      PermissionQr:
        'Se solicitara el uso de la cámara para la lectura de códigos QR al momento de registrar un BLEG o sensores.',
      PermissionLocation:
        'Se solicitara el acceso a tu ubicación actual para brindarte un mejor servicio en la detección de dispositivos bluetooth y esta no sera compartida en ningún momento.',
      PermissionBluetooth:
        'Se solicitara el acceso al bluetooth para brindarte un mejor servicio (puede que esto no se te solicite solo si tu dispositivo no cuenta con android 12 o superior).',
      WarningFooter:
        'Usted puede realizar cambios después en la configuración del dispositivo',
      Next: 'Siguiente',
    },
    QrScanner: {
      TitleHeader: 'Coloca la cámara sobre el QR',
      Error400Bleg:
        'El formato de código es incorrecto, por lo cual no se pudo obtener información',
      Error409Bleg:
        'El BLEG que tratas de agregar se encuentra en otra base de datos',
      Error404Bleg: 'El BLEG que tratas de agregar no se encuentra',
      Error409Sensor:
        'Ocurrió un problema el sensor que trata de agregar ya se encuentra asignado a este BLEG',
      ErrorServer: 'Error del servidor',
    },
    SensorEdit: {
      TitleHeader: 'Editar sensor',
      SerialNumber: 'No. Serie sensor',
      TypeSensor: 'Tipo de sensor',
      Reference: 'Referencia',
      AddReference: 'Ingrese referencia',
      Parameters: 'Configurar parámetros',
      SaveChanges: 'Guardar cambios',
      SelectParameter: 'Selecciona un parámetro',
      Search: 'Buscar',
      SensorUpdated:
        'Sensor actualizado correctamente, número de serie del sensor: ',
      Error409Sensor:
        'Ocurrió un error al editar, puede que agregaras un parámetro ya asignado a otro sensor',
    },
    SensorRegister: {
      TitleHeader: 'Registrar sensor',
      EmptyFields: 'Llena todos los campos',
      SerialNumber: 'Identificador',
      InputSerialNumber: 'Ingresa número de serie del sensor',
      MessageSerialNumber:
        'Ingrese el número serial del dispositivo (17 dígitos)',
      MacAddress: 'Dirección MAC',
      InputMacAddress: 'Ingresar dirección mac',
      MessageMacAddress:
        'Ingrese la dirección mac en formato 00:00:00:00:00:00',
      Reference: 'Referencia',
      InputReference: 'Ingresa la referencia',
      TypeSensor: 'Tipo de sensor',
      Add: 'Agregar',
      Parameters: 'Parámetros',
      SelectType: 'Selecciona un tipo de sensor',
      SelectParameter: 'Selecciona un parámetro',
      Search: 'Buscar',
      Tooltip:
        'Si el sensor fue comprado en Didcom, introduce el numero serial que viene en la etiqueta del sensor. Si fue comprado en otro lugar, puedes introducir cualquier dato.',
      SensorRegister:
        'Sensor agregado correctamente, numero de serie del sensor agregado: ',
      Error409Sensor:
        'Ocurrió un problema el sensor que trata de agregar ya se encuentra asignado a este BLEG',
    },
    AssetTracker: {
      AssetTracker: 'Seguimiento de activos',
      Frequency: 'Frecuencia de envío',
      Seconds: 'Segundos',
      MaxSensors: 'Máximo de sensores detectados',
      Prefix: 'Prefijo',
      Variable: 'Variable',
      Variables: 'Variable',
      Save: 'Guardar',
      Identifier: 'Identificador',
      Sensors: 'Sensores',
      TypesSensor: 'Tipos de sensor',
      SelectTypeSensor: 'Selecciona un tipo de sensor',
      Search: 'Buscar',
      UseIdentifier: 'Utilizar como identificador',
      Add: 'Agregar',
      Cancel: 'Cancelar',
      ExistsVariable: 'Ya existe un sensor asignado con esa variable',
      SavedCorrectly: 'Se guardo correctamente',
      ErrorFrequency:
        'La frecuencia debe ser mayor o igual a 10 y menor o igual a 120',
      ErrorMaxSensors:
        'El máximo de sensores debe ser mayor o igual a 1 y menor o igual a 100',
      ErrorCalculate:
        'La cantidad de mensajes configurados, sobrepasa la cantidad de mensajes permitidos por geotab',
    },
    History: {
      Graphic: 'Gráfica',
      Detail: 'Detalle',
    },
    Messages: {
      EmptyFields: 'Llene todos los campos',
    },
    Status: {
      ServerError: 'Error de servidor',
      Unauthorized: 'No autorizado',
      NoConnection: 'Sin conexión',
      Error: 'Ocurrió un error, revisa tu conexión de internet por favor',
    },
    RegisterModal: {
      AssignBleg: 'Asignar BLEG a un vehículo',
      AddSensor: 'Agregar nuevo sensor',
      ReadQr: 'Leer código QR',
      ManualCode: 'Código manual',
    },
    Constants: {
      LocationPermission:
        'necesita permiso para acceder a tu ubicación, para darte un mejor servicio en tiempo real',
      LocationService:
        'necesita que enciendas tu ubicación actual para un buen funcionamiento del bluetooth y conexión',
      BluetoothPermission:
        'necesita permisos para la detección de dispositivos cercanos, para darte un mejor servicio en tiempo real',
      BluetoothEnabled:
        'necesita que enciendas bluetooth en tu dispositivo para utilizar el tiempo real',
      BluetoothNotSupport:
        'Tu dispositivo no tiene soporte para Bluetooth Low Energy, no puedes acceder a tiempo real',
      CameraPermission:
        'necesita acceso a la cámara de tu teléfono, para leer el QR de los dispositivos',
      AllPermission:
        'necesita permisos para acceder a varias características de tu dispositivo para funcionar correctamente, recuerda dar los accesos necesarios',
      BluetoothConnectedQuestion:
        '¿Estas conectado a un BLEG deseas desconectarte?',

      BluetoothTurnOn: 'Encender Bluetooth',
      GoToConfiguration: 'Ir a configuraciones',
      NoThanks: 'No, gracias',
      Accept: 'Aceptar',
      Delete: 'Eliminar',
      Cancel: 'Cancelar',
    },
  },
}
