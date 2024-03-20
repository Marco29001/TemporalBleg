import React from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';

export const DetailList = ({history, unit}) => {
  return (
    <View style={Styles.mainContainer}>
      <FlatList
        style={Styles.list}
        data={history}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <View style={Styles.mainContainer}>
              <View style={Styles.item}>
                <View style={Styles.itemDate}>
                  <Text style={Styles.textItem}>{item[0]}</Text>
                </View>
                <View style={Styles.itemValue}>
                  <Text style={Styles.textItem}>
                    {item[1]} {' ' + unit}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(221, 221, 221, 1)',
  },
  list: {flex: 1, paddingHorizontal: 15},
  item: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 5,
    marginVertical: 5,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  itemDate: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  itemValue: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
  },
  textItem: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000000',
    marginLeft: 10,
  },
});
