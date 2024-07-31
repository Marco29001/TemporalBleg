import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import { Appbar, Menu, Switch } from 'react-native-paper'
import StatusBarComp from './StatusBarComp'
import { i18n } from '../assets/locale/i18n'

function HeaderComp({
  title,
  isOptions = false,
  isSwitchActive,
  isSwitchOn,
  onToggleSwitch,
  handleReturn,
}) {
  const navigation = useNavigation()
  const [visible, setVisible] = useState(false)

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)
  const handleOption = () => {
    navigation.replace('AssetTrackingScreen')
  }

  return (
    <>
      <StatusBarComp backgroundColor="#003180" barStyle={'light-content'} />

      <Appbar.Header style={styles.headerContainer}>
        <Appbar.BackAction iconColor="#FFFFFF" onPress={handleReturn} />
        <Appbar.Content titleStyle={styles.txtTitle} title={title} />
        {isOptions && (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity style={styles.buttonOption} onPress={openMenu}>
                <Icon name="more-vert" size={25} color={'#FFFFFF'} />
              </TouchableOpacity>
            }>
            <Menu.Item
              onPress={handleOption}
              title={i18n.t('Header.AssetTracker')}
            />
          </Menu>
        )}
        {isSwitchActive && (
          <Switch
            style={{ marginLeft: 16 }}
            color="#FFFFFF"
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
          />
        )}
      </Appbar.Header>
    </>
  )
}

const styles = StyleSheet.create({
  headerContainer: { backgroundColor: '#003180' },
  txtTitle: {
    fontSize: 22,
    fontFamily: 'Quicksand',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
})

export default HeaderComp
