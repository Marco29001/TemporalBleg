import { useEffect, useState, useRef, useReducer } from 'react'
import { BleManager } from 'react-native-ble-plx'
import { useGlobalContext } from '../../../../context/GlobalContext'
import {
  SENSOR_MANAGER_SERVICE,
  SENSOR_CHARACTERISTIC,
} from '../../../../utils/Constants'
import {
  EmptyObjectValidate,
  convertBase64ToString,
  convertMacAddress,
} from '../../../../utils/Common'
import moment from 'moment'

const manager = new BleManager()

function useGatewayConnection(variables, sensorsDb) {
  const { gatewayRealTime } = useGlobalContext()
  const timer = useRef(null)
  const [statusConnect, setStatusConnect] = useState(0) //status 0 connecting, 1 disconnected, 2 connected
  const [sensorService, setSensorService] = useState(null)
  const [characteristic, setCharacteristic] = useState(null)
  const [rssiGateway, setRssiGateway] = useState(
    gatewayRealTime?.rssi * -1 ?? 0,
  )
  const [variableGraphic, setVariableGraphic] = useState(null)

  const [sensors, setSensors] = useState(new Map())

  const connectionGateway = async gateway => {
    try {
      // Validate connection to bleg
      const validateConnection = await gateway.isConnected()

      if (!validateConnection) {
        setStatusConnect(0)
        // Connect to device
        const connectedGateway = await gateway.connect()
        console.log('Device is connected')
        // Discover all device services and characteristics
        const allServicesAndCharacteristics =
          await connectedGateway.discoverAllServicesAndCharacteristics()
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

  const disconnectGateway = async gateway => {
    try {
      await manager.cancelDeviceConnection(gateway.id)
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
      processSensorData(convertBase64ToString(characteristic.value))
    } catch (error) {
      console.log('ocurrió un error al obtener la característica', error)
    }
  }

  const getRssiGateway = async () => {
    try {
      const gateway = await gatewayRealTime.readRSSI()
      setRssiGateway(gateway.rssi * -1)
    } catch (error) {
      console.log('Error rssi', error)
    }
  }

  const processSensorData = data => {
    data.Sensores.map(sensor => {
      const propertiesSensor = Object.keys(sensor)
      const sensorVariable = getDataVariableSensor(
        parseInt(sensor.ID),
        sensor.VL,
      )

      propertiesSensor.map(key => {
        sensor[key] =
          key == 'MC'
            ? convertMacAddress(sensor[key])
            : EmptyObjectValidate(sensor[key])
      })

      setSensors(map => {
        let s = map.get(sensor.MC)
        if (s) {
          const variableIndex = s.variables.findIndex(item => item.id == s.ID)

          s.BT = sensor.BT
          s.SG = sensor.SG
          s.LA = sensor.LA
          if (variableIndex !== -1) {
            s.variables[variableIndex].history.push(sensorVariable.history[0])
            s.variables[variableIndex].history = filterHistory(
              s.variables[variableIndex].history,
            )
          } else {
            s.variables.push(sensorVariable)
          }

          return new Map(map.set(s.MC, s))
        } else {
          sensor.reference = ''
          sensor.variables = [sensorVariable]
          return new Map(map.set(sensor.MC, sensor))
        }
      })
    })
  }

  const getDataVariableSensor = (idVariable, value) => {
    let date = new Date()

    const LocalVariables = [
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
        id: 10051,
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
        id: 10071,
        name: 'Voltaje 2',
        unit: 'V',
        unitType: 1,
      },
      {
        id: 6,
        name: 'Presión 100 psi',
        unit: 'psi',
        unitType: 1,
      },
      {
        id: 7,
        name: 'Presión 420 Psi',
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
        id: 13,
        name: 'Batería',
        unit: 'Volts (V)',
        unitType: 1,
      },
      {
        id: 14,
        name: 'Estado de entrada',
        unit: '',
        unitType: 1,
      },
      {
        id: 15,
        name: 'Movimiento',
        unit: '',
        unitType: 1,
      },
      {
        id: 16,
        name: 'Angulo',
        unit: '°',
        unitType: 1,
      },
      {
        id: 17,
        name: 'Presencia',
        unit: '',
        unitType: 1,
      },
      {
        id: 18,
        name: 'Temperatura de combustible',
        unit: '°C',
        unitType: 1,
      },
      {
        id: 19,
        name: 'Presión de llantas',
        unit: 'psi',
        unitType: 1,
      },
      {
        id: 20,
        name: 'Alertas de fuga',
        unit: '',
        unitType: 1,
      },
    ]

    const variable = LocalVariables.find(item => item.id == idVariable)
    variable.id = idVariable
    variable.history = [{ x: date, y: value }]

    return variable
  }

  const filterHistory = history => {
    const currentDate = moment(
      history[history.length - 1].x,
      'YYYY-MM-DD HH:mm:ss',
    )

    const fiveMinutesAgo = currentDate.clone().subtract(5, 'minutes')

    return history.filter(entry =>
      moment(entry.x, 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(fiveMinutesAgo),
    )
  }

  const handleSensorVariable = (macAddress, variableId) => () => {
    const sensor = sensors.get(macAddress)
    if (sensor) {
      const variable = sensor.variables.find(item => item.id == variableId)
      if (variable) {
        setVariableGraphic(variable)
      }
    }
  }

  const handleCloseVariableGraphic = () => {
    setVariableGraphic(null)
  }

  const emptyVariables = () => {
    setStatusConnect(1)
    setCharacteristic(null)
    setSensorService(null)
    clearInterval(timer.current)
  }

  useEffect(() => {
    if (sensorService) {
      timer.current = setInterval(() => {
        getCharacteristic(sensorService)
        getRssiGateway()
      }, 1000)
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [sensorService])

  useEffect(() => {
    if (sensors.size !== 0) {
      let actualSensors = Array.from(sensors.values())
      //console.log(JSON.stringify(actualSensors[0]?.variables, null, 2))
    }
  }, [sensors])

  return {
    statusConnect,
    characteristic,
    rssiGateway,
    sensors: Array.from(sensors.values()),
    variableGraphic,
    connectionGateway,
    disconnectGateway,
    handleSensorVariable,
    handleCloseVariableGraphic,
  }
}

export default useGatewayConnection
