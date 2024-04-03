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

export function calculateZindex(index, length) {
  let zindex = 0

  if (index == 0) {
    zindex = length * 10
  } else if (index >= 1) {
    zindex = index * 10
  }

  return zindex
}

export function dateFormat(date) {
  const formatDate = moment(date).format('DD/MM/YYYY HH:mm')

  return formatDate
}

//validate data
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

//convert Base64 to object
export function convertBase64ToString(data) {
  try {
    const decodedData = Buffer.from(data, 'base64').toJSON()
    const stringData = String.fromCharCode(...decodedData.data)
    const jsonData = JSON.parse(stringData)

    return jsonData
  } catch (error) {
    console.error('Error al decodificar ', error)
    return null
  }
}

//convert array to MacAddress
export function convertMacAddress(data) {
  const macArray = []

  for (let i = 0; i < data.length; i++) {
    const byteHex = data[i].toString(16).toUpperCase().padStart(2, '0')

    macArray.push(byteHex)
  }

  const macAddress = macArray.join(':')

  return macAddress
}
//------------------------------------------------------------
export function convertBase64ToArray(data) {
  const json = Buffer.from(data, 'base64').toJSON()

  return json.data
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

export function convertHexadecimalToInt(data) {
  let hexadecimal = ''
  data.reverse()
  data.map(value => {
    hexadecimal += value.toString(16).toUpperCase()
  })

  return parseInt(hexadecimal, 16)
}

export function convertDecToFloat(data) {
  data.reverse()
  var buf = new ArrayBuffer(4)
  var view = new DataView(buf)

  if (data.length == 1) {
    num = data[0]

    return num
  }

  data.forEach(function (b, i) {
    view.setUint8(i, b)
  })

  var num = view.getFloat32(0)

  return num
}

export function convertToInt(data) {
  let decimal = null
  data.reverse()
  data.map(value => {
    decimal += value
  })

  return decimal
}

export function convertToString(data) {
  let str = null
  data.reverse()
  data.map(value => {
    str += value
  })

  return str.toString()
}

export function convertDecToHex(data) {
  const stringData = String.fromCharCode(...data)

  return stringData
}

export function searchSequenceSTXETX(currentFlag, data) {
  let stx = -1
  let edx = -1
  let sequence = []
  let stringData = ''

  for (currentFlag; currentFlag < data.length; currentFlag++) {
    if (data[currentFlag] === 2) {
      stx = currentFlag
    } else if (data[currentFlag] === 3) {
      edx = currentFlag
      currentFlag += 1
      break
    }
  }

  if (stx !== -1 && edx !== -1) {
    sequence = data.slice(stx + 1, edx)
    stringData = convertDecToHex(sequence)
  }

  return { currentFlag, stringData }
}

export function sumValuesArray(data) {
  const total = data.reduce((a, b) => a + b, 0)

  return total
}

export function EmptyObjectValidate(data) {
  if (typeof data === 'object') {
    return null
  } else {
    return data
  }
}
