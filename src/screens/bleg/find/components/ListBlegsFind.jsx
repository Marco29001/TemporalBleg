import React from 'react'
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { i18n } from '../../../../assets/locale/i18n'
import SignalComp from '../../../../components/SignalComp'

function ListBlegsFind({ blegs, handleBlegSelect }) {
  return (
    <View style={styles.mainContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={blegs}
        renderItem={({ item, index }) => {
          let itemNum = index + 1
          const signalRssi = item.rssi * -1
          const itemStyle =
            blegs.length == 1
              ? oneItem
              : index == 0
              ? firtsItem
              : itemNum == blegs.length
              ? latestItem
              : styles.item

          return (
            <>
              <TouchableOpacity
                key={index}
                style={itemStyle}
                onPress={() => handleBlegSelect(item)}>
                <View style={styles.mainItemContainer}>
                  <View style={styles.iconBlegContainer}>
                    <SignalComp signalRssi={signalRssi} size={20} />
                  </View>
                  <View style={styles.infoBlegContainer}>
                    <Text style={styles.txtTitleBleg}>
                      {item.name ? item?.name : item?.localName}
                    </Text>
                    <Text style={styles.txtSubtitleBleg}>{item?.id}</Text>
                    <Text style={styles.txtSubtitleBleg}>
                      {i18n.t('BlegFind.Unit')}: {item?.device?.name ?? '-'}
                    </Text>
                    <Text style={styles.txtSubtitleBleg}>
                      {i18n.t('BlegFind.NoSerieGo')}:{' '}
                      {item?.device?.serialNumber ?? '-'}
                    </Text>
                  </View>
                  <View style={styles.countSensorsContainer}>
                    <Text style={styles.txtSensors}>
                      {item?.totalSensors ?? '-'}
                    </Text>
                    <Text style={styles.txtTitleSensors}>
                      {i18n.t('BlegFind.Sensors')}
                    </Text>
                  </View>
                </View>
                {itemNum != blegs.length && <View style={styles.divisorLine} />}
              </TouchableOpacity>
            </>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  item: { height: 110, backgroundColor: '#FFFFFF', padding: 15 },
  firtsItem: { borderTopStartRadius: 16, borderTopEndRadius: 16 },
  latestItem: { borderBottomStartRadius: 16, borderBottomEndRadius: 16 },
  mainItemContainer: { flexDirection: 'row' },
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
    flex: 0.4,
    borderRadius: 16,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtSensors: { fontSize: 16, fontWeight: 'bold', color: '#46B7AE' },
  txtTitleSensors: { fontSize: 16, color: '#5F6F7E' },
  divisorLine: { height: 3, backgroundColor: '#D8DFE7', marginTop: 10 },
})

const firtsItem = StyleSheet.compose(styles.item, styles.firtsItem)
const latestItem = StyleSheet.compose(styles.item, styles.latestItem)
const oneItem = StyleSheet.flatten([
  styles.item,
  styles.firtsItem,
  styles.latestItem,
])

export default ListBlegsFind
