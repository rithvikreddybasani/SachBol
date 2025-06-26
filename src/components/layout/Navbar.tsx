import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ChevronDown, UserCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, logout } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const getNavLinks = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Home', path: '/' },
        { name: 'Department Complaints', path: '/admin-dashboard' },
        { name: 'About', path: '/about' },
      ];
    }
    return [
      { name: 'Home', path: '/' },
      { name: 'File Complaint', path: '/file-complaint' },
      { name: 'Track Complaint', path: '/track-complaint' },
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Whistleblower', path: '/whistleblower' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
          : isHomePage 
            ? 'bg-transparent' 
            : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0" onClick={closeMenu}>
              <Logo />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.path
                        ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg'
                        : (!scrolled && isHomePage)
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center space-x-2 ${
                      (!scrolled && isHomePage)
                        ? 'text-white hover:text-white/90'
                        : 'text-gray-700 hover:text-blue-700'
                    }`}
                  >
                    <UserCircle className="w-8 h-8" />
                    <span className="text-sm font-medium">
                      {user.role === 'admin' ? `${user.department} Admin` : (user.name || 'User')}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          to={user.role === 'admin' ? '/admin-dashboard' : '/profile'}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Your Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`${
                    (!scrolled && isHomePage)
                      ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                  } py-2 px-6 rounded-full flex items-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-lg ${
                (!scrolled && isHomePage)
                  ? 'text-white hover:text-white/80 hover:bg-white/10'
                  : 'text-gray-700 hover:text-blue-800 hover:bg-blue-50'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-0 z-40`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMenu}></div>
        <div className="relative bg-white w-64 h-full shadow-xl">
          <div className="pt-5 pb-3 px-2">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Logo />
              </div>
            </div>
            <nav className="mt-8">
              <div className="px-2 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      location.pathname === link.path
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 px-2">
                {user ? (
                  <>
                    <div className="flex items-center px-3 py-2 text-base font-medium text-gray-700">
                      <UserCircle className="w-5 h-5 mr-2" />
                      <span>{user.role === 'admin' ? `${user.department} Admin` : (user.name || 'User')}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mt-2 w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-red-200"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;