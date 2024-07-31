import Toast from 'react-native-toast-message'
import moment from 'moment'
import { Buffer } from 'buffer'

export const showToastMessage = (type, message) => {
  Toast.show({
    position: 'bottom',
    type,
    props: {
      message,
    },
  })
}

export function dateFormat(date) {
  const formatDate = moment(date).format('DD/MM/YYYY HH:mm:ss')

  return formatDate
}

export function validateMacAddress(valor) {
  let regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  if (regex.test(valor)) {
    return true
  } else {
    showToastMessage('didcomWarningToast', 'Direccion Mac no valida')
    return false
  }
}

export function validateSerialNumber(value) {
  if (value.length == 17) {
    return true
  } else {
    showToastMessage('didcomWarningToast', 'Numero de serie no valido')
    return false
  }
}

export function convertBase64ToString(data) {
  const decodedData = Buffer.from(data, 'base64').toJSON()
  const stringData = String.fromCharCode(...decodedData.data)
  const jsonData = JSON.parse(stringData)

  return jsonData
}

export function convertMacAddress(data) {
  try {
    const macArray = []

    for (let i = 0; i < data.length; i++) {
      const byteHex = data[i].toString(16).toUpperCase().padStart(2, '0')

      macArray.push(byteHex)
    }

    const macAddress = macArray.join(':')

    let isMac = validateMacAddress(macAddress)

    return isMac ? macAddress : null
  } catch (error) {
    console.log('error al obtener mac address', error)
  }
}

export function convertBase64ToHex(data) {
  try {
    if (data == null) return

    const buffer = Buffer.from(data, 'base64')
    const bufString = buffer.toString('hex')

    return bufString.toUpperCase()
  } catch (error) {
    console.log('error', error)
  }
}
