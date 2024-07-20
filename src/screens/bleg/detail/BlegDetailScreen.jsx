import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { i18n } from '../../../assets/locale/i18n'
import {
  getBlegById,
  synchronizeBleg,
  checkVersionSynchronize,
} from '../../../services/remote/BlegServices'
import useApiRequest from '../../../hooks/useApiRequest'
import useDialog from '../../../hooks/useDialog'
import { createBleg, selectBleg } from '../../../redux/slices/blegSlice'
import HeaderComp from '../../../components/HeaderComp'
import RegisterModal from '../../../components/RegisterModal'
import Loading from './components/Loading'
import ListSensors from './components/ListSensors'
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon'
import { dateFormat } from '../../../utils/Common'
import { OK_DIALOG, WARNING_DIALOG } from '../../../utils/Constants'
import LoadingModal from './components/LoadingModal'
import { selectNotification } from '../../../redux/slices/notificationSlice'

function BlegDetailScreen(props) {
  const dispatch = useDispatch()
  const bleg = useSelector(selectBleg)
  const notification = useSelector(selectNotification)
  const [modalRegister, setModalRegister] = useState(false)
  const [loadSync, setLoadSync] = useState(false)
  const [isSendCommand, setIsSendCommand] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showDialog } = useDialog()
  const { error, callEndpoint } = useApiRequest()

  useEffect(() => {
    refreshBleg()
  }, [])

  useEffect(() => {
    if (notification) {
      var parseNotification = JSON.parse(notification)
      console.log(parseNotification)
      const tempBleg = Object.assign({}, bleg)
      tempBleg.lastUpdate = parseNotification.LastUpdated
      tempBleg.statusSync = {
        id: parseNotification.StatusNotification,
        descriptionEs: parseNotification.DescriptionNotification,
        descriptionEn: parseNotification.DescriptionNotificationEn,
        icon: parseNotification.Icon,
        color: parseNotification.ColorNotification,
      }

      dispatch(createBleg(tempBleg))
    }
  }, [notification])

  useEffect(() => {
    if (error) {
      if (error.status != 409) {
        let configDialogWarning = Object.assign({}, WARNING_DIALOG)
        configDialogWarning.subtitle = error.message
        showDialog(configDialogWarning)
      }
      setLoadSync(false)
    }
  }, [error])

  const refreshBleg = async () => {
    setIsLoading(true)
    const response = await callEndpoint(getBlegById(bleg.id))
    if (response) {
      setIsLoading(false)
      dispatch(createBleg(response))
    }
  }

  const handleReturn = () => {
    props.navigation.replace('TabBarNavigator')
  }

  const handleEditDevice = () => {
    props.navigation.replace('BlegRegisterScreen', { lastScreen: 'detail' })
  }

  const handleRegister = () => {
    setModalRegister(!modalRegister)
  }

  const getSynchronizeBleg = async () => {
    setLoadSync(true)
    setIsSendCommand(true)
    const response = await callEndpoint(
      synchronizeBleg(bleg.device.id, bleg.id),
    )
    if (response) {
      const tempBleg = Object.assign({}, bleg)
      tempBleg.isSynchronized = false
      tempBleg.statusSync = response.statusBleg
      dispatch(createBleg(tempBleg))
      setIsSendCommand(false)
      setLoadSync(false)
      setLongPolling(response.messageId, response.version)
    } else {
      let configDialogWarning = Object.assign({}, WARNING_DIALOG)
      configDialogWarning.subtitle =
        i18n.t('BlegDetail.ErrorSynchronize') + bleg.serialNumber
      showDialog(configDialogWarning, () => {
        refreshBleg()
      })
      setIsSendCommand(false)
    }
  }

  const setLongPolling = async (messageId, version) => {
    const response = await callEndpoint(
      checkVersionSynchronize(bleg.device.id, bleg.id, messageId, version),
    )

    if (response) {
      //let configDialogOk = Object.assign({}, OK_DIALOG)
      //let configDialogWarning = Object.assign({}, WARNING_DIALOG)

      switch (response.code) {
        case 1:
          /*const tempBleg = Object.assign({}, bleg)
          tempBleg.isSynchronized = true
          tempBleg.lastUpdate = response.lastUpdateString
          dispatch(createBleg(tempBleg))*/
          //configDialogOk.subtitle = i18n.t('BlegDetail.UpdatedSynchronize')
          //showDialog(configDialogOk)
          console.log('long polling response', response)
          break
        case 0:
        case 2:
        case 3:
        case 4:
          //configDialogWarning.subtitle = i18n.t('BlegDetail.ErrorSynchronize')
          //showDialog(configDialogWarning)
          console.log('long polling response', response)
          break
        case 5:
          //configDialogWarning.subtitle = i18n.t('BlegDetail.ModulesLastVersion')
          //showDialog(configDialogWarning)
          break
        case 6:
          await new Promise(resolve => setTimeout(resolve, 5000))
          setLongPolling(messageId, version)
          console.log('long polling response', response)
          break
        case 7:
          //configDialogWarning.subtitle = i18n.t('BlegDetail.TimeExpired')
          //showDialog(configDialogWarning)
          console.log('long polling response', response)
          break
      }
    }
  }

  if (!bleg) {
    return null
  }

  return (
    <View style={styles.mainContainer}>
      <HeaderComp
        title={i18n.t('BlegDetail.TitleHeader')}
        isOptions={true}
        handleReturn={handleReturn}
      />

      {isLoading && !loadSync ? (
        <Loading />
      ) : (
        <>
          <View
            style={[
              styles.synchronizeInfoContainer,
              {
                backgroundColor: bleg?.statusSync.color,
              },
            ]}>
            <Text style={styles.txtSynchronizeInfo}>
              {i18n._locale == 'es'
                ? bleg?.statusSync.descriptionEs
                : bleg?.statusSync.descriptionEn}
            </Text>
            <Text style={styles.txtSynchronizeInfo}>
              {i18n.t('BlegDetail.LastSynchronized')}:{' '}
              {dateFormat(bleg?.lastUpdate)}
            </Text>
          </View>
          <View style={styles.formContainer}>
            {/* Bleg section */}
            <Text style={styles.txtTitleForm}>
              {i18n.t('BlegDetail.NoSerieBleg')}
            </Text>
            <Text style={styles.txtInfoForm}>{bleg?.serialNumber}</Text>
            <View style={styles.lineSeparator} />
            {/* Vehicle section */}
            <View style={styles.titleVehicleContainer}>
              <Text style={styles.txtTitleForm}>
                {i18n.t('BlegDetail.VehicleAssigned')}
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
                  {i18n.t('BlegDetail.Unit')}
                </Text>
                <Text style={styles.txtInfoVehicle}>
                  {bleg?.device.name ?? ''}
                </Text>
                <Text style={styles.txtTitleInfo}>
                  {i18n.t('BlegDetail.NoSerieGo')}
                </Text>
                <Text style={styles.txtInfoVehicle}>
                  {bleg?.device.serialNumber ?? ''}
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
                {i18n.t('BlegDetail.Sensors')}
              </Text>
              <View style={styles.addButtonContainer}>
                <TouchableOpacity onPress={handleRegister}>
                  <BlegIcon name="icon_plus" color={'#00317F'} size={25} />
                </TouchableOpacity>
              </View>
            </View>
            <ListSensors sensors={bleg?.sensors} onRefresh={refreshBleg} />
          </View>
          <View style={styles.synchronizeContainer}>
            <TouchableOpacity
              style={styles.buttonSynchronize}
              onPress={getSynchronizeBleg}>
              <BlegIcon name="icon_refresh" color={'#FFFFFF'} size={25} />
              <Text style={styles.txtButtonSynchronize}>
                {i18n.t('BlegDetail.Synchronize')}
              </Text>
            </TouchableOpacity>
          </View>
          {/*Modals*/}
          <RegisterModal
            visible={modalRegister}
            type={'sensor'}
            handleClose={handleRegister}
          />
          <LoadingModal
            open={loadSync}
            message={
              isSendCommand
                ? i18n.t('BlegDetail.SendCommand')
                : i18n.t('BlegDetail.WaitingAnswer')
            }
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
    borderRadius: 10,
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

export default BlegDetailScreen
