import {useEffect, useState, useRef} from 'react';
import {BleManager} from 'react-native-ble-plx';
import {useGlobalContext} from '../../../../context/GlobalContext';
import {
  SENSOR_MANAGER_SERVICE,
  SENSOR_CHARCTERISTIC,
} from '../../../../utils/Constants';
import {
  convertBase64ToArray,
  sumValuesArray,
  searchSequenceSTXETX,
  convertMacAddreess,
  convertHexadecimalToInt,
  convertDecToFloat,
  convertToInt,
  convertToString,
} from '../../../../utils/Common';

const manager = new BleManager();
let listValuesParams = [];
const config = {
  firmwareVersion: 1,
  idVariable: 2,
  batteryLevel: 1,
  signalDbm: 1,
  macAddress: 6,
  lastSeen: 2,
  sizeData: 1,
  data: 0,
  name: 0,
};
const Localvariables = [
  {
    id: 1,
    name: 'Temperatura',
    unit: '°C',
    unitType: 1,
  },
  {
    id: 2,
    name: 'Humedad',
    unit: '%',
    unitType: 1,
  },
  {
    id: 3,
    name: 'Entrada Digital',
    unit: '',
    unitType: 2,
  },
  {
    id: 4,
    name: 'Voltaje',
    unit: 'V',
    unitType: 1,
  },
  {
    id: 5,
    name: 'Temperatura',
    unit: '°C',
    unitType: 1,
  },
  {
    id: 6,
    name: 'Presion 100 psi',
    unit: 'psi',
    unitType: 1,
  },
  {
    id: 7,
    name: 'Presion 420 Psi',
    unit: 'psi',
    unitType: 1,
  },
  {
    id: 8,
    name: 'Corriente 50 A',
    unit: 'A',
    unitType: 1,
  },
  {
    id: 9,
    name: 'Corriente 100 A',
    unit: 'A',
    unitType: 1,
  },
  {
    id: 10,
    name: 'Nivel Combustible (%)',
    unit: '%',
    unitType: 1,
  },
  {
    id: 11,
    name: 'Nivel Combustible (L)',
    unit: 'L',
    unitType: 1,
  },
  {
    id: 12,
    name: 'Nivel  Combustible HD (%)',
    unit: '%',
    unitType: 1,
  },
  {
    id: 230,
    name: 'Temperatura',
    unit: '°C',
    unitType: 1,
  },
  {
    id: 1003,
    name: 'Temperatura',
    unit: '°C',
    unitType: 1,
  },
  {
    id: 1004,
    name: 'Humedad',
    unit: '%',
    unitType: 1,
  },
];

function useGatewayConnection(variables, sensorGraphic, sensorsDb) {
  const {gatewayRealTime} = useGlobalContext();
  const timer = useRef(null);
  const [statusConnect, setStatusConnect] = useState(0); //status 0 connecting, 1 disconnected, 2 connected
  const [sensorService, setSensorService] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [rssiGateway, setRssiGateway] = useState(
    gatewayRealTime?.rssi * -1 ?? 0,
  );
  const [sensors, setSensors] = useState([]);
  const [variableGraphic, setVariableGraphic] = useState(null);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);

  const connectionGateway = async gateway => {
    try {
      const validateConnection = await gateway.isConnected();

      if (!validateConnection) {
        setStatusConnect(0);
        // connect to device
        const connectedGateway = await gateway.connect();
        // discover all device services and characteristics
        const allServicesAndCharacteristics =
          await connectedGateway.discoverAllServicesAndCharacteristics();
        //discovered manager service
        const discoveredServices =
          await allServicesAndCharacteristics.services();
        //find service
        const service = discoveredServices.find(
          item => item.uuid == SENSOR_MANAGER_SERVICE,
        );

        if (service) {
          //read characteristic
          await getCharacteristic(service);
          setSensorService(service);
          setStatusConnect(2);
        }
      } else {
        setStatusConnect(2);
      }
    } catch (error) {
      setStatusConnect(1);
      console.log('ocurrio un error al conectar', error);
    }
  };

  const disconnectGateway = async gateway => {
    try {
      await manager.cancelDeviceConnection(gateway.id);
      //-----------------
      setStatusConnect(1);
      setCharacteristic(null);
      setSensorService(null);
      clearInterval(timer.current);
    } catch (error) {
      console.log('No disconnecting device', error);
    }
  };

  const getCharacteristic = async service => {
    try {
      const characteristic = await service.readCharacteristic(
        SENSOR_CHARCTERISTIC,
      );
      processSensorData(convertBase64ToArray(characteristic.value));
    } catch (error) {
      console.log('ocurrio un error al obtener la caracteristica', error);
    }
  };

  const getRssiGateway = async () => {
    try {
      const gateway = await gatewayRealTime.readRSSI();
      setRssiGateway(gateway.rssi * -1);
    } catch (error) {
      console.log('error rssi', error);
    }
  };

  const processSensorData = dataFrame => {
    let flag = 0;
    const listSensors = [];

    while (flag < dataFrame.length) {
      const sensor = {};

      for (const key in config) {
        let data = [];
        let value = config[key];

        data = dataFrame.slice(flag, flag + value);

        switch (key) {
          case 'firmwareVersion':
            if (flag > 0) {
              value = 0;
            }
            sensor[key] = dataFrame[0];
            break;
          case 'idVariable':
            const id = sumValuesArray(data);
            sensor[key] = id;
            break;
          case 'signalDbm':
            const signal = data[0] * -1;
            sensor[key] = signal + ' dBm';
            break;
          case 'macAddress':
            const mac = convertMacAddreess(data);
            sensor[key] = mac;
            break;
          case 'lastSeen':
            const lastSeen = convertHexadecimalToInt(data);
            sensor[key] = lastSeen + ' seg';
            break;
          case 'data':
            data = dataFrame.slice(flag, flag + sensor?.sizeData);
            const variableData = getDataVariableSensor(
              sensor.idVariable,
              data,
              sensor.macAddress,
            );
            value = sensor?.sizeData;
            sensor[key] = variableData;
            break;
          case 'name':
            if (sensor?.firmwareVersion >= 31) {
              const {currentFlag, stringData} = searchSequenceSTXETX(
                flag,
                dataFrame,
              );
              flag = currentFlag;
              sensor[key] = stringData;
            }
            break;
          default:
            sensor[key] = data[0];
            break;
        }

        flag += value;
      }

      const searchSensor = listSensors.find(
        s => s.macAddress == sensor.macAddress,
      );

      if (searchSensor) {
        listSensors.map(obj => {
          if (obj.macAddress == sensor.macAddress) {
            obj.data.push(sensor.data[0]);
          }
        });
      } else {
        listSensors.push(sensor);
      }
    }

    listSensors.map(obj => {
      obj.reference = '';
      sensorsDb.map(sensor => {
        const sensorMac = sensor.mac.replace(/:/g, '');
        const macObj = obj.macAddress.replace(/:/g, '');
        if (sensorMac == macObj) {
          obj.reference = sensor.comment;
        }
      });
    });

    setSensors(listSensors);
  };

  const getDataVariableSensor = (idVariable, data, macAddress) => {
    const dataArray = [];
    let value = null;

    const variable = Localvariables.find(item => item.id == idVariable);

    if (variable) {
      switch (variable.unitType) {
        case 1:
          value = convertDecToFloat(data).toFixed(2);
          value.toString();
          break;
        case 2:
          value = convertToInt(data).toString();
          break;
        case 3:
          value = convertToString(data);
          break;
      }

      dataArray.push({
        id: variable.id,
        name: variable.name,
        unit: variable.unit,
        value,
      });

      getMinAndMaxValue(variable, macAddress, value);
    }

    return dataArray;
  };

  const getMinAndMaxValue = (variable, macAddress, value) => {
    const search = listValuesParams.some(
      data => data.mac == macAddress && data.variableId == variable.id,
    );

    if (search) {
      listValuesParams.map(obj => {
        if (
          value >= obj.max &&
          obj.variableId == variable.id &&
          obj.mac == macAddress
        ) {
          obj.max = value;
        } else if (
          value != obj.min &&
          obj.variableId == variable.id &&
          obj.mac == macAddress
        ) {
          obj.min = value;
        }
      });
    } else {
      listValuesParams.push({
        variableId: variable.id,
        mac: macAddress,
        max: value,
        min: value,
      });
    }
  };

  useEffect(() => {
    if (sensorGraphic !== null) {
      const sensor = sensors.find(
        s => s.macAddress == sensorGraphic.macAddress,
      );
      const variable = sensor.data.find(d => d.id == sensorGraphic.variableId);

      setVariableGraphic(variable);

      listValuesParams.map(obj => {
        if (
          obj.variableId == sensorGraphic.variableId &&
          obj.mac == sensorGraphic.macAddress
        ) {
          setMax(obj.max);
          setMin(obj.min);
        }
      });
    }
  }, [sensors]);

  useEffect(() => {
    if (sensorService) {
      timer.current = setInterval(() => {
        getCharacteristic(sensorService);
        getRssiGateway();
      }, 2000);
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [sensorService]);

  return {
    statusConnect,
    characteristic,
    rssiGateway,
    sensors,
    variableGraphic,
    max,
    min,
    connectionGateway,
    disconnectGateway,
  };
}

export default useGatewayConnection;
