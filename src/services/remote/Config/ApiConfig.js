import axios from 'axios';
import LocalStorage from '../../local/LocalStorage';

const Api = axios.create({
  baseURL: 'https://cloud2.didcom.mx/Services/BluetoothSensorManager',
  headers: {
    'Content-type': 'application/json',
  },
});

//INTERCEPTORS
Api.interceptors.request.use(async config => {
  const user = await LocalStorage.get('user');

  if (user) {
    const user$ = JSON.parse(user);
    config.headers['Authorization'] = 'Bearer ' + user$.token;
  }

  return config;
});

export default Api;
