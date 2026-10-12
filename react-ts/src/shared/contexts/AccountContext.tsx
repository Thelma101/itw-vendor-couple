/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { meApi, type MeResponse, type Profile, type PublicUser } from '@/shared/lib/api'
import { isDemoSession, storedUser } from '@/shared/lib/session'

type AccountContextValue = {
  /** True for friends & family demo sessions (sample data, nothing saved to the server). */
  isDemo: boolean
  user: PublicUser | null
  profile: Profile
  loading: boolean
  refresh: () => Promise<void>
  update: (body: Parameters<typeof meApi.update>[0]) => Promise<MeResponse>
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined)

export function AccountProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || '')
  const [isDemo, setIsDemo] = useState(() => isDemoSession())
  const [user, setUser] = useState<PublicUser | null>(null)
  const [profile, setProfile] = useState<Profile>({})
  const [loading, setLoading] = useState(() => !isDemoSession())

  useEffect(() => {
    const next = localStorage.getItem('authToken') || ''
    if (next !== token) setToken(next)
    setIsDemo(isDemoSession())
  }, [location.pathname, location.search, token])

  const refresh = useCallback(async () => {
    if (isDemoSession()) {
      setUser(null)
      setProfile({})
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const me = await meApi.get()
      setUser(me.user)
      setProfile(me.profile || {})
      const cached = storedUser()
      localStorage.setItem('user', JSON.stringify({ ...cached, ...me.user }))
    } catch {
      /* 401s are handled by the API client; keep whatever we had */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [token, refresh])

  const update = useCallback(async (body: Parameters<typeof meApi.update>[0]) => {
    const me = await meApi.update(body)
    setUser(me.user)
    setProfile(me.profile || {})
    localStorage.setItem('user', JSON.stringify({ ...storedUser(), ...me.user }))
    return me
  }, [])

  const value = useMemo(
    () => ({ isDemo, user, profile, loading, refresh, update }),
    [isDemo, user, profile, loading, refresh, update],
  )
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error('useAccount must be used within AccountProvider')
  return ctx
}

/** Typed read of a profile field with a fallback. */
export function profileString(profile: Profile, key: string, fallback = ''): string {
  const value = profile[key]
  return typeof value === 'string' ? value : fallback
}

export function profileNumber(profile: Profile, key: string, fallback = 0): number {
  const value = Number(profile[key])
  return Number.isFinite(value) && profile[key] !== undefined && profile[key] !== '' ? value : fallback
}
