import { useCallback, useEffect, useRef, useState } from 'react'
import { meApi } from '@/shared/lib/api'
import { currentUserId, isDemoSession } from '@/shared/lib/session'

type Options<T> = {
  /** localStorage key used for demo sessions (kept identical to the old key so F&F data survives). */
  demoKey: string
  /** Value demo sessions start with. */
  demo: T
  /** Value a brand-new live account starts with. */
  empty: T
}

function readCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    /* fall through */
  }
  return fallback
}

/**
 * Workspace state that lives on the server for real accounts (`/me/docs/:docKey`) and in
 * localStorage for demo sessions. A per-account cache keeps the UI instant between visits.
 */
export function useServerState<T>(docKey: string, { demoKey, demo, empty }: Options<T>) {
  const isDemo = isDemoSession()
  const cacheKey = isDemo ? demoKey : `itw:${currentUserId()}:${docKey}`
  const defaults = useRef({ demo, empty })

  const [state, setState] = useState(() => ({
    key: cacheKey,
    data: readCache<T>(cacheKey, isDemo ? demo : empty),
  }))
  const [loading, setLoading] = useState(!isDemo)
  const [error, setError] = useState<string | null>(null)

  // Session switched (sign-in, sign-out, another account): start from that account's cache
  const data = state.key === cacheKey ? state.data : readCache<T>(cacheKey, isDemo ? defaults.current.demo : defaults.current.empty)
  const latest = useRef(data)
  latest.current = data

  useEffect(() => {
    setState((prev) => (prev.key === cacheKey ? prev : { key: cacheKey, data: latest.current }))
    if (isDemo) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    meApi
      .getDoc<T>(docKey)
      .then((res) => {
        if (cancelled) return
        const value = res.value !== null && res.value !== undefined ? res.value : defaults.current.empty
        setState({ key: cacheKey, data: value })
        localStorage.setItem(cacheKey, JSON.stringify(value))
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your saved data. Check your connection and refresh.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isDemo, docKey, cacheKey])

  const save = useCallback(
    /** Resolves false when the server rejected the save (the error message is set). */
    async (next: T | ((prev: T) => T)): Promise<boolean> => {
      const value = typeof next === 'function' ? (next as (prev: T) => T)(latest.current) : next
      latest.current = value
      setState({ key: cacheKey, data: value })
      try {
        localStorage.setItem(cacheKey, JSON.stringify(value))
      } catch {
        /* quota — the server copy still saves */
      }
      if (isDemo) return true
      try {
        await meApi.putDoc(docKey, value)
        setError(null)
        return true
      } catch {
        setError('Could not save to your account. Check your connection and try again.')
        return false
      }
    },
    [isDemo, docKey, cacheKey],
  )

  return { data, save, loading, error, isDemo }
}
