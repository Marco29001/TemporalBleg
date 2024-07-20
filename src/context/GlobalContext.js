import React, { createContext, useState, useContext } from 'react'
import LocalStorage from '../services/local/LocalStorage'

const Context = createContext()

export default function GlobalContext({ children }) {
  const [userSession, setUserSession] = useState({
    email: null,
    database: null,
    token: null,
  })
  const [Bleg, setBleg] = useState(null)
  const [sensorScanned, setSensorScanned] = useState(null)
  const [screenTab, setScreenTab] = useState('BlegsScreen')
  const [BlegRealTime, setBlegRealTime] = useState(null)
  const [listBlegs, setListBlegs] = useState([])
  const [listBlegsRealTime, setListBlegsRealTime] = useState([])

  const saveUserSession = user => {
    const userSession$ = {
      email: user.Api.UserName,
      database: user.Api.Database,
      token: user.HeaderAuth,
    }

    LocalStorage.set('user', JSON.stringify(userSession$))
    setUserSession(userSession$)
  }

  const getUserSession = async () => {
    const userSession$ = await LocalStorage.get('user')
    if (userSession$) {
      setUserSession(JSON.parse(userSession$))
    }

    return JSON.parse(userSession$)
  }

  const deleteUserSession = () => {
    LocalStorage.delete('user')
    setUserSession({
      email: null,
      database: null,
      token: null,
    })
  }

  return (
    <Context.Provider
      value={{
        userSession,
        Bleg,
        sensorScanned,
        screenTab,
        BlegRealTime,
        listBlegs,
        listBlegsRealTime,
        saveUserSession,
        getUserSession,
        deleteUserSession,
        setBleg,
        setSensorScanned,
        setScreenTab,
        setBlegRealTime,
        setListBlegs,
        setListBlegsRealTime,
      }}>
      {children}
    </Context.Provider>
  )
}

export function useGlobalContext() {
  return useContext(Context)
}
