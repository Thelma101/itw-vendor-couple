import { Link, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  LeaderboardOutlined,
  EventOutlined,
  ChatOutlined,
  WorkOutline,
} from '@mui/icons-material'

const tabs = [
  { label: 'Home', path: '/vendor', end: true, icon: DashboardOutlined },
  { label: 'Leads', path: '/vendor/leads', icon: LeaderboardOutlined },
  { label: 'Bookings', path: '/vendor/bookings', icon: EventOutlined },
  { label: 'Services', path: '/vendor/services', icon: WorkOutline },
  { label: 'Inbox', path: '/vendor/messages', icon: ChatOutlined },
]

export default function VendorBottomNav() {
  const { pathname } = useLocation()

  const isActive = (path: string, end?: boolean) => {
    if (end) return pathname === path || pathname === `${path}/` || pathname === '/vendor/overview'
    return pathname.startsWith(path)
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[1100] bg-white/95 backdrop-blur border-t border-slate-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-5 h-16">
        {tabs.map(({ label, path, end, icon: Icon }) => {
          const active = isActive(path, end)
          return (
            <li key={path}>
              <Link
                to={path}
                className={`h-full flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                  active ? 'text-teal-700' : 'text-slate-400'
                }`}
              >
                <Icon sx={{ fontSize: 22 }} />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
