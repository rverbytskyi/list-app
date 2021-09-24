import { spawn, take, put, select } from 'redux-saga/effects'

import { MY_API_FILMS_TOKEN } from 'react-native-dotenv'

import { API_REQUEST } from '../types/api'

import {
  GET_MOVIES_REQUEST,
  GET_MOVIES_SUCCESS,
  GET_MOVIES_FAIL,
  SET_MOVIES,
  GET_MORE_MOVIES_REQUEST,
  GET_MORE_MOVIES_SUCCESS,
} from '../types/movies'

import selectors from '../selectors'

/**
 * saga to request movies
 */
export function* moviesRequestSaga() {
  yield spawn(getMoviesSuccessSaga)
  while (true) {
    yield take(GET_MOVIES_REQUEST)
    yield put({
      type: API_REQUEST,
      payload: {
        method: 'GET',
        path: `https://www.myapifilms.com/imdb/top?end=20&${MY_API_FILMS_TOKEN}`,
        onSuccess: GET_MOVIES_SUCCESS,
        onFail: GET_MOVIES_FAIL,
      },
    })
  }
}

/**
 * saga to catch action with GET_MOVIES_SUCCESS type and process response
 */
export function* getMoviesSuccessSaga() {
  while (true) {
    const { payload } = yield take(GET_MOVIES_SUCCESS)
    const { data } = payload
    const { movies } = data
    yield put({
      type: SET_MOVIES,
      payload: movies,
    })
  }
}

export function* moreMoviesRequestSaga() {
  yield spawn(getMoreMoviesSuccessSaga)
  while (true) {
    yield take(GET_MORE_MOVIES_REQUEST)
    const moviesList = yield select(selectors.movies.getMoviesList)
    yield put({
      type: API_REQUEST,
      payload: {
        method: 'GET',
        path: `https://www.myapifilms.com/imdb/top?start=${
          moviesList.length + 1
        }&end=${moviesList.length + 20}&${MY_API_FILMS_TOKEN}`,
        onSuccess: GET_MOVIES_SUCCESS,
        onFail: GET_MOVIES_FAIL,
      },
    })
  }
}

export function* getMoreMoviesSuccessSaga() {
  while (true) {
    const { payload } = yield take(GET_MORE_MOVIES_SUCCESS)
    const { data } = payload
    const { movies } = data
    const moviesList = yield select(selectors.movies.getMoviesList)
    const moviesListIdsSet = new Set(moviesList.map(({ idIMDB }) => idIMDB))
    const newMoviesList = [...moviesList]
    for (let i = 0; i < movies.length; i += 1) {
      const movie = movies[i]
      const { idIMDB } = movie
      if (moviesListIdsSet.has(idIMDB)) {
        continue
      }
      newMoviesList.push(movie)
    }
    yield put({
      type: SET_MOVIES,
      payload: newMoviesList,
    })
  }
}
