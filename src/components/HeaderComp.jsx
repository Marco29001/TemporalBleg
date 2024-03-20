import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import StatusBarComp from './StatusBarComp';
import BlegIcon from '../assets/icons/customIcons/BlegIcon';

function HeaderComp({title, subtitle, handleReturn}) {
  return (
    <>
      <StatusBarComp backgroundColor="#003180" barStyle={'light-content'} />

      <View style={styles.headerContainer}>
        <View style={styles.returnContainer}>
          <TouchableOpacity style={styles.btnReturn} onPress={handleReturn}>
            <BlegIcon name="icon_return" color={'#FFFFFF'} size={20} />
          </TouchableOpacity>
          <Text style={styles.txtTitle}>{title}</Text>
        </View>
        <View style={styles.titleContainer}>
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
    paddingHorizontal: 15,
  },
  returnContainer: {
    flex: 1.5,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  btnReturn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  txtTitle: {
    fontSize: 25,
    fontFamily: 'Quicksand',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  txtSubtitle: {fontSize: 15, color: '#FFFFFF', marginTop: 10},
});

export default HeaderComp;
