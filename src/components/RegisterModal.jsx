import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import BlegIcon from '../assets/icons/customIcons/BlegIcon';

function RegisterModal(props) {
  const {visible, type, handleClose} = props;

  const handleManualOption = () => {
    if (type == 'gateway') {
      props.navigation.replace('GatewayRegisterScreen', {lastScreen: 'list'});
    } else {
      props.navigation.replace('SensorRegisterScreen');
    }
  };

  const handleQrOption = () => {
    props.navigation.replace('QrScannerScreen', {
      type: type,
    });
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        statusBarTranslucent={true}>
        <View style={Styles.modalContainer}>
          <View style={Styles.centerModalContainer}>
            <View style={Styles.closeContainer}>
              <TouchableOpacity style={Styles.btnClose} onPress={handleClose}>
                <BlegIcon name="icon_close" color={'#003180'} size={30} />
              </TouchableOpacity>
            </View>
            <View style={Styles.titleModalContainer}>
              <Text style={Styles.txtTitleModal}>
                {type == 'gateway'
                  ? 'Asignar gateway a una unidad'
                  : 'Agregar nuevo sensor'}
              </Text>
            </View>
            <View style={Styles.optionsContainer}>
              <TouchableOpacity
                style={Styles.btnOption}
                onPress={handleQrOption}>
                <BlegIcon name="icon_qr" color={'#003180'} size={25} />
                <Text style={Styles.txtOption}>Leer código QR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.btnOption}
                onPress={handleManualOption}>
                <BlegIcon
                  name="icon_enter_manual"
                  color={'#003180'}
                  size={25}
                />
                <Text style={Styles.txtOption}>Código manual</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const Styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerModalContainer: {
    width: 300,
    height: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
  },
  closeContainer: {flex: 0.3, paddingHorizontal: 10},
  btnClose: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleModalContainer: {
    flex: 0.8,
    paddingHorizontal: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtTitleModal: {
    fontSize: 20,
    color: '#414547',
    textAlign: 'center',
  },
  optionsContainer: {flex: 1, flexDirection: 'row', justifyContent: 'center'},
  btnOption: {
    width: 100,
    height: 150,
    backgroundColor: '#EAEDEF',
    borderRadius: 16,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtOption: {fontSize: 16, color: '#003180', textAlign: 'center'},
});

export default RegisterModal;
