import React from 'react';
import {Text, StyleSheet} from 'react-native';
import Battery0 from '../../../../assets/icons/icon_battery0.svg';
import Battery1 from '../../../../assets/icons/icon_battery1.svg';
import Battery2 from '../../../../assets/icons/icon_battery2.svg';
import Battery3 from '../../../../assets/icons/icon_battery3.svg';
import Battery4 from '../../../../assets/icons/icon_battery4.svg';

function Battery(props) {
  const {batteryLevel, size, fill} = props;
  return batteryLevel >= 95 && batteryLevel <= 100 ? (
    <Battery4 width={size} height={size} fill={fill} />
  ) : batteryLevel >= 75 && batteryLevel < 95 ? (
    <Battery3 width={size} height={size} fill={fill} />
  ) : batteryLevel >= 50 && batteryLevel < 75 ? (
    <Battery2 width={size} height={size} fill={fill} />
  ) : batteryLevel >= 25 && batteryLevel < 50 ? (
    <Battery1 width={size} height={size} fill={fill} />
  ) : batteryLevel == 0 || batteryLevel == null ? (
    <Text style={Styles.txtBattery}>-</Text>
  ) : (
    <Battery0 width={size} height={size} fill={fill} />
  );
}

const Styles = StyleSheet.create({
  txtBattery: {fontSize: 35, fontWeight: 'bold', color: '#17A0A3'},
});

export default Battery;
