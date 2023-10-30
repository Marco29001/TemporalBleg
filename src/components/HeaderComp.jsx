import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import StatusBarComp from './StatusBarComp';
import BlegIcon from '../assets/icons/customIcons/BlegIcon';

function HeaderComp({title, subtitle, handleReturn}) {
  return (
    <>
      <StatusBarComp backgroundColor="#003180" barStyle={'ligth-content'} />

      <View style={styles.headerContainer}>
        <View style={styles.returnContainer}>
          <TouchableOpacity style={styles.btnReturn} onPress={handleReturn}>
            <BlegIcon name="icon_return" color={'#FFFFFF'} size={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>{title}</Text>
          <Text style={styles.txtSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.15,
    backgroundColor: '#003180',
    padding: 15,
  },
  returnContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  btnReturn: {
    width: 70,
    height: 70,
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  txtTitle: {
    fontSize: 30,
    fontFamily: 'Quicksand',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  txtSubtitle: {fontSize: 15, color: '#FFFFFF', marginTop: 10},
});

export default HeaderComp;
