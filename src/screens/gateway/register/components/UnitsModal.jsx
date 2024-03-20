import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {i18n} from '../../../../assets/locale/i18n';
import {getDevices} from '../../../../services/remote/DeviceServices';
import useApiRequest from '../../../../hooks/useApiRequest';
import useSearch from '../../../../hooks/useSearch';
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon';
import ListEmptyComp from '../../../../components/ListEmptyComp';
import LoadingModal from '../../../../components/LoadingModal';

function UnitsModal({visible, handleSelectUnit, handleClose}) {
  const [units, setUnits] = useState([]);
  const {search, filtered, onChangeSearch} = useSearch(
    'serialNumber',
    'name',
    units,
  );
  const {loading, error, callEndpoint} = useApiRequest();

  const refreshUnits = async () => {
    const response = await callEndpoint(getDevices());
    if (response) {
      setUnits(response);
    }
  };

  useEffect(() => {
    if (visible) {
      refreshUnits();
    } else {
      setUnits([]);
      onChangeSearch('');
    }
  }, [visible]);

  if (loading) {
    return <LoadingModal visible={loading} />;
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.centerModalContainer}>
          <View style={styles.headerModalContainer}>
            <View style={styles.closeModal}>
              <TouchableOpacity
                styles={styles.btnCloseModal}
                onPress={handleClose}>
                <BlegIcon name={'icon_close'} color={'#FFFFFF'} size={30} />
              </TouchableOpacity>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.txtTitle}>
                {i18n.t('GatewayRegister.Units')}
              </Text>
              <Text style={styles.txtSubtitle}>
                {i18n.t('GatewayRegister.SelectUnit')}
              </Text>
            </View>
            <View style={styles.searchInputContent}>
              <BlegIcon name="icon_search" color={'#46B7AE'} size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder={i18n.t('GatewayRegister.Search')}
                placeholderTextColor={'#5F6F7E'}
                keyboardType={'default'}
                value={search}
                onChangeText={text => onChangeSearch(text)}
              />
            </View>
          </View>
          {error || filtered.length == 0 ? (
            <ListEmptyComp
              icon={'icon_bus'}
              message={
                error ? error.message : i18n.t('GatewayRegister.NoSearchUnit')
              }
              handleRefresh={refreshUnits}
            />
          ) : (
            <FlatList
              style={styles.list}
              showsVerticalScrollIndicator={false}
              data={filtered}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.item}
                    onPress={() => handleSelectUnit(item)}>
                    <View style={styles.infoGatewayContent}>
                      <Text style={styles.txtTitleField}>
                        {i18n.t('GatewayRegister.Unit')}
                      </Text>
                      <Text style={styles.txtField}>{item.name}</Text>
                      <Text style={styles.txtTitleField}>
                        {i18n.t('GatewayRegister.NoSerieGo')}
                      </Text>
                      <Text style={styles.txtField}>{item.serialNumber}</Text>
                    </View>
                    <View style={styles.iconGatewayContent}>
                      <BlegIcon name="icon_bus" color={'#17A0A3'} size={30} />
                    </View>
                  </TouchableOpacity>
                );
              }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refreshUnits} />
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  centerModalContainer: {
    height: height / 1.3,
    backgroundColor: '#003180',
    borderRadius: 15,
  },
  headerModalContainer: {flex: 0.5},
  closeModal: {
    flex: 0.5,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  btnCloseModal: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  txtTitle: {fontSize: 25, fontWeight: 'bold', color: '#FFFFFF'},
  txtSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
    marginTop: 5,
  },
  //search
  searchInputContent: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 15,
    paddingHorizontal: 10,
    margin: 20,
    alignItems: 'center',
  },
  searchInput: {flex: 1, fontSize: 16, color: '#000000', paddingHorizontal: 10},
  //loading
  loadingContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  lottieContainer: {width: 150, height: 150},
  //list
  list: {flex: 2, padding: 15},
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    //width: width,
  },
  listEmpty: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  txtListEmpty: {fontSize: 16, color: '#C2CACE', marginTop: 10},
  item: {
    height: 110,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    elevation: 3,
    marginBottom: 15,
  },
  infoGatewayContent: {
    flex: 1,
    justifyContent: 'center',
  },
  txtTitleField: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00317F',
    marginTop: 10,
  },
  txtField: {fontSize: 14, color: '#97A4B0', marginLeft: 15},
  iconGatewayContent: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UnitsModal;
