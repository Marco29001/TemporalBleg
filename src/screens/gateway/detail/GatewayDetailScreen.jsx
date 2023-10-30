import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useGlobalContext} from '../../../context/GlobalContext';
import {getGatewayById} from '../../../services/remote/GatewayServices';
import useApiRequest from '../../../hooks/useApiRequest';
import HeaderComp from '../../../components/HeaderComp';
import RegisterModal from '../../../components/RegisterModal';
import ListSensors from './components/ListSensors';
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon';
import {showToastMessage} from '../../../utils/Common';

function GatewayDetailScreen(props) {
  const {gateway} = useGlobalContext();
  const [sensors, setSensors] = useState([]);
  const [modalRegister, setModalRegister] = useState(false);
  const {loading, error, callEnpoint} = useApiRequest();

  const refreshSensors = async () => {
    const response = await callEnpoint(getGatewayById(gateway?.id));
    if (response) {
      setSensors(response.sensors);
    }
  };

  const handleReturn = () => {
    props.navigation.replace('TabBarNavigator');
  };

  const handleEditDevice = () => {
    props.navigation.replace('GatewayRegisterScreen', {lastScreen: 'detail'});
  };

  const handleRegister = () => {
    setModalRegister(!modalRegister);
  };

  useEffect(() => {
    refreshSensors();
  }, []);

  useEffect(() => {
    if (error.value) {
      showToastMessage(
        'didcomErrorToast',
        error.e?.response.data.message || 'Sin conexion',
      );
      props.navigation.replace('TabBarNavigator');
    }
  }, [error]);

  return (
    <>
      <View style={Styles.mainContainer}>
        <HeaderComp title={'Detalle Bleg'} handleReturn={handleReturn} />
        <View style={Styles.formContainer}>
          {/* Gateway section */}
          <Text style={Styles.txtTitleForm}>No.Serie Bleg</Text>
          <Text style={Styles.txtInfoForm}>{gateway?.serialNumber}</Text>
          <View style={Styles.lineSeparator} />
          {/* Vehicle section */}
          <View style={Styles.titleVehicleContainer}>
            <Text style={Styles.txtTitleForm}>Vehiculo asignado</Text>
            <TouchableOpacity
              style={Styles.editButton}
              onPress={handleEditDevice}>
              <BlegIcon name="icon_edit" color={'#17A0A3'} size={25} />
            </TouchableOpacity>
          </View>
          <View style={Styles.vehicleContainer}>
            <View style={Styles.infoVehicle}>
              <Text style={Styles.txtTitleInfo}>Unidad:</Text>
              <Text style={Styles.txtInfoVehicle}>
                {gateway?.device?.name ?? ''}
              </Text>
              <Text style={Styles.txtTitleInfo}>No.Serie GO:</Text>
              <Text style={Styles.txtInfoVehicle}>
                {gateway?.device?.serialNumber ?? ''}
              </Text>
            </View>
            <View style={Styles.vehicleIcon}>
              <BlegIcon name="icon_bus" color={'#17A0A3'} size={40} />
            </View>
          </View>
          <View style={Styles.lineSeparator} />
          {/* Sensors section */}
          <View style={Styles.titleSensorsContainer}>
            <Text style={Styles.txtTitleForm}>Sensores</Text>
            <View style={Styles.addButtonContainer}>
              <TouchableOpacity onPress={handleRegister}>
                <BlegIcon name="icon_plus" color={'#00317F'} size={25} />
              </TouchableOpacity>
            </View>
          </View>
          <ListSensors
            {...props}
            sensors={sensors}
            error={error}
            refreshing={loading}
            onRefresh={refreshSensors}
          />
        </View>
        {/*Modals*/}
        <RegisterModal
          {...props}
          visible={modalRegister}
          type={'sensor'}
          handleClose={handleRegister}
        />
      </View>
    </>
  );
}

const Styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#F2F2F7'},
  formContainer: {flex: 1, padding: 30},
  txtTitleForm: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F6F7E',
    marginBottom: 5,
  },
  txtInfoForm: {
    fontSize: 16,
    color: '#97A4B0',
    marginLeft: 20,
  },
  lineSeparator: {
    height: 3,
    backgroundColor: '#D8DFE7',
    marginTop: 10,
    marginBottom: 10,
  },
  titleVehicleContainer: {flexDirection: 'row', paddingVertical: 10},
  editButton: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleContainer: {flexDirection: 'row', padding: 15},
  infoVehicle: {flex: 1},
  txtTitleInfo: {fontSize: 16, color: '#00317F'},
  txtInfoVehicle: {
    fontSize: 16,
    color: '#97A4B0',
    marginLeft: 20,
  },
  vehicleIcon: {flex: 1, alignItems: 'flex-end', justifyContent: 'center'},
  titleSensorsContainer: {flexDirection: 'row', paddingVertical: 10},
  addButtonContainer: {flex: 1, alignItems: 'flex-end', paddingHorizontal: 15},
});

export default GatewayDetailScreen;
