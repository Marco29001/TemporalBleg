import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {getAuth} from '../../services/remote/AuthServices';
import {useGlobalContext} from '../../context/GlobalContext';
import useApiRequest from '../../hooks/useApiRequest';
import LoadingModal from '../../components/LoadingModal';
import CustomTextInput from '../../components/CustomTextInput';
import {showToastMessage} from '../../utils/Common';
import ErrorManager from '../../utils/ErrorManager';
import Images from '../../assets/images/Images';

function LoginScreen(props) {
  const [values, setValues] = useState({
    email: '',
    password: '',
    database: '',
  });
  const [secure, setSecure] = useState(true);
  const arrayInputs = [
    {
      icon: 'icon_user',
      placeHolder: 'Usuario',
      property: 'email',
      keyboardType: 'default',
      value: values.email,
      secure: false,
    },
    {
      icon: 'icon_password',
      placeHolder: 'Contraseña',
      property: 'password',
      keyboardType: 'default',
      value: values.password,
      secure: secure,
    },
    {
      icon: 'icon_database',
      placeHolder: 'Base de datos',
      property: 'database',
      keyboardType: 'default',
      value: values.database,
      secure: false,
    },
  ];
  const {saveUserSession} = useGlobalContext();
  const {loading, error, resetError, callEnpoint} = useApiRequest();

  const onChangeValues = (property, value) => {
    resetError();
    setValues({...values, [property]: value});
  };

  const handleSecure = () => {
    setSecure(!secure);
  };

  const handleLogin = async () => {
    if (validateForm()) {
      const response = await callEnpoint(
        getAuth(values.email, values.password, values.database),
      );
      if (response) {
        saveUserSession(response);
        props.navigation.replace('TabBarNavigator');
      }
    }
  };

  const validateForm = () => {
    if (values.email == '' || values.password == '' || values.database == '') {
      showToastMessage('didcomWarningToast', 'Llena todos los campos');
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (error.value && error.status != 401) {
      showToastMessage('didcomErrorToast', ErrorManager(error.status));
    }
  }, [error]);

  return (
    <>
      <LoadingModal visible={loading} />

      <View style={LoginStyle.mainContainer}>
        <View style={LoginStyle.logoContainer}>
          <Image style={LoginStyle.imgLogo} source={Images.imgLogoWhite} />
        </View>
        <View style={LoginStyle.bodyLoginContainer}>
          <View style={LoginStyle.headerBodyContainer}>
            <Text style={LoginStyle.txtTitleBody}>Inicio de Sesión</Text>
          </View>
          <View style={LoginStyle.centerBodyContainer}>
            {arrayInputs.map((input, index) => {
              return (
                <CustomTextInput
                  key={index}
                  icon={input.icon}
                  placeHolder={input.placeHolder}
                  property={input.property}
                  keyboardType={input.keyboardType}
                  value={input.value}
                  secure={input.secure}
                  error={error.value}
                  onChangeText={onChangeValues}
                  handleSecure={handleSecure}
                />
              );
            })}
          </View>
          <View style={LoginStyle.footerBodyContainer}>
            <TouchableOpacity style={LoginStyle.btnLogin} onPress={handleLogin}>
              <Text style={LoginStyle.txtLogin}>Acceder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const LoginStyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#003180',
  },
  logoContainer: {
    flex: 0.3,
    paddingHorizontal: 15,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  imgLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  bodyLoginContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 60,
  },
  headerBodyContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  txtTitleBody: {
    width: 180,
    fontSize: 35,
    fontWeight: 'bold',
    color: '#06205C',
  },
  centerBodyContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  footerBodyContainer: {
    flex: 1,
    paddingHorizontal: 50,
    justifyContent: 'center',
  },
  btnLogin: {
    height: 50,
    backgroundColor: '#004A98',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtLogin: {fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'},
});

export default LoginScreen;
