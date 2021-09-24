import {
  take,
  put,
  call,
  actionChannel,
  fork,
  cancel,
  spawn,
} from 'redux-saga/effects'
import { buffers } from 'redux-saga'

import apiCall from '../utils/api'

import {
  API_READY,
  API_REQUEST,
  API_REQUEST_SUCCESS,
  API_REQUEST_FAIL,
} from '../types/api'

import {
  DISCONNECTED_FROM_INTERNET,
  CONNECTED_TO_INTERNET,
} from '../types/network'

/**
 * function to fork/cancel apiHandler depending on internet connection
 */
export function* handleApiConnection() {
  while (true) {
    const event = yield take([CONNECTED_TO_INTERNET, API_REQUEST])
    if (event.type === CONNECTED_TO_INTERNET) {
      const requestChan = yield actionChannel(
        [API_REQUEST],
        buffers.expanding(5)
      )
      const apiHandlerActivity = yield fork(apiHandlerSaga, requestChan)
      yield take(DISCONNECTED_FROM_INTERNET)
      yield cancel(apiHandlerActivity)
      requestChan.close()
    } else {
      const {
        payload: { onFail },
      } = event
      if (onFail) {
        console.log('API failed due to missing internet connection')
        yield fork(processCallback, onFail)
      }
    }
  }
}

/**
 * saga to make apiCalls on actionChannel event
 * @param requestChan
 */
export function* apiHandlerSaga(requestChan) {
  yield put({ type: API_READY })
  while (true) {
    const action = yield take(requestChan)
    const { payload: request = {} } = action
    yield spawn(makeApiCall, request)
  }
}

/**
 * function to make api call and handle the response
 * @param {Object} request
 */
export function* makeApiCall(request) {
  const {
    path,
    method,
    headers = {},
    timeout = 10000,
    payload,
    onSuccess,
    onFail,
  } = request

  const response = yield call(apiCall, {
    path,
    method,
    headers,
    payload,
    timeout,
  })

  if (response.status && /^20\d/.test(response.status.toString())) {
    yield put({ type: API_REQUEST_SUCCESS })
    if (!onSuccess) {
      return
    }
    yield fork(processCallback, onSuccess, response.payload, response.status)
  } else {
    yield put({ type: API_REQUEST_FAIL })
    if (!onFail) {
      console.log(
        `API failed with status ${
          response.status
        } and response ${JSON.stringify(response.payload)}`
      )
      return
    }
    yield fork(processCallback, onFail, response.payload, response.status)
  }
}

/**
 * function to execute or send a callback
 * @param {string|function} callback
 * @param {Object} payload
 * @param {number} status
 */
export function* processCallback(callback, payload = {}, status) {
  if (typeof callback === 'function') {
    if (status) {
      yield call(callback, payload, status)
    } else {
      yield call(callback, payload)
    }
    return
  }
  if (status) {
    yield put({ type: callback, payload, status })
  } else {
    yield put({ type: callback, payload })
  }
}
