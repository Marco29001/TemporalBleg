import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useDispatch } from 'react-redux'
import { i18n } from '../../../assets/locale/i18n'
import {
  setOpenHistory,
  setVariableObserver,
  setVariables,
} from '../../../redux/slices/sensorsSlice'
import { useGlobalContext } from '../../../context/GlobalContext'
import { getVariables } from '../../../services/remote/VariableServices'
import useBlegConnection from './hooks/useBlegConnection'
import useApiRequest from '../../../hooks/useApiRequest'
import useDialog from '../../../hooks/useDialog'
import StatusBarComp from '../../../components/StatusBarComp'
import SignalComp from '../../../components/SignalComp'
import LoadingModal from '../../../components/LoadingModal'
import ListSensorsRealTime from './components/ListSensorsRealTime'
import History from './components/History'
import {
  DISCONNECT_BLEG_DIALOG,
  WARNING_DIALOG,
} from '../../../utils/Constants'
import HeaderComp from '../../../components/HeaderComp'

export default function BlegRealTimeScreen({ navigation }) {
  const { BlegRealTime } = useGlobalContext()
  const dispatch = useDispatch()
  const { dialogState, showDialog } = useDialog()
  const {
    statusConnect,
    rssiBleg,
    setIsWaiting,
    connectionBleg,
    disconnectBleg,
  } = useBlegConnection()
  const { loading, error, callEndpoint } = useApiRequest()

  useEffect(() => {
    refreshVariables()
  }, [])

  useEffect(() => {
    if (!dialogState.open) {
      setIsWaiting(false)
    }
  }, [dialogState])

  useEffect(() => {
    if (error) {
      WARNING_DIALOG.subtitle = error.message
      showDialog(WARNING_DIALOG, () => null)
    }
  }, [error])

  const handleReturn = () => {
    if (statusConnect == 2) {
      setIsWaiting(true)
      showDialog(DISCONNECT_BLEG_DIALOG, () => {
        disconnectBleg(BlegRealTime)
        navigation.replace('TabBarNavigator', {
          screen: 'BlegsFindScreen',
        })
      })
    } else {
      navigation.replace('TabBarNavigator', {
        screen: 'BlegsFindScreen',
      })
    }
  }

  const handleSwitch = () => {
    if (statusConnect == 2) {
      disconnectBleg(BlegRealTime)
    } else {
      connectionBleg(BlegRealTime)
    }
  }

  const refreshVariables = async () => {
    const response = await callEndpoint(getVariables())
    if (response) {
      console.log(response)
      dispatch(setVariables(response))
      connectionBleg(BlegRealTime)
    }
  }

  const handleSelectVariable = variable => {
    dispatch(setVariableObserver(JSON.stringify(variable)))
    dispatch(setOpenHistory(true))
  }

  return (
    <>
      <LoadingModal visible={loading} />

      <StatusBarComp backgroundColor="#003180" barStyle={'light-content'} />

      <HeaderComp
        title={'BLEG'}
        isSwitchActive={true}
        isSwitchOn={statusConnect == 2 || statusConnect == 0 ? true : false}
        onToggleSwitch={handleSwitch}
        handleReturn={handleReturn}
      />

      <View style={Styles.mainContent}>
        <View style={Styles.infoContent}>
          <View style={Styles.leftInfo}>
            <View style={Styles.leftField}>
              <Text style={Styles.txtTitleField}>
                {i18n.t('BlegRealtime.MacAddress')}:
              </Text>
              <Text style={Styles.txtInfo}>{BlegRealTime.id}</Text>
            </View>
            <View style={Styles.leftField}>
              <Text style={Styles.txtTitleField}>
                {i18n.t('BlegRealtime.Status')}:
              </Text>
              <Text style={Styles.txtConnected(statusConnect)}>
                {statusConnect == 0
                  ? i18n.t('BlegRealtime.Connecting')
                  : statusConnect == 2
                  ? i18n.t('BlegRealtime.Connected')
                  : i18n.t('BlegRealtime.Disconnected')}
              </Text>
              {statusConnect == 0 && (
                <ActivityIndicator size="small" color="#17A0A3" />
              )}
            </View>
          </View>
          <View style={Styles.rightInfo}>
            <SignalComp signalRssi={rssiBleg} size={30} />
          </View>
        </View>
        {/* list sensors */}
        <ListSensorsRealTime handleSelectVariable={handleSelectVariable} />
      </View>
      {/* modals */}
      <History />
    </>
  )
}

const Styles = StyleSheet.create({
  mainContent: { flex: 1, backgroundColor: '#F2F2F7' },
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
  txtConnected: connected => {
    const color =
      connected == 0 ? '#9DA9B4' : connected == 1 ? 'red' : '#17A0A3'
    return {
      fontSize: 16,
      color: color,
      marginHorizontal: 10,
    }
  },
  rightInfo: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { flex: 1 },
})
