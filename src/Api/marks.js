import api from './auth'
import publicApi from './publicApi'

// Submit marks
export const submitMarks = async (marksData) => {
  try {
    const response = await api.post('/marks/submit', marksData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get marks by class, section, and terminal
export const getMarks = async (classValue, section, terminal) => {
  try {
    const params = {
      class: classValue,
      terminal: terminal
    }
    if (section) {
      params.section = section
    }
    
    const response = await api.get('/marks', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Public: Get student result by class, roll, terminal (and optional section)
// Endpoint example: GET /marks/result?class=1&roll=1&terminal=First&section=A
// Expected response includes: student, marks[], summary (total_max_marks, total_obtained, percentage, division, rank, published_date)
export const getStudentResultPublic = async ({ classValue, roll, terminal, section }) => {
  try {
    const params = {
      class: classValue,
      roll: roll,
      terminal: terminal,
    }

    if (section) params.section = section

    const response = await publicApi.get('/marks/result', { params })
    return response.data
  } catch (error) {
    // Preserve status and response data so callers can handle 404/403 more precisely
    const status = error?.response?.status
    const data = error?.response?.data
    const message = error?.message || 'Request failed'
    throw { status, data, message, response: error?.response }
  }
}

// Publish results for a class
export const publishResults = async (classValue, section, terminal) => {
  try {
    const response = await api.post('/marks/publish', {
      class: classValue,
      section: section || undefined,
      terminal: terminal
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export default { submitMarks, getMarks, getStudentResultPublic, publishResults }

