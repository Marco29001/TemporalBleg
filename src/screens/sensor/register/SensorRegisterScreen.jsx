import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  getSensorType,
  getSensorConfig,
  createSensor,
} from '../../../services/remote/SensorServices';
import useApiRequest from '../../../hooks/useApiRequest';
import useDialog from '../../../hooks/useDialog';
import HeaderComp from '../../../components/HeaderComp';
import LoadingModal from '../../../components/LoadingModal';
import Parameter from './components/Parameter';
import {useGlobalContext} from '../../../context/GlobalContext';
import {
  calculateZindex,
  showToastMessage,
  validateMacAddress,
  validateSerialNumber,
} from '../../../utils/Common';
import ErrorManager from '../../../utils/ErrorManager';
import {OK_DIALOG, WARNING_DIALOG} from '../../../utils/Constants';

function SensorRegisterScreen(props) {
  const {gateway, sensorScanned, setSensorScanned} = useGlobalContext();
  const [serialNumber, setSerialNumber] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [reference, setReference] = useState('');
  const [listTypes, setListTypes] = useState([]);
  const [openTypeSensor, setOpenTypeSensor] = useState(false);
  const [typeSensor, setTypeSensor] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [listConfig, setListConfig] = useState([]);
  const {acceptDialog} = useDialog();
  const {loading, error, callEnpoint} = useApiRequest();

  const handleReturn = () => {
    setSensorScanned(null);
    props.navigation.replace('GatewayDetailScreen');
  };

  const changeTypeSensor = async selectValue => {
    setTypeSensor(selectValue(typeSensor));
    const response = await callEnpoint(
      getSensorConfig(selectValue(typeSensor)),
    );
    if (response) {
      setParameters(response);
    }
  };

  const refreshTypesSensor = async () => {
    const response = await callEnpoint(getSensorType());
    if (response) {
      const tempTypes = [];
      response.map(type => {
        if (type.name != '') {
          tempTypes.push({label: type.name, value: type.id});
        }
      });
      setListTypes(tempTypes);
    }
  };

  const handleSave = async () => {
    const isValidMac = validateMacAddress(macAddress);
    const isValidSerialNumber = validateSerialNumber(serialNumber);
    if (!isValidSerialNumber || !isValidMac) {
      return;
    }

    if (
      reference != '' &&
      typeSensor != null &&
      parameters.length == listConfig.length
    ) {
      const response = await callEnpoint(
        createSensor({
          serialNumber: serialNumber,
          mac: macAddress,
          gateway: gateway,
          Type: {id: typeSensor},
          comment: reference,
          config: listConfig,
        }),
      );
      if (response) {
        OK_DIALOG.subtitle = response.message;
        showDialog(OK_DIALOG, () => {
          setSensorScanned(null);
          props.navigation.replace('GatewayDetailScreen');
        });
      }
    } else {
      showToastMessage('didcomWarningToast', 'Llena todos los campos');
    }
  };

  const showDialog = async (config, action) => {
    const isAccept = await acceptDialog(config);

    if (isAccept) {
      action();
    }
  };

  useEffect(() => {
    if (sensorScanned) {
      const serialNumber$ = sensorScanned.serialNumber.split(';');
      const macAddress$ = sensorScanned.mac.match(/.{1,2}/g).join(':');
      setSerialNumber(serialNumber$[0]);
      setMacAddress(macAddress$);
      setTypeSensor(sensorScanned.sensorTypeId);
      setParameters(sensorScanned.variables);
    } else {
      refreshTypesSensor();
    }
  }, []);

  useEffect(() => {
    if (error.value) {
      WARNING_DIALOG.subtitle =
        error.e?.response?.data?.message ?? ErrorManager(error.status);
      showDialog(WARNING_DIALOG, () => null);
    }
  }, [error]);

  return (
    <>
      <LoadingModal visible={loading} />

      <View style={Styles.mainContent}>
        <HeaderComp title={'Agregar sensor'} handleReturn={handleReturn} />
        <SafeAreaView style={Styles.safeAreaView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={Styles.formContent}>
              {/*Serial Number*/}
              <Text style={Styles.txtTitleField}>No. Serie sensor</Text>
              <TextInput
                style={Styles.txtInputField}
                placeholder={'Ingrese numero serial'}
                placeholderTextColor={'#5F6F7E'}
                keyboardType={'default'}
                maxLength={17}
                value={serialNumber}
                onChangeText={setSerialNumber}
              />
              <Text style={Styles.txtDescriptionField}>
                Ingrese el numero serial del dispositivo (17 digitos)
              </Text>
              {/*MAC Address*/}
              <Text style={Styles.txtTitleField}>Direccion MAC</Text>
              <TextInput
                style={Styles.txtInputField}
                placeholder={'Ingrese direccion MAC'}
                placeholderTextColor={'#5F6F7E'}
                keyboardType={'default'}
                value={macAddress}
                onChangeText={setMacAddress}
              />
              <Text style={Styles.txtDescriptionField}>
                Ingrese la direccion mac en formato 00:00:00:00:00:00
              </Text>
              {/*Reference*/}
              <Text style={Styles.txtTitleField}>Referencia</Text>
              <TextInput
                style={Styles.txtInputField}
                placeholder={'Ingrese referencia'}
                placeholderTextColor={'#5F6F7E'}
                keyboardType={'default'}
                value={reference}
                onChangeText={setReference}
              />
              {/*Sensor type*/}
              <Text style={Styles.txtTitleField}>Tipo de sensor</Text>
              {sensorScanned ? (
                <Text style={Styles.txtTypeSensor}>
                  {sensorScanned.sensorType.name}
                </Text>
              ) : (
                <DropDownPicker
                  loading={loading}
                  listMode="SCROLLVIEW"
                  zIndex={parameters.length * 10 + 10}
                  open={openTypeSensor}
                  value={typeSensor}
                  items={listTypes}
                  setOpen={setOpenTypeSensor}
                  setValue={selectValue => changeTypeSensor(selectValue)}
                />
              )}
              {/*Sensor parameters*/}
              {parameters.length != 0 ? (
                <>
                  <View style={Styles.lineSeparator} />
                  <Text style={Styles.txtTitleParameters}>
                    Configurar parámetros
                  </Text>
                  {parameters.map((param, index) => {
                    return (
                      <Parameter
                        key={param.id}
                        config={param}
                        zIndex={calculateZindex(index, parameters.length)}
                        setListConfig={setListConfig}
                      />
                    );
                  })}
                </>
              ) : null}
              {/*Button*/}
              <View style={Styles.buttonFormContent}>
                <TouchableOpacity style={Styles.btnForm} onPress={handleSave}>
                  <Text style={Styles.txtButtonForm}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
}

const {height} = Dimensions.get('window');
const Styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  safeAreaView: {flex: 1},
  formContent: {height: height, paddingHorizontal: 15},
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
  txtDescriptionField: {fontSize: 12, color: '#5F6F7E'},
  buttonFormContent: {
    marginTop: 35,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  btnForm: {
    width: 150,
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtButtonForm: {fontSize: 16, color: '#FFFFFF'},
  lineSeparator: {height: 3, backgroundColor: '#D8DFE7', marginBottom: 20},
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
});

export default SensorRegisterScreen;
