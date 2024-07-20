import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

function Loading() {
  return (
    <View style={styles.listLoading}>
      <LottieView
        width={150}
        height={150}
        source={require('../../../../assets/animations/circular.json')}
        autoPlay
        loop
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listLoading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default Loading;
