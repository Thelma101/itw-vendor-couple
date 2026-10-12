import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { IS_LIVE_APP, SITE_URL } from '@/shared/lib/session'
import RouteLoader from '@/shared/components/RouteLoader'

const PUBLIC_PREFIXES = ['/w/', '/couple/registry/public/', '/privacy', '/terms']

function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to)
  }, [to])
  return <RouteLoader />
}

/** In the live build, every workspace page needs a real session and sign-in happens on itheewed.co. */
export default function LiveAppGate({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  if (!IS_LIVE_APP) return <>{children}</>

  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('userRole')
  const home = role === 'vendor' ? '/vendor' : '/couple/dashboard'

  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return <>{children}</>
  if (pathname === '/signup') return <ExternalRedirect to={`${SITE_URL}/signup`} />
  if (!token) return <ExternalRedirect to={`${SITE_URL}/signin`} />
  if (pathname === '/' || pathname === '/signin') return <Navigate to={home} replace />
  if (role === 'vendor' && pathname.startsWith('/couple')) return <Navigate to="/vendor" replace />
  if (role !== 'vendor' && pathname.startsWith('/vendor')) return <Navigate to="/couple/dashboard" replace />
  return <>{children}</>
}
