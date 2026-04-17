import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';

const MobileNavigation = ({ userRole = 'User' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const normalizedRole = userRole?.toLowerCase?.() || '';

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeMenu}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            {/* Header Section */}
            <div className="p-4 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                User Management System
              </p>
              <h2 className="text-lg font-bold text-gray-900 mt-1">
                Dashboard
              </h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {/* Dashboard */}
              <Link 
                to="/users" 
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Dashboard
              </Link>

              {/* Profile */}
              <Link 
                to="/profile" 
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Profile
              </Link>

              {/* Activity Log */}
              {(normalizedRole === 'admin' || normalizedRole === 'manager') && (
                <Link 
                  to="/activity" 
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Activity log
                </Link>
              )}

              {/* User Management */}
              {(normalizedRole === 'admin' || normalizedRole === 'manager') && (
                <Link 
                  to="/users" 
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  {normalizedRole === 'admin' ? 'User Management' : 'Manage Users'}
                </Link>
              )}
            </nav>

            {/* User Info and Logout */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-red-200 rounded-full text-sm font-medium text-red-700 hover:bg-red-50 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;
