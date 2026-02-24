import api, { buildQueryParams, normalizeApiError } from './auth'

// Get all subjects
export const getAllSubjects = async () => {
  try {
    const response = await api.get('/api/subjects')
    return response.data
  } catch (error) {
    throw normalizeApiError(error, 'Failed to fetch subjects')
  }
}

// Get subjects for a specific class and section
export const getSubjectsForClass = async (classValue, section = '') => {
  try {
    const params = buildQueryParams({ section })
    const response = await api.get(`/api/subjects/class/${classValue}`, { params })
    return response.data
  } catch (error) {
    throw normalizeApiError(error, 'Failed to fetch class subjects')
  }
}

// Add subject to class
export const addSubjectToClass = async (subjectData) => {
  try {
    const response = await api.post('/api/subjects/add', subjectData)
    return response.data
  } catch (error) {
    throw normalizeApiError(error, 'Failed to add subject')
  }
}

// Add multiple subjects to class
export const addMultipleSubjectsToClass = async (subjectData) => {
  try {
    const response = await api.post('/api/subjects/add-multiple', subjectData)
    return response.data
  } catch (error) {
    throw normalizeApiError(error, 'Failed to add subjects')
  }
}

// Create new subject
export const createSubject = async (subjectData) => {
  try {
    const response = await api.post('/api/subjects', subjectData)
    return response.data
  } catch (error) {
    throw normalizeApiError(error, 'Failed to create subject')
  }
}

// Delete subject by ID
export const deleteSubjectById = async (subjectId) => {
  try {
    const response = await api.delete(`/api/subjects/${subjectId}`)
    return response.data
  } catch (error) {
    throw normalizeApiError(error, 'Failed to delete subject')
  }
}

export default { getAllSubjects, addSubjectToClass, addMultipleSubjectsToClass, createSubject, deleteSubjectById }

