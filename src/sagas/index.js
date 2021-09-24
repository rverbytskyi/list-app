import { all, spawn } from 'redux-saga/effects'

import { handleApiConnection } from './api'

import { networkListenSaga } from './network'

import { moviesRequestSaga, moreMoviesRequestSaga } from './movies'

export default function* () {
  yield all([
    spawn(handleApiConnection),
    spawn(networkListenSaga),
    spawn(moviesRequestSaga),
    spawn(moreMoviesRequestSaga),
  ])
}
