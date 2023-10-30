import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import BlegIcon from '../assets/icons/customIcons/BlegIcon';

function ListEmptyComp({icon, message, handleRefresh}) {
  return (
    <View style={Styles.listEmpty}>
      <BlegIcon name={icon} color={'#C2CACE'} size={40} />
      <Text style={Styles.txtListEmpty}>{message}</Text>
      <TouchableOpacity style={Styles.buttonRefresh} onPress={handleRefresh}>
        <BlegIcon name="icon_refresh" color={'#FFFFFF'} size={25} />
      </TouchableOpacity>
    </View>
  );
}

const Styles = StyleSheet.create({
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
});

export default ListEmptyComp;
