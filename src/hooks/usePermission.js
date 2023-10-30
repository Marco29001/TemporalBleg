import {Platform} from 'react-native';
import {PERMISSIONS, RESULTS, request, check} from 'react-native-permissions';

function usePermissions() {
  const PLATFORM_CAMERA_PERMISSIONS = {
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  };

  const PLATFORM_LOCATION_PERMISSIONS = {
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  };

  const PLATFORM_BLUETOOTH_CONNECT_PERMISSIONS = {
    ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    android: PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  };

  const PLATFORM_BLUETOOTH_SCAN_PERMISSIONS = {
    android: PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  };

  const REQUEST_PERMISSION_TYPE = {
    camera: PLATFORM_CAMERA_PERMISSIONS,
    location: PLATFORM_LOCATION_PERMISSIONS,
    bluetoothConnect: PLATFORM_BLUETOOTH_CONNECT_PERMISSIONS,
    bluetoothScan: PLATFORM_BLUETOOTH_SCAN_PERMISSIONS,
  };

  const PERMISSION_TYPE = {
    camera: 'camera',
    location: 'location',
    bluetoothConnect: 'bluetoothConnect',
    bluetoothScan: 'bluetoothScan',
  };

  const checkPermission = async type => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    if (!permissions) {
      return true;
    }

    try {
      const r = await check(permissions);
      //console.log('permission', type, 'value: ', r);
      switch (r) {
        case RESULTS.UNAVAILABLE:
          if (type == 'location') {
            return true;
          }
          return false;
        case RESULTS.DENIED:
          return requestPermission(permissions);
        case RESULTS.LIMITED:
          return false;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          return false;
      }
    } catch (error) {
      return false;
    }
  };

  const requestPermission = async permissions => {
    try {
      const r = await request(permissions);
      if (r === RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  return {PERMISSION_TYPE, checkPermission};
}

export default usePermissions;
