import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { normalizePlan } from '@/shared/data/featureTiers'
import { rememberReturnOrigin } from '@/shared/lib/api'
import { DEMO_EMAIL, IS_LIVE_APP, SITE_URL } from '@/shared/lib/session'

function tokenEmail(token: string): string {
  try {
    return String(JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).email || '')
  } catch {
    return ''
  }
}

/**
 * Stores the session handed over from itheewed.co (`?token=&role=&from=`). Runs before the
 * first render so no page ever fetches with a missing or previous account's token.
 */
export function consumeAuthFromUrl() {
  const url = new URL(window.location.href)
  const token = url.searchParams.get('token')
  if (!token || token === 'null') return

  if (IS_LIVE_APP && DEMO_EMAIL.test(tokenEmail(token))) {
    window.location.replace(`${SITE_URL}/signin?demo=1&signedout=1`)
    return
  }

  localStorage.setItem('authToken', token)
  const role = url.searchParams.get('role')
  if (role) localStorage.setItem('userRole', role)
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
  rememberReturnOrigin(url.searchParams.get('from'))

  for (const key of ['token', 'role', 'from']) url.searchParams.delete(key)
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
}

/** Supports ?plan=standard|premium for friends & family plan demos. */
export function useAuthFromUrl() {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const plan = searchParams.get('plan')
    if (!plan || IS_LIVE_APP) return
    localStorage.setItem('userPlan', normalizePlan(plan))
    searchParams.delete('plan')
    window.dispatchEvent(new Event('itw-plan-changed'))
    setSearchParams(searchParams, { replace: true })
  }, [searchParams, setSearchParams])
}
