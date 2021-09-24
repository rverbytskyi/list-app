import { expectSaga } from 'redux-saga-test-plan'
import { MY_API_FILMS_TOKEN } from 'react-native-dotenv'

import {
  GET_MORE_MOVIES_REQUEST,
  GET_MORE_MOVIES_SUCCESS,
  GET_MOVIES_FAIL,
  GET_MOVIES_REQUEST,
  GET_MOVIES_SUCCESS,
  SET_MOVIES,
} from '../types/movies'
import { API_REQUEST } from '../types/api'

import {
  moviesRequestSaga,
  getMoviesSuccessSaga,
  moreMoviesRequestSaga,
  getMoreMoviesSuccessSaga,
} from './movies'

const moviesPayload = {
  data: {
    movies: [{ idIMDB: '1' }, { idIMDB: '2' }],
  },
}

const moviesPayload1 = {
  data: {
    movies: [{ idIMDB: '2' }, { idIMDB: '3' }],
  },
}

const moviesMergeResult = [{ idIMDB: '1' }, { idIMDB: '2' }, { idIMDB: '3' }]

describe('test movies sagas', () => {
  it('test moviesRequestSaga', async () => {
    await expectSaga(moviesRequestSaga)
      .spawn(getMoviesSuccessSaga)
      .put({
        type: API_REQUEST,
        payload: {
          method: 'GET',
          path: `https://www.myapifilms.com/imdb/top?end=20&${MY_API_FILMS_TOKEN}`,
          onSuccess: GET_MOVIES_SUCCESS,
          onFail: GET_MOVIES_FAIL,
        },
      })
      .dispatch({ type: GET_MOVIES_REQUEST })
      .run()
  })
  it('test getMoviesSuccessSaga', async () => {
    await expectSaga(getMoviesSuccessSaga)
      .put({ type: SET_MOVIES, payload: moviesPayload.data.movies })
      .dispatch({
        type: GET_MOVIES_SUCCESS,
        payload: moviesPayload,
      })
      .run()
  })
  it('test moreMoviesRequestSaga with empty state', async () => {
    await expectSaga(moreMoviesRequestSaga)
      .withState({})
      .spawn(getMoreMoviesSuccessSaga)
      .put({
        type: API_REQUEST,
        payload: {
          method: 'GET',
          path: `https://www.myapifilms.com/imdb/top?start=${1}&end=${20}&${MY_API_FILMS_TOKEN}`,
          onSuccess: GET_MOVIES_SUCCESS,
          onFail: GET_MOVIES_FAIL,
        },
      })
      .dispatch({
        type: GET_MORE_MOVIES_REQUEST,
      })
      .run()
  })
  it('test moreMoviesRequestSaga', async () => {
    await expectSaga(moreMoviesRequestSaga)
      .withState({
        movies: {
          moviesList: moviesPayload.data.movies,
        },
      })
      .spawn(getMoreMoviesSuccessSaga)
      .put({
        type: API_REQUEST,
        payload: {
          method: 'GET',
          path: `https://www.myapifilms.com/imdb/top?start=${
            moviesPayload.data.movies.length + 1
          }&end=${moviesPayload.data.movies.length + 20}&${MY_API_FILMS_TOKEN}`,
          onSuccess: GET_MOVIES_SUCCESS,
          onFail: GET_MOVIES_FAIL,
        },
      })
      .dispatch({
        type: GET_MORE_MOVIES_REQUEST,
      })
      .run()
  })
  it('test getMoreMoviesSuccessSaga', async () => {
    await expectSaga(getMoreMoviesSuccessSaga)
      .withState({
        movies: {
          moviesList: moviesPayload.data.movies,
        },
      })
      .put({ type: SET_MOVIES, payload: moviesMergeResult })
      .dispatch({ type: GET_MORE_MOVIES_SUCCESS, payload: moviesPayload1 })
      .run()
  })
})
