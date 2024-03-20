import React from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {i18n} from '../../../../assets/locale/i18n';
import Battery from './Battery';
import SignalComp from '../../../../components/SignalComp';
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon';

function ListSensorsRealTime({data, handleSensorVariable}) {
  return (
    <FlatList
      style={styles.list}
      showsVerticalScrollIndicator={false}
      data={data}
      renderItem={({item, index}) => {
        return (
          <View key={index} style={styles.item}>
            <View style={styles.sensorInfoContent}>
              <View style={styles.sensorCount}>
                <Text style={styles.txtSensorCount}>
                  {i18n.t('GatewayRealtime.Sensor')} : {item.NM}
                </Text>
              </View>
              <View style={styles.macAddress}>
                <Text style={styles.txtGeneralItem}>{item.MC}</Text>
              </View>
            </View>
            <View style={styles.sensorInfoContent}>
              <View style={styles.infoStatusSensor}>
                <Battery batteryLevel={item.BT} size={30} fill={'#17A0A3'} />
                <Text style={styles.txtGeneralItem}>
                  {item.BT != 0 && item.BT ? item.BT + ' %' : ''}
                </Text>
              </View>
              <View style={styles.infoStatusSensor}>
                <SignalComp signalRssi={item.SG} size={25} />
                <Text style={styles.txtGeneralItem}>{item.SG * -1}</Text>
              </View>
              <View style={styles.infoStatusSensor}>
                <BlegIcon name="icon_clock" color={'#97A4B0'} size={25} />
                <Text style={styles.txtGeneralItem}>{item.LA}</Text>
              </View>
            </View>
            {item.variables.map((variable, index) => {
              return (
                <View key={index}>
                  {index != item.variables.length ? (
                    <View style={styles.lineSeparator} />
                  ) : null}
                  <TouchableOpacity
                    style={styles.infoTypeSensor}
                    onPress={handleSensorVariable(item.MC, variable.id)}>
                    <Text style={styles.txtInfoType}>{variable.name}</Text>
                    <Text style={styles.txtInfoType}>
                      {variable.value + ' ' + variable.unit}
                    </Text>
                    <View style={styles.btnNext}>
                      <BlegIcon name="icon_next" color={'#17A0A3'} size={20} />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
            <View style={styles.lineSeparator} />
            <View style={styles.referenceContainer}>
              <Text style={styles.txtReference}>
                {i18n.t('GatewayRealtime.Reference') + ' ' + item?.reference ??
                  ''}
              </Text>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {flex: 1, paddingHorizontal: 15},
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
  },
  txtGeneralItem: {fontSize: 16, color: '#97A4B0', marginLeft: 5},
  sensorInfoContent: {flex: 1, flexDirection: 'row', marginBottom: 15},
  sensorCount: {flex: 1},
  txtSensorCount: {fontSize: 16, fontWeight: 'bold', color: '#17A0A3'},
  macAddress: {flex: 1, alignItems: 'center'},
  infoStatusSensor: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBattery: {transform: [{rotate: '270deg'}]},
  infoTypeSensor: {flex: 1, flexDirection: 'row', marginBottom: 15},
  txtInfoType: {flex: 1, fontSize: 16, color: '#97A4B0'},
  btnNext: {flex: 1, alignItems: 'flex-end'},
  lineSeparator: {
    height: 3,
    backgroundColor: '#D8DFE7',
    marginBottom: 15,
  },
  referenceContainer: {
    height: 30,
    justifyContent: 'center',
  },
  txtReference: {fontSize: 16, color: '#97A4B0'},
});

export default ListSensorsRealTime;
