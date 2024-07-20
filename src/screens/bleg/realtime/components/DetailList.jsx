import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View, Text } from 'react-native'
import moment from 'moment'
import { Divider } from 'react-native-paper'

export const DetailList = ({ variable }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (variable) {
      let updateHistory = variable.history.map(history => {
        let dateObject = new Date(history.x)
        let date = moment(dateObject).format('DD/MM/YYYY HH:mm:ss')
        //console.log('date', date)

        return { ...history, x: date }
      })

      setData(updateHistory.reverse())
    }
  }, [variable])

  return (
    <View style={styles.mainContainer}>
      <FlatList
        style={styles.list}
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <>
              <View style={styles.mainContainer}>
                <View style={styles.item}>
                  <View style={styles.itemDate}>
                    <Text style={styles.textItem}>{item.x}</Text>
                  </View>
                  <View style={styles.itemValue}>
                    <Text style={styles.textItem}>
                      {item.y + ' ' + variable.unit}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider style={{ height: 2 }} bold={true} />
            </>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: { flex: 1, paddingHorizontal: 15 },
  item: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  itemDate: {
    flex: 2,
    flexDirection: 'row',
  },
  itemValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  textItem: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000000',
  },
})
