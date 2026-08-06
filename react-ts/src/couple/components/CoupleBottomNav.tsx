import { Link, useLocation } from 'react-router-dom'
import {
  DashboardCustomizeOutlined,
  SearchOutlined,
  ChecklistOutlined,
  AccountBalanceWalletOutlined,
  GroupsOutlined,
} from '@mui/icons-material'

const tabs = [
  { label: 'Home', path: '/couple/dashboard', icon: DashboardCustomizeOutlined },
  { label: 'Vendors', path: '/couple/search-results', icon: SearchOutlined },
  { label: 'Tasks', path: '/couple/checklist', icon: ChecklistOutlined },
  { label: 'Budget', path: '/couple/budget', icon: AccountBalanceWalletOutlined },
  { label: 'Guests', path: '/couple/guests', icon: GroupsOutlined },
]

export default function CoupleBottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[1100] bg-white/95 backdrop-blur border-t border-slate-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-5 h-16">
        {tabs.map(({ label, path, icon: Icon }) => {
          const active = pathname === path || pathname.startsWith(`${path}/`)
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
