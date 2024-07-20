import { useEffect, useRef, useState } from 'react'
import * as signalR from '@microsoft/signalr'
import { i18n } from '../assets/locale/i18n'
import { useGlobalContext } from '../context/GlobalContext'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { createNotification } from '../redux/slices/notificationSlice'

export const useSignalR = () => {
  const dispatch = useDispatch()
  const { userSession } = useGlobalContext()
  const connectionRef = useRef(null)
  const [currentMessage, setCurrentMessage] = useState('')
  const [errorSignalR, setErrorSignalR] = useState(null)

  useEffect(() => {
    if (userSession.database) {
      const connection$ = new signalR.HubConnectionBuilder()
        .withUrl('https://cloud4.didcom.mx/APIs/BLEG/StatusHub')
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect([0, 1000, 1000, 1000])
        .build()

      connectionRef.current = connection$

      start()
    }

    return () => {
      //stop()
    }
  }, [userSession])

  const start = () => {
    let group = userSession.database

    const connection = connectionRef.current
    if (connection == null) {
      return
    }

    if (connection.state === 'Disconnected') {
      connection
        .start()
        .then(() => {
          console.log('connectionRef successfully')
          connection.invoke('JoinGroup', group)
          //setErrorSignalR(null)
        })
        .catch(err => {
          console.log(`Error starting the connectionRef: ${err.toString()}`)
          //setErrorSignalR(i18n.t('MapScreen.SignalInternet'))
          setTimeout(() => start(), 5000)
        })
    } else if (connection.state === 'Connected') {
      console.log('retoma la conexión')
      //setErrorSignalR(null)
      connection.invoke('JoinGroup', group)
    }

    connection.on('AwaitMessage', message => {
      try {
        var parseMessage = JSON.parse(message)
        dispatch(createNotification(message))
        Alert.alert(
          parseMessage.BlegName,
          i18n._locale == 'es'
            ? parseMessage.DescriptionNotification
            : parseMessage.DescriptionNotificationEn,
          [
            {
              text: 'Aceptar',
              onPress: () => {
                dispatch(createNotification(null))
              },
            },
          ],
        )
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    })

    connection.onreconnecting(function () {
      console.log('Reconnecting server')
      //setErrorSignalR(i18n.t('MapScreen.ReconnectUnits'))
    })

    connection.onreconnected(function () {
      //setErrorSignalR(null)
      connection.invoke('JoinGroup', group)
    })

    connection.onclose(async error => {
      console.log(new Date().toLocaleString(), `Close connection:  ${error}`)
      //setErrorSignalR(i18n.t('MapScreen.SignalInternet'))
      setTimeout(() => start(), 5000)
    })
  }

  const stop = async () => {
    const connection = connectionRef.current
    await connection.stop()
    await connection.off('AwaitMessage')
    connectionRef.current = null

    console.log(new Date().toLocaleString(), 'stop connection signal r')
  }

  return { currentMessage, errorSignalR }
}
