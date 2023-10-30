import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

function LoadingModal({visible}) {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      statusBarTranslucent={true}>
      <View style={styles.containerModal}>
        <LottieView
          width={200}
          height={200}
          source={require('../assets/animations/circular.json')}
          autoPlay
          loop
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingModal;
