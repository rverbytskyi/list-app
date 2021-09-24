const EMPTY_OBJ = {}
const EMPTY_ARR = []

/**
 * get movies reducer
 * @param {Object} state
 * @returns {{
 *   moviesList: Array,
 * }}
 */
export function getMoviesReducer(state) {
  const { movies = EMPTY_OBJ } = state
  return movies
}

/**
 * get moviesList from state.movies
 * @param {Object} state
 * @returns {Array}
 */
export function getMoviesList(state) {
  const { moviesList = EMPTY_ARR } = getMoviesReducer(state)
  return moviesList
}
