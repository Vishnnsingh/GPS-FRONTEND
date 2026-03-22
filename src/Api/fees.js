import api, { buildQueryParams, normalizeApiError } from './auth'

const withErrorHandling = async (request, fallbackMessage) => {
  try {
    const response = await request()
    return response.data
  } catch (error) {
    throw normalizeApiError(error, fallbackMessage)
  }
}

const normalizeFilterInput = (classFilter = '', sectionFilter = '', month = '') => {
  if (typeof classFilter === 'object' && classFilter !== null) {
    return classFilter
  }

  return {
    class: classFilter,
    section: sectionFilter,
    month,
  }
}

// ============ Fee Structure Management ============

export const createFeeStructure = async (feeData) =>
  withErrorHandling(() => api.post('/api/fee-structure', feeData), 'Failed to create fee structure')

export const getFeeStructures = async (classFilter = '', sectionFilter = '') => {
  const params = buildQueryParams(normalizeFilterInput(classFilter, sectionFilter))
  return withErrorHandling(
    () => api.get('/api/fee-structure', { params }),
    'Failed to fetch fee structures'
  )
}

export const updateFeeStructure = async (id, feeData) =>
  withErrorHandling(() => api.put(`/api/fee-structure/${id}`, feeData), 'Failed to update fee structure')

export const deleteFeeStructure = async (id) =>
  withErrorHandling(() => api.delete(`/api/fee-structure/${id}`), 'Failed to delete fee structure')

// ============ Bills ============

export const generateBulkBills = async (billData) =>
  withErrorHandling(() => api.post('/api/bills/generate', billData), 'Failed to generate bills')

export const generateBillsForClass = async (classFilter, month, feeOptions = {}) => {
  const payload = {
    class: classFilter,
    month,
    ...feeOptions,
  }
  return withErrorHandling(() => api.post('/api/bills/generate', payload), 'Failed to generate bills')
}

export const generateBillsForAllClasses = async (billData) =>
  withErrorHandling(() => api.post('/api/bills/generate-all', billData), 'Failed to generate bills for all classes')

export const downloadBillsData = async (monthOrFilters = '', classFilter = '') => {
  const params =
    typeof monthOrFilters === 'object'
      ? buildQueryParams(monthOrFilters)
      : buildQueryParams({ month: monthOrFilters, class: classFilter })

  return withErrorHandling(
    () => api.get('/api/bills/download-data', { params }),
    'Failed to fetch bills data'
  )
}

export const generateBillsPDF = async (month) =>
  withErrorHandling(
    () =>
      api.get('/api/bills/pdf', {
        params: buildQueryParams({ month }),
        responseType: 'blob',
      }),
    'Failed to generate bills PDF'
  )

// ============ Fees ============

export const getFeeList = async (classFilter = '', sectionFilter = '', month = '') => {
  const params = buildQueryParams(normalizeFilterInput(classFilter, sectionFilter, month))
  return withErrorHandling(() => api.get('/api/fees/list', { params }), 'Failed to fetch fee list')
}

export const recordFeePayment = async (paymentData) =>
  withErrorHandling(() => api.post('/api/fees/pay', paymentData), 'Failed to record fee payment')

export const getInvoiceDetails = async (billId) =>
  withErrorHandling(() => api.get(`/api/fees/invoice/${billId}`), 'Failed to fetch invoice')

export const closeMonth = async (month) =>
  withErrorHandling(() => api.post('/api/fees/close-month', { month }), 'Failed to close month')

export const getStudentDues = async (studentId) =>
  withErrorHandling(() => api.get(`/api/fees/dues/${studentId}`), 'Failed to fetch student dues')

export const getStudentFeeDetails = async (classFilter, section, rollNumber, month) => {
  try {
    // Use existing getFeeList API and filter for the specific student
    const feeList = await getFeeList(classFilter, section, month)
    
    // Find the matching student record
    const feeData = Array.isArray(feeList) 
      ? feeList.find(f => f.roll_no == rollNumber)
      : feeList?.data?.find(f => f.roll_no == rollNumber)
    
    if (!feeData) {
      throw new Error('Student fee details not found')
    }
    
    return feeData
  } catch (error) {
    throw normalizeApiError(error, 'Failed to fetch student fee details')
  }
}

// ============ Migration ============

export const migrateOpeningBalance = async (migrationData) => {
  try {
    const response = await api.post('/api/migration/opening-balance', migrationData)
    return response.data
  } catch (error) {
    console.error('Migration API error:', error.response?.data || error.message)
    throw normalizeApiError(error, 'Failed to complete opening balance migration')
  }
}

export const migrateFromExcel = async (file, migrationMonth) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('migration_month', migrationMonth)

    // Don't let axios set Content-Type header, let the browser do it with boundary
    const response = await api.post('/api/migration/from-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Excel migration API error:', error.response?.data || error.message)
    throw normalizeApiError(error, 'Failed to complete Excel migration')
  }
}

export const cancelMigration = async (migrationMonth) => {
  try {
    const response = await api.post('/api/migration/cancel', { migration_month: migrationMonth })
    return response.data
  } catch (error) {
    console.error('Cancel migration API error:', error.response?.data || error.message)
    throw normalizeApiError(error, 'Failed to cancel migration')
  }
}

// ============ Legacy / Optional ============

export const getBillById = async (billId) =>
  withErrorHandling(() => api.get(`/api/billing/bill/${billId}`), 'Failed to fetch bill')

export const downloadBillsPDF = async (classFilter, month, sectionFilter = '') => {
  const params = buildQueryParams({
    class: classFilter,
    month,
    section: sectionFilter,
  })

  return withErrorHandling(
    () =>
      api.get('/api/billing/download', {
        params,
        responseType: 'blob',
      }),
    'Failed to download bills PDF'
  )
}

export const downloadInvoicePDF = async (billId) =>
  withErrorHandling(
    () =>
      api.get(`/api/invoice/download/${billId}`, {
        responseType: 'blob',
      }),
    'Failed to download invoice PDF'
  )

export default {
  createFeeStructure,
  getFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
  generateBulkBills,
  getBillById,
  downloadBillsPDF,
  getFeeList,
  recordFeePayment,
  getInvoiceDetails,
  closeMonth,
  getStudentDues,
  downloadInvoicePDF,
  generateBillsPDF,
  generateBillsForClass,
  generateBillsForAllClasses,
  downloadBillsData,
  migrateOpeningBalance,
}

