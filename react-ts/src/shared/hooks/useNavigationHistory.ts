/**
 * useNavigationHistory — Custom hook for precise navigation history tracking.
 *
 * Tracks every location change (pathname + search params + hash) in a stack.
 * Provides a `goBack()` that returns the user to the exact previous location,
 * including query parameters such as `?category=Venue&page=2`.
 *
 * Usage:
 *   const { canGoBack, goBack, previousLocation, history } = useNavigationHistory();
 */

import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HistoryEntry {
  /** Full pathname, e.g. `/couple/search-results` */
  pathname: string;
  /** Raw query string including leading `?`, e.g. `?category=Venue` */
  search: string;
  /** Hash fragment including leading `#`, e.g. `#reviews` */
  hash: string;
  /** ISO timestamp */
  timestamp: string;
  /** Unique key per entry (derived from React Router location key) */
  key: string;
}

export interface NavigationHistoryAPI {
  /** Whether there is at least one previous location to go back to */
  canGoBack: boolean;
  /** Navigate back to the previous location (preserving query params) */
  goBack: () => void;
  /** The previous location entry (or null) */
  previousLocation: HistoryEntry | null;
  /** Full ordered history stack (oldest → newest) */
  history: HistoryEntry[];
  /** Current entry */
  current: HistoryEntry | null;
  /** Clear the history stack */
  clearHistory: () => void;
  /** Get a human-readable label for the previous page */
  previousPageLabel: string;
}

/* ------------------------------------------------------------------ */
/*  Friendly route labels                                              */
/* ------------------------------------------------------------------ */

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/couple/dashboard': 'Dashboard',
  '/couple/search-results': 'Search Results',
  '/couple/search': 'Search',
  '/couple/select-vendors': 'Vendors',
  '/couple/shortlist': 'Shortlist',
  '/couple/my-vendors': 'My Vendors',
  '/couple/messages': 'Messages',
  '/couple/booking': 'Booking',
  '/couple/profile': 'Profile',
  '/couple/checklist': 'Checklist',
  '/couple/budget': 'Budget',
  '/couple/guests': 'Guests',
  '/couple/registry': 'Gift Registry',
  '/couple/wedding-website': 'Wedding Website',
  '/couple/timeline': 'Timeline',
  '/couple/compare': 'Compare',
  '/couple/booking': 'Booking',
};

function labelForPath(pathname: string): string {
  // Direct match
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];

  // Dynamic vendor profile route — /couple/vendor/:id
  if (/^\/couple\/vendor\/.+$/.test(pathname)) return 'Vendor Profile';
  if (/^\/couple\/registry\/public\/.+$/.test(pathname)) return 'Public Registry';

  // Vendor dashboard routes
  if (pathname.startsWith('/vendor')) {
    const segment = pathname.split('/').pop();
    if (segment) return segment.charAt(0).toUpperCase() + segment.slice(1);
    return 'Vendor Dashboard';
  }

  return 'Previous Page';
}

/* ------------------------------------------------------------------ */
/*  Storage key                                                        */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'itw_nav_history';
const MAX_STACK_SIZE = 50;

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useNavigationHistory(): NavigationHistoryAPI {
  const location = useLocation();
  const navigate = useNavigate();

  // Persistent stack stored in sessionStorage so it survives hot-reload
  // but resets when the tab is closed.
  const stackRef = useRef<HistoryEntry[]>(
    (function() {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
      } catch {
        return [];
      }
    })()
  );

  // Lazily initialise the ref on first render
  if (typeof stackRef.current === 'function') {
    stackRef.current = (stackRef.current as unknown as () => HistoryEntry[])();
  }

  /* ---- track location changes ---- */
  useEffect(() => {
    const stack = stackRef.current as HistoryEntry[];
    const entry: HistoryEntry = {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      timestamp: new Date().toISOString(),
      key: location.key || `${Date.now()}`,
    };

    // Avoid duplicate consecutive entries (e.g. replaceState)
    const last = stack[stack.length - 1];
    if (
      last &&
      last.pathname === entry.pathname &&
      last.search === entry.search &&
      last.hash === entry.hash
    ) {
      return;
    }

    stack.push(entry);

    // Trim to max size
    if (stack.length > MAX_STACK_SIZE) {
      stack.splice(0, stack.length - MAX_STACK_SIZE);
    }

    // Persist
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stack));
    } catch {
      // quota exceeded — silently ignore
    }
  }, [location.pathname, location.search, location.hash, location.key]);

  /* ---- derived state ---- */
  const stack = stackRef.current as HistoryEntry[];
  const current = stack.length > 0 ? stack[stack.length - 1] : null;
  const previousLocation = stack.length > 1 ? stack[stack.length - 2] : null;
  const canGoBack = previousLocation !== null;

  const previousPageLabel = useMemo(
    () => (previousLocation ? labelForPath(previousLocation.pathname) : ''),
    [previousLocation],
  );

  /* ---- actions ---- */
  const goBack = useCallback(() => {
    const s = stackRef.current as HistoryEntry[];
    if (s.length < 2) {
      // Fallback: use browser history
      window.history.back();
      return;
    }

    // Pop current
    s.pop();
    const target = s[s.length - 1];

    // Also pop the target so we don't double-push when the location effect fires
    s.pop();

    // Persist trimmed stack
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      // ignore
    }

    // Navigate to exact previous location with full query params + hash
    navigate(target.pathname + target.search + target.hash, { replace: false });
  }, [navigate]);

  const clearHistory = useCallback(() => {
    (stackRef.current as HistoryEntry[]).length = 0;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    canGoBack,
    goBack,
    previousLocation,
    history: stack,
    current,
    clearHistory,
    previousPageLabel,
  };
}

export default useNavigationHistory;
