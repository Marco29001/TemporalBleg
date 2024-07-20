import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import BlegIcon from '../assets/icons/customIcons/BlegIcon'

const CustomTextInput = ({
  icon,
  placeHolder,
  property,
  keyboardType,
  secure = false,
  value,
  onChangeText,
  handleSecure = () => {},
  error,
}) => {
  const [isPresed, setIsPresed] = useState(false)

  const onFocus = () => {
    setIsPresed(true)
  }

  const onBlur = () => {
    setIsPresed(false)
  }

  return (
    <View style={Styles.inputContainer(error)}>
      <BlegIcon
        name={icon}
        color={isPresed ? '#17A0A3' : '#003180'}
        size={25}
      />
      <TextInput
        style={Styles.input}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeHolder}
        placeholderTextColor={'#5F6F7E'}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        value={value}
        onChangeText={text => onChangeText(property, text)}
      />
      {property == 'password' ? (
        <TouchableOpacity style={Styles.btnPassword} onPress={handleSecure}>
          <BlegIcon
            name={secure ? 'icon_eye_close' : 'icon_eye_open'}
            color={'#003180'}
            size={25}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const Styles = StyleSheet.create({
  inputContainer: error => {
    const borderColor = error ? 'red' : '#004A98'
    return {
      height: 50,
      flexDirection: 'row',
      borderWidth: 3,
      borderRadius: 10,
      borderColor: borderColor,
      paddingHorizontal: 10,
      marginVertical: 10,
      alignItems: 'center',
    }
  },
  input: { flex: 1, fontSize: 16, color: '#000000', paddingHorizontal: 10 },
  btnPassword: {
    width: 50,
    height: 40,
    borderLeftWidth: 1,
    borderLeftColor: '#5F6F7E',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CustomTextInput
