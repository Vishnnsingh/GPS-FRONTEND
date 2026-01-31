import api from './auth'

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

export default { submitMarks, getMarks, publishResults }

