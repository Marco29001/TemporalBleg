import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import SplashScreen from '../screens/splash/SplashScreen';
import PermissionScreen from '../screens/permissions/PermissionScreen';
import LoginScreen from '../screens/login/LoginScreen';
import TabBarNavigator from './TabBarNavigator';
import UserInfoScreen from '../screens/userInfo/UserInfoScreen';
import GatewayDetailScreen from '../screens/gateway/detail/GatewayDetailScreen';
import GatewayRegisterScreen from '../screens/gateway/register/GatewayRegisterScreen';
import SensorRegisterScreen from '../screens/sensor/register/SensorRegisterScreen';
import SensorEditScreen from '../screens/sensor/edit/SensorEditScreen';
import QrScannerScreen from '../screens/qr/QrScannerScreen';
import GatewayRealTimeScreen from '../screens/gateway/realtime/GatewayRealTimeScreen';

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        options={{headerShown: false}}
        component={SplashScreen}
      />
      <Stack.Screen
        name="PermissionScreen"
        options={{headerShown: false}}
        component={PermissionScreen}
      />
      <Stack.Screen
        name="LoginScreen"
        options={{headerShown: false}}
        component={LoginScreen}
      />
      <Stack.Screen
        name="TabBarNavigator"
        options={{headerShown: false}}
        component={TabBarNavigator}
      />
      <Stack.Screen
        name="UserInfoScreen"
        options={{headerShown: false}}
        component={UserInfoScreen}
      />
      <Stack.Screen
        name="GatewayDetailScreen"
        options={{headerShown: false}}
        component={GatewayDetailScreen}
      />
      <Stack.Screen
        name="GatewayRegisterScreen"
        options={{headerShown: false}}
        component={GatewayRegisterScreen}
      />
      <Stack.Screen
        name="SensorRegisterScreen"
        options={{headerShown: false}}
        component={SensorRegisterScreen}
      />
      <Stack.Screen
        name="SensorEditScreen"
        options={{headerShown: false}}
        component={SensorEditScreen}
      />
      <Stack.Screen
        name="QrScannerScreen"
        options={{headerShown: false}}
        component={QrScannerScreen}
      />
      <Stack.Screen
        name="GatewayRealTimeScreen"
        options={{headerShown: false}}
        component={GatewayRealTimeScreen}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
