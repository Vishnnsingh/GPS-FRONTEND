import api from './auth'

// ============ Fee Structure Management ============

// Create Fee Structure
export const createFeeStructure = async (feeData) => {
  try {
    const response = await api.post('/fee-structure', feeData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get Fee Structures
export const getFeeStructures = async (classFilter = '', sectionFilter = '') => {
  try {
    const params = {}
    if (classFilter) params.class = classFilter
    if (sectionFilter) params.section = sectionFilter
    
    const response = await api.get('/fee-structure', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Update Fee Structure
export const updateFeeStructure = async (id, feeData) => {
  try {
    const response = await api.put(`/fee-structure/${id}`, feeData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Delete Fee Structure
export const deleteFeeStructure = async (id) => {
  try {
    const response = await api.delete(`/fee-structure/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// ============ Bulk Bill Generation ============

// Generate Bills for Class (uses /bills/generate endpoint)
export const generateBulkBills = async (billData) => {
  try {
    const response = await api.post('/bills/generate', billData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get Bill by ID
export const getBillById = async (billId) => {
  try {
    const response = await api.get(`/billing/bill/${billId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Download Bills PDF
export const downloadBillsPDF = async (classFilter, month, sectionFilter = '') => {
  try {
    const params = { class: classFilter, month }
    if (sectionFilter) params.section = sectionFilter
    
    const response = await api.get('/billing/download', {
      params,
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// ============ Fees Management ============

// Get Fee List (Dashboard)
export const getFeeList = async (classFilter = '', sectionFilter = '', month = '') => {
  try {
    const params = {}
    if (classFilter) params.class = classFilter
    if (sectionFilter) params.section = sectionFilter
    if (month) params.month = month
    
    const response = await api.get('/fees/list', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Record Fee Payment
export const recordFeePayment = async (paymentData) => {
  try {
    const response = await api.post('/fees/pay', paymentData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get Invoice Details
export const getInvoiceDetails = async (billId) => {
  try {
    const response = await api.get(`/fees/invoice/${billId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Close Month
export const closeMonth = async (month) => {
  try {
    const response = await api.post('/fees/close-month', { month })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get Student Dues
export const getStudentDues = async (studentId) => {
  try {
    const response = await api.get(`/fees/dues/${studentId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// ============ Invoice ============

// Download Invoice PDF
export const downloadInvoicePDF = async (billId) => {
  try {
    const response = await api.get(`/invoice/download/${billId}`, {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// ============ Bills ============

// Generate Bills PDF
export const generateBillsPDF = async (month) => {
  try {
    const response = await api.get('/bills/pdf', {
      params: { month },
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Generate Bills for Class (wrapper function)
export const generateBillsForClass = async (classFilter, month, feeOptions = {}) => {
  try {
    const payload = {
      class: classFilter,
      month,
      ...feeOptions
    }
    const response = await api.post('/bills/generate', payload)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Generate Bills for All Classes
export const generateBillsForAllClasses = async (billData) => {
  try {
    const response = await api.post('/bills/generate-all', billData)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Download Bills Data
export const downloadBillsData = async (month, classFilter = '') => {
  try {
    const params = { month }
    if (classFilter) params.class = classFilter
    
    const response = await api.get('/bills/download-data', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export default {
  // Fee Structure
  createFeeStructure,
  getFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
  // Bulk Bills
  generateBulkBills,
  getBillById,
  downloadBillsPDF,
  // Fees Management
  getFeeList,
  recordFeePayment,
  getInvoiceDetails,
  closeMonth,
  getStudentDues,
  // Invoice
  downloadInvoicePDF,
  // Bills
  generateBillsPDF,
  generateBillsForClass,
  generateBillsForAllClasses,
  downloadBillsData
}

