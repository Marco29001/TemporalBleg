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
import {useSelector} from 'react-redux';
import {i18n} from '../../../assets/locale/i18n';
import {selectGateway} from '../../../redux/slices/gatewaySlice';
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
import {OK_DIALOG, WARNING_DIALOG} from '../../../utils/Constants';

function SensorRegisterScreen(props) {
  const gateway = useSelector(selectGateway);
  const {sensorScanned, setSensorScanned} = useGlobalContext();
  const [serialNumber, setSerialNumber] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [reference, setReference] = useState('');
  const [listTypes, setListTypes] = useState([]);
  const [openTypeSensor, setOpenTypeSensor] = useState(false);
  const [typeSensor, setTypeSensor] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [listConfig, setListConfig] = useState([]);
  const {showDialog} = useDialog();
  const {loading, error, callEndpoint} = useApiRequest();

  const handleReturn = () => {
    setSensorScanned(null);
    props.navigation.replace('GatewayDetailScreen', {gatewayId: gateway.id});
  };

  const changeTypeSensor = async selectValue => {
    setTypeSensor(selectValue(typeSensor));
    const response = await callEndpoint(
      getSensorConfig(selectValue(typeSensor)),
    );
    if (response) {
      setParameters(response);
    }
  };

  const refreshTypesSensor = async () => {
    const response = await callEndpoint(getSensorType());
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
      const response = await callEndpoint(
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
        let configDialog = Object.assign({}, OK_DIALOG);
        configDialog.subtitle = response.message;

        showDialog(configDialog, () => {
          setSensorScanned(null);
          props.navigation.replace('GatewayDetailScreen', {
            gatewayId: gateway.id,
          });
        });
      }
    } else {
      showToastMessage(
        'didcomWarningToast',
        i18n.t('SensorRegister.EmptyFields'),
      );
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
    if (error) {
      let configDialog = Object.assign({}, WARNING_DIALOG);
      configDialog.subtitle = error.message;

      showDialog(configDialog);
    }
  }, [error]);

  return (
    <>
      <LoadingModal visible={loading} />

      <View style={Styles.mainContent}>
        <HeaderComp
          title={i18n.t('SensorRegister.TitleHeader')}
          handleReturn={handleReturn}
        />

        <SafeAreaView style={Styles.safeAreaView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={Styles.formContent}>
              {/*Serial Number*/}
              <Text style={Styles.txtTitleField}>
                {i18n.t('SensorRegister.SerialNumber')}
              </Text>
              <TextInput
                style={Styles.txtInputField}
                placeholder={i18n.t('SensorRegister.InputSerialNumber')}
                placeholderTextColor={'#5F6F7E'}
                keyboardType={'default'}
                maxLength={17}
                value={serialNumber}
                onChangeText={setSerialNumber}
              />
              <Text style={Styles.txtDescriptionField}>
                {i18n.t('SensorRegister.InputSerialNumberSensor')}
              </Text>
              {/*MAC Address*/}
              <Text style={Styles.txtTitleField}>
                {i18n.t('SensorRegister.MacAddress')}
              </Text>
              <TextInput
                style={Styles.txtInputField}
                placeholder={i18n.t('SensorRegister.InputMacAddress')}
                placeholderTextColor={'#5F6F7E'}
                keyboardType={'default'}
                value={macAddress}
                onChangeText={setMacAddress}
              />
              <Text style={Styles.txtDescriptionField}>
                {i18n.t('SensorRegister.MessageMacAddress')}
              </Text>
              {/*Reference*/}
              <Text style={Styles.txtTitleField}>
                {i18n.t('SensorRegister.Reference')}
              </Text>
              <TextInput
                style={Styles.txtInputField}
                placeholder={i18n.t('SensorRegister.InputReference')}
                placeholderTextColor={'#5F6F7E'}
                keyboardType={'default'}
                value={reference}
                onChangeText={setReference}
              />
              {/*Sensor type*/}
              <Text style={Styles.txtTitleField}>
                {i18n.t('SensorRegister.TypeSensor')}
              </Text>
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
                    {i18n.t('SensorRegister.Parameters')}
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
                  <Text style={Styles.txtButtonForm}>
                    {i18n.t('SensorRegister.Add')}
                  </Text>
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
