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
