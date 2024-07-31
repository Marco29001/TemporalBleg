import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectOpenHistory,
  selectVariableObserver,
  setOpenHistory,
  setVariableObserver,
} from '../../../../redux/slices/sensorsSlice'
import { Graphic } from './Graphic'
import { DetailList } from './DetailList'
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon'
import { i18n } from '../../../../assets/locale/i18n'

const Tab = createMaterialTopTabNavigator()

function History() {
  const dispatch = useDispatch()
  const open = useSelector(selectOpenHistory)
  const variableObserver = useSelector(selectVariableObserver)

  const handleClose = () => {
    dispatch(setVariableObserver(null))
    dispatch(setOpenHistory(false))
  }

  if (!variableObserver) {
    return null
  }

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={open}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContent}>
            <View style={styles.closeContainer}>
              <TouchableOpacity
                style={styles.btnCloseModal}
                onPress={handleClose}>
                <BlegIcon name={'icon_return'} color={'#FFFFFF'} size={25} />
              </TouchableOpacity>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.txtTitle}>
                {i18n._locale == 'es'
                  ? variableObserver.name
                  : variableObserver.nameEn}
              </Text>
              <Text style={styles.txtSubtitle}>
                {variableObserver.history[variableObserver.history.length - 1]
                  .y +
                  ' ' +
                  variableObserver.unit}
              </Text>
            </View>
          </View>
          <View style={styles.graphicContent}>
            <Tab.Navigator
              screenOptions={{
                swipeEnabled: false,
                tabBarPressColor: '#46B7AE',
                tabBarInactiveTintColor: '#666666',
                tabBarActiveTintColor: '#46B7AE',
                tabBarLabelStyle: { fontSize: 14 },
                tabBarStyle: {
                  backgroundColor: '#FFFFFF',
                  height: 40,
                },
              }}>
              <Tab.Screen
                name="Graphic"
                options={{
                  tabBarLabel: i18n.t('History.Graphic'),
                }}>
                {() => <Graphic />}
              </Tab.Screen>
              <Tab.Screen
                name="Detail"
                options={{
                  tabBarLabel: i18n.t('History.Detail'),
                }}>
                {() => <DetailList variable={variableObserver} />}
              </Tab.Screen>
            </Tab.Navigator>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flex: 0.15,
    flexDirection: 'row',
    backgroundColor: '#003180',
  },
  closeContainer: { flex: 0.1 },
  btnCloseModal: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  txtTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  txtSubtitle: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 10,
  },
  graphicContent: { flex: 1 },
})

export default History
