import React from 'react';
import {View, Text, Image} from 'react-native';

export default function DidcomToast(props) {
  const {image, color, message} = props;

  return (
    <View
      style={{
        zIndex: 1,
        height: 53,
        width: '82%',
        flexDirection: 'row',
        borderRadius: 10,
      }}>
      <View
        style={{
          width: '20%',
          backgroundColor: color,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{width: 30, height: 30}}>
          <Image
            style={{
              flex: 1,
              width: null,
              height: null,
              resizeMode: 'contain',
            }}
            source={image}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          paddingLeft: 10,
        }}>
        <Text style={{color: '#534C4C', fontWeight: 'bold'}}>
          {/*message.length > 35 ? message.slice(0, 34).concat('...') : message*/}
          {message}
        </Text>
      </View>
    </View>
  );
}
