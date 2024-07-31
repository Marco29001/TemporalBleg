import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native'
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera'
import { i18n } from '../../assets/locale/i18n'
import { getSensorByQrCode } from '../../services/remote/SensorServices'
import { getBlegByQrCode } from '../../services/remote/BlegServices'
import useApiRequest from '../../hooks/useApiRequest'
import useDialog from '../../hooks/useDialog'
import BlegIcon from '../../assets/icons/customIcons/BlegIcon'
import Images from '../../assets/images/Images'
import LoadingModal from '../../components/LoadingModal'
import { useGlobalContext } from '../../context/GlobalContext'
import { CAMERA_PERMISSION_DIALOG, WARNING_DIALOG } from '../../utils/Constants'
import { useDispatch, useSelector } from 'react-redux'
import { selectBleg, createBleg } from '../../redux/slices/blegSlice'
import { openSettings } from 'react-native-permissions'

function QrScannerScreen(props) {
  const { type } = props.route.params
  const { userSession, setSensorScanned } = useGlobalContext()
  const dispatch = useDispatch()
  const Bleg = useSelector(selectBleg)
  const [isScanned, setIsScanned] = useState(true)
  const [hasPermission, setHasPermission] = useState(false)
  const [torch, setTorch] = useState('off')
  const { showDialog } = useDialog()
  const { loading, error, callEndpoint } = useApiRequest()

  const device = useCameraDevice('back')
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      setIsScanned(false)
      if (isScanned) {
        setIsScanned(false)
        if (codes[0].value !== '') {
          switch (type) {
            case 'Bleg':
              getValidateBleg(codes[0].value)
              break
            case 'sensor':
              getValidateSensor(codes[0].value)
              break
          }
        }
      }
    },
  })

  useEffect(() => {
    ;(async () => {
      const status = await Camera.requestCameraPermission()
      if (status == 'granted') {
        setHasPermission(true)
      } else {
        showDialog(
          CAMERA_PERMISSION_DIALOG,
          () => {
            openSettings().catch(() => console.warn('cannot open settings'))
            props.navigation.replace('TabBarNavigator')
          },
          () => {
            props.navigation.replace('TabBarNavigator')
          },
        )
      }
    })()
  }, [])

  useEffect(() => {
    if (error && type == 'Bleg') {
      let configDialog = Object.assign({}, WARNING_DIALOG)
      let message = ''
      switch (error.status) {
        case 400:
          message = i18n.t('QrScanner.Error400Bleg')
          break
        case 409:
          message = i18n.t('QrScanner.Error409Bleg')
          break
        case 404:
          message = i18n.t('QrScanner.Error404Bleg')
          break
        default:
          message = i18n.t('QrScanner.ErrorServer')
          break
      }

      configDialog.subtitle = message
      showDialog(configDialog, () => {
        setIsScanned(true)
      })
    } else if (error && type == 'sensor') {
      let configDialog = Object.assign({}, WARNING_DIALOG)
      let message = ''
      switch (error.status) {
        case 400:
          message = i18n.t('QrScanner.Error400Sensor')
          break
        case 409:
          message = i18n.t('QrScanner.Error409Sensor')
          break
        default:
          message = i18n.t('QrScanner.ErrorServer')
          break
      }

      configDialog.subtitle = message
      showDialog(configDialog, () => {
        setIsScanned(true)
      })
    }
  }, [error])

  const handleReturn = () => {
    props.navigation.replace(
      type == 'Bleg' ? 'TabBarNavigator' : 'BlegDetailScreen',
    )
  }

  const getValidateSensor = async code => {
    const response = await callEndpoint(getSensorByQrCode(code, Bleg.id))
    if (response) {
      setSensorScanned(response)
      props.navigation.replace('SensorRegisterScreen')
    }
  }

  const getValidateBleg = async code => {
    const response = await callEndpoint(
      getBlegByQrCode(code, userSession.database),
    )
    if (response) {
      dispatch(createBleg(response))
      props.navigation.replace('BlegRegisterScreen', { lastScreen: 'qr' })
    }
  }

  if (!device) {
    return null
  }

  if (!hasPermission) {
    return null
  }

  return (
    <>
      <LoadingModal visible={loading} />

      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        torch={torch}
      />
      <View style={Styles.container}>
        <View style={Styles.headerContainer}>
          <Text style={Styles.txtTitleHeader}>
            {i18n.t('QrScanner.TitleHeader')}
          </Text>
        </View>
        <View style={Styles.topContainer} />
        <View style={Styles.centerContainer}>
          <View style={Styles.rightContainer} />
          <View style={Styles.rectangleContainer}>
            <View style={Styles.content}>
              <View style={Styles.leftTop}>
                <Image style={Styles.imgTopLeft} source={Images.imgTopLeft} />
              </View>
              <View style={Styles.rightTop}>
                <Image style={Styles.imgTopRight} source={Images.imgTopRight} />
              </View>
            </View>
            <View style={Styles.content}>
              <View style={Styles.leftBottom}>
                <Image
                  style={Styles.imgBottomLeft}
                  source={Images.imgBottomLeft}
                />
              </View>
              <View style={Styles.rightBottom}>
                <Image
                  style={Styles.imgBottomRight}
                  source={Images.imgBottomRight}
                />
              </View>
            </View>
          </View>
          <View style={Styles.leftContainer} />
        </View>
        <View style={Styles.bottomContainer}>
          <View style={Styles.returnContent}>
            <TouchableOpacity style={Styles.btnBack} onPress={handleReturn}>
              <BlegIcon name="icon_return" color={'#FFFFFF'} size={25} />
            </TouchableOpacity>
          </View>
          <View style={Styles.lanternContent}>
            <TouchableOpacity
              style={Styles.btnLantern}
              onPress={() => {
                setTorch(f => (f === 'off' ? 'on' : 'off'))
              }}>
              <BlegIcon name="icon_lantern" color={'#FFFFFF'} size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flex: 0.3,
    backgroundColor: '#003180',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtTitleHeader: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  topContainer: { flex: 0.6, backgroundColor: 'rgba(0,0,0,0.5)' },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  rightContainer: { flex: 0.2, backgroundColor: 'rgba(0,0,0,0.5)' },
  rectangleContainer: { flex: 1, backgroundColor: 'transparent', zIndex: 1 },
  leftContainer: { flex: 0.2, backgroundColor: 'rgba(0,0,0,0.5)' },
  content: { flex: 1, flexDirection: 'row', zIndex: 1 },
  leftTop: { flex: 1 },
  rightTop: { flex: 1, alignItems: 'flex-end' },
  leftBottom: { flex: 1, justifyContent: 'flex-end' },
  rightBottom: { flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' },
  imgTopLeft: {
    width: 100,
    height: 100,
    marginTop: -10,
    marginLeft: -15,
    resizeMode: 'contain',
  },
  imgTopRight: {
    width: 100,
    height: 100,
    marginTop: -10,
    marginRight: -15,
    resizeMode: 'contain',
  },
  imgBottomLeft: {
    width: 100,
    height: 100,
    marginBottom: -10,
    marginLeft: -15,
    resizeMode: 'contain',
  },
  imgBottomRight: {
    width: 100,
    height: 100,
    marginBottom: -10,
    marginRight: -15,
    resizeMode: 'contain',
  },
  bottomContainer: {
    flex: 0.6,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    zIndex: -1,
  },
  returnContent: { flex: 1, paddingHorizontal: 15 },
  lanternContent: { flex: 1, paddingHorizontal: 20, alignItems: 'flex-end' },
  btnBack: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLantern: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default QrScannerScreen
