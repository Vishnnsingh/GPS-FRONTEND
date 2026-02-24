import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createTeacher, getTeachers, getLoginType, getUser, removeTeacher } from '../../Api/auth'

const resolveTeachersList = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.teachers)) return response.teachers
  if (Array.isArray(response?.users)) return response.users
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.results)) return response.results
  return []
}

const toTeacherRow = (teacher) => ({
  id:
    teacher?.id ||
    teacher?._id ||
    teacher?.user_id ||
    teacher?.userId ||
    teacher?.teacher_id ||
    teacher?.teacherId ||
    '',
  email: teacher?.email || teacher?.user?.email || '',
  role: teacher?.role || teacher?.user?.role || 'teacher',
  createdAt: teacher?.created_at || teacher?.createdAt || teacher?.user?.created_at || teacher?.user?.createdAt || '',
})

function TeacherManagement() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const loginType = getLoginType()
  const user = getUser()
  const isAdmin = loginType === 'all' && user?.role === 'admin'

  const totalTeachers = useMemo(() => teachers.length, [teachers])

  const fetchTeachers = useCallback(async () => {
    if (!isAdmin) return
    setLoading(true)
    setError('')
    try {
      const response = await getTeachers()
      const rows = resolveTeachersList(response)
        .map(toTeacherRow)
        .filter((row) => row.email && String(row.role || '').toLowerCase() === 'teacher')

      setTeachers(rows)
    } catch (err) {
      setTeachers([])
      setError(err?.message || 'Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleAddTeacher = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const email = String(formData.email || '').trim()
    const password = String(formData.password || '')

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      await createTeacher({ email, password })
      setSuccess('Teacher added successfully.')
      setFormData({ email: '', password: '' })
      await fetchTeachers()
    } catch (err) {
      setError(err?.message || 'Failed to add teacher')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveTeacher = async (teacher) => {
    if (!teacher?.id) {
      setError('Unable to remove this teacher: missing id.')
      return
    }

    const confirmed = window.confirm(`Remove teacher "${teacher.email}"?`)
    if (!confirmed) return

    setDeletingId(String(teacher.id))
    setError('')
    setSuccess('')
    try {
      await removeTeacher(teacher.id)
      setSuccess('Teacher removed successfully.')
      await fetchTeachers()
    } catch (err) {
      setError(err?.message || 'Failed to remove teacher')
    } finally {
      setDeletingId('')
    }
  }

  if (!isAdmin) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
        <p className="text-red-700 dark:text-red-300 text-sm font-semibold">Admin access required.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black text-[#0d141b] dark:text-white">Teacher Management</h2>
        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#137fec] bg-[#137fec]/10 border border-[#137fec]/20 px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-base">groups</span>
          {totalTeachers} Teachers
        </span>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      ) : null}

      {success ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">{success}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Teacher</h3>
          <form onSubmit={handleAddTeacher} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Teacher Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="teacher@school.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Temporary Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#137fec] text-white font-semibold hover:bg-[#137fec]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                  Adding...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">person_add</span>
                  Add Teacher
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Teachers List</h3>

          {loading ? (
            <div className="py-10 flex items-center justify-center text-slate-500 dark:text-slate-300">
              <span className="material-symbols-outlined animate-spin mr-2">sync</span>
              Loading teachers...
            </div>
          ) : teachers.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">No teachers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                    <th className="px-3 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-300">Email</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-300">Role</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-300">Created</th>
                    <th className="px-3 py-2.5 text-center font-semibold text-slate-700 dark:text-slate-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={`${teacher.id}-${teacher.email}`} className="border-b border-slate-100 dark:border-slate-700/60">
                      <td className="px-3 py-2.5 text-slate-900 dark:text-white">{teacher.email}</td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          teacher
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                        {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString('en-IN') : '--'}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveTeacher(teacher)}
                          disabled={deletingId === String(teacher.id)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === String(teacher.id) ? (
                            <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                          ) : (
                            <span className="material-symbols-outlined text-sm">delete</span>
                          )}
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherManagement
