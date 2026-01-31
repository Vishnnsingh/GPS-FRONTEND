import api from './auth'

// Get all subjects
export const getAllSubjects = async () => {
  try {
    const response = await api.get('/subjects')
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Add subject to class
export const addSubjectToClass = async (subjectData) => {
  try {
    const response = await api.post('/subjects/add', subjectData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Add multiple subjects to class
export const addMultipleSubjectsToClass = async (subjectData) => {
  try {
    const response = await api.post('/subjects/add-multiple', subjectData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Create new subject
export const createSubject = async (subjectData) => {
  try {
    const response = await api.post('/subjects', subjectData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Delete subject by ID
export const deleteSubjectById = async (subjectId) => {
  try {
    const response = await api.delete(`/subjects/${subjectId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export default { getAllSubjects, addSubjectToClass, addMultipleSubjectsToClass, createSubject, deleteSubjectById }

