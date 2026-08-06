import { useNavigationHistory } from '@/shared/hooks/useNavigationHistory'

/** Mount once under Router so every route change is tracked for BackButton. */
export default function NavigationTracker() {
  useNavigationHistory()
  return null
}
