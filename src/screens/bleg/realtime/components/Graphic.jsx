import React, { useEffect, useRef, useState } from 'react'
import { Platform, StyleSheet } from 'react-native'
import WebView from 'react-native-webview'
import { selectVariableObserver } from '../../../../redux/slices/sensorsSlice'
import { useSelector } from 'react-redux'
import { i18n } from '../../../../assets/locale/i18n'

export const Graphic = () => {
  const webRef = useRef(null)
  const [isCreatedChart, setIsCreatedChart] = useState(false)
  const variableObserver = useSelector(selectVariableObserver)
  const sourceUri =
    Platform.OS === 'android'
      ? 'file:///android_asset/html/index.html'
      : 'Web.bundle/site/index.html'

  useEffect(() => {
    if (variableObserver && !isCreatedChart) {
      webRef.current.postMessage(
        JSON.stringify({
          type: 'initialData',
          data: variableObserver.history,
          serieName:
            i18n._locale == 'es'
              ? variableObserver.name
              : variableObserver.nameEn,
          unit: variableObserver.unit,
        }),
      )
    }
  }, [variableObserver, isCreatedChart, webRef.current])

  useEffect(() => {
    if (isCreatedChart) {
      webRef.current.postMessage(
        JSON.stringify({
          type: 'addNewPoint',
          data: variableObserver.history[variableObserver.history.length - 1],
        }),
      )
    }
  }, [variableObserver])

  return (
    <>
      <WebView
        style={Styles.mainContainer}
        ref={r => (webRef.current = r)}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        setBuiltInZoomControls={false}
        bounces={false}
        textInteractionEnabled={false}
        incognito={true}
        onMessage={event => {
          console.log(event.nativeEvent.data)
          if (event.nativeEvent.data == 'createdChart') {
            setIsCreatedChart(true)
          }
        }}
        source={{ uri: sourceUri }}
      />
    </>
  )
}

const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
})
