import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { PaperProvider } from 'react-native-paper'
import { Provider } from 'react-redux'
import Store from './src/redux/Store'
import GlobalContext from './src/context/GlobalContext'
import StackNavigator from './src/navigation/StackNavigator'
import Logout from './src/components/Logout'
import AlertDialog from './src/components/AlertDialog'
import { didcomToastConfig } from './src/components/didcom_toast/DidcomToastConfig'

export default function App() {
  return (
    <>
      <Provider store={Store}>
        <GlobalContext>
          <PaperProvider>
            <NavigationContainer>
              <StackNavigator />
              <Logout />
              <AlertDialog />
            </NavigationContainer>
            <Toast config={didcomToastConfig} />
          </PaperProvider>
        </GlobalContext>
      </Provider>
    </>
  )
}
