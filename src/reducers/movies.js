import { SET_MOVIES } from '../types/movies'

const initialState = {
  moviesList: [],
}

export default function (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_MOVIES: {
      return {
        ...state,
        moviesList: payload,
      }
    }
    default: {
      return state
    }
  }
}
