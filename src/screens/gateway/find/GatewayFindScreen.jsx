import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import useFindGateways from './hooks/useFindGateways';
import ListGatewaysFind from './components/ListGatewaysFind';
import HeaderTab from '../../../components/HeaderTab';
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon';

function GatewaysFindScreen(props) {
  const {
    scanning,
    statusBluetooth,
    listGatewaysRealTime,
    setGatewayRealTime,
    scanGateways,
    stopScanGateways,
  } = useFindGateways();

  const handleFindGateways = () => {
    if (!scanning) {
      scanGateways();
    } else {
      stopScanGateways();
    }
  };

  const handleGatewaySelect = async gateway => {
    setGatewayRealTime(gateway);
    props.navigation.replace('GatewayRealTimeScreen');
  };

  return (
    <>
      <View style={Styles.mainContainer}>
        <HeaderTab
          {...props}
          title={'Escanear Bleg'}
          screen={'GatewaysFindScreen'}
        />

        <View style={Styles.bluetoothContainer}>
          <View style={Styles.descriptionContainer}>
            <Text style={Styles.txtDescription}>
              Selecciona un BLEG para ver su status e infomación interna
            </Text>
            <Text style={Styles.txtStatusBluetooth}>
              {statusBluetooth == 'PoweredOn'
                ? 'Bluetooth  activo'
                : 'Bluetooth inactivo'}
            </Text>
          </View>
          <TouchableOpacity
            style={Styles.btnBluetooth}
            onPress={handleFindGateways}>
            <BlegIcon name="icon_bluetooth" color={'#FFFFFF'} size={25} />
            <Text style={Styles.txtButton}>
              {!scanning ? 'Iniciar busqueda' : 'Finalizar busqueda'}
            </Text>
          </TouchableOpacity>
          {scanning && (
            <View style={Styles.searchDevicesContainer}>
              <ActivityIndicator size="large" color="#003180" />
              <Text style={Styles.txtSearchDevices}>
                Buscando BLEG cercanos
              </Text>
            </View>
          )}
          <ListGatewaysFind
            gateways={listGatewaysRealTime}
            handleGatewaySelect={handleGatewaySelect}
          />
        </View>
        <View style={Styles.footerContainer} />
      </View>
    </>
  );
}

const Styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#F2F2F7'},
  bluetoothContainer: {flex: 1, padding: 15},
  descriptionContainer: {alignItems: 'center'},
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
    borderRadius: 30,
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
  list: {flex: 1},
  footerContainer: {height: 50},
});

export default GatewaysFindScreen;
