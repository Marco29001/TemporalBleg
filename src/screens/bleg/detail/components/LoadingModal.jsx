import React from 'react'
import { View, Text, Modal, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'

function LoadingModal({ open, message }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      statusBarTranslucent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.centerModalContainer}>
          <View style={styles.lottieContainer}>
            <LottieView
              width={150}
              height={150}
              source={require('../../../../assets/animations/circular.json')}
              autoPlay
              loop
            />
          </View>
          <Text style={styles.txtMessage}>{message}</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerModalContainer: {
    width: 250,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
  },
  lottieContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  txtMessage: { fontSize: 20, color: '#5F6F7E', textAlign: 'center' },
})

export default LoadingModal
