import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  getSensorById,
  editSensor,
} from '../../../services/remote/SensorServices';
import useApiRequest from '../../../hooks/useApiRequest';
import useDialog from '../../../hooks/useDialog';
import LoadingModal from '../../../components/LoadingModal';
import HeaderComp from '../../../components/HeaderComp';
import {calculateZindex} from '../../../utils/Common';
import Parameter from './componets/Parameter';
import ErrorManager from '../../../utils/ErrorManager';
import {OK_DIALOG, WARNING_DIALOG} from '../../../utils/Constants';

function SensorEditScreen(props) {
  const {sensorId} = props.route.params;
  const [serialNumber, setSerialNumber] = useState('');
  const [reference, setReference] = useState('');
  const [sensor, setSensor] = useState(null);
  const [listConfig, setListConfig] = useState([]);
  const {acceptDialog} = useDialog();
  const {loading, error, callEnpoint} = useApiRequest();

  const handleReturn = () => {
    props.navigation.replace('GatewayDetailScreen');
  };

  const handleSave = async () => {
    const body = {sensorId: sensorId, comment: reference, config: listConfig};
    const response = await callEnpoint(editSensor(body));
    if (response) {
      OK_DIALOG.subtitle = response.message;
      showDialog(OK_DIALOG, () => {
        props.navigation.replace('GatewayDetailScreen');
      });
    }
  };

  const showDialog = async (config, action) => {
    const isAccept = await acceptDialog(config);

    if (isAccept) {
      action();
    }
  };

  const refreshSensorInfo = async () => {
    const response = await callEnpoint(getSensorById(sensorId));
    if (response) {
      setSensor(response);
      setReference(response.comment);
    }
  };

  useEffect(() => {
    refreshSensorInfo();
  }, []);

  useEffect(() => {
    if (error.value) {
      WARNING_DIALOG.subtitle =
        error.e?.response.data?.message ?? ErrorManager(error.status);
      showDialog(WARNING_DIALOG, () => null);
    }
  }, [error]);

  return (
    <>
      <LoadingModal visible={loading} />

      <View style={Styles.mainContent}>
        <HeaderComp title={'Editar sensor'} handleReturn={handleReturn} />
        <View style={Styles.formContent}>
          {/*Serial Number*/}
          <Text style={Styles.txtTitleField}>No. Serie sensor</Text>
          <TextInput
            style={Styles.txtInputField}
            placeholder={sensor?.serialNumber}
            placeholderTextColor={'#5F6F7E'}
            keyboardType={'default'}
            value={serialNumber}
            onChangeText={setSerialNumber}
          />
          {/*Type sensor*/}
          <Text style={Styles.txtTitleField}>Tipo de sensor</Text>
          <Text style={Styles.txtField}>
            {sensor?.sensorType?.sensorTypeName}
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
          {sensor?.config?.length ? (
            <>
              <View style={Styles.lineSeparator} />
              <Text style={Styles.txtTitleParameters}>
                Configurar parámetros
              </Text>
              {sensor.variables.map((variable, index) => {
                return (
                  <Parameter
                    key={variable.id}
                    config={variable}
                    zIndex={calculateZindex(index, sensor.variables.length)}
                    setListConfig={setListConfig}
                    configSelected={sensor.config.find(
                      x => x.variableSensorTypeId == variable.id,
                    )}
                  />
                );
              })}
            </>
          ) : null}
          {/*Button*/}
          <View style={Styles.buttonFormContent}>
            <TouchableOpacity style={Styles.btnForm} onPress={handleSave}>
              <Text style={Styles.txtButtonForm}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const Styles = StyleSheet.create({
  mainContent: {flex: 1, backgroundColor: '#F2F2F7'},
  formContent: {flex: 1, padding: 25},
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
  txtField: {fontSize: 16, color: '#1A468D', marginLeft: 15},
  lineSeparator: {height: 3, backgroundColor: '#D8DFE7', marginBottom: 20},
  txtSubtitleField: {
    fontSize: 16,
    color: '#1A468D',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonFormContent: {
    marginTop: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  btnForm: {
    width: 150,
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 25,
    marginTop: 10,
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
});

export default SensorEditScreen;
