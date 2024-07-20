import React, { useEffect } from 'react'
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { i18n } from '../../../../assets/locale/i18n'
import { deleteSensor } from '../../../../services/remote/SensorServices'
import useApiRequest from '../../../../hooks/useApiRequest'
import useDialog from '../../../../hooks/useDialog'
import ListEmptyComp from '../../../../components/ListEmptyComp'
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon'
import SensorIcon from '../../../../components/SensorIcon'
import { showToastMessage } from '../../../../utils/Common'
import {
  DELETE_SENSOR_DIALOG,
  WARNING_DIALOG,
} from '../../../../utils/Constants'

function ListSensors({ sensors, onRefresh }) {
  const navigation = useNavigation()
  const { showDialog } = useDialog()
  const { error, callEndpoint } = useApiRequest()

  useEffect(() => {
    if (error) {
      let configDialog = Object.assign({}, WARNING_DIALOG)
      configDialog.subtitle = error.message

      showDialog(configDialog)
    }
  }, [error])

  const handleEdit = sensor => () => {
    navigation.replace('SensorEditScreen', {
      sensorId: sensor.id,
    })
  }

  const handleRemove = sensor => () => {
    DELETE_SENSOR_DIALOG.subtitle =
      i18n.t('BlegDetail.QuestionDeleteBleg') + sensor.serialNumber + '?'
    showDialog(DELETE_SENSOR_DIALOG, async () => {
      const response = await callEndpoint(deleteSensor(sensor.id))
      if (response) {
        showToastMessage(
          'didcomSuccessToast',
          i18n.t('BlegDetail.RemovedSuccessfully'),
        )
        onRefresh()
      }
    })
  }

  if (sensors.length == 0) {
    return (
      <ListEmptyComp
        icon={'icon_sensor'}
        handleRefresh={onRefresh}
        message={i18n.t('BlegDetail.EmptySensors')}
      />
    )
  }

  return (
    <>
      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={sensors}
        renderItem={({ item }) => {
          return (
            <View style={styles.item}>
              <View style={styles.iconContainer}>
                <SensorIcon
                  url={item.type.sensorIcon}
                  size={50}
                  fill={'#003180'}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.txtTitleInfo}>
                  {i18n.t('BlegDetail.SerialNumber')}
                </Text>
                <Text style={styles.txtInfoSerial}>{item.serialNumber}</Text>
                <Text style={styles.txtInfoType}>
                  {i18n._locale == 'es' ? item.type.name : item.type.nameEn}
                </Text>
              </View>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.btnOption}
                  onPress={handleEdit(item)}>
                  <BlegIcon name="icon_edit" color={'#17A0A3'} size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnOption}
                  onPress={handleRemove(item)}>
                  <BlegIcon name="icon_erase" color={'#17A0A3'} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  contentContainer: { flexGrow: 1, justifyContent: 'center' },
  list: { flex: 1 },
  txtListEmpty: { fontSize: 16, color: '#C2CACE', marginTop: 10 },
  item: {
    height: 90,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 3,
    marginBottom: 15,
  },
  iconContainer: { flex: 0.3, alignItems: 'center', justifyContent: 'center' },
  infoContainer: { flex: 1, justifyContent: 'center' },
  txtTitleInfo: { fontSize: 16, color: '#00317F', marginBottom: 5 },
  txtInfoSerial: { fontSize: 16, color: '#97A4B0', marginBottom: 5 },
  txtInfoType: { fontSize: 12, color: '#97A4B0' },
  optionsContainer: { flex: 0.3 },
  btnOption: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  btnRefresh: {
    width: 50,
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ListSensors
