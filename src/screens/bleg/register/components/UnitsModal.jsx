import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { i18n } from '../../../../assets/locale/i18n'
import { getDevices } from '../../../../services/remote/DeviceServices'
import useApiRequest from '../../../../hooks/useApiRequest'
import useSearch from '../../../../hooks/useSearch'
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon'
import ListEmptyComp from '../../../../components/ListEmptyComp'
import LoadingModal from '../../../../components/LoadingModal'

function UnitsModal({ visible, handleSelectUnit, handleClose }) {
  const [units, setUnits] = useState([])
  const { search, filtered, onChangeSearch } = useSearch(
    'serialNumber',
    'name',
    units,
  )
  const { loading, error, callEndpoint } = useApiRequest()

  const refreshUnits = async () => {
    const response = await callEndpoint(getDevices())
    if (response) {
      setUnits(response)
    }
  }

  useEffect(() => {
    if (visible) {
      refreshUnits()
    } else {
      setUnits([])
      onChangeSearch('')
    }
  }, [visible])

  if (loading) {
    return <LoadingModal visible={loading} />
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.centerModalContainer}>
          <View style={styles.headerModalContainer}>
            <Text style={styles.txtTitle}>
              {i18n.t('BlegRegister.SelectUnit')}
            </Text>
            <View style={styles.closeContainer}>
              <TouchableOpacity
                styles={styles.btnCloseModal}
                onPress={handleClose}>
                <BlegIcon name={'icon_close'} color={'#FFFFFF'} size={30} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchInputContent}>
            <BlegIcon name="icon_search" color={'#46B7AE'} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder={i18n.t('BlegRegister.Search')}
              placeholderTextColor={'#5F6F7E'}
              keyboardType={'default'}
              value={search}
              onChangeText={text => onChangeSearch(text)}
            />
          </View>

          {error || filtered.length == 0 ? (
            <ListEmptyComp
              icon={'icon_bus'}
              message={
                error ? error.message : i18n.t('BlegRegister.NoSearchUnit')
              }
              handleRefresh={refreshUnits}
            />
          ) : (
            <FlatList
              style={styles.list}
              showsVerticalScrollIndicator={false}
              data={filtered}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.itemContainer}
                    onPress={() => handleSelectUnit(item)}>
                    <View style={styles.iconDeviceContainer}>
                      <BlegIcon name="icon_bus" color={'#17A0A3'} size={30} />
                    </View>
                    <View style={styles.infoDeviceContainer}>
                      <Text style={styles.txtTitleItem}>{item.name}</Text>
                      <Text style={styles.txtSubtitleItem}>
                        {i18n.t('BlegRegister.NoSerieGo')}: {item.serialNumber}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refreshUnits} />
              }
            />
          )}
        </View>
      </View>
    </Modal>
  )
}

const { height } = Dimensions.get('window')
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  centerModalContainer: {
    height: height / 1.3,
    backgroundColor: '#003180',
    borderRadius: 15,
  },
  headerModalContainer: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  txtTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  closeContainer: { flex: 0.1 },
  btnCloseModal: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //search
  searchInputContent: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 15,
    paddingHorizontal: 10,
    margin: 15,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingHorizontal: 10,
  },
  //List
  list: { flex: 2, paddingHorizontal: 15 },
  itemContainer: {
    height: 80,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 10,
  },
  iconDeviceContainer: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoDeviceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  txtTitleItem: { fontSize: 16, fontWeight: 'bold', color: '#5F6F7E' },
  txtSubtitleItem: { fontSize: 14, color: '#92A2B0' },
})

export default UnitsModal
