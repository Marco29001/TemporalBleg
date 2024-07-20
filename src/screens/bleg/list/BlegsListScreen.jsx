import React, { useState, useEffect } from 'react'
import { View, TextInput, StyleSheet, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { createBleg } from '../../../redux/slices/blegSlice'
import { i18n } from '../../../assets/locale/i18n'
import { useGlobalContext } from '../../../context/GlobalContext'
import { getBlegs } from '../../../services/remote/BlegServices'
import useApiRequest from '../../../hooks/useApiRequest'
import useSearch from '../../../hooks/useSearch'
import { useSignalR } from '../../../hooks/useSignalR'
import HeaderTab from '../../../components/HeaderTab'
import LoadingModal from '../../../components/LoadingModal'
import RegisterModal from '../../../components/RegisterModal'
import ListBlegs from './components/ListBlegs'
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon'
import { showToastMessage } from '../../../utils/Common'
import { selectNotification } from '../../../redux/slices/notificationSlice'

function BlegsListScreen(props) {
  const { listBlegs, setListBlegs, setListBlegsRealTime } = useGlobalContext()
  const dispatch = useDispatch()
  const notification = useSelector(selectNotification)
  const [registerModal, setRegisterModal] = useState(false)
  const { search, filtered, onChangeSearch } = useSearch(
    'serialNumber',
    'DeviceName',
    listBlegs,
  )
  const { loading, error, callEndpoint } = useApiRequest()

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setListBlegs([])
      setListBlegsRealTime([])
      dispatch(createBleg(null))
      RefreshBlegs()
    })

    return unsubscribe
  }, [props.navigation, listBlegs])

  useEffect(() => {
    if (notification) {
      setListBlegs(prevState => {
        const newState = prevState
        const parseNotification = JSON.parse(notification)
        const findBleg = newState.find(
          item => item.id == parseNotification.IdBleg,
        )
        if (findBleg) {
          findBleg.statusSync = {
            id: parseNotification.StatusNotification,
            descriptionEs: parseNotification.DescriptionNotification,
            descriptionEn: parseNotification.DescriptionNotificationEn,
            Icon: parseNotification.Icon,
            Color: parseNotification.Color,
            icon: parseNotification.Icon,
            color: parseNotification.ColorNotification,
          }
        }

        return newState
      })
    }
  }, [notification])

  useEffect(() => {
    if (error) {
      showToastMessage('didcomErrorToast', error.message)
    }
  }, [error])

  const handleRegister = () => {
    setRegisterModal(!registerModal)
  }

  const RefreshBlegs = async () => {
    onChangeSearch('')
    const response = await callEndpoint(getBlegs())
    if (response) {
      response.map(Bleg => {
        if (Bleg.device != null) {
          Bleg.DeviceName = Bleg.device.name
        } else {
          Bleg.DeviceName = ''
        }
      })
      setListBlegs(response)
    }
  }

  return (
    <>
      <LoadingModal visible={loading} />

      <View style={BlegsStyle.mainContainer}>
        <HeaderTab
          {...props}
          title={i18n.t('BlegList.TitleHeader')}
          screen={'BlegsScreen'}
        />

        <View style={BlegsStyle.BlegContainer}>
          <View style={BlegsStyle.searchInputContainer}>
            <BlegIcon name="icon_search" color={'#46B7AE'} size={20} />
            <TextInput
              style={BlegsStyle.searchInput}
              placeholder={i18n.t('BlegList.Search')}
              placeholderTextColor={'#5F6F7E'}
              keyboardType={'default'}
              value={search}
              onChangeText={text => {
                onChangeSearch(text)
              }}
            />
          </View>
          <ListBlegs
            {...props}
            Blegs={filtered}
            loading={loading}
            error={error}
            onRefresh={RefreshBlegs}
            handleRegister={handleRegister}
          />
        </View>
        <View style={BlegsStyle.footerContainer} />
        {/*Modals*/}
        <RegisterModal
          {...props}
          visible={registerModal}
          type={'Bleg'}
          handleClose={handleRegister}
        />
      </View>
    </>
  )
}

const BlegsStyle = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F2F2F7' },
  BlegContainer: { flex: 1, paddingHorizontal: 20 },
  searchInputContainer: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 15,
    paddingHorizontal: 10,
    marginTop: -10,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingHorizontal: 10,
  },
  footerContainer: { height: 50 },
})

export default BlegsListScreen
