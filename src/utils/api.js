import axios from 'axios'
import axiosRetry, {
  isNetworkError,
  isRetryableError,
  exponentialDelay,
} from 'axios-retry'
import { transliterate } from 'transliteration'

const SAFE_HTTP_METHODS = ['get', 'head', 'options']

axiosRetry(axios, {
  retries: 5,
  retryCondition: (e) =>
    (isNetworkError(e) || isRetryableError(e) || e.response.status === 429) &&
    SAFE_HTTP_METHODS.includes(e.config.method.toLowerCase()),
  retryDelay: exponentialDelay,
})

export default async function call(options = {}) {
  const { path, method, payload, timeout = 5000 } = options
  let { headers } = options
  headers = cleanHeaders(headers)
  try {
    const response = await axios({
      url: path,
      timeout,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      data: payload,
    })
    return { status: response.status, payload: response.data }
  } catch (e) {
    if (e.response) {
      return { status: e.response.status, payload: e.response.data }
    }
    return { error: e }
  }
}

function cleanHeaders(headers = {}) {
  const result = {}
  Object.keys(headers).forEach((headerKey) => {
    result[headerKey] = transliterate(headers[headerKey])
  })
  return result
}
