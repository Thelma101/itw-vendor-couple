import {
  Calendar,
  Heart,
  Home,
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/vendor-dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/vendor-leads', icon: Inbox },
  { name: 'Bookings', href: '/vendor-bookings', icon: Calendar },
  { name: 'Profile', href: '/vendor-profile', icon: Settings },
];

export function VendorSidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <Link to="/" className="flex items-center px-6 py-5 border-b border-sidebar-border">
          <Heart className="w-6 h-6 text-primary mr-2 fill-primary" />
          <span className="font-serif text-2xl text-secondary">iTheeWed</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Back to Couple View */}
        <div className="p-4 border-t border-sidebar-border">
          <Link to="/">
            <button className="flex items-center w-full px-4 py-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors">
              <Home className="w-5 h-5 mr-3" />
              Couple View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
