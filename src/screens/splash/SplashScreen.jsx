import React, {useEffect} from 'react';
import {
  StatusBar,
  View,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {useGlobalContext} from '../../context/GlobalContext';
import LocalStorage from '../../services/local/LocalStorage';
import Images from '../../assets/images/Images';

function SplashScreen(props) {
  const {getUserSession} = useGlobalContext();

  const getSession = async () => {
    const permissions = await LocalStorage.get('permissions');
    const user = await getUserSession();

    if (permissions == null) {
      setTimeout(() => {
        props.navigation.replace('PermissionScreen');
      }, 3000);
      return;
    }

    if (user) {
      setTimeout(() => {
        props.navigation.replace('TabBarNavigator');
      }, 3000);
      return;
    }

    setTimeout(() => {
      props.navigation.replace('LoginScreen');
    }, 3000);
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle={'dark-content'} />
      <View style={SplashStyle.container}>
        <ImageBackground
          source={Images.imgFondo}
          resizeMode="cover"
          style={SplashStyle.imgFondo}>
          <View style={SplashStyle.logoContainer}>
            <Image style={SplashStyle.logoImg} source={Images.imgLogo} />
          </View>
          <View style={SplashStyle.poweredByContainer}>
            <Image
              style={SplashStyle.imgPoweredBy}
              source={Images.imgPowerBy}
            />
          </View>
        </ImageBackground>
      </View>
    </>
  );
}

const SplashStyle = StyleSheet.create({
  container: {flex: 1},
  imgFondo: {flex: 1, justifyContent: 'center'},
  logoContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  logoImg: {width: 200, height: 200, resizeMode: 'contain'},
  poweredByContainer: {flex: 0.2, alignItems: 'center'},
  imgPoweredBy: {width: 150, height: 50, resizeMode: 'contain'},
});

export default SplashScreen;
