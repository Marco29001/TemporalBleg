import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import useDialog from '../hooks/useDialog';
import BlegIcon from '../assets/icons/customIcons/BlegIcon';
import IconGps from '../assets/icons/icon_gps.svg';
import IconScan from '../assets/icons/icon_scan.svg';
import IconLocation from '../assets/icons/icon_gps_location.svg';
import IconSecurity from '../assets/icons/icon_security.svg';
import IconLike from '../assets/icons/icon_like.svg';
import IconWarning from '../assets/icons/icon_warning.svg';

function AlertDialogModal() {
  const {dialogState, onAcceptDialog, onCancelDialog} = useDialog();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={dialogState.open}
      statusBarTranslucent={true}>
      <View style={Styles.modalContainer}>
        <View style={Styles.centerModalContainer}>
          <View style={Styles.imgContainer}>
            <IconDialog type={dialogState.type} />
          </View>
          <View style={Styles.questionContainer}>
            <Text style={Styles.txtMessage}>{dialogState.title}</Text>
            <Text style={Styles.txtQuestion}>{dialogState.subtitle}</Text>
          </View>
          <View style={Styles.optionsContainer}>
            {dialogState.isAccept ? (
              <TouchableOpacity
                style={Styles.btnOptionAccept}
                onPress={onAcceptDialog}>
                <Text style={Styles.txtButtonOption}>
                  {dialogState.txtAccept}
                </Text>
              </TouchableOpacity>
            ) : null}
            {dialogState.isCancel ? (
              <TouchableOpacity
                style={Styles.btnOptionCancel}
                onPress={onCancelDialog}>
                <Text style={Styles.txtButtonOption}>
                  {dialogState.txtCancel}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function IconDialog(props) {
  const {type} = props;

  return (
    <>
      {type == 'BLUETOOTH_NOSUPPORT_DIALOG' ? (
        <BlegIcon name={'icon_bluetooth'} color={'#5F6F7E'} size={60} />
      ) : type == 'LOCATION_SETIINGS_DIALOG' ? (
        <IconGps width={150} height={150} />
      ) : type == 'BLUETOOTH_ENABLED_DIALOG' ||
        type == 'BLUETOOTH_PERMISSION_DIALOG' ? (
        <BlegIcon name={'icon_bluetooth'} color={'#003180'} size={60} />
      ) : type == 'CAMERA_PERMISSION_DIALOG' ? (
        <IconScan width={150} height={150} />
      ) : type == 'ALL_PERMISSION_DIALOG' ? (
        <IconSecurity width={150} height={150} />
      ) : type == 'LOCATION_PERMISSION_DIALOG' ? (
        <IconLocation width={150} height={150} />
      ) : type == 'OK' ? (
        <IconLike width={150} height={150} />
      ) : type == 'WARNING' ? (
        <IconWarning width={150} height={150} />
      ) : null}
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
    height: 450,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
  },
  imgContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  img: {width: 80, height: 100, resizeMode: 'contain'},
  questionContainer: {flex: 2, alignItems: 'center', justifyContent: 'center'},
  txtMessage: {fontSize: 20, color: '#003180', textAlign: 'center'},
  txtQuestion: {fontSize: 20, color: '#5F6F7E', textAlign: 'center'},
  optionsContainer: {flex: 1, paddingHorizontal: 15, justifyContent: 'center'},
  btnOptionAccept: {
    height: 50,
    backgroundColor: '#17A0A3',
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOptionCancel: {
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtButtonOption: {fontSize: 16, color: '#FFFFFF'},
});

export default AlertDialogModal;
