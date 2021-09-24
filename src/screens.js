import { Navigation } from 'react-native-navigation'

import App from './screens/App'

import reduxWrapper from './wrappers/ReduxWrapper'

export function registerScreens() {
  Navigation.registerComponent(
    'welcomeScreen',
    () => reduxWrapper(App),
    () => App
  )
}
