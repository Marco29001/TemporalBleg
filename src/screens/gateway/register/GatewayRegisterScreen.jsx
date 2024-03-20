import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {i18n} from '../../../assets/locale/i18n';
import {useGlobalContext} from '../../../context/GlobalContext';
import {
  createGateway,
  validateGateway,
} from '../../../services/remote/GatewayServices';
import useApiRequest from '../../../hooks/useApiRequest';
import useDialog from '../../../hooks/useDialog';
import UnitsModal from './components/UnitsModal';
import HeaderComp from '../../../components/HeaderComp';
import LoadingModal from '../../../components/LoadingModal';
import BlegIcon from '../../../assets/icons/customIcons/BlegIcon';
import {showToastMessage} from '../../../utils/Common';
import {OK_DIALOG, WARNING_DIALOG} from '../../../utils/Constants';

function GatewayRegisterScreen(props) {
  const {lastScreen} = props.route.params;
  const {userSession, gateway, setGateway} = useGlobalContext();
  const [serieGateway, setSerieGateway] = useState('');
  const [editSerie, setEditSerieGateway] = useState(true);
  const [showUnitsModal, setShowUnitsModal] = useState(false);
  const [unit, setUnit] = useState(null);
  const [validate, setValidate] = useState(true);
  const {showDialog} = useDialog();
  const {loading, error, callEndpoint} = useApiRequest();

  const handleReturn = () => {
    if (lastScreen == 'detail') {
      props.navigation.replace('GatewayDetailScreen');
      return;
    }

    setGateway(null);
    props.navigation.replace('TabBarNavigator');
  };

  const onChangeSerialNumber = text => {
    setSerieGateway(text);
    setValidate(true);
  };

  const handleValidate = async () => {
    if (serieGateway != '') {
      const response = await callEndpoint(
        validateGateway(serieGateway, userSession.database),
      );
      if (response) {
        let configDialog = Object.assign({}, OK_DIALOG);
        configDialog.subtitle = i18n.t('GatewayRegister.ValidSerialNumber');

        showDialog(configDialog);
        setGateway(response);
        setValidate(false);
      }
    } else {
      showToastMessage(
        'didcomWarningToast',
        i18n.t('GatewayRegister.EmptySerialNumber'),
      );
    }
  };

  const handleSave = async () => {
    if (unit && serieGateway != '') {
      const response = await callEndpoint(
        createGateway({
          SerialNumber: serieGateway,
          VehicleId: unit.id,
          Gateway: gateway,
          Device: unit,
        }),
      );
      if (response) {
        let configDialog = Object.assign({}, OK_DIALOG);
        configDialog.subtitle = response.message;

        showDialog(configDialog, () => {
          switch (lastScreen) {
            case 'detail':
              props.navigation.replace('GatewayDetailScreen');
              break;
            case 'qr':
              setGateway(null);
              props.navigation.replace('TabBarNavigator');
              break;
          }
        });
      }
    } else {
      showToastMessage(
        'didcomErrorToast',
        i18n.t('GatewayRegister.EmptyFields'),
      );
    }
  };

  const handleShowUnitsModal = () => {
    setShowUnitsModal(!showUnitsModal);
  };

  const handleSelectUnit = item => {
    setUnit(item);
    handleShowUnitsModal();
  };

  useEffect(() => {
    if (lastScreen == 'detail' || lastScreen == 'qr') {
      setSerieGateway(gateway.serialNumber);
      setEditSerieGateway(false);
      setValidate(false);

      if (lastScreen == 'detail') {
        setUnit(gateway.device);
      }
    }
  }, []);

  useEffect(() => {
    if (error) {
      let configDialog = Object.assign({}, WARNING_DIALOG);
      configDialog.subtitle = error.message;

      showDialog(configDialog);
    }
  }, [error]);

  return (
    <>
      <LoadingModal visible={loading} />

      <View style={Styles.mainContainer}>
        <HeaderComp
          title={i18n.t('GatewayRegister.TitleHeader')}
          handleReturn={handleReturn}
        />

        <View style={Styles.formContainer}>
          <Text style={Styles.txtTitleForm}>
            {i18n.t('GatewayRegister.NoSerieBleg')}
          </Text>
          <TextInput
            style={Styles.inputForm}
            editable={editSerie}
            placeholder={i18n.t('GatewayRegister.NoSerieBleg')}
            placeholderTextColor={'#5F6F7E'}
            keyboardType={'default'}
            value={serieGateway}
            onChangeText={text => onChangeSerialNumber(text)}
          />
          <View style={Styles.btnFormContainer}>
            {validate && (
              <TouchableOpacity style={Styles.btnForm} onPress={handleValidate}>
                <Text style={Styles.txtButtonForm}>
                  {i18n.t('GatewayRegister.Validate')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={Styles.lineSeparator} />
          <Text style={Styles.txtTitleForm}>
            {i18n.t('GatewayRegister.SelectUnit')}
          </Text>
          <View style={Styles.selectUnitContainer}>
            <TouchableOpacity
              style={Styles.btnUnitSelect}
              onPress={handleShowUnitsModal}>
              <View style={Styles.titleUnitContiner}>
                <Text style={Styles.txtSelectButton}>
                  {i18n.t('GatewayRegister.Unit')}
                </Text>
                <View style={Styles.arrowContainer}>
                  <BlegIcon name="icon_next" color={'#17A0A3'} size={20} />
                </View>
              </View>
              <View style={Styles.lineSeparator} />
              <Text style={Styles.txtUnitSelect}>
                {unit ? unit.serialNumber : i18n.t('GatewayRegister.NoSerieGo')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.btnFormContainer}>
            {!validate && (
              <TouchableOpacity style={Styles.btnForm} onPress={handleSave}>
                <Text style={Styles.txtButtonForm}>
                  {i18n.t('GatewayRegister.Assign')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {/* Modals*/}
      <UnitsModal
        visible={showUnitsModal}
        handleSelectUnit={handleSelectUnit}
        handleClose={handleShowUnitsModal}
      />
    </>
  );
}

const Styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#F2F2F7'},
  formContainer: {flex: 1, padding: 30},
  txtTitleForm: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F6F7E',
    marginBottom: 20,
  },
  inputForm: {
    height: 50,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderColor: '#D8DFE7',
    borderWidth: 2,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  btnFormContainer: {alignItems: 'flex-end'},
  btnForm: {
    width: 150,
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtButtonForm: {fontSize: 16, color: '#FFFFFF'},
  lineSeparator: {height: 3, backgroundColor: '#D8DFE7', marginVertical: 10},
  titleUnitContiner: {flex: 1, flexDirection: 'row'},
  selectUnitContainer: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  btnUnitSelect: {
    height: 70,
    marginBottom: 10,
  },
  arrowContainer: {flex: 1, alignItems: 'flex-end'},
  txtSelectButton: {fontSize: 14, color: '#17A0A3'},
  txtUnitSelect: {fontSize: 14, color: '#5F6F7E'},
});

export default GatewayRegisterScreen;
