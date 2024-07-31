import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { i18n } from '../../../assets/locale/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { createBleg, selectBleg } from '../../../redux/slices/blegSlice'
import { useGlobalContext } from '../../../context/GlobalContext'
import {
  addBleg,
  getBlegBySerialNumber,
  updateBleg,
} from '../../../services/remote/BlegServices'
import useApiRequest from '../../../hooks/useApiRequest'
import useDialog from '../../../hooks/useDialog'
import UnitsModal from './components/UnitsModal'
import HeaderComp from '../../../components/HeaderComp'
import LoadingModal from '../../../components/LoadingModal'
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon'
import { showToastMessage } from '../../../utils/Common'
import { OK_DIALOG, WARNING_DIALOG } from '../../../utils/Constants'

function BlegRegisterScreen(props) {
  const { lastScreen } = props.route.params
  const dispatch = useDispatch()
  const Bleg = useSelector(selectBleg)
  const { userSession } = useGlobalContext()
  const [serieBleg, setSerieBleg] = useState(Bleg?.serialNumber ?? '')
  const [macBleg, setMacBleg] = useState(Bleg?.mac ?? '')
  const [showUnitsModal, setShowUnitsModal] = useState(false)
  const [device, setDevice] = useState(Bleg?.device ?? null)
  const { showDialog } = useDialog()
  const { loading, error, callEndpoint } = useApiRequest()

  const handleReturn = () => {
    if (lastScreen == 'detail') {
      props.navigation.replace('BlegDetailScreen')
      return
    }

    props.navigation.replace('TabBarNavigator')
  }

  const onChangeSerialNumber = text => {
    setSerieBleg(text)
  }

  const onChangeMac = text => {
    setMacBleg(text)
  }

  const handleValidate = async () => {
    if (serieBleg != '' && macBleg != '') {
      const response = await callEndpoint(
        getBlegBySerialNumber(serieBleg, macBleg, userSession.database),
      )
      if (response) {
        let configDialog = Object.assign({}, OK_DIALOG)
        configDialog.subtitle = i18n.t('BlegRegister.ValidSerialNumber')

        showDialog(configDialog, () => {
          dispatch(createBleg(response))
          setDevice(response.device)
        })
      }
    } else {
      showToastMessage('didcomWarningToast', i18n.t('BlegRegister.EmptyFields'))
    }
  }

  const handleSave = async () => {
    if (device && serieBleg != '') {
      if (lastScreen == 'list' || lastScreen == 'qr') {
        const response = await callEndpoint(
          addBleg({
            serialNumber: Bleg.serialNumber,
            Mac: Bleg.mac,
            VehicleId: device.id,
            ConfigKey: '',
            Groups: '',
          }),
        )
        if (response) {
          let configDialog = Object.assign({}, OK_DIALOG)
          configDialog.subtitle = i18n.t('BlegRegister.AddBleg')

          showDialog(configDialog, () => {
            props.navigation.replace('TabBarNavigator')
          })
        }
      } else {
        const response = await callEndpoint(
          updateBleg({
            Id: Bleg.id,
            VehicleId: device.id,
            Mac: Bleg.mac,
          }),
        )
        if (response) {
          let configDialog = Object.assign({}, OK_DIALOG)
          configDialog.subtitle = i18n.t('BlegRegister.AddBleg')

          showDialog(configDialog, () => {
            props.navigation.replace('BlegDetailScreen')
          })
        }
      }
    } else {
      showToastMessage('didcomErrorToast', i18n.t('BlegRegister.EmptyFields'))
    }
  }

  const handleShowUnitsModal = () => {
    setShowUnitsModal(!showUnitsModal)
  }

  const handleSelectUnit = item => {
    setDevice(item)
    handleShowUnitsModal()
  }

  useEffect(() => {
    if (error) {
      let configDialog = Object.assign({}, WARNING_DIALOG)
      configDialog.subtitle = error.message

      showDialog(configDialog)
    }
  }, [error])

  return (
    <>
      <LoadingModal visible={loading} />

      <View style={Styles.mainContainer}>
        <HeaderComp
          title={
            lastScreen == 'list' || lastScreen == 'qr'
              ? i18n.t('BlegRegister.TitleHeaderAdd')
              : i18n.t('BlegRegister.TitleHeader')
          }
          handleReturn={handleReturn}
        />

        <View style={Styles.formContainer}>
          <Text style={Styles.txtTitleForm}>
            {i18n.t('BlegRegister.NoSerieBleg')}
          </Text>
          <TextInput
            style={Styles.inputForm}
            editable={!Bleg ? true : false}
            placeholder={i18n.t('BlegRegister.NoSerieBleg')}
            placeholderTextColor={'#5F6F7E'}
            keyboardType={'default'}
            value={serieBleg}
            onChangeText={text => onChangeSerialNumber(text)}
          />
          <Text style={Styles.txtTitleForm}>
            {i18n.t('BlegRegister.MacAddressBleg')}
          </Text>
          <TextInput
            style={Styles.inputForm}
            editable={!Bleg ? true : false}
            placeholder={i18n.t('BlegRegister.MacAddressBleg')}
            placeholderTextColor={'#5F6F7E'}
            keyboardType={'default'}
            value={macBleg}
            onChangeText={text => onChangeMac(text)}
          />
          <View style={Styles.btnFormContainer}>
            {!Bleg && (
              <TouchableOpacity style={Styles.btnForm} onPress={handleValidate}>
                <Text style={Styles.txtButtonForm}>
                  {i18n.t('BlegRegister.Validate')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {Bleg && (
            <>
              <View style={Styles.lineSeparator} />
              <Text style={Styles.txtTitleForm}>
                {i18n.t('BlegRegister.SelectUnit')}
              </Text>
              <View style={Styles.selectUnitContainer}>
                <TouchableOpacity
                  style={Styles.btnUnitSelect}
                  onPress={handleShowUnitsModal}>
                  <View style={Styles.titleUnitContainer}>
                    <Text style={Styles.txtSelectButton}>
                      {i18n.t('BlegRegister.Unit')}
                    </Text>
                    <View style={Styles.arrowContainer}>
                      <BlegIcon name="icon_next" color={'#17A0A3'} size={20} />
                    </View>
                  </View>
                  <View style={Styles.lineSeparator} />
                  <Text style={Styles.txtUnitSelect}>
                    {device
                      ? device.serialNumber
                      : i18n.t('BlegRegister.NoSerieGo')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={Styles.btnFormContainer}>
                {Bleg && (
                  <TouchableOpacity style={Styles.btnForm} onPress={handleSave}>
                    <Text style={Styles.txtButtonForm}>
                      {lastScreen == 'list' || lastScreen == 'qr'
                        ? i18n.t('BlegRegister.Add')
                        : i18n.t('BlegRegister.Assign')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </View>
      {/* Modals*/}
      <UnitsModal
        visible={showUnitsModal}
        handleSelectUnit={handleSelectUnit}
        handleClose={handleShowUnitsModal}
      />
    </>
  )
}

const Styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F2F2F7' },
  formContainer: { flex: 1, padding: 30 },
  txtTitleForm: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F6F7E',
    marginBottom: 20,
  },
  inputForm: {
    height: 50,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderColor: '#D8DFE7',
    borderWidth: 2,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  btnFormContainer: { alignItems: 'flex-end' },
  btnForm: {
    width: 150,
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtButtonForm: { fontSize: 16, color: '#FFFFFF' },
  lineSeparator: { height: 3, backgroundColor: '#D8DFE7', marginVertical: 10 },
  titleUnitContainer: { flex: 1, flexDirection: 'row' },
  selectUnitContainer: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  btnUnitSelect: {
    height: 70,
    marginBottom: 10,
  },
  arrowContainer: { flex: 1, alignItems: 'flex-end' },
  txtSelectButton: { fontSize: 14, color: '#17A0A3' },
  txtUnitSelect: { fontSize: 14, color: '#5F6F7E' },
})

export default BlegRegisterScreen
