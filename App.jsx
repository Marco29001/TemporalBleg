import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import Store from './src/redux/Store';
import GlobalContext from './src/context/GlobalContext';
import StackNavigator from './src/navigation/StackNavigator';
import Logout from './src/components/Logout';
import AlertDialog from './src/components/AlertDialog';
import {didcomToastConfig} from './src/components/didcom_toast/DidcomToastConfig';

function App() {
  return (
    <>
      <Provider store={Store}>
        <GlobalContext>
          <NavigationContainer>
            <StackNavigator />
            <Logout />
            <AlertDialog />
          </NavigationContainer>
          <Toast config={didcomToastConfig} />
        </GlobalContext>
      </Provider>
    </>
  );
}

export default App;
