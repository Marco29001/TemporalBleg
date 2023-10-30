import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {createLogout} from '../redux/slices/logout';
import StatusBarComp from './StatusBarComp';
import BlegIcon from '../assets/icons/customIcons/BlegIcon';

function HeaderTab(props) {
  const {title, screen} = props;
  const dispatcher = useDispatch();

  const handleLogout = () => {
    dispatcher(createLogout({open: true, unauthorized: false}));
  };

  const handleUser = () => {
    props.navigation.replace('UserInfoScreen', {toScreen: screen});
  };

  return (
    <>
      <StatusBarComp backgroundColor="#003180" barStyle={'ligth-content'} />

      <View style={Styles.headerContainer}>
        <View style={Styles.titleContainer}>
          <Text style={Styles.txtTitle}>{title}</Text>
        </View>
        <View style={Styles.optionContainer}>
          <TouchableOpacity onPress={handleLogout}>
            <BlegIcon
              style={Styles.iconOption}
              name="icon_logout"
              color={'#FFFFFF'}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUser}>
            <BlegIcon name="icon_user" color={'#FFFFFF'} size={25} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const Styles = StyleSheet.create({
  headerContainer: {
    flex: 0.2,
    flexDirection: 'row',
    backgroundColor: '#003180',
  },
  titleContainer: {flex: 1, justifyContent: 'flex-end'},
  txtTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 18,
    color: '#FFFFFF',
  },
  optionContainer: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOption: {marginBottom: 25},
});

export default HeaderTab;
