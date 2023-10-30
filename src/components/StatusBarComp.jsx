import React from 'react';
import {View, StatusBar, StyleSheet, Platform} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

function StatusBarComp(props) {
  const isFocused = useIsFocused();

  return (
    isFocused && (
      <View style={styles.barHeight(props)}>
        <StatusBar {...props} />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  barHeight: props => {
    const backgroundColor = props.backgroundColor;
    const height = Platform.OS == 'ios' ? 24 : 0;
    return {
      height: height,
      backgroundColor: backgroundColor,
    };
  },
});

export default StatusBarComp;
