import React, { useMemo, useState } from 'react'
import { getUser } from '../../Api/auth'
import { promoteClass } from '../../Api/promotions'

const CLASS_OPTIONS = ['Mother Care', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8']

const getDefaultPromotedBy = () => {
  const user = getUser()
  return String(user?.email || user?.Email || user?.username || '').trim()
}

const STATUS_MESSAGE_FALLBACK = {
  400: 'Validation error. Please verify the promotion details.',
  404: 'No eligible students found for selected class/session.',
  409: 'Promotion conflict detected. Please resolve conflicts and retry.',
  500: 'Server error while processing promotion. Please try again.',
}

function ClassPromotion() {
  const [formData, setFormData] = useState({
    from_class: '',
    current_session: '',
    new_session: '',
    promoted_by: getDefaultPromotedBy(),
  })

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successData, setSuccessData] = useState(null)

  const currentSession = formData.current_session.trim()
  const newSession = formData.new_session.trim()
  const isSameSession = Boolean(currentSession && newSession && currentSession === newSession)
  const hasMissingRequired = !formData.from_class || !currentSession || !newSession
  const isSubmitDisabled = submitting || hasMissingRequired || isSameSession

  const helperNotes = useMemo(() => [
    'Annual result must be published before promotion.',
    'Target class requires unique class+section+roll for active students.',
    'Class 8 students are marked pass-out/inactive; they are not promoted to class 9.',
  ], [])

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
    setSuccessData(null)
  }

  const handleOpenConfirm = (e) => {
    e.preventDefault()

    if (hasMissingRequired) {
      setError('Please fill all required fields before promotion.')
      return
    }

    if (isSameSession) {
      setError('Current session and new session cannot be same.')
      return
    }

    setShowConfirmModal(true)
  }

  const handlePromote = async () => {
    const promotedByValue = String(formData.promoted_by || getDefaultPromotedBy()).trim()
    const payload = {
      from_class: String(formData.from_class).trim(),
      current_session: currentSession,
      new_session: newSession,
      promoted_by: promotedByValue,
    }

    setSubmitting(true)
    setError('')
    setSuccessData(null)

    try {
      const response = await promoteClass(payload)
      setSuccessData({
        message: response?.message || 'Class promoted successfully',
        promoted_count: Number(response?.promoted_count || 0),
        from_class: payload.from_class,
        current_session: payload.current_session,
        new_session: payload.new_session,
      })
      setShowConfirmModal(false)
    } catch (err) {
      const status = err?.status || 0
      const backendMessage = err?.data?.message || err?.message
      setError(backendMessage || STATUS_MESSAGE_FALLBACK[status] || 'Failed to promote class.')
      setShowConfirmModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-5" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Class Promotion</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Promote an entire class to next academic session with server-side validation.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3 sm:p-4">
        <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">Promotion Rules</p>
        <ul className="space-y-1 text-xs sm:text-sm text-amber-700 dark:text-amber-200">
          {helperNotes.map((note) => (
            <li key={note} className="flex items-start gap-2">
              <span className="mt-0.5">-</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {successData && (
        <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-3 sm:p-4">
          <p className="text-sm font-semibold text-green-800 dark:text-green-300">{successData.message}</p>
          <p className="text-xs sm:text-sm text-green-700 dark:text-green-200 mt-1">
            Promoted students: <span className="font-bold">{successData.promoted_count}</span>
          </p>
          <p className="text-xs sm:text-sm text-green-700 dark:text-green-200 mt-1">
            From Class {successData.from_class} ({successData.current_session}) to session {successData.new_session}
          </p>
        </div>
      )}

      <form
        onSubmit={handleOpenConfirm}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">From Class *</label>
            <select
              value={formData.from_class}
              onChange={(e) => handleFieldChange('from_class', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
              required
            >
              <option value="">Select Class</option>
              {CLASS_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Promoted By</label>
            <input
              value={formData.promoted_by}
              onChange={(e) => handleFieldChange('promoted_by', e.target.value)}
              placeholder="admin@school.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Auto-filled from logged-in admin, editable if needed.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Current Session *</label>
            <input
              value={formData.current_session}
              onChange={(e) => handleFieldChange('current_session', e.target.value)}
              placeholder="2025-26"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">New Session *</label>
            <input
              value={formData.new_session}
              onChange={(e) => handleFieldChange('new_session', e.target.value)}
              placeholder="2026-27"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>

        {isSameSession && (
          <p className="text-xs text-red-600 dark:text-red-400">Current session and new session must be different.</p>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#137fec] text-white text-sm font-bold hover:bg-[#137fec]/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">sync</span>
                Processing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">arrow_upward</span>
                Promote Class
              </>
            )}
          </button>
        </div>
      </form>

      {showConfirmModal && (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !submitting) {
                setShowConfirmModal(false)
              }
            }}
        >
          <div className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-5 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Class Promotion</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Please verify details before final submit.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">From Class</p>
                <p className="font-bold text-slate-900 dark:text-white">{formData.from_class || '--'}</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Current Session</p>
                <p className="font-bold text-slate-900 dark:text-white">{currentSession || '--'}</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">New Session</p>
                <p className="font-bold text-slate-900 dark:text-white">{newSession || '--'}</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Promoted By</p>
                <p className="font-bold text-slate-900 dark:text-white break-all">{formData.promoted_by || '--'}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handlePromote}
                className="px-4 py-2 rounded-lg bg-[#137fec] text-white text-sm font-bold hover:bg-[#137fec]/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Promoting...' : 'Confirm Promotion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassPromotion
