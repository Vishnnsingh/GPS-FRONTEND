import { useEffect, useMemo, useState } from 'react'
import { normalizeApiError } from '../../Api/auth'
import publicApi from '../../Api/publicApi'

const HARD_CODED_RESULT_CLASSES = ['Mother Care', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8']
const HARD_CODED_RESULT_SECTIONS = ['A', 'B', 'C']
const RESULT_SESSION_ENDPOINTS = ['/api/students/sessions', '/api/results/sessions']

const EMPTY_METADATA = {
  classes: HARD_CODED_RESULT_CLASSES,
  sessions: [],
}

const normalizeText = (value) => (value ?? '').toString().trim()

const getSessionSortValue = (session) => {
  const match = normalizeText(session).match(/(\d{2,4})/)
  if (!match) return Number.NEGATIVE_INFINITY

  let year = Number.parseInt(match[1], 10)
  if (year < 100) year += 2000
  return year
}

const sortSessions = (left, right) => {
  const yearDiff = getSessionSortValue(right) - getSessionSortValue(left)
  if (yearDiff !== 0) return yearDiff
  return right.localeCompare(left, undefined, { numeric: true, sensitivity: 'base' })
}

const normalizeSessionOption = (session) => {
  if (typeof session === 'string') return normalizeText(session)
  if (session && typeof session === 'object') {
    return normalizeText(session.value ?? session.label ?? session.session)
  }
  return ''
}

const extractSessionOptions = (payload) => {
  const responseOptions = Array.isArray(payload?.options) ? payload.options : []
  const responseSessions = Array.isArray(payload?.sessions) ? payload.sessions : []
  const rootSessions = Array.isArray(payload) ? payload : []

  const uniqueSessions = new Set(
    [...responseOptions, ...responseSessions, ...rootSessions].map(normalizeSessionOption).filter(Boolean)
  )

  return [...uniqueSessions].sort(sortSessions)
}

const buildFallbackSessions = (count = 3) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const sessionStartYear = currentMonth >= 3 ? currentYear : currentYear - 1

  return Array.from({ length: count }, (_, index) => {
    const startYear = sessionStartYear - index
    const endYear = (startYear + 1) % 100
    return `${startYear}-${String(endYear).padStart(2, '0')}`
  })
}

const loadSessionOptions = async () => {
  let lastError = null

  for (const endpoint of RESULT_SESSION_ENDPOINTS) {
    try {
      const response = await publicApi.get(endpoint)
      const sessions = extractSessionOptions(response?.data)
      if (sessions.length > 0) return sessions
    } catch (error) {
      lastError = error
    }
  }

  return {
    sessions: buildFallbackSessions(),
    error: lastError,
  }
}

export function useResultSearchOptions(selectedClass = '') {
  const [metadata, setMetadata] = useState(EMPTY_METADATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadOptions = async () => {
      setLoading(true)
      setError('')

      try {
        const result = await loadSessionOptions()
        if (!active) return

        const sessions = Array.isArray(result) ? result : result?.sessions || []

        setMetadata({
          ...EMPTY_METADATA,
          classes: HARD_CODED_RESULT_CLASSES,
          sessions,
        })

        if (sessions.length === 0 && result?.error) {
          const normalizedError = normalizeApiError(result.error, 'Failed to fetch result sessions')
          setError(normalizedError.message)
        }

        setLoading(false)
      } catch (err) {
        if (!active) return

        const normalizedError = normalizeApiError(err, 'Failed to load result search options')
        setMetadata({
          ...EMPTY_METADATA,
          classes: HARD_CODED_RESULT_CLASSES,
          sessions: buildFallbackSessions(),
        })
        setError(normalizedError.message)
        setLoading(false)
      }
    }

    loadOptions().catch((err) => {
      if (!active) return
      const normalizedError = normalizeApiError(err, 'Failed to load result search options')
      setMetadata({
        ...EMPTY_METADATA,
        classes: HARD_CODED_RESULT_CLASSES,
        sessions: buildFallbackSessions(),
      })
      setError(normalizedError.message)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  const classOptions = metadata.classes

  const sectionOptions = useMemo(() => {
    if (!selectedClass) return []
    return HARD_CODED_RESULT_SECTIONS
  }, [selectedClass])

  const sessionOptions = useMemo(() => metadata.sessions, [metadata.sessions])

  return {
    classOptions,
    sectionOptions,
    sessionOptions,
    recentSessionOptions: sessionOptions.slice(0, 3),
    olderSessionOptions: sessionOptions.slice(3),
    loading,
    error,
  }
}

export default useResultSearchOptions
