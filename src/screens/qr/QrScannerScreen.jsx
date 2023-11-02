import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Text} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {validateSensor} from '../../services/remote/SensorServices';
import {validateGateway} from '../../services/remote/GatewayServices';
import useApiRequest from '../../hooks/useApiRequest';
import useDialog from '../../hooks/useDialog';
import BlegIcon from '../../assets/icons/customIcons/BlegIcon';
import Images from '../../assets/images/Images';
import LoadingModal from '../../components/LoadingModal';
import {useGlobalContext} from '../../context/GlobalContext';
import {WARNING_DIALOG} from '../../utils/Constants';

function QrScannerScreen(props) {
  const {type} = props.route.params;
  const {userSession, setGateway, setSensorScanned} = useGlobalContext();
  const [isScanned, setIsScanned] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [torch, setTorch] = useState('off');
  const {acceptDialog} = useDialog();
  const {loading, error, callEnpoint} = useApiRequest();

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      setIsScanned(false);
      if (isScanned) {
        setIsScanned(false);
        if (codes[0].value !== '') {
          switch (type) {
            case 'gateway':
              getValidateGateway(codes[0].value);
              break;
            case 'sensor':
              getValidateSensor(codes[0].value);
              break;
          }
        }
      }
    },
  });

  const handleReturn = () => {
    props.navigation.replace(
      type == 'gateway' ? 'TabBarNavigator' : 'GatewayDetailScreen',
    );
  };

  const getValidateSensor = async code => {
    const response = await callEnpoint(validateSensor(code));
    if (response) {
      setSensorScanned(response);
      props.navigation.replace('SensorRegisterScreen');
    }
  };

  const getValidateGateway = async code => {
    const codeArray = code.split(';');
    const serialNumber = codeArray[0];
    const response = await callEnpoint(
      validateGateway(serialNumber, userSession.database),
    );
    if (response) {
      setGateway(response);
      props.navigation.replace('GatewayRegisterScreen', {lastScreen: 'qr'});
    }
  };

  const showDialog = async (config, action) => {
    const isAccept = await acceptDialog(config);

    if (isAccept) {
      action();
    }
  };

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (error.value) {
      WARNING_DIALOG.subtitle = error.e?.response?.data?.message;
      showDialog(WARNING_DIALOG, () => {
        setIsScanned(true);
      });
    }
  }, [error]);

  if (!device) {
    return null;
  }

  if (!hasPermission) {
    return null;
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
            Coloca la camara sobre el QR
          </Text>
        </View>
        <View style={Styles.topContainer} />
        <View style={Styles.centerContainer}>
          <View style={Styles.rigthContainer} />
          <View style={Styles.rectangleContainer}>
            <View style={Styles.content}>
              <View style={Styles.leftTop}>
                <Image style={Styles.imgTopLeft} source={Images.imgTopLeft} />
              </View>
              <View style={Styles.rigthTop}>
                <Image style={Styles.imgTopRigth} source={Images.imgTopRigth} />
              </View>
            </View>
            <View style={Styles.content}>
              <View style={Styles.leftBottom}>
                <Image
                  style={Styles.imgBottomLeft}
                  source={Images.imgBottomLeft}
                />
              </View>
              <View style={Styles.rigthBottom}>
                <Image
                  style={Styles.imgBottomRigth}
                  source={Images.imgBottomRigth}
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
                setTorch(f => (f === 'off' ? 'on' : 'off'));
              }}>
              <BlegIcon name="icon_lantern" color={'#FFFFFF'} size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
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
  txtTitleHeader: {fontSize: 20, fontWeight: 'bold', color: '#FFFFFF'},
  topContainer: {flex: 0.6, backgroundColor: 'rgba(0,0,0,0.5)'},
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  rigthContainer: {flex: 0.2, backgroundColor: 'rgba(0,0,0,0.5)'},
  rectangleContainer: {flex: 1, backgroundColor: 'transparent', zIndex: 1},
  leftContainer: {flex: 0.2, backgroundColor: 'rgba(0,0,0,0.5)'},
  content: {flex: 1, flexDirection: 'row', zIndex: 1},
  leftTop: {flex: 1},
  rigthTop: {flex: 1, alignItems: 'flex-end'},
  leftBottom: {flex: 1, justifyContent: 'flex-end'},
  rigthBottom: {flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'},
  imgTopLeft: {
    width: 100,
    height: 100,
    marginTop: -10,
    marginLeft: -15,
    resizeMode: 'contain',
  },
  imgTopRigth: {
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
  imgBottomRigth: {
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
  returnContent: {flex: 1, paddingHorizontal: 15},
  lanternContent: {flex: 1, paddingHorizontal: 20, alignItems: 'flex-end'},
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
});

export default QrScannerScreen;
