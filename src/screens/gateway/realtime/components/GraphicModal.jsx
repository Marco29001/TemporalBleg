import React, {useEffect, useRef} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon';
import moment from 'moment';
import {DetailList} from './DetailList';

const Tab = createMaterialTopTabNavigator();

function GraphicsModal({variable, handleClose}) {
  const webRef = useRef(null);
  const sourceUri =
    Platform.OS === 'android'
      ? 'file:///android_asset/html/index.html'
      : 'Web.bundle/site/index.html';

  const filterHistory = history => {
    const currentDate = moment(
      history[history.length - 1][0],
      'YYYY-MM-DD HH:mm:ss',
    );

    const fiveMinutesAgo = currentDate.clone().subtract(1, 'minutes');

    return history.filter(entry =>
      moment(entry[0], 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(fiveMinutesAgo),
    );
  };

  useEffect(() => {
    if (variable && webRef.current) {
      let history = filterHistory(variable.history);
      webRef.current.postMessage(JSON.stringify(history));
    }
  }, [variable, webRef.current]);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={variable ? true : false}>
        <View style={Styles.mainContainer}>
          <View style={Styles.headerContent}>
            <View style={Styles.returnContainer}>
              <TouchableOpacity
                style={Styles.btnCloseModal}
                onPress={handleClose}>
                <BlegIcon name={'icon_return'} color={'#FFFFFF'} size={25} />
              </TouchableOpacity>
              <View style={Styles.titleContainer}>
                <Text style={Styles.txtTitle}>{variable?.name}</Text>
              </View>
            </View>
            <View style={Styles.subtitleContainer}>
              <Text style={Styles.txtSubtitle}>
                {variable?.value + ' ' + variable?.unit}
              </Text>
            </View>
          </View>
          <View style={Styles.graphicContent}>
            <Tab.Navigator
              screenOptions={{
                swipeEnabled: false,
                tabBarPressColor: '#46B7AE',
                tabBarInactiveTintColor: '#666666',
                tabBarActiveTintColor: '#46B7AE',
                tabBarLabelStyle: {fontSize: 14},
                tabBarStyle: {
                  backgroundColor: 'rgba(221, 221, 221, 1)',
                  height: 40,
                },
              }}>
              <Tab.Screen
                name="Graphic"
                options={{
                  tabBarLabel: 'Gráfica',
                }}>
                {() => (
                  <WebView
                    style={Styles.mainContainer}
                    ref={r => (webRef.current = r)}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    setBuiltInZoomControls={false}
                    bounces={false}
                    textInteractionEnabled={false}
                    onMessage={event => {
                      //console.log(event.nativeEvent.data);
                    }}
                    source={{uri: sourceUri}}
                  />
                )}
              </Tab.Screen>
              <Tab.Screen
                name="DetailSensor"
                options={{
                  tabBarLabel: 'Detalle',
                }}>
                {() => (
                  <DetailList
                    history={variable?.history}
                    unit={variable?.unit}
                  />
                )}
              </Tab.Screen>
            </Tab.Navigator>
          </View>
        </View>
      </Modal>
    </>
  );
}

const {width, height} = Dimensions.get('window');
const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flex: 0.15,
    backgroundColor: '#003180',
  },
  returnContainer: {flex: 1, flexDirection: 'row'},
  btnCloseModal: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtSubtitle: {
    fontSize: 25,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  textVariable: {fontSize: 18, fontWeight: '700', color: '#FFFFFF'},
  graphicContent: {flex: 1},
});

export default GraphicsModal;
