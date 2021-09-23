import { Navigation } from 'react-native-navigation'

export function setNavigationRoot() {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'welcomeScreen',
            },
          },
        ],
      },
    },
  })
}
