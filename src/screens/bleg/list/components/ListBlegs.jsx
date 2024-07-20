import React from 'react'
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { i18n } from '../../../../assets/locale/i18n'
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon'
import ListEmptyComp from '../../../../components/ListEmptyComp'
import BlegStatusIcon from '../../../../components/BlegStatusIcon'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { createBleg } from '../../../../redux/slices/blegSlice'

function ListBlegs(props) {
  const navigation = useNavigation()
  const { Blegs, loading, onRefresh, handleRegister } = props
  const dispatch = useDispatch()

  const handleItem = item => () => {
    dispatch(createBleg(item))
    navigation.replace('BlegDetailScreen')
  }

  if (loading) {
    return null
  }

  if (Blegs.length == 0) {
    return (
      <ListEmptyComp
        icon={'icon_Bleg'}
        handleRefresh={onRefresh}
        message={i18n.t('BlegList.EmptyBleg')}
      />
    )
  }

  return (
    <View style={styles.mainContainer}>
      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={Blegs}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={styles.item} onPress={handleItem(item)}>
              <View style={styles.leftItemContainer}>
                <View style={styles.iconBlegContainer}>
                  <BlegStatusIcon
                    url={item.statusSync.icon}
                    size={25}
                    fill={item.statusSync.color}
                  />
                </View>
                <View style={styles.infoBlegContainer}>
                  <Text style={styles.txtTitleBleg}>{item?.serialNumber}</Text>
                  <Text style={styles.txtSubtitleBleg}>
                    {i18n.t('BlegList.Unit')}:{item.device?.name ?? ''}
                  </Text>
                  <Text style={styles.txtSubtitleBleg}>
                    {i18n.t('BlegList.NoSerieGo')}:
                    {item.device?.serialNumber ?? ''}
                  </Text>
                </View>
              </View>
              <View style={styles.countSensorsContainer}>
                <Text style={styles.txtSensors}>{item?.totalSensors}</Text>
                <Text style={styles.txtTitleSensors}>
                  {i18n.t('BlegList.Sensors')}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        style={styles.addBlegContainer}
        onPress={handleRegister}>
        <BlegIcon name="icon_plus" color={'#FFFFFF'} size={25} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  list: { flex: 1 },
  listEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  txtListEmpty: {
    fontSize: 16,
    color: '#C2CACE',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonRefresh: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#003180',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: { height: 90, flexDirection: 'row', elevation: 15, marginBottom: 15 },
  leftItemContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  iconBlegContainer: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBlegContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  txtTitleBleg: { fontSize: 16, fontWeight: 'bold', color: '#5F6F7E' },
  txtSubtitleBleg: { fontSize: 14, color: '#92A2B0' },
  countSensorsContainer: {
    flex: 0.3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtSensors: { fontSize: 16, fontWeight: 'bold', color: '#46B7AE' },
  txtTitleSensors: { fontSize: 16, color: '#5F6F7E' },
  addBlegContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#46B7AE',
    borderRadius: 16,
    position: 'absolute',
    right: 5,
    bottom: 50,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ListBlegs
