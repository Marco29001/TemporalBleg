import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {i18n} from '../../../../assets/locale/i18n';
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon';
import ListEmptyComp from '../../../../components/ListEmptyComp';
import {useGlobalContext} from '../../../../context/GlobalContext';

function ListGateways(props) {
  const {gateways, loading, onRefresh, handleRegister, navigation} = props;
  const {setGateway} = useGlobalContext();

  const handleItem = item => () => {
    setGateway(item);
    navigation.replace('GatewayDetailScreen');
  };

  if (loading) {
    return null;
  }

  if (gateways.length == 0) {
    return (
      <ListEmptyComp
        icon={'icon_gateway'}
        handleRefresh={onRefresh}
        message={i18n.t('GatewayList.EmptyGateway')}
      />
    );
  }

  return (
    <View style={Styles.mainContainer}>
      <FlatList
        style={Styles.list}
        showsVerticalScrollIndicator={false}
        data={gateways}
        renderItem={({item}) => {
          return (
            <TouchableOpacity style={Styles.item} onPress={handleItem(item)}>
              <View style={Styles.leftItemContainer}>
                <View style={Styles.iconGatewayContainer}>
                  <BlegIcon name="icon_gateway" color={'#003180'} size={20} />
                </View>
                <View style={Styles.infoGatewayContainer}>
                  <Text style={Styles.txtTitleGateway}>
                    {item?.serialNumber}
                  </Text>
                  <Text style={Styles.txtSubtitleGateway}>
                    {i18n.t('GatewayList.Unit')}:{item.device?.name ?? ''}
                  </Text>
                  <Text style={Styles.txtSubtitleGateway}>
                    {i18n.t('GatewayList.NoSerieGo')}:
                    {item.device?.serialNumber ?? ''}
                  </Text>
                </View>
              </View>
              <View style={Styles.countSensorsContainer}>
                <Text style={Styles.txtSensors}>{item?.totalSensors}</Text>
                <Text style={Styles.txtTitleSensors}>
                  {i18n.t('GatewayList.Sensors')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        style={Styles.addGatewayContainer}
        onPress={handleRegister}>
        <BlegIcon name="icon_plus" color={'#FFFFFF'} size={25} />
      </TouchableOpacity>
    </View>
  );
}

const Styles = StyleSheet.create({
  mainContainer: {flex: 1},
  list: {flex: 1},
  listEmpty: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  txtListEmpty: {
    fontSize: 16,
    color: '#C2CACE',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonRefresh: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#003180',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {height: 90, flexDirection: 'row', elevation: 15, marginBottom: 15},
  leftItemContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  iconGatewayContainer: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoGatewayContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  txtTitleGateway: {fontSize: 16, fontWeight: 'bold', color: '#5F6F7E'},
  txtSubtitleGateway: {fontSize: 14, color: '#92A2B0'},
  countSensorsContainer: {
    flex: 0.3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtSensors: {fontSize: 16, fontWeight: 'bold', color: '#46B7AE'},
  txtTitleSensors: {fontSize: 16, color: '#5F6F7E'},
  addGatewayContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#46B7AE',
    borderRadius: 16,
    position: 'absolute',
    right: 5,
    bottom: 50,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListGateways;
