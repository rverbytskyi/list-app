import React from 'react'
import { Provider } from 'react-redux'

import store from '../../store'

export default function (Component) {
  return (props) => (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  )
}
