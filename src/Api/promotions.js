import api, { normalizeApiError } from './auth'

export const promoteClass = async (payload) => {
  try {
    const response = await api.post('/api/promotions/class', payload)
    return response.data
  } catch (error) {
    throw normalizeApiError(error, 'Failed to promote class')
  }
}

export default {
  promoteClass,
}

