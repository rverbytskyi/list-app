import { take, put, delay, spawn } from 'redux-saga/effects'
import { eventChannel, buffers } from 'redux-saga'
import NetInfo from '@react-native-community/netinfo'
import Emitter from 'tiny-emitter'
import { Platform } from 'react-native'

import {
  CONNECTED_TO_INTERNET,
  DISCONNECTED_FROM_INTERNET,
} from '../types/network'

const networkEmitter = new Emitter()

/**
 * saga to listen internet connection change events
 */
export function* networkListenSaga() {
  NetInfo.addEventListener((event) => {
    networkEmitter.emit('networkConnectionChanged', event)
  })

  while (true) {
    const { isInternetReachable, isConnected } = yield take(networkEventChannel)
    if (
      (isInternetReachable === false && Platform.OS === 'android') ||
      isConnected === false
    ) {
      yield put({ type: DISCONNECTED_FROM_INTERNET })
      yield spawn(fetchNetworkState)
    } else {
      yield put({ type: CONNECTED_TO_INTERNET })
    }
  }
}

/**
 * function to check internet connection if the event didn't fire
 */
export function* fetchNetworkState() {
  yield delay(5000)
  const state = yield NetInfo.fetch()
  networkEmitter.emit('networkConnectionChanged', state)
}

export const networkEventChannel = eventChannel((emit) => {
  const handler = async (event) => {
    if (event) {
      emit(event)
    }
  }

  networkEmitter.on('networkConnectionChanged', handler)

  const unsubscribe = () => {
    networkEmitter.off('networkConnectionChanged', handler)
  }

  return unsubscribe
}, buffers.none())
