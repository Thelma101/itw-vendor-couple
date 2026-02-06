import { Heart, Menu, Search, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

export function CoupleNav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Heart className="w-6 h-6 text-primary mr-2 fill-primary" />
              <span className="font-serif text-2xl text-secondary">
                iTheeWed
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/search"
                className={`text-sm transition-colors ${
                  isActive('/search')
                    ? 'text-primary-foreground'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Find Vendors
              </Link>
              <Link
                to="/couple-dashboard"
                className={`text-sm transition-colors ${
                  isActive('/couple-dashboard')
                    ? 'text-primary-foreground'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Dashboard
              </Link>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Inspiration
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Blog
              </a>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/vendor-dashboard">
                <Button variant="ghost" size="sm">
                  For Vendors
                </Button>
              </Link>
              <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border absolute w-full z-40 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-600"
            >
              Find Vendors
            </Link>
            <Link
              to="/couple-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-600"
            >
              My Dashboard
            </Link>
            <a href="#" className="block py-2 text-sm text-gray-600">
              Inspiration
            </a>
            <a href="#" className="block py-2 text-sm text-gray-600">
              Blog
            </a>
            <div className="pt-3 border-t border-border space-y-2">
              <Link to="/vendor-dashboard">
                <Button variant="ghost" size="sm" className="w-full">
                  For Vendors
                </Button>
              </Link>
              <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 shadow-lg">
        <div className="flex items-center justify-around h-16">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              isActive('/') ? 'text-primary-foreground' : 'text-gray-600'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              isActive('/search') ? 'text-primary-foreground' : 'text-gray-600'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Link>
          <Link
            to="/couple-dashboard"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              isActive('/couple-dashboard')
                ? 'text-primary-foreground'
                : 'text-gray-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
        </div>
      </div>
    </>
  );
}
