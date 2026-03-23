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

// Update subject sequence within a class/section mapping
export const updateSubjectSequence = async (subjectId, sequence) => {
  try {
    const response = await api.put(`/api/subjects/sequence/${subjectId}`, { sequence })
    return response.data
  } catch (error) {
    throw normalizeApiError(error, 'Failed to update subject sequence')
  }
}

// Remove a subject mapping from a class/section
export const removeSubjectFromClass = async (subjectId) => {
  try {
    const response = await api.delete(`/api/subjects/remove/${subjectId}`)
    return response.data
  } catch (error) {
    throw normalizeApiError(error, 'Failed to remove subject from class')
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

export default {
  getAllSubjects,
  getSubjectsForClass,
  addSubjectToClass,
  addMultipleSubjectsToClass,
  updateSubjectSequence,
  removeSubjectFromClass,
  createSubject,
  deleteSubjectById,
}

