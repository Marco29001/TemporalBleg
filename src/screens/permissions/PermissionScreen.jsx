import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LocalStorage from '../../services/local/LocalStorage';
import usePermissions from '../../hooks/usePermission';
import BlegIcon from '../../assets/icons/customIcons/BlegIcon';
import IconGps from '../../assets/icons/icon_gps_location_test.svg';

function PermissionScreen(props) {
  const {PERMISSION_TYPE, checkPermission} = usePermissions();

  const getPermissions = async () => {
    await checkPermission(PERMISSION_TYPE.camera);
    await checkPermission(PERMISSION_TYPE.location);
    await checkPermission(PERMISSION_TYPE.bluetoothConnect);
    await checkPermission(PERMISSION_TYPE.bluetoothScan);
    LocalStorage.set('permissions', '1');
    props.navigation.replace('LoginScreen');
  };

  return (
    <View style={Styles.mainContainer}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.txtTitle}>Permisos de usuario</Text>
      </View>
      <View style={Styles.infoContainer}>
        <Text style={Styles.txtSubtitle}>
          Se solicitaran los permisos siguientes para la correcta funcionalidad
          de la applicacion:
        </Text>
        <View style={Styles.listDescriptionContainer}>
          <View style={Styles.descriptionContainer}>
            <View style={Styles.iconDescription}>
              <BlegIcon name="icon_qr" color={'#17A0A3'} size={30} />
            </View>
            <Text style={Styles.txtDescription}>
              Se solicitara el uso de la camara para la lectura de codigos QR al
              momento de registrar un bleg o sensores
            </Text>
          </View>
          <View style={Styles.descriptionContainer}>
            <View style={Styles.iconDescription}>
              <IconGps width={60} height={60} />
            </View>
            <Text style={Styles.txtDescription}>
              Se solicitara el acceso a tu ubicacion actual para brindarte un
              mejor servicio en la deteccion de dispositivos bluetooth y esta no
              sera compartida en ningun momento
            </Text>
          </View>
          <View style={Styles.descriptionContainer}>
            <View style={Styles.iconDescription}>
              <BlegIcon name="icon_bluetooth" color={'#17A0A3'} size={30} />
            </View>
            <Text style={Styles.txtDescription}>
              Se solicitara el acceso al bluetooth para brindarte un mejor
              servicio (puede que esto no se te solicite solo si tu dispositivo
              no cuenta con android 12 o superior)
            </Text>
          </View>
        </View>
      </View>
      <View style={Styles.footerContainer}>
        <TouchableOpacity style={Styles.btnNext} onPress={getPermissions}>
          <Text style={Styles.txtBtnNext}>Siguiente</Text>
        </TouchableOpacity>
        <Text style={Styles.txtDescription}>
          Usted puede realizar cambios despues en la configuracion del
          dispositivo
        </Text>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#003180'},
  headerContainer: {
    flex: 0.2,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  txtTitle: {fontSize: 25, fontWeight: 'bold', color: '#003180'},
  infoContainer: {flex: 1, padding: 20},
  txtSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 25,
  },
  listDescriptionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  descriptionContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
  },
  iconDescription: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtDescription: {fontSize: 16, color: '#FFFFFF'},
  footerContainer: {flex: 0.3, paddingHorizontal: 20},
  txtBtnNext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003180',
  },
  btnNext: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PermissionScreen;
