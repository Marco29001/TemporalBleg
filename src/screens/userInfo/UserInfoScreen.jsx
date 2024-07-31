import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import HeaderComp from '../../components/HeaderComp'
import BlegIcon from '../../assets/icons/customIcons/BlegIcon'
import { useGlobalContext } from '../../context/GlobalContext'
import { i18n } from '../../assets/locale/i18n'

function UserInfoScreen(props) {
  const { userSession } = useGlobalContext()
  const appVersion = DeviceInfo.getVersion()

  const handleReturn = () => {
    props.navigation.replace('TabBarNavigator', {
      screen: props.route.params.toScreen,
    })
  }

  return (
    <>
      <HeaderComp title={''} handleReturn={handleReturn} />

      <View style={Styles.mainContent}>
        <View style={Styles.infoContent}>
          <View style={Styles.iconUserContent}>
            <BlegIcon name="icon_user" color={'#97A4B0'} size={40} />
          </View>
          <View style={Styles.userEmailContent}>
            <Text style={Styles.txtUserEmail}>{userSession.email}</Text>
          </View>
          <View style={Styles.lineSeparator} />
          <Text style={Styles.txtTitleInfo}>
            {i18n.t('UserProfile.Database')}:
          </Text>
          <Text style={Styles.txtInfo}>{userSession.database}</Text>
          <Text style={Styles.txtTitleInfo}>
            {i18n.t('UserProfile.VersionApp')}:
          </Text>
          <Text style={Styles.txtInfo}>{appVersion}</Text>
        </View>
      </View>
    </>
  )
}

const Styles = StyleSheet.create({
  mainContent: { flex: 1, backgroundColor: '#F2F2F7', paddingHorizontal: 20 },
  infoContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: -8,
    paddingHorizontal: 15,
  },
  iconUserContent: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 80,
    marginTop: -15,
    elevation: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userEmailContent: { alignItems: 'center', marginVertical: 10 },
  txtUserEmail: { fontSize: 16, color: '#5F6F7E' },
  lineSeparator: { height: 3, backgroundColor: '#E4E7E9', marginVertical: 10 },
  txtTitleInfo: { fontSize: 16, color: '#004A98' },
  txtInfo: { fontSize: 16, color: '#97A4B0', marginLeft: 15, marginBottom: 10 },
})

export default UserInfoScreen
