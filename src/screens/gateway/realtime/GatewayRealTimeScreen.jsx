import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { i18n } from '../../../assets/locale/i18n'
import { useGlobalContext } from '../../../context/GlobalContext'
import { getVariables } from '../../../services/remote/VariableServices'
import { getGatewayById } from '../../../services/remote/GatewayServices'
import useGatewayConnection from './hooks/useGatewayConnection'
import useApiRequest from '../../../hooks/useApiRequest'
import useDialog from '../../../hooks/useDialog'
import StatusBarComp from '../../../components/StatusBarComp'
import SignalComp from '../../../components/SignalComp'
import LoadingModal from '../../../components/LoadingModal'
import ListSensorsRealTime from './components/ListSensorsRealTime'
import History from './components/History'
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon'
import { WARNING_DIALOG } from '../../../utils/Constants'

export default function GatewayRealTimeScreen({ navigation }) {
  const { gatewayRealTime } = useGlobalContext()
  const [sensorsDb, setSensorsDb] = useState([])
  const [variables, setVariables] = useState([])
  const { showDialog } = useDialog()
  const {
    statusConnect,
    rssiGateway,
    sensors,
    variableGraphic,
    connectionGateway,
    disconnectGateway,
    handleSensorVariable,
    handleCloseVariableGraphic,
  } = useGatewayConnection(variables, sensorsDb)
  const { loading, error, callEndpoint } = useApiRequest()

  const handleReturn = () => {
    if (statusConnect == 2) {
      disconnectGateway(gatewayRealTime)
    }

    navigation.replace('TabBarNavigator', {
      screen: 'GatewaysFindScreen',
    })
  }

  const handleSwitch = () => {
    if (statusConnect == 2) {
      disconnectGateway(gatewayRealTime)
    } else {
      connectionGateway(gatewayRealTime)
    }
  }

  //-------------------------------------------------------------------------------------

  const refreshVariables = async () => {
    const response = await callEndpoint(getVariables())
    if (response) {
      setVariables(response)
      connectionGateway(gatewayRealTime)
    }
  }

  const refreshGateway = async () => {
    const response = await callEndpoint(getGatewayById(gatewayRealTime.idDb))
    if (response) {
      setSensorsDb(response.sensors)
    }
  }

  //---------------------------------------------------------------------------------------
  useEffect(() => {
    connectionGateway(gatewayRealTime)
    //refreshGateway();
    //refreshVariables();
  }, [])

  useEffect(() => {
    if (error) {
      WARNING_DIALOG.subtitle = error.message
      showDialog(WARNING_DIALOG, () => null)
    }
  }, [error])

  return (
    <>
      <LoadingModal visible={loading} />

      <StatusBarComp backgroundColor="#003180" barStyle={'light-content'} />

      <View style={Styles.mainContent}>
        <View style={Styles.headerContent}>
          <View style={Styles.topHeader}>
            <View style={Styles.leftTopHeader}>
              <TouchableOpacity style={Styles.btnBack} onPress={handleReturn}>
                <BlegIcon name={'icon_return'} color={'#FFFFFF'} size={25} />
              </TouchableOpacity>
              <Text style={Styles.txtNameGateway}>{gatewayRealTime.name}</Text>
            </View>
            <View style={Styles.rigthTopHeader}>
              <View style={Styles.switchContainer(statusConnect)}>
                <TouchableOpacity
                  style={Styles.btnSwitch(statusConnect)}
                  onPress={handleSwitch}
                />
              </View>
            </View>
          </View>
          <View style={Styles.bottomHeader} />
        </View>
        <View style={Styles.infoContent}>
          <View style={Styles.leftInfo}>
            <View style={Styles.leftField}>
              <Text style={Styles.txtTitleField}>
                {i18n.t('GatewayRealtime.MacAddress')}:
              </Text>
              <Text style={Styles.txtInfo}>{gatewayRealTime.id}</Text>
            </View>
            <View style={Styles.leftField}>
              <Text style={Styles.txtTitleField}>
                {i18n.t('GatewayRealtime.Status')}:
              </Text>
              <Text style={Styles.txtConected(statusConnect)}>
                {statusConnect == 0
                  ? i18n.t('GatewayRealtime.Connecting')
                  : statusConnect == 2
                  ? i18n.t('GatewayRealtime.Connected')
                  : i18n.t('GatewayRealtime.Disconnected')}
              </Text>
              {statusConnect == 0 && (
                <ActivityIndicator size="small" color="#17A0A3" />
              )}
            </View>
          </View>
          <View style={Styles.rigthInfo}>
            <SignalComp signalRssi={rssiGateway} size={30} />
          </View>
        </View>
        <ListSensorsRealTime
          data={sensors}
          handleSensorVariable={handleSensorVariable}
        />
      </View>
      {/* modals */}
      <History
        variable={variableGraphic}
        handleClose={handleCloseVariableGraphic}
      />
    </>
  )
}

const Styles = StyleSheet.create({
  mainContent: { flex: 1, backgroundColor: '#F2F2F7' },
  headerContent: {
    flex: 0.15,
    backgroundColor: '#003180',
    paddingHorizontal: 15,
  },
  topHeader: { flex: 1, flexDirection: 'row' },
  leftTopHeader: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  btnBack: {
    width: 50,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rigthTopHeader: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  switchContainer: value => {
    const backgroundColor = value == 2 || value == 0 ? '#FFFFFF' : '#041649'
    return {
      width: 65,
      height: 30,
      backgroundColor,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  btnSwitch: value => {
    const right = value == 2 || value == 0 ? 1 : null
    const left = value == 2 || value == 0 ? null : 1
    return {
      width: 25,
      height: 25,
      borderRadius: 50,
      backgroundColor: '#003180',
      right,
      left,
      position: 'absolute',
    }
  },
  bottomHeader: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  txtNameGateway: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  infoContent: {
    flex: 0.1,
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  leftInfo: { flex: 1 },
  leftField: { flexDirection: 'row', marginVertical: 5 },
  txtTitleField: { fontSize: 16, color: '#5F6F7E' },
  txtInfo: { fontSize: 16, color: '#9DA9B4', marginLeft: 10 },
  txtConected: conected => {
    const color = conected == 0 ? '#9DA9B4' : conected == 1 ? 'red' : '#17A0A3'
    return {
      fontSize: 16,
      color: color,
      marginHorizontal: 10,
    }
  },
  rigthInfo: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { flex: 1 },
})
