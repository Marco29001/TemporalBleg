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
      : 'Web.bundle/site/index.html';

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
    <>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={Styles.centerModalContainer}>
          <View style={Styles.graphicContent}>
            <View style={Styles.headerContent} />
            {showReturnButton && (
              <TouchableOpacity
                style={Styles.btnCloseModal}
                onPress={handleClose}>
                <BlegIcon name={'icon_return'} color={'#FFFFFF'} size={25} />
              </TouchableOpacity>
            )}
            <WebView
              ref={r => (webRef.current = r)}
              originWhitelist={['*']}
              javaScriptEnabled={true}
              setBuiltInZoomControls={false}
              bounces={false}
              textInteractionEnabled={false}
              source={{uri: sourceUri}}
              onMessage={event => {
                if (event.nativeEvent.data == 'History') {
                  setShowReturnButton(!showReturnButton);
                } else {
                  console.log(event.nativeEvent.data);
                }
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const {width, height} = Dimensions.get('window');
const Styles = StyleSheet.create({
  headerContent: {
    height: 50,
    backgroundColor: '#003180',
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
    top: 60,
    left: 10,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicContent: {flex: 2},
});

export default GraphicsModal;
