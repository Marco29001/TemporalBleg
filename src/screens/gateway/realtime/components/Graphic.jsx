import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

export const Graphic = ({ref}) => {
  const sourceUri =
    Platform.OS === 'android'
      ? 'file:///android_asset/html/index.html'
      : 'Web.bundle/site/index.html';

  return (
    <WebView
      style={Styles.mainContainer}
      ref={r => (ref.current = r)}
      originWhitelist={['*']}
      javaScriptEnabled={true}
      setBuiltInZoomControls={false}
      bounces={false}
      textInteractionEnabled={false}
      onMessage={event => {
        console.log(event.nativeEvent.data);
      }}
      source={{uri: sourceUri}}
    />
  );
};

const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
