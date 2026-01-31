import api from './auth'

// Get all students
export const getAllStudents = async (classFilter = '') => {
  try {
    const params = classFilter ? { class: classFilter } : {}
    
    const response = await api.get('/students/all', {
      params,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Add new student
export const addStudent = async (studentData) => {
  try {
    const response = await api.post('/students/add', studentData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Update student
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await api.put(`/students/edit/${studentId}`, studentData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Delete student
export const deleteStudent = async (studentId) => {
  try {
    const response = await api.delete(`/students/${studentId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export default { getAllStudents, addStudent, updateStudent, deleteStudent }

