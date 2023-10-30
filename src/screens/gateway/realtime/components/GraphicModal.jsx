import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon';

function GraphicsModal(props) {
  const {modalVisible, variable, max, min, handleClose} = props;
  const [showReturnButton, setShowReturnButton] = useState(true);
  const webRef = useRef(null);

  const sourceUri =
    Platform.OS === 'android'
      ? 'file:///android_asset/html/index.html'
      : 'web.budle/site/index.html';

  const scriptSetValue = (variableName, variableValue) => {
    return `
      document.getElementById("variableName").innerHTML = "${variableName}";
      document.getElementById("variableValue").innerHTML = "${variableValue}";
      document.getElementById("max").innerHTML = "${max}";
      document.getElementById("min").innerHTML = "${min}";
    `;
  };

  useEffect(() => {
    if (variable && modalVisible) {
      webRef.current.injectJavaScript(
        scriptSetValue(variable?.name, variable?.value + ' ' + variable?.unit),
      );
      webRef.current.postMessage(`${variable.value}`);
    }
  }, [variable]);

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={Styles.modalContainer}>
        <View style={Styles.centerModalContainer}>
          {showReturnButton && (
            <TouchableOpacity
              style={Styles.btnCloseModal}
              onPress={handleClose}>
              <BlegIcon name={'icon_return'} color={'#FFFFFF'} size={25} />
            </TouchableOpacity>
          )}

          <View style={Styles.graphicContent}>
            <WebView
              ref={r => (webRef.current = r)}
              originWhitelist={['*']}
              javaScriptEnabled={true}
              setBuiltInZoomControls={false}
              onMessage={event => {
                if (event.nativeEvent.data == 'History') {
                  setShowReturnButton(!showReturnButton);
                } else {
                  console.log(event.nativeEvent.data);
                }
              }}
              source={{uri: sourceUri}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const {width, height} = Dimensions.get('window');
const Styles = StyleSheet.create({
  container: {backgroundColor: '#FFFFFF', justifyContent: 'center'},
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerModalContainer: {
    width: width,
    height: height,
    backgroundColor: '#FFFFFF',
  },
  closeModal: {
    flex: 0.3,
    backgroundColor: '#003180',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  btnCloseModal: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtTitleData: {fontSize: 40, color: '#5F6F7E'},
  txtData: {fontSize: 65, fontWeight: 'bold', color: '#17A0A3', marginTop: 30},
  graphicContent: {flex: 2},
  maxandminContainer: {
    width: width,
    height: 60,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
  },
  minContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  maxContainer: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'flex-end',
  },
  txtTitleMaxOrMin: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#17A0A3',
    marginVertical: 2,
  },
  txtInfo: {fontSize: 16, fontWeight: 'bold', color: '#003180'},
});

export default GraphicsModal;
