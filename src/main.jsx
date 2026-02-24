import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import schoolLogo from './assets/logo.jpeg'

const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'

document.title = SCHOOL_NAME

const faviconElement =
  document.querySelector("link[rel='icon']") ||
  (() => {
    const link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
    return link
  })()

faviconElement.type = 'image/jpeg'
faviconElement.href = schoolLogo

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'Unknown error',
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled app error:', error, errorInfo)
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-xl border border-red-200 p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Application crashed</h1>
          <p className="mt-2 text-sm text-slate-600">{this.state.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
          >
            Reload
          </button>
        </div>
      </div>
    )
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
