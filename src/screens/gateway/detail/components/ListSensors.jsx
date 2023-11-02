import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {deleteSensor} from '../../../../services/remote/SensorServices';
import useApiRequest from '../../../../hooks/useApiRequest';
import useDialog from '../../../../hooks/useDialog';
import ListEmptyComp from '../../../../components/ListEmptyComp';
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon';
import SensorIcon from './SensorIcon';
import {showToastMessage} from '../../../../utils/Common';
import {WARNING_DIALOG} from '../../../../utils/Constants';
import ErrorManager from '../../../../utils/ErrorManager';

function ListSensors(props) {
  const {sensors, error, refreshing, onRefresh} = props;
  const {acceptDialog} = useDialog();
  const {callEnpoint} = useApiRequest();

  const handleEdit = item => {
    props.navigation.replace('SensorEditScreen', {
      sensorId: item.id,
    });
  };

  const handleRemove = sensor => {
    WARNING_DIALOG.subtitle =
      '¿Estas seguro que deseas eliminar el sensor con numero de serie ' +
      sensor.serialNumber +
      '?';
    WARNING_DIALOG.txtAccept = 'Si, eliminar';
    WARNING_DIALOG.isCancel = true;
    WARNING_DIALOG.txtCancel = 'No, eliminar';
    showDialog(WARNING_DIALOG, async () => {
      const response = await callEnpoint(deleteSensor(sensor.id));
      if (response) {
        showToastMessage('didcomSuccessToast', 'Se elimino correctamente');
        onRefresh();
      }
    });
  };

  const showDialog = async (config, action) => {
    const isAccept = await acceptDialog(config);

    if (isAccept) {
      action();
    }
  };

  useEffect(() => {
    if (error.value) {
      WARNING_DIALOG.subtitle =
        error.e?.response?.data?.message ?? ErrorManager(error.status);
      showDialog(WARNING_DIALOG, () => null);
    }
  }, [error]);

  if (refreshing) {
    return (
      <View style={styles.listLoading}>
        <LottieView
          width={150}
          height={150}
          source={require('../../../../assets/animations/circular.json')}
          autoPlay
          loop
        />
      </View>
    );
  }

  if (error.value || sensors.length == 0) {
    return (
      <ListEmptyComp
        icon={'icon_sensor'}
        handleRefresh={onRefresh}
        message={
          error.value
            ? 'Ocurrio un error al momento de cargar los sensores'
            : 'No se encontraron sensores'
        }
      />
    );
  }

  return (
    <>
      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={sensors}
        renderItem={({item}) => {
          return (
            <View style={styles.item}>
              <View style={styles.iconContainer}>
                <SensorIcon
                  idType={item.sensorTypeId}
                  size={50}
                  fill={'#003180'}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.txtTitleInfo}>Numero de serie</Text>
                <Text style={styles.txtInfoSerial}>{item.serialNumber}</Text>
                <Text style={styles.txtInfoType}>{item.sensorTypeName}</Text>
              </View>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.btnOption}
                  onPress={() => handleEdit(item)}>
                  <BlegIcon name="icon_edit" color={'#17A0A3'} size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnOption}
                  onPress={() => handleRemove(item)}>
                  <BlegIcon name="icon_erase" color={'#17A0A3'} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {flexGrow: 1, justifyContent: 'center'},
  list: {flex: 1},
  listLoading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  txtListEmpty: {fontSize: 16, color: '#C2CACE', marginTop: 10},
  item: {
    height: 90,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 3,
    marginBottom: 15,
  },
  iconContainer: {flex: 0.3, alignItems: 'center', justifyContent: 'center'},
  infoContainer: {flex: 1, justifyContent: 'center'},
  txtTitleInfo: {fontSize: 16, color: '#00317F', marginBottom: 5},
  txtInfoSerial: {fontSize: 16, color: '#97A4B0', marginBottom: 5},
  txtInfoType: {fontSize: 12, color: '#97A4B0'},
  optionsContainer: {flex: 0.3},
  btnOption: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  btnRefresh: {
    width: 50,
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListSensors;
