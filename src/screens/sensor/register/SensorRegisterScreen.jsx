import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { i18n } from '../../../assets/locale/i18n'
import { selectBleg } from '../../../redux/slices/blegSlice'
import {
  getSensorType,
  getVariableSensorMaping,
  addSensor,
} from '../../../services/remote/SensorServices'
import useApiRequest from '../../../hooks/useApiRequest'
import useDialog from '../../../hooks/useDialog'
import HeaderComp from '../../../components/HeaderComp'
import LoadingModal from '../../../components/LoadingModal'
import DiagnosticDropDown from '../../../components/DiagnosticDropDown'
import { useGlobalContext } from '../../../context/GlobalContext'
import {
  showToastMessage,
  validateMacAddress,
  validateSerialNumber,
} from '../../../utils/Common'
import { OK_DIALOG, WARNING_DIALOG } from '../../../utils/Constants'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

function SensorRegisterScreen(props) {
  const Bleg = useSelector(selectBleg)
  const { sensorScanned, setSensorScanned } = useGlobalContext()
  const [serialNumber, setSerialNumber] = useState('')
  const [macAddress, setMacAddress] = useState('')
  const [reference, setReference] = useState('')
  const [typesList, setTypesList] = useState([])
  const [isTypeFocus, setIsTypeFocus] = useState(false)
  const [typeSensor, setTypeSensor] = useState(null)
  const [variables, setVariables] = useState([])
  const [listDiagnostics, setListDiagnostics] = useState([])
  const [isTooltipOpen, setIsTooltipOpen] = useState(true)
  const { showDialog } = useDialog()
  const { loading, error, callEndpoint } = useApiRequest()

  useEffect(() => {
    if (sensorScanned) {
      const serialNumber$ = sensorScanned.serialNumber.split(';')
      const macAddress$ = sensorScanned.mac.match(/.{1,2}/g).join(':')

      setSerialNumber(serialNumber$[0])
      setMacAddress(macAddress$)
      setTypeSensor(sensorScanned.type)
      setVariables(sensorScanned.variables)
    } else {
      refreshTypesSensor()
    }
  }, [])

  useEffect(() => {
    if (error) {
      let configDialog = Object.assign({}, WARNING_DIALOG)
      configDialog.subtitle =
        error.status == 409
          ? i18n.t('SensorRegister.Error409Sensor')
          : error.message

      showDialog(configDialog)
    }
  }, [error])

  const handleReturn = () => {
    setSensorScanned(null)
    props.navigation.replace('BlegDetailScreen')
  }

  const changeTypeSensor = async selectValue => {
    setTypeSensor(selectValue)

    const response = await callEndpoint(
      getVariableSensorMaping(selectValue.id, Bleg.id),
    )
    if (response) {
      setVariables(response)
    }
  }

  const refreshTypesSensor = async () => {
    const response = await callEndpoint(getSensorType())
    if (response) {
      setTypesList(response)
    }
  }

  const handleSave = async () => {
    const isValidMac = validateMacAddress(macAddress)
    const isValidSerialNumber = validateSerialNumber(serialNumber)
    if (!isValidSerialNumber || !isValidMac) {
      return
    }
    if (
      reference != '' &&
      typeSensor != null &&
      variables.length == listDiagnostics.length
    ) {
      const response = await callEndpoint(
        addSensor({
          SerialNumber: serialNumber,
          Mac: macAddress,
          Comment: reference,
          Bleg: Bleg,
          SensorTypeObj: typeSensor,
          BlegSensorMaping: listDiagnostics,
        }),
      )
      if (response) {
        let configDialog = Object.assign({}, OK_DIALOG)
        configDialog.subtitle =
          i18n.t('SensorRegister.SensorRegister') + response.SerialNumber

        showDialog(configDialog, () => {
          setSensorScanned(null)
          props.navigation.replace('BlegDetailScreen')
        })
      }
    } else {
      showToastMessage(
        'didcomWarningToast',
        i18n.t('SensorRegister.EmptyFields'),
      )
    }
  }

  const handleOpenTooltip = () => {
    setIsTooltipOpen(!isTooltipOpen)
  }

  const handleWithoutFeedback = () => {
    setIsTooltipOpen(false)
  }

  return (
    <>
      <LoadingModal visible={loading} />

      <View style={Styles.mainContent}>
        <HeaderComp
          title={i18n.t('SensorRegister.TitleHeader')}
          handleReturn={handleReturn}
        />

        <SafeAreaView style={Styles.safeAreaView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={Styles.formContent}>
              {/*Serial Number*/}
              <Text style={Styles.txtTitleField}>
                {i18n.t('SensorRegister.SerialNumber')}
              </Text>
              <View
                style={
                  !sensorScanned ? Styles.inputInfoContainer : Styles.input
                }>
                {!sensorScanned && (
                  <>
                    {isTooltipOpen && (
                      <View style={Styles.tooltipContainer}>
                        <Text style={Styles.textTooltip}>
                          {i18n.t('SensorRegister.Tooltip')}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={Styles.buttonInfo}
                      onPress={handleOpenTooltip}>
                      <Icon name="question-mark" size={20} color={'#5F6F7E'} />
                    </TouchableOpacity>
                  </>
                )}
                <TextInput
                  style={Styles.txtInputField}
                  editable={!sensorScanned ? true : false}
                  placeholder={i18n.t('SensorRegister.InputSerialNumber')}
                  placeholderTextColor={'#5F6F7E'}
                  keyboardType={'default'}
                  maxLength={17}
                  value={serialNumber}
                  onFocus={handleWithoutFeedback}
                  onChangeText={setSerialNumber}
                />
              </View>
              {/*MAC Address*/}
              <TouchableWithoutFeedback onPress={handleWithoutFeedback}>
                <Text style={Styles.txtTitleField}>
                  {i18n.t('SensorRegister.MacAddress')}
                </Text>
                <TextInput
                  style={Styles.txtInputField}
                  editable={!sensorScanned ? true : false}
                  placeholder={i18n.t('SensorRegister.InputMacAddress')}
                  placeholderTextColor={'#5F6F7E'}
                  keyboardType={'default'}
                  value={macAddress}
                  onChangeText={setMacAddress}
                />
                <Text style={Styles.txtDescriptionField}>
                  {i18n.t('SensorRegister.MessageMacAddress')}
                </Text>
                {/*Reference*/}
                <Text style={Styles.txtTitleField}>
                  {i18n.t('SensorRegister.Reference')}
                </Text>
                <TextInput
                  style={Styles.txtInputField}
                  placeholder={i18n.t('SensorRegister.InputReference')}
                  placeholderTextColor={'#5F6F7E'}
                  keyboardType={'default'}
                  value={reference}
                  onChangeText={setReference}
                />
                {/*Sensor type*/}
                <Text style={Styles.txtTitleField}>
                  {i18n.t('SensorRegister.TypeSensor')}
                </Text>
                {sensorScanned ? (
                  <Text style={Styles.txtTypeSensor}>
                    {sensorScanned.type.name}
                  </Text>
                ) : (
                  <Dropdown
                    style={[
                      Styles.dropdown,
                      { borderColor: isTypeFocus ? '#00317F' : 'grey' },
                    ]}
                    placeholderStyle={Styles.textDropDown}
                    selectedTextStyle={Styles.textDropDown}
                    data={typesList}
                    maxHeight={150}
                    labelField={i18n._locale == 'es' ? 'name' : 'nameEn'}
                    valueField={i18n._locale == 'es' ? 'name' : 'nameEn'}
                    placeholder={i18n.t('SensorRegister.SelectType')}
                    searchPlaceholder={i18n.t('SensorRegister.Search') + '...'}
                    value={typeSensor}
                    onFocus={() => setIsTypeFocus(true)}
                    onBlur={() => setIsTypeFocus(false)}
                    onChange={item => changeTypeSensor(item)}
                  />
                )}
                {/*Sensor variables*/}
                {variables.length != 0 ? (
                  <>
                    <View style={Styles.lineSeparator} />
                    <Text style={Styles.txtTitleParameters}>
                      {i18n.t('SensorRegister.Parameters')}
                    </Text>
                    {variables.map(variable => {
                      return (
                        <DiagnosticDropDown
                          key={variable.name}
                          variable={variable}
                          type={'insert'}
                          setListDiagnostics={setListDiagnostics}
                        />
                      )
                    })}
                  </>
                ) : null}
                {/*Button*/}
                <View style={Styles.buttonFormContent}>
                  <TouchableOpacity style={Styles.btnForm} onPress={handleSave}>
                    <Text style={Styles.txtButtonForm}>
                      {i18n.t('SensorRegister.Add')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  )
}

const { height } = Dimensions.get('window')
const Styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  safeAreaView: { flex: 1 },
  formContent: { height: height, paddingHorizontal: 15 },
  txtTitleField: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F6F7E',
    marginTop: 10,
    marginBottom: 10,
  },
  txtInputField: {
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
  txtDescriptionField: { fontSize: 12, color: '#5F6F7E' },
  buttonFormContent: {
    marginTop: 35,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  btnForm: {
    width: 150,
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtButtonForm: { fontSize: 16, color: '#FFFFFF' },
  lineSeparator: { height: 3, backgroundColor: '#D8DFE7', marginBottom: 20 },
  txtTitleParameters: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F6F7E',
    marginBottom: 5,
  },
  txtTypeSensor: {
    fontSize: 16,
    color: '#00317F',
    margin: 15,
  },
  //input whit info
  inputInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  inputContainer: { flexDirection: 'column' },
  //buttonInfo
  buttonInfo: {
    width: 40,
    height: 50,
    borderRadius: 5,
    borderColor: '#D8DFE7',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //tooltip
  tooltipContainer: {
    width: 300,
    height: 80,
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 5,
    position: 'absolute',
    bottom: -80,
    left: 5,
    zIndex: 10,
  },
  textTooltip: { fontSize: 14, color: '#FFFFFF' },
  //dropdown
  dropdown: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  textDropDown: { fontSize: 16 },
})

export default SensorRegisterScreen
