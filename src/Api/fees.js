import api from './auth'
import publicApi from './publicApi'

// Get fee invoice by id
export const getInvoice = async (id) => {
  try {
    const response = await publicApi.get(`/invoice/${id}`)
    return response.data
  } catch (error) {
    const status = error?.response?.status
    const data = error?.response?.data
    const message = error?.message || 'Request failed'
    throw { status, data, message, response: error?.response }
  }
}

// Get all fees for a student (public)
export const getFeesForStudent = async (studentId, month) => {
  try {
    const params = {}
    if (month) params.month = month
    const response = await publicApi.get(`/fees/${studentId}`, { params })
    return response.data
  } catch (error) {
    const status = error?.response?.status
    const data = error?.response?.data
    const message = error?.message || 'Request failed'
    throw { status, data, message, response: error?.response }
  }
}

// Public: Get student fee summary
export const getStudentFeeSummary = async (studentId) => {
  try {
    const response = await publicApi.get(`/fees/student/${studentId}/summary`)
    return response.data
  } catch (error) {
    const status = error?.response?.status
    const data = error?.response?.data
    const message = error?.message || 'Request failed'
    throw { status, data, message, response: error?.response }
  }
}

// Generate invoices for a class/month (admin)
export const generateInvoices = async ({ className, month, amount, section }) => {
  try {
    const payload = { class: className, month, amount, section }
    const response = await api.post('/fees/generate', payload)
    return response.data
  } catch (error) {
    const status = error?.response?.status
    const data = error?.response?.data
    const message = error?.message || 'Request failed'
    throw { status, data, message, response: error?.response }
  }
}

// Get invoices list (admin)
export const getInvoices = async ({ className, month, status, page }) => {
  try {
    const params = {}
    if (className) params.class = className
    if (month) params.month = month
    if (status) params.status = status
    if (page) params.page = page
    const response = await api.get('/invoices', { params })
    return response.data
  } catch (error) {
    const status = error?.response?.status
    const data = error?.response?.data
    const message = error?.message || 'Request failed'
    throw { status, data, message, response: error?.response }
  }
}

// Get fee list by class/month (admin) - returns array of student fee objects
export const getFeesByClass = async ({ className, month, section }) => {
  try {
    const params = {}
    if (className) params.class = className
    if (month) params.month = month
    if (section) params.section = section
    const response = await api.get('/fees', { params })
    return response.data
  } catch (error) {
    const status = error?.response?.status
    const data = error?.response?.data
    const message = error?.message || 'Request failed'
    throw { status, data, message, response: error?.response }
  }
}

// Mark invoice as paid (admin)
export const markInvoicePaid = async (invoiceId, payload = {}) => {
  try {
    const response = await api.post(`/invoices/${invoiceId}/pay`, payload)
    return response.data
  } catch (error) {
    const status = error?.response?.status
    const data = error?.response?.data
    const message = error?.message || 'Request failed'
    throw { status, data, message, response: error?.response }
  }
}

// Pay fees (requires auth - use api client)
export const payFees = async (paymentData) => {
  try {
    const response = await api.post('/fees/pay', paymentData)
    return response.data
  } catch (error) {
    const status = error?.response?.status
    const data = error?.response?.data
    const message = error?.message || 'Request failed'
    throw { status, data, message, response: error?.response }
  }
}

export default { getInvoice, getFeesForStudent, getStudentFeeSummary, generateInvoices, getInvoices, markInvoicePaid, payFees }
