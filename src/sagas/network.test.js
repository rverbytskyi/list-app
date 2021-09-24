import { expectSaga } from 'redux-saga-test-plan'
import { Platform } from 'react-native'
import NetInfo from '@react-native-community/netinfo'

import {
  CONNECTED_TO_INTERNET,
  DISCONNECTED_FROM_INTERNET,
} from '../types/network'
import {
  networkListenSaga,
  fetchNetworkState,
  networkEventChannel,
} from './network'

const provideDelay = ({ fn }, next) => (fn.name === 'delayP' ? null : next())

function provideEvent(event) {
  let consumed = false

  return {
    take({ channel }, next) {
      if (channel === networkEventChannel && !consumed) {
        consumed = true
        return event
      }

      return next()
    },
  }
}
const disconnectEvent = {
  isInternetReachable: false,
  isConnected: true,
}
const unknownStateEvent = {
  isInternetReachable: null,
  isConnected: true,
}
const connectEvent = {
  isInternetReachable: true,
  isConnected: true,
}

Platform.OS = 'android'

describe('test network sagas', () => {
  it('handles disconnection event', async () =>
    expectSaga(networkListenSaga)
      .put({
        type: DISCONNECTED_FROM_INTERNET,
      })
      .spawn(fetchNetworkState)
      .provide([
        provideEvent(disconnectEvent),
        {
          spawn(effect, next) {
            if (effect === fetchNetworkState) {
              next()
            }
          },
        },
      ])
      .run())
  it('handles unknown event', async () =>
    expectSaga(networkListenSaga)
      .put({
        type: CONNECTED_TO_INTERNET,
      })
      .provide([
        provideEvent(unknownStateEvent),
        {
          spawn(effect, next) {
            if (effect === fetchNetworkState) {
              next()
            }
          },
        },
      ])
      .run())
  it('handles connection event', async () =>
    expectSaga(networkListenSaga)
      .put({
        type: CONNECTED_TO_INTERNET,
      })
      .provide([
        provideEvent(connectEvent),
        {
          spawn(effect, next) {
            if (effect === fetchNetworkState) next()
          },
        },
      ])
      .run())
  it('handles fetch network event', async () => {
    await expectSaga(fetchNetworkState)
      .provide([{ call: provideDelay }])
      .run()
    expect(NetInfo.fetch).toBeCalled()
  })
})
