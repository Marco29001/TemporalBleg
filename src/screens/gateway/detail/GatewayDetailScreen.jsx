import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { i18n } from '../../../assets/locale/i18n'
import {
  getGatewayById,
  synchronizeGateway,
  CheckVersionSynchronize,
} from '../../../services/remote/GatewayServices'
import useApiRequest from '../../../hooks/useApiRequest'
import useDialog from '../../../hooks/useDialog'
import { createGateway } from '../../../redux/slices/gatewaySlice'
import HeaderComp from '../../../components/HeaderComp'
import RegisterModal from '../../../components/RegisterModal'
import Loading from './components/Loading'
import ListSensors from './components/ListSensors'
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon'
import { showToastMessage, dateFormat } from '../../../utils/Common'
import { OK_DIALOG, WARNING_DIALOG } from '../../../utils/Constants'
import { useGlobalContext } from '../../../context/GlobalContext'

function GatewayDetailScreen(props) {
  const { gateway, setGateway } = useGlobalContext()
  const dispatch = useDispatch()
  const [modalRegister, setModalRegister] = useState(false)
  const [loadSync, setLoadSync] = useState(false)
  const { showDialog } = useDialog()
  const { loading, error, callEndpoint } = useApiRequest()

  const refreshGateway = async () => {
    const response = await callEndpoint(getGatewayById(gateway.id))
    if (response) {
      setGateway(response)
    }
  }

  const handleReturn = () => {
    props.navigation.replace('TabBarNavigator')
  }

  const handleEditDevice = () => {
    props.navigation.replace('GatewayRegisterScreen', { lastScreen: 'detail' })
  }

  const handleRegister = () => {
    dispatch(createGateway(gateway.gateway))
    setModalRegister(!modalRegister)
  }

  const getSynchronizeGateway = async () => {
    setLoadSync(true)
    const response = await callEndpoint(
      synchronizeGateway(gatewayId, gateway.device.id),
    )
    if (response) {
      setLongPolling(response.messageId, response.version)
    }
  }

  const setLongPolling = async (messageId, version) => {
    const response = await callEndpoint(
      CheckVersionSynchronize(gatewayId, gateway.device.id, messageId, version),
    )

    if (response) {
      let configDialogOk = Object.assign({}, OK_DIALOG)
      let configDialogWarning = Object.assign({}, WARNING_DIALOG)

      switch (response.code) {
        case 1:
          const tempGateway = Object.assign({}, gateway)
          tempGateway.gateway.isSynchronized = true
          tempGateway.gateway.lastUpdate = response.lastUpdateString
          setGateway(tempGateway)

          setLoadSync(false)
          configDialogOk.subtitle = i18n.t('GatewayDetail.UpdatedSynchronize')
          showDialog(configDialogOk)
          break
        case 2:
        case 3:
        case 4:
          setLoadSync(false)
          configDialogWarning.subtitle = i18n.t(
            'GatewayDetail.ErrorSynchronize',
          )
          showDialog(configDialogWarning)
          break
        case 5:
          setLoadSync(false)
          configDialogWarning.subtitle = i18n.t(
            'GatewayDetail.ModulesLastVersion',
          )
          showDialog(configDialogWarning)
          break
        case 6:
          await new Promise(resolve => setTimeout(resolve, 5000))
          setLongPolling(messageId, version)
          break
        case 7:
          setLoadSync(false)
          configDialogWarning.subtitle = i18n.t('GatewayDetail.TimeExpired')
          showDialog(configDialogWarning)
          break
      }
    }
  }

  useEffect(() => {
    refreshGateway()
  }, [])

  useEffect(() => {
    if (error) {
      showToastMessage('didcomErrorToast', error.message)
    }
  }, [error])

  return (
    <View style={styles.mainContainer}>
      <HeaderComp
        title={i18n.t('GatewayDetail.TitleHeader')}
        handleReturn={handleReturn}
      />

      {loading || loadSync || gateway['isSynchronized'] !== undefined ? (
        <Loading />
      ) : (
        <>
          <View
            style={[
              styles.synchronizeInfoContainer,
              {
                backgroundColor: gateway.gateway.isSynchronized
                  ? '#1ABC9C'
                  : '#ED8302',
              },
            ]}>
            <Text style={styles.txtSynchronizeInfo}>
              {gateway.gateway.isSynchronized
                ? i18n.t('GatewayDetail.Synchronized')
                : i18n.t('GatewayDetail.NotSynchronized')}
              {i18n.t('GatewayDetail.LastSynchronized') + ': '}
              {dateFormat(gateway.gateway.lastUpdate)}
            </Text>
          </View>
          <View style={styles.formContainer}>
            {/* Gateway section */}
            <Text style={styles.txtTitleForm}>
              {i18n.t('GatewayDetail.NoSerieBleg')}
            </Text>
            <Text style={styles.txtInfoForm}>
              {gateway.gateway.serialNumber}
            </Text>
            <View style={styles.lineSeparator} />
            {/* Vehicle section */}
            <View style={styles.titleVehicleContainer}>
              <Text style={styles.txtTitleForm}>
                {i18n.t('GatewayDetail.VehicleAssigned')}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditDevice}>
                <BlegIcon name="icon_edit" color={'#17A0A3'} size={25} />
              </TouchableOpacity>
            </View>
            <View style={styles.vehicleContainer}>
              <View style={styles.infoVehicle}>
                <Text style={styles.txtTitleInfo}>
                  {i18n.t('GatewayDetail.Unit')}
                </Text>
                <Text style={styles.txtInfoVehicle}>
                  {gateway.device.name ?? ''}
                </Text>
                <Text style={styles.txtTitleInfo}>
                  {i18n.t('GatewayDetail.NoSerieGo')}
                </Text>
                <Text style={styles.txtInfoVehicle}>
                  {gateway.device.serialNumber ?? ''}
                </Text>
              </View>
              <View style={styles.vehicleIcon}>
                <BlegIcon name="icon_bus" color={'#17A0A3'} size={40} />
              </View>
            </View>
            <View style={styles.lineSeparator} />
            {/* Sensors section */}
            <View style={styles.titleSensorsContainer}>
              <Text style={styles.txtTitleForm}>
                {i18n.t('GatewayDetail.Sensors')}
              </Text>
              <View style={styles.addButtonContainer}>
                <TouchableOpacity onPress={handleRegister}>
                  <BlegIcon name="icon_plus" color={'#00317F'} size={25} />
                </TouchableOpacity>
              </View>
            </View>
            <ListSensors
              {...props}
              sensors={gateway.sensors}
              error={error}
              loading={loading}
              onRefresh={refreshGateway}
            />
          </View>
          <View style={styles.synchronizeContainer}>
            <TouchableOpacity
              style={styles.buttonSynchronize}
              onPress={getSynchronizeGateway}>
              <BlegIcon name="icon_refresh" color={'#FFFFFF'} size={25} />
              <Text style={styles.txtButtonSynchronize}>
                {i18n.t('GatewayDetail.Synchronize')}
              </Text>
            </TouchableOpacity>
          </View>
          {/*Modals*/}
          <RegisterModal
            {...props}
            visible={modalRegister}
            type={'sensor'}
            handleClose={handleRegister}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F2F2F7' },
  synchronizeInfoContainer: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtSynchronizeInfo: { fontSize: 16, color: '#FFFFFF', textAlign: 'center' },
  formContainer: { flex: 1, padding: 30 },
  txtTitleForm: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F6F7E',
    marginBottom: 5,
  },
  txtInfoForm: {
    fontSize: 16,
    color: '#97A4B0',
    marginLeft: 20,
  },
  lineSeparator: {
    height: 3,
    backgroundColor: '#D8DFE7',
    marginTop: 10,
    marginBottom: 10,
  },
  titleVehicleContainer: { flexDirection: 'row', paddingVertical: 10 },
  editButton: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleContainer: { flexDirection: 'row', padding: 15 },
  infoVehicle: { flex: 1 },
  txtTitleInfo: { fontSize: 16, color: '#00317F' },
  txtInfoVehicle: {
    fontSize: 16,
    color: '#97A4B0',
    marginLeft: 20,
  },
  vehicleIcon: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  titleSensorsContainer: { flexDirection: 'row', paddingVertical: 10 },
  addButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingHorizontal: 15,
  },
  synchronizeContainer: { flex: 0.1, paddingHorizontal: 10 },
  buttonSynchronize: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtButtonSynchronize: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
  },
})

export default GatewayDetailScreen
