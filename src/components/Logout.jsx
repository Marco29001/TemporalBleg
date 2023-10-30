import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {resetLogout} from '../redux/slices/logout';
import {useGlobalContext} from '../context/GlobalContext';

function Logout() {
  const {deleteUserSession} = useGlobalContext();
  const logoutState = useSelector(store => store.logout);
  const dispatcher = useDispatch();

  const handleAccept = () => {
    deleteUserSession();
    dispatcher(resetLogout());
  };

  const handleCancel = () => {
    dispatcher(resetLogout());
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={logoutState.open}
      statusBarTranslucent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.centerModalContainer}>
          <View style={styles.questionContainer}>
            <Text style={styles.txtQuestion}>
              {logoutState.unauthorized
                ? 'La sesion no es valida, vuelve a iniciar la sesion'
                : '¿Estas seguro de que quieres cerrar la sesion?'}
            </Text>
          </View>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.btnOptionAcept}
              onPress={handleAccept}>
              <Text style={styles.txtButtonOption}>
                {logoutState.unauthorized ? 'Aceptar' : 'Si, Salir'}
              </Text>
            </TouchableOpacity>
            {!logoutState.unauthorized && (
              <TouchableOpacity
                style={styles.btnOptionCancel}
                onPress={handleCancel}>
                <Text style={styles.txtButtonOption}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerModalContainer: {
    width: 300,
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
  },
  questionContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  txtQuestion: {fontSize: 20, color: '#414547', textAlign: 'center'},
  optionsContainer: {flex: 1, paddingHorizontal: 15, justifyContent: 'center'},
  btnOptionAcept: {
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

export default Logout;
