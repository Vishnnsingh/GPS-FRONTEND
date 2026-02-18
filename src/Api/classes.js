import api from './auth'

// Get all unique classes from students
export const getAllClasses = async () => {
  try {
    const response = await api.get('/students/classes')
    return response.data.classes || []
  } catch (error) {
    throw error.response?.data || error.message
  }
}
