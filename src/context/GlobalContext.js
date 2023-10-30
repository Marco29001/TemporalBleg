import React, {createContext, useState, useContext} from 'react';
import LocalStorage from '../services/local/LocalStorage';

const Context = createContext();

export default function GlobalContext({children}) {
  const [userSession, setUserSession] = useState({
    email: null,
    database: null,
    token: null,
  });
  const [gateway, setGateway] = useState(null);
  const [sensorScanned, setSensorScanned] = useState(null);
  const [screenTab, setScreenTab] = useState('GatewaysScreen');
  const [gatewayRealTime, setGatewayRealTime] = useState(null);
  const [listGateways, setListGateways] = useState([]);
  const [listGatewaysRealTime, setListGatewaysRealTime] = useState([]);

  const saveUserSession = user => {
    const userSession$ = {
      email: user.api.userName,
      database: user.api.database,
      token: user.headerAuth,
    };

    LocalStorage.set('user', JSON.stringify(userSession$));
    setUserSession(userSession$);
  };

  const getUserSession = async () => {
    const userSession$ = await LocalStorage.get('user');
    if (userSession$) {
      setUserSession(JSON.parse(userSession$));
    }

    return JSON.parse(userSession$);
  };

  const deleteUserSession = () => {
    LocalStorage.delete('user');
    setUserSession({
      email: null,
      database: null,
      token: null,
    });
  };

  return (
    <Context.Provider
      value={{
        userSession,
        gateway,
        sensorScanned,
        screenTab,
        gatewayRealTime,
        listGateways,
        listGatewaysRealTime,
        saveUserSession,
        getUserSession,
        deleteUserSession,
        setGateway,
        setSensorScanned,
        setScreenTab,
        setGatewayRealTime,
        setListGateways,
        setListGatewaysRealTime,
      }}>
      {children}
    </Context.Provider>
  );
}

export function useGlobalContext() {
  return useContext(Context);
}
