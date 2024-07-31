import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { i18n } from '../../../assets/locale/i18n'
import useFindBlegs from './hooks/useFindBlegs'
import ListBlegsFind from './components/ListBlegsFind'
import HeaderTab from '../../../components/HeaderTab'
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon'

function BlegsFindScreen(props) {
  const {
    scanning,
    statusBluetooth,
    listBlegsRealTime,
    setBlegRealTime,
    scanBlegs,
    stopScanBlegs,
  } = useFindBlegs()

  const handleFindBlegs = () => {
    if (!scanning) {
      scanBlegs()
    } else {
      stopScanBlegs()
    }
  }

  const handleBlegSelect = bleg => {
    setBlegRealTime(bleg)
    props.navigation.replace('BlegRealTimeScreen')
  }

  return (
    <>
      <View style={styles.mainContainer}>
        <HeaderTab
          {...props}
          title={i18n.t('BlegFind.TitleHeader')}
          screen={'BlegsFindScreen'}
        />

        <View style={styles.bluetoothContainer}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.txtDescription}>
              {i18n.t('BlegFind.Message')}
            </Text>
            <Text style={styles.txtStatusBluetooth}>
              {statusBluetooth == 'PoweredOn'
                ? i18n.t('BlegFind.ActiveBluetooth')
                : i18n.t('BlegFind.InactiveBluetooth')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnBluetooth}
            onPress={handleFindBlegs}>
            <BlegIcon name="icon_bluetooth" color={'#FFFFFF'} size={25} />
            <Text style={styles.txtButton}>
              {!scanning
                ? i18n.t('BlegFind.StartSearch')
                : i18n.t('BlegFind.EndSearch')}
            </Text>
          </TouchableOpacity>
          {scanning && (
            <View style={styles.searchDevicesContainer}>
              <ActivityIndicator size="large" color="#003180" />
              <Text style={styles.txtSearchDevices}>
                {i18n.t('BlegFind.NearBleg')}
              </Text>
            </View>
          )}
          <ListBlegsFind
            blegs={listBlegsRealTime}
            handleBlegSelect={handleBlegSelect}
          />
        </View>
        <View style={styles.footerContainer} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F2F2F7' },
  bluetoothContainer: { flex: 1, padding: 15 },
  descriptionContainer: { alignItems: 'center' },
  txtDescription: {
    fontSize: 14,
    color: '#97A4B0',
    textAlign: 'center',
    marginBottom: 15,
  },
  txtStatusBluetooth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F6F7E',
    marginBottom: 15,
  },
  btnBluetooth: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#003180',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlueContainer: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'green',
    justifyContent: 'center',
  },
  txtButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 15,
  },
  searchDevicesContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtSearchDevices: {
    fontSize: 14,
    color: '#97A4B0',
    textAlign: 'center',
  },
  list: { flex: 1 },
  footerContainer: { height: 50 },
})

export default BlegsFindScreen
