import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useGlobalContext} from '../../../context/GlobalContext';
import {getGateways} from '../../../services/remote/GatewayServices';
import useApiRequest from '../../../hooks/useApiRequest';
import useSearch from '../../../hooks/useSearch';
import HeaderTab from '../../../components/HeaderTab';
import LoadingModal from '../../../components/LoadingModal';
import RegisterModal from '../../../components/RegisterModal';
import ListGateways from './components/ListGateways';
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon';
import {showToastMessage} from '../../../utils/Common';
import ErrorManager from '../../../utils/ErrorManager';

function GatewaysListScreen(props) {
  const {listGateways, setListGateways, setListGatewaysRealTime} =
    useGlobalContext();
  const [registerModal, setRegisterModal] = useState(false);
  const {search, filtered, onChangeSearch} = useSearch(
    'serialNumber',
    'deviceName',
    listGateways,
  );
  const {loading, error, callEnpoint} = useApiRequest();

  const handleRegister = () => {
    setRegisterModal(!registerModal);
  };

  const RefreshGateways = async () => {
    onChangeSearch('');
    const response = await callEnpoint(getGateways());
    if (response) {
      response.map(gateway => {
        if (gateway.device != null) {
          gateway.deviceName = gateway.device.name;
        } else {
          gateway.deviceName = '';
        }
      });
      setListGateways(response);
    }
  };

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', () => {
      setListGatewaysRealTime([]);
      RefreshGateways();
    });

    return unsuscribe;
  }, [props.navigation, listGateways]);

  useEffect(() => {
    if (error.value) {
      showToastMessage('didcomErrorToast', ErrorManager(error.status));
    }
  }, [error]);

  return (
    <>
      <LoadingModal visible={loading} />

      <View style={GatewaysStyle.mainContainer}>
        <HeaderTab {...props} title={'BLEG'} screen={'GatewaysScreen'} />
        <View style={GatewaysStyle.gatewayContainer}>
          <View style={GatewaysStyle.searchInputContainer}>
            <BlegIcon name="icon_search" color={'#46B7AE'} size={20} />
            <TextInput
              style={GatewaysStyle.searchInput}
              placeholder={'Buscar'}
              placeholderTextColor={'#5F6F7E'}
              keyboardType={'default'}
              value={search}
              onChangeText={text => {
                onChangeSearch(text);
              }}
            />
          </View>
          <ListGateways
            {...props}
            gateways={filtered}
            loading={loading}
            error={error}
            onRefresh={RefreshGateways}
            handleRegister={handleRegister}
          />
        </View>
        <View style={GatewaysStyle.footerContainer} />
        {/*Modals*/}
        <RegisterModal
          {...props}
          visible={registerModal}
          type={'gateway'}
          handleClose={handleRegister}
        />
      </View>
    </>
  );
}

const GatewaysStyle = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#F2F2F7'},
  gatewayContainer: {flex: 1, paddingHorizontal: 20},
  searchInputContainer: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 15,
    paddingHorizontal: 10,
    marginTop: -10,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchInput: {flex: 1, fontSize: 16, color: '#000000', paddingHorizontal: 10},
  footerContainer: {height: 50},
});

export default GatewaysListScreen;
