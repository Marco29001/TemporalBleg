import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { i18n } from '../../../assets/locale/i18n'
import {
  getSensorById,
  updateSensor,
} from '../../../services/remote/SensorServices'
import useApiRequest from '../../../hooks/useApiRequest'
import useDialog from '../../../hooks/useDialog'
import LoadingModal from '../../../components/LoadingModal'
import HeaderComp from '../../../components/HeaderComp'
import { OK_DIALOG, WARNING_DIALOG } from '../../../utils/Constants'
import { useSelector } from 'react-redux'
import { selectBleg } from '../../../redux/slices/blegSlice'
import DiagnosticDropDown from '../../../components/DiagnosticDropDown'

function SensorEditScreen(props) {
  const { sensorId } = props.route.params
  const Bleg = useSelector(selectBleg)
  const [sensor, setSensor] = useState(null)
  const [serialNumber, setSerialNumber] = useState(sensor?.serialNumber ?? '')
  const [macAddress, setMacAddress] = useState(sensor?.mac ?? '')
  const [reference, setReference] = useState(sensor?.comment ?? '')
  const [listDiagnostics, setListDiagnostics] = useState([])
  const { showDialog } = useDialog()
  const { loading, error, callEndpoint } = useApiRequest()

  useEffect(() => {
    refreshSensorInfo()
  }, [])

  useEffect(() => {
    if (error) {
      let configDialog = Object.assign({}, WARNING_DIALOG)
      configDialog.subtitle =
        error.status == 409
          ? i18n.t('SensorEdit.Error409Sensor')
          : error.message

      showDialog(configDialog)
    }
  }, [error])

  const handleReturn = () => {
    props.navigation.replace('BlegDetailScreen')
  }

  const handleSave = async () => {
    const body = {
      Id: sensorId,
      Mac: macAddress,
      Comment: reference,
      Bleg: Bleg,
      BlegSensorMaping: listDiagnostics,
    }
    const response = await callEndpoint(updateSensor(body))
    if (response) {
      let configDialog = Object.assign({}, OK_DIALOG)
      configDialog.subtitle =
        i18n.t('SensorEdit.SensorUpdated') + response.serialNumber

      showDialog(configDialog, () => {
        props.navigation.replace('BlegDetailScreen')
      })
    }
  }

  const refreshSensorInfo = async () => {
    const response = await callEndpoint(getSensorById(sensorId))
    if (response) {
      setSensor(response)
      setSerialNumber(response.serialNumber)
      setMacAddress(response.mac)
      setReference(response.comment)
    }
  }

  return (
    <>
      <LoadingModal visible={loading} />

      <View style={styles.mainContent}>
        <HeaderComp
          title={i18n.t('SensorEdit.TitleHeader')}
          handleReturn={handleReturn}
        />
        <View style={styles.formContent}>
          {/*Serial Number*/}
          <Text style={styles.txtTitleField}>
            {i18n.t('SensorEdit.SerialNumber')}
          </Text>
          <TextInput
            style={styles.txtInputField}
            placeholder={''}
            placeholderTextColor={'#5F6F7E'}
            keyboardType={'default'}
            value={serialNumber}
            onChangeText={setSerialNumber}
          />
          {/*Mac address*/}
          <Text style={styles.txtTitleField}>
            {i18n.t('SensorRegister.MacAddress')}
          </Text>
          <TextInput
            style={styles.txtInputField}
            placeholder={''}
            placeholderTextColor={'#5F6F7E'}
            keyboardType={'default'}
            value={macAddress}
            onChangeText={setMacAddress}
          />
          {/*Type sensor*/}
          <Text style={styles.txtTitleField}>
            {i18n.t('SensorEdit.TypeSensor')}
          </Text>
          <Text style={styles.txtField}>
            {i18n._locale == 'es' ? sensor?.type?.name : sensor?.type?.nameEn}
          </Text>
          {/*Reference*/}
          <Text style={styles.txtTitleField}>
            {i18n.t('SensorEdit.Reference')}
          </Text>
          <TextInput
            style={styles.txtInputField}
            placeholder={i18n.t('SensorEdit.AddReference')}
            placeholderTextColor={'#5F6F7E'}
            keyboardType={'default'}
            value={reference}
            onChangeText={setReference}
          />
          {/*Sensor variables*/}
          {sensor?.variables?.length ? (
            <>
              <View style={styles.lineSeparator} />
              <Text style={styles.txtTitleParameters}>
                {i18n.t('SensorEdit.Parameters')}
              </Text>
              {sensor.variables.map(variable => {
                return (
                  <DiagnosticDropDown
                    key={variable.name}
                    variable={variable}
                    type={'edit'}
                    setListDiagnostics={setListDiagnostics}
                  />
                )
              })}
            </>
          ) : null}
          {/*Button*/}
          <View style={styles.buttonFormContent}>
            <TouchableOpacity style={styles.btnForm} onPress={handleSave}>
              <Text style={styles.txtButtonForm}>
                {i18n.t('SensorEdit.SaveChanges')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  mainContent: { flex: 1, backgroundColor: '#F2F2F7' },
  formContent: { flex: 1, padding: 25 },
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
  txtField: { fontSize: 16, color: '#1A468D', marginLeft: 15 },
  lineSeparator: { height: 3, backgroundColor: '#D8DFE7', marginBottom: 20 },
  txtSubtitleField: {
    fontSize: 16,
    color: '#1A468D',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonFormContent: {
    marginTop: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  btnForm: {
    width: 150,
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 10,
    marginTop: 10,
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
})

export default SensorEditScreen
