import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { normalizePlan } from '@/shared/data/featureTiers'

/**
 * Reads auth token & role from URL query params (set by signup-flow redirect)
 * and stores them in localStorage. Also supports ?plan=standard|premium for F&F demos.
 */
export function useAuthFromUrl() {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const role = searchParams.get('role')
    const plan = searchParams.get('plan')
    let dirty = false

    if (token && token !== 'null') {
      localStorage.setItem('authToken', token)
      if (role) localStorage.setItem('userRole', role)
      // Replace any profile left by a previous account on this browser
      try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as {
          sub?: string
          email?: string
        }
        const previous = JSON.parse(localStorage.getItem('user') || '{}') as { id?: string }
        if (payload.sub && previous.id !== payload.sub) {
          localStorage.setItem('user', JSON.stringify({ id: payload.sub, email: payload.email }))
        }
      } catch {
        localStorage.removeItem('user')
      }
      searchParams.delete('token')
      searchParams.delete('role')
      dirty = true
    }

    if (plan) {
      localStorage.setItem('userPlan', normalizePlan(plan))
      searchParams.delete('plan')
      dirty = true
      window.dispatchEvent(new Event('itw-plan-changed'))
    }

    if (dirty) {
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])
}
