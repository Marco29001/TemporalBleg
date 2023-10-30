import AsyncStorage from '@react-native-async-storage/async-storage';

const LocalStorage = {
  set: (key, value) => AsyncStorage.setItem(key, value),
  get: key => AsyncStorage.getItem(key),
  delete: key => AsyncStorage.removeItem(key),
};

export default LocalStorage;
