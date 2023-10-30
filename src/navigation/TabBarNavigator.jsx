import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useGlobalContext} from '../context/GlobalContext';
import GatewaysListScreen from '../screens/gateway/list/GatewaysListScreen';
import GatewaysFindScreen from '../screens/gateway/find/GatewayFindScreen';
import BlegIcon from '../assets/icons/customIcons/BlegIcon';

const Tab = createMaterialTopTabNavigator();

function TabBarNavigator(props) {
  const {userSession} = useGlobalContext();

  useEffect(() => {
    if (userSession.token == null) {
      props.navigation.replace('LoginScreen');
    }
  }, [userSession]);

  return (
    <>
      <Tab.Navigator screenOptions={styles.tabStyles}>
        <Tab.Screen
          name="GatewaysListScreen"
          component={GatewaysListScreen}
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({color}) => (
              <BlegIcon name="icon_gateway" color={color} size={17} />
            ),
          }}
        />
        <Tab.Screen
          name="GatewaysFindScreen"
          component={GatewaysFindScreen}
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({color}) => (
              <BlegIcon name="icon_bluetooth" color={color} size={20} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  tabStyles: {
    tabBarPressColor: '#46B7AE',
    tabBarInactiveTintColor: '#666666',
    tabBarActiveTintColor: '#46B7AE',
    tabBarLabelStyle: {fontSize: 10},
    tabBarStyle: {
      backgroundColor: '#FFFFFF',
      height: 60,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
});

export default TabBarNavigator;
