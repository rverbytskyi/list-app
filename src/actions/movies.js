import { GET_MOVIES_REQUEST, GET_MORE_MOVIES_REQUEST } from '../types/movies'

export function getMoviesRequest() {
  return {
    type: GET_MOVIES_REQUEST,
  }
}

export function getMoreMoviesRequest() {
  return {
    type: GET_MORE_MOVIES_REQUEST,
  }
}
