import React, { useState, useEffect } from 'react';
import itheewedLogo from '../features/Nav/assets/Itheewed_Logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../lib/api';

const Navbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('authToken'));
  }, [location]);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    authApi.logout();
    setIsLoggedIn(false);
    navigate('/signin');
  };

  const closeMobileMenu = () => setShowMenu(false);

  // Determine dashboard link based on stored role
  const getDashboardPath = () => {
    const role = localStorage.getItem('userRole');
    return role === 'vendor' ? '/vendor/dashboard' : '/couple/dashboard';
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm font-montserrat">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" onClick={closeMobileMenu}>
            <img
              src={itheewedLogo}
              alt="iTheeWed Logo"
              className="w-auto h-10 object-contain"
            />
          </Link>
        </div>

        <div className="hidden md:flex gap-6 text-[#00838F] text-sm font-medium items-center">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/faq" className="hover:underline">FAQ</Link>
          <Link to="/blog" className="hover:underline">Blog</Link>
          <Link to="/contact" className="hover:underline">Contact Us</Link>
          <Link to="/games" className="hover:underline">Games</Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link to={getDashboardPath()} className="text-sm text-white px-4 py-2 bg-[#00838F] rounded hover:bg-[#006d75] transition">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-sm text-[#00838F] px-4 py-2 bg-white border border-[#00838F] rounded hover:bg-gray-50 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-sm text-white px-4 py-2 bg-[#00838F] hover:bg-[#006d75] transition">
                Sign in
              </Link>
              <Link to="/signup" className="text-sm text-[#00838F] px-4 py-2 bg-white border-[#00838F] rounded hover:bg-gray-50 transition">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger menu (mobile only) */}
        <div className="md:hidden">
          <button
            className="text-[#00838F] text-2xl p-1"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Toggle menu"
          >
            {showMenu ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {showMenu && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-[#00838F] text-sm font-medium border-t border-gray-100 pt-3">
          <Link to="/about" onClick={closeMobileMenu}>About</Link>
          <Link to="/faq" onClick={closeMobileMenu}>FAQ</Link>
          <Link to="/blog" onClick={closeMobileMenu}>Blog</Link>
          <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
          <Link to="/games" onClick={closeMobileMenu}>Games</Link>
          <hr className="border-gray-200" />
          {isLoggedIn ? (
            <>
              <Link to={getDashboardPath()} onClick={closeMobileMenu} className="font-semibold">Dashboard</Link>
              <button onClick={() => { closeMobileMenu(); handleLogout(); }} className="text-left text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" onClick={closeMobileMenu} className="font-semibold">Sign in</Link>
              <Link to="/signup" onClick={closeMobileMenu}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
