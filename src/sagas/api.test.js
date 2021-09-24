import { expectSaga } from 'redux-saga-test-plan'

import { handleApiConnection, processCallback } from './api'

import {
  CONNECTED_TO_INTERNET,
  DISCONNECTED_FROM_INTERNET,
} from '../types/network'

import {
  API_READY,
  API_REQUEST,
  API_REQUEST_SUCCESS,
  API_REQUEST_FAIL,
} from '../types/api'

import api from '../utils/api'

const RESPONSES = {
  OK_200: {
    message: 'OK',
  },
  ACCEPTED_201: {
    message: 'Accepted',
  },
  FORBIDDEN_403: {
    message: 'Forbidden',
  },
  BAD_REQUEST_400: {
    message: 'Bad Request',
  },
}

function mockedApi(effect) {
  const { args } = effect
  const { method } = args[0]
  switch (method) {
    case 'POST':
      return {
        status: 200,
        payload: RESPONSES.OK_200,
      }
    case 'PUT':
      return {
        status: 201,
        payload: RESPONSES.ACCEPTED_201,
      }
    case 'DELETE':
      return {
        status: 403,
        payload: RESPONSES.FORBIDDEN_403,
      }
    default:
      return {
        status: 400,
        payload: RESPONSES.BAD_REQUEST_400,
      }
  }
}

const ON_SUCCESS_TYPE = 'fake/ON_SUCCESS_TYPE'
const ON_FAIL_TYPE = 'fake/ON_FAIL_TYPE'

const provideMock = {
  call: (effect, next) => {
    if (effect.fn === api) {
      return mockedApi(effect)
    }
    if (effect.fn.name === 'delayP') {
      const [duration] = effect.args
      if (duration !== -1) return null
    }
    return next()
  },
}

describe('test api sagas', () => {
  it('Api call without internet connection', async () => {
    await expectSaga(handleApiConnection)
      .provide(provideMock)
      .put({ type: API_READY })
      .not.call.like({ fn: api })
      .dispatch({ type: CONNECTED_TO_INTERNET })
      .dispatch({ type: DISCONNECTED_FROM_INTERNET })
      .dispatch({
        type: API_REQUEST,
        payload: {
          method: 'POST',
        },
      })
      .silentRun()
  })
  it('Successful api call', async () => {
    const onSuccess = jest.fn()
    await expectSaga(handleApiConnection)
      .provide(provideMock)
      .put({ type: API_READY })
      .call.like({ fn: api })
      .put({ type: API_REQUEST_SUCCESS })
      .fork(processCallback, onSuccess, RESPONSES.OK_200, 200)
      .call(onSuccess, RESPONSES.OK_200, 200)
      .put({
        type: ON_SUCCESS_TYPE,
        payload: RESPONSES.ACCEPTED_201,
        status: 201,
      })
      .dispatch({ type: CONNECTED_TO_INTERNET })
      .dispatch({
        type: API_REQUEST,
        payload: {
          method: 'POST',
          onSuccess,
        },
      })
      .dispatch({
        type: API_REQUEST,
        payload: {
          method: 'PUT',
          onSuccess: ON_SUCCESS_TYPE,
        },
      })
      .dispatch({
        type: API_REQUEST,
        payload: {
          method: 'POST',
        },
      })
      .silentRun()
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })
  it('Failed api call', async () => {
    const onFail = jest.fn()
    await expectSaga(handleApiConnection)
      .provide(provideMock)
      .put({ type: API_READY })
      .call.like({ fn: api })
      .put({ type: API_REQUEST_FAIL })
      .fork(processCallback, onFail, RESPONSES.BAD_REQUEST_400, 400)
      .call(onFail, RESPONSES.BAD_REQUEST_400, 400)
      .put({
        type: ON_FAIL_TYPE,
        status: 403,
        payload: RESPONSES.FORBIDDEN_403,
      })
      .dispatch({ type: CONNECTED_TO_INTERNET })
      .dispatch({
        type: API_REQUEST,
        payload: {
          onFail,
        },
      })
      .dispatch({
        type: API_REQUEST,
        payload: {
          method: 'DELETE',
          onFail: ON_FAIL_TYPE,
        },
      })
      .dispatch({
        type: API_REQUEST,
        payload: {
          method: 'DELETE',
        },
      })
      .silentRun()
    expect(onFail).toHaveBeenCalledTimes(1)
  })
})
