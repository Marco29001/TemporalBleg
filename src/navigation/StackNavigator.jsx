import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import SplashScreen from '../screens/splash/SplashScreen'
import PermissionScreen from '../screens/permissions/PermissionScreen'
import LoginScreen from '../screens/login/LoginScreen'
import TabBarNavigator from './TabBarNavigator'
import UserInfoScreen from '../screens/userInfo/UserInfoScreen'
import BlegDetailScreen from '../screens/bleg/detail/BlegDetailScreen'
import BlegRegisterScreen from '../screens/bleg/register/BlegRegisterScreen'
import SensorRegisterScreen from '../screens/sensor/register/SensorRegisterScreen'
import SensorEditScreen from '../screens/sensor/edit/SensorEditScreen'
import QrScannerScreen from '../screens/qr/QrScannerScreen'
import BlegRealTimeScreen from '../screens/bleg/realtime/BlegRealTimeScreen'
import AssetTrackingScreen from '../screens/bleg/asset_tracking/AssetTrackingScreen'
import { useSignalR } from '../hooks/useSignalR'

const Stack = createStackNavigator()

function StackNavigator() {
  useSignalR()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        options={{ headerShown: false }}
        component={SplashScreen}
      />
      <Stack.Screen
        name="PermissionScreen"
        options={{ headerShown: false }}
        component={PermissionScreen}
      />
      <Stack.Screen
        name="LoginScreen"
        options={{ headerShown: false }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="TabBarNavigator"
        options={{ headerShown: false }}
        component={TabBarNavigator}
      />
      <Stack.Screen
        name="UserInfoScreen"
        options={{ headerShown: false }}
        component={UserInfoScreen}
      />
      <Stack.Screen
        name="BlegDetailScreen"
        options={{ headerShown: false }}
        component={BlegDetailScreen}
      />
      <Stack.Screen
        name="BlegRegisterScreen"
        options={{ headerShown: false }}
        component={BlegRegisterScreen}
      />
      <Stack.Screen
        name="SensorRegisterScreen"
        options={{ headerShown: false }}
        component={SensorRegisterScreen}
      />
      <Stack.Screen
        name="SensorEditScreen"
        options={{ headerShown: false }}
        component={SensorEditScreen}
      />
      <Stack.Screen
        name="QrScannerScreen"
        options={{ headerShown: false }}
        component={QrScannerScreen}
      />
      <Stack.Screen
        name="BlegRealTimeScreen"
        options={{ headerShown: false }}
        component={BlegRealTimeScreen}
      />
      <Stack.Screen
        name="AssetTrackingScreen"
        options={{ headerShown: false }}
        component={AssetTrackingScreen}
      />
    </Stack.Navigator>
  )
}

export default StackNavigator
