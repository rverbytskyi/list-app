import { LogBox } from 'react-native'
import { Navigation } from 'react-native-navigation'

import { registerScreens } from './src/screens'
import { setNavigationRoot } from './src/navigation'
import { runSagas } from './src/store'

LogBox.ignoreLogs([
  'Remote debugger is in a background tab which may cause apps to perform slowly. Fix this by foregrounding the tab (or opening it in a separate window).',
  // Warnings appear after calling Navigation.pop()
  'Possible Unhandled Promise Rejection',
])

Navigation.events().registerAppLaunchedListener(() => {
  registerScreens()
  runSagas()
  setNavigationRoot()
})
