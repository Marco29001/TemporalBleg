import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native'
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon'
import { Graphic } from './Graphic'

const Tab = createMaterialTopTabNavigator()

function History({ variable, handleClose }) {
  const [variableActualValue, setVariableActualValue] = useState(0)

  useEffect(() => {
    if (variable) {
      setVariableActualValue(variable.history[variable.history.length - 1].y)
    }
  }, [variable])

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
                {variableActualValue + ' ' + variable?.unit}
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
                tabBarLabelStyle: { fontSize: 14 },
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
                {() => <Graphic variable={variable} />}
              </Tab.Screen>
            </Tab.Navigator>
          </View>
        </View>
      </Modal>
    </>
  )
}

const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flex: 0.15,
    backgroundColor: '#003180',
  },
  returnContainer: { flex: 1, flexDirection: 'row' },
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
  textVariable: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  graphicContent: { flex: 1 },
})

export default History
