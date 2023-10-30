import {useState, useEffect, useReducer} from 'react';
import {BleManager} from 'react-native-ble-plx';
import {useGlobalContext} from '../../../../context/GlobalContext';
import useBluetooth from '../../../../hooks/useBluetooth';
import {convertBase64ToHex} from '../../../../utils/Common';
import {NAME_GATEWAY} from '../../../../utils/Constants';

const manager = new BleManager();
const reducer = (state, action) => {
  const {gateway} = action;
  switch (action.type) {
    case 'add_gateway':
      if (
        gateway &&
        !state.some(gat => gat.manufacturerData == gateway.manufacturerData)
      ) {
        return [...state, gateway];
      }

      return state;
    case 'clear':
      return [];
    default:
      return state;
  }
};

function useFindGateways() {
  const {
    listGateways,
    listGatewaysRealTime,
    setListGatewaysRealTime,
    setGatewayRealTime,
  } = useGlobalContext();
  const [scannedGateways, dispatch] = useReducer(reducer, []);
  const [scanning, setScanning] = useState(false);
  const {statusBluetooth, validateLocationEnabled, validateBluetoothEnabled} =
    useBluetooth(manager);

  //scan devices
  const scanGateways = async () => {
    const isLocationEnabled = await validateLocationEnabled();
    const isBluetoothEnabled = await validateBluetoothEnabled();

    if (isLocationEnabled && isBluetoothEnabled) {
      setScanning(true);
      manager.startDeviceScan(null, null, (err, device) => {
        if (err) {
          console.log('error al escanear bleg', err);
        }

        if (device) {
          if (
            device.manufacturerData &&
            (device.name === NAME_GATEWAY || device.localName === NAME_GATEWAY)
          ) {
            device.manufacturerData = convertBase64ToHex(
              device.manufacturerData,
            );
            //search gateway in db list and change the properties
            const gateway = listGateways.find(
              item => item.mac == device.manufacturerData,
            );

            if (gateway) {
              device.idDb = gateway.id;
              device.sensors = gateway.totalSensors;
              device.unit = gateway.device;

              dispatch({type: 'add_gateway', gateway: device});
            }
          }
        }
      });

      // stop scanning gateways after 20 seconds
      setTimeout(() => {
        stopScanGateways();
      }, 20000);
    }
  };

  const stopScanGateways = () => {
    manager.stopDeviceScan();
    setScanning(false);
  };

  useEffect(() => {
    if (statusBluetooth == 'PoweredOff') {
      stopScanGateways();
    }
  }, [statusBluetooth]);

  useEffect(() => {
    if (scannedGateways.length != 0) {
      setListGatewaysRealTime(scannedGateways);
    }
  }, [scannedGateways]);

  return {
    scanning,
    statusBluetooth,
    listGatewaysRealTime,
    setGatewayRealTime,
    scanGateways,
    stopScanGateways,
  };
}

export default useFindGateways;
