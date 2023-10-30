import React from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import SignalComp from '../../../../components/SignalComp';

function ListGatewaysFind({gateways, handleGatewaySelect}) {
  return (
    <View style={Styles.mainContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={gateways}
        renderItem={({item, index}) => {
          let itemNum = index + 1;
          const signalRssi = item.rssi * -1;
          const itemStyle =
            gateways.length == 1
              ? oneItem
              : index == 0
              ? firtsItem
              : itemNum == gateways.length
              ? latestItem
              : Styles.item;

          return (
            <>
              <TouchableOpacity
                key={index}
                style={itemStyle}
                onPress={() => handleGatewaySelect(item)}>
                <View style={Styles.mainItemContainer}>
                  <View style={Styles.iconGatewayContainer}>
                    <SignalComp signalRssi={signalRssi} size={20} />
                  </View>
                  <View style={Styles.infoGatewayContainer}>
                    <Text style={Styles.txtTitleGateway}>
                      {item.name ? item.name : item.localName}
                    </Text>
                    <Text style={Styles.txtSubtitleGateway}>
                      {Platform.OS == 'android'
                        ? item.id
                        : item.manufacturerData}
                    </Text>
                    <Text style={Styles.txtSubtitleGateway}>
                      {'Unidad: ' + item.unit.name}
                    </Text>
                    <Text style={Styles.txtSubtitleGateway}>
                      {'No.Serie Go: ' + item.unit.serialNumber}
                    </Text>
                  </View>
                  <View style={Styles.countSensorsContainer}>
                    <Text style={Styles.txtSensors}>{item.sensors}</Text>
                    <Text style={Styles.txtTitleSensors}>Sensores</Text>
                  </View>
                </View>
                {itemNum != gateways.length && (
                  <View style={Styles.divisorLine} />
                )}
              </TouchableOpacity>
            </>
          );
        }}
      />
    </View>
  );
}

const Styles = StyleSheet.create({
  mainContainer: {flex: 1},
  item: {height: 110, backgroundColor: '#FFFFFF', padding: 15},
  firtsItem: {borderTopStartRadius: 16, borderTopEndRadius: 16},
  latestItem: {borderBottomStartRadius: 16, borderBottomEndRadius: 16},
  mainItemContainer: {flexDirection: 'row'},
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
    flex: 0.4,
    borderRadius: 16,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtSensors: {fontSize: 16, fontWeight: 'bold', color: '#46B7AE'},
  txtTitleSensors: {fontSize: 16, color: '#5F6F7E'},
  divisorLine: {height: 3, backgroundColor: '#D8DFE7', marginTop: 10},
});

const firtsItem = StyleSheet.compose(Styles.item, Styles.firtsItem);
const latestItem = StyleSheet.compose(Styles.item, Styles.latestItem);
const oneItem = StyleSheet.flatten([
  Styles.item,
  Styles.firtsItem,
  Styles.latestItem,
]);

export default ListGatewaysFind;
