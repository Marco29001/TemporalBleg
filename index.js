import 'react-native-url-polyfill/auto'
import { AppRegistry, LogBox } from 'react-native'
import App from './App'
import { name as appName } from './app.json'

LogBox.ignoreLogs(['SerializableStateInvariantMiddleware'])

AppRegistry.registerComponent(appName, () => App)
