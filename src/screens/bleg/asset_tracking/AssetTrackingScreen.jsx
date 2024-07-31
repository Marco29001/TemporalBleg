import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { i18n } from '../../../assets/locale/i18n'
import { useSelector } from 'react-redux'
import { selectBleg } from '../../../redux/slices/blegSlice'
import useApiRequest from '../../../hooks/useApiRequest'
import {
  AddAssetTracker,
  getAssetTracker,
  getVariablesSensorTypes,
} from '../../../services/remote/AssetTrackerServices'
import useDialog from '../../../hooks/useDialog'
import AddBeacon from './components/AddBeacon'
import HeaderComp from '../../../components/HeaderComp'
import LoadingModal from '../../../components/LoadingModal'
import SensorIcon from '../../../components/SensorIcon'
import { showToastMessage } from '../../../utils/Common'
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon'
import { OK_DIALOG } from '../../../utils/Constants'

function AssetTrackingScreen() {
  const navigation = useNavigation()
  const bleg = useSelector(selectBleg)
  const [infoAssetTracking, setInfoAssetTracking] = useState(null)
  const [frequency, setFrequency] = useState('')
  const [maxSensors, setMaxSensors] = useState('')
  const [beacons, setBeacons] = useState([])
  const [isSwitchOn, setIsSwitchOn] = useState(false)
  const [openAddBeacon, setOpenAddBeacon] = useState(false)
  const [sensorsTypes, setSensorsTypes] = useState([])
  const [errorConf, setErrorConf] = useState({
    isError: false,
    type: '',
    message: '',
  })
  const { showDialog } = useDialog()
  const { loading, error, callEndpoint } = useApiRequest()

  useEffect(() => {
    refreshBeacons()
  }, [])

  useEffect(() => {
    if (infoAssetTracking) {
      setIsSwitchOn(infoAssetTracking.isActive)
      setFrequency(infoAssetTracking.timer.toString())
      setMaxSensors(infoAssetTracking.maxBeacons.toString())
      setBeacons(infoAssetTracking.beacons)
    }
  }, [infoAssetTracking])

  useEffect(() => {
    if (frequency != '' && maxSensors != '') {
      const calculate = parseInt(maxSensors) * (60 / parseInt(frequency)) * 10
      if (parseInt(frequency) < 10 || parseInt(frequency) > 120) {
        setErrorConf({
          isError: true,
          type: 'Frequency',
          message: i18n.t('AssetTracker.ErrorFrequency'),
        })
        return
      } else if (parseInt(maxSensors) < 1 || parseInt(maxSensors) > 100) {
        setErrorConf({
          isError: true,
          type: 'MaxBeacons',
          message: i18n.t('AssetTracker.ErrorMaxSensors'),
        })
        return
      } else if (calculate < 400) {
        setErrorConf({ isError: false, message: '' })
      } else {
        setErrorConf({
          isError: true,
          type: 'Calculate',
          message: i18n.t('AssetTracker.ErrorCalculate'),
        })
      }
    } else {
      setErrorConf({ isError: true, message: '' })
    }
  }, [frequency, maxSensors])

  useEffect(() => {
    if (error) {
      showToastMessage('didcomErrorToast', error.message)
    }
  }, [error])

  const refreshBeacons = async () => {
    const response = await callEndpoint(getAssetTracker(bleg.id))
    if (response) {
      setInfoAssetTracking(response)
    }
  }

  const handleReturn = () => {
    navigation.replace('BlegDetailScreen')
  }

  const onChangeFrequency = text => {
    setFrequency(text)
  }

  const onChangeMaxSensors = text => {
    setMaxSensors(text)
  }

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn)

  const handleRegisterBeacon = async () => {
    const response = await callEndpoint(getVariablesSensorTypes(bleg.id))
    if (response) {
      setSensorsTypes(response)
      setOpenAddBeacon(true)
    }
  }

  const handleAddNewBeacon = (sensorType, variable) => {
    const searchBeacon = beacons.find(
      item =>
        item.variableSensorTypeId == sensorType.id &&
        item.variable.id == variable.id,
    )
    const newBeacon = {
      assetTrackerId: infoAssetTracking?.id ?? 0,
      variableSensorTypeId: sensorType.id,
      type: sensorType.name,
      typeEn: sensorType.nameEn,
      sensorTypeIcon: sensorType.sensorIcon,
      prefix: sensorType.prefix,
      vettingCode: sensorType.vettingCode,
      variable: {
        id: variable.id,
        name: variable.name,
        nameEn: variable.nameEn,
        unit: null,
        unitType: null,
      },
    }

    if (searchBeacon) {
      showToastMessage(
        'didcomWarningToast',
        i18n.t('AssetTracker.ExistsVariable'),
      )
    } else {
      console.log('new beacon', newBeacon)
      setBeacons(prevState => {
        const newState = prevState
        newState.push(newBeacon)
        return newState
      })
    }
  }

  const handleRemoveBeacon = indexItem => {
    const filterBeacons = beacons.filter((item, index) => index != indexItem)
    setBeacons(filterBeacons)
  }

  const handleSaveAssetTracker = async () => {
    if (errorConf?.isError) return

    const variableSensorType = beacons.map(beacon => {
      return beacon.variable
    })
    const response = await callEndpoint(
      AddAssetTracker({
        blegId: bleg.id,
        timer: frequency,
        maxBeacons: maxSensors,
        isActive: isSwitchOn,
        variablesSensorType: variableSensorType,
      }),
    )
    if (response) {
      let configDialog = Object.assign({}, OK_DIALOG)
      configDialog.subtitle = i18n.t('AssetTracker.SavedCorrectly')

      showDialog(configDialog, () => {
        if (infoAssetTracking != null) {
          setInfoAssetTracking(prevState => {
            const newState = prevState
            newState.id = response.id
            newState.beacons.map(beacon => {
              beacon.assetTrackerId = response.id
            })
            return newState
          })
        } else {
          setInfoAssetTracking(response)
        }
      })
    }
  }

  return (
    <>
      <LoadingModal visible={loading} />

      <HeaderComp
        title={i18n.t('AssetTracker.AssetTracker')}
        isSwitchActive={true}
        isSwitchOn={isSwitchOn}
        onToggleSwitch={onToggleSwitch}
        handleReturn={handleReturn}
      />

      <View style={styles.mainContainer}>
        <View style={{ flex: 0.7 }}>
          <Text style={styles.txtTitleField}>
            {i18n.t('AssetTracker.Frequency')}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.txtInputField}
              placeholderTextColor={'#5F6F7E'}
              keyboardType={'number-pad'}
              value={frequency}
              onChangeText={text => onChangeFrequency(text)}
            />
            <Text style={styles.txtInfo}>{i18n.t('AssetTracker.Seconds')}</Text>
          </View>
          {errorConf.type == 'Frequency' && (
            <Text style={styles.txtErrorInput}>{errorConf?.message}</Text>
          )}
          <Text style={styles.txtTitleField}>
            {i18n.t('AssetTracker.MaxSensors')}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.txtInputField}
              placeholderTextColor={'#5F6F7E'}
              keyboardType={'number-pad'}
              value={maxSensors}
              onChangeText={text => onChangeMaxSensors(text)}
            />
          </View>
          {errorConf.type == 'MaxBeacons' && (
            <Text style={styles.txtErrorInput}>{errorConf?.message}</Text>
          )}
          {errorConf.type == 'Calculate' && (
            <Text style={styles.txtErrorConf}>{errorConf?.message}</Text>
          )}
        </View>

        <View style={styles.titleSensorsContainer}>
          <Text style={styles.txtTitleSensors}>
            {i18n.t('BlegDetail.Sensors')}
          </Text>
          <View style={styles.addButtonContainer}>
            <TouchableOpacity onPress={handleRegisterBeacon}>
              <BlegIcon name="icon_plus" color={'#00317F'} size={25} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          style={styles.list}
          data={beacons}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.sensorItem}>
                <View style={styles.iconItemContainer}>
                  <SensorIcon
                    url={item.sensorTypeIcon}
                    size={50}
                    fill={'#003180'}
                  />
                </View>
                <View style={styles.infoItemContainer}>
                  <Text style={styles.sensorItemTitle}>
                    {i18n._locale == 'es' ? item.type : item.typeEn}
                  </Text>
                  <Text style={styles.sensorInfo}>
                    {i18n.t('AssetTracker.Prefix')}: {item.prefix}
                  </Text>
                  <Text style={styles.sensorInfo}>
                    {i18n.t('AssetTracker.Variable')}:
                    {i18n._locale == 'es'
                      ? item.variable.name
                      : item.variable.nameEn ??
                        i18n.t('AssetTracker.Identifier')}
                  </Text>
                </View>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.btnOption}
                    onPress={() => handleRemoveBeacon(index)}>
                    <BlegIcon name="icon_erase" color={'#17A0A3'} size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
        />
        <View style={styles.synchronizeContainer}>
          <TouchableOpacity
            style={[
              styles.buttonSynchronize,
              {
                backgroundColor: !errorConf.isError ? '#003180' : '#97A4B0',
              },
            ]}
            onPress={handleSaveAssetTracker}>
            <Text style={styles.txtButtonSynchronize}>
              {i18n.t('AssetTracker.Save')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <AddBeacon
        open={openAddBeacon}
        setOpen={setOpenAddBeacon}
        sensorTypes={sensorsTypes}
        handleAddNewBeacon={handleAddNewBeacon}
      />
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
  },
  txtTitleField: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F6F7E',
    marginVertical: 10,
  },
  txtInputField: {
    width: 200,
    height: 50,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderColor: '#D8DFE7',
    borderWidth: 2,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  txtInfo: {
    fontSize: 16,
    color: '#97A4B0',
    marginLeft: 20,
    alignSelf: 'center',
  },
  //error
  txtErrorConf: {
    fontSize: 14,
    fontWeight: '700',
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  txtErrorInput: {
    fontSize: 14,
    fontWeight: '700',
    color: 'red',
    marginVertical: 5,
  },
  //title sensors
  titleSensorsContainer: {
    flex: 0.1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  txtTitleSensors: { fontSize: 16, fontWeight: 'bold', color: '#5F6F7E' },
  addButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    //paddingHorizontal: 15,
  },
  //list sensors
  list: { flex: 1 },
  sensorItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  iconItemContainer: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoItemContainer: { flex: 1, justifyContent: 'center' },
  sensorItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#97A4B0',
    marginBottom: 5,
  },
  sensorInfo: { fontSize: 14, color: '#97A4B0' },
  optionsContainer: { flex: 0.3, justifyContent: 'center' },
  btnOption: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  synchronizeContainer: { flex: 0.2, paddingHorizontal: 10 },
  buttonSynchronize: {
    flexDirection: 'row',
    height: 50,
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

export default AssetTrackingScreen
