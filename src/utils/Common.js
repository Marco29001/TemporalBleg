import Toast from 'react-native-toast-message';
import {Buffer} from 'buffer';

export const showToastMessage = (type, message) => {
  Toast.show({
    position: 'bottom',
    type,
    props: {
      message,
    },
  });
};

export function calculateZindex(index, length) {
  let zindex = 0;

  if (index == 0) {
    zindex = length * 10;
  } else if (index >= 1) {
    zindex = index * 10;
  }

  return zindex;
}

//validate data
export function validateMacAddress(valor) {
  let regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  if (regex.test(valor)) {
    return true;
  } else {
    showToastMessage('didcomWarningToast', 'Direccion Mac no valida');
    return false;
  }
}

export function validateSerialNumber(value) {
  if (value.length == 17) {
    return true;
  } else {
    showToastMessage('didcomWarningToast', 'Numero de serie no valido');
    return false;
  }
}

export function sumValuesArray(data) {
  const total = data.reduce((a, b) => a + b, 0);

  return total;
}

export function searchSequenceSTXETX(currentFlag, data) {
  let stx = -1;
  let edx = -1;
  let sequence = [];
  let stringData = '';

  for (currentFlag; currentFlag < data.length; currentFlag++) {
    if (data[currentFlag] === 2) {
      stx = currentFlag;
    } else if (data[currentFlag] === 3) {
      edx = currentFlag;
      currentFlag += 1;
      break;
    }
  }

  if (stx !== -1 && edx !== -1) {
    sequence = data.slice(stx + 1, edx);
    stringData = convertDecToHex(sequence);
  }

  return {currentFlag, stringData};
}

//convert data
export function convertBase64ToArray(data) {
  const json = Buffer.from(data, 'base64').toJSON();

  return json.data;
}

export function convertBase64ToHex(data) {
  const buffer = Buffer.from(data, 'base64');
  const bufString = buffer.toString('hex');

  return bufString.toUpperCase();
}

export function convertHexadecimalToInt(data) {
  let hexadecimal = '';
  data.reverse();
  data.map(value => {
    hexadecimal += value.toString(16).toUpperCase();
  });

  return parseInt(hexadecimal, 16);
}

export function convertDecToFloat(data) {
  data.reverse();
  var buf = new ArrayBuffer(4);
  var view = new DataView(buf);

  data.forEach(function (b, i) {
    view.setUint8(i, b);
  });

  var num = view.getFloat32(0);

  return num;
}

export function convertToInt(data) {
  let decimal = null;
  data.reverse();
  data.map(value => {
    decimal += value;
  });

  return decimal;
}

export function convertToString(data) {
  let str = null;
  data.reverse();
  data.map(value => {
    str += value;
  });

  return str.toString();
}

export function convertMacAddreess(data) {
  const macArray = [];

  for (let i = 0; i < data.length; i++) {
    const byteHex = data[i].toString(16).toUpperCase().padStart(2, '0');

    macArray.push(byteHex);
  }

  const macAddress = macArray.join(':');

  return macAddress;
}

export function convertDecToHex(data) {
  const stringData = String.fromCharCode(...data);

  return stringData;
}
