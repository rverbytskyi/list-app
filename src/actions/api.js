import { API_REQUEST } from '../types/api'

export function apiRequest(payload) {
  return {
    type: API_REQUEST,
    payload,
  }
}
