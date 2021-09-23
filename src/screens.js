import { Navigation } from 'react-native-navigation'

import App from './screens/App'

export function registerScreens() {
  Navigation.registerComponent('welcomeScreen', () => App)
}
