import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, User, Settings, LogOut, Menu } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="text-gray-700 lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
          aria-label="Toggle sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <h1 className="flex-1 text-lg font-semibold text-gray-900">
          {user?.role === 'admin' && 'Admin Dashboard'}
          {user?.role === 'teacher' && 'Teacher Portal'}
          {user?.role === 'student' && 'Student Portal'}
        </h1>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 p-1 rounded-md"
            aria-label="View notifications"
          >
            <Bell className="h-6 w-6" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md p-1"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  {user?.rollNumber && <p className="text-xs text-gray-500">Roll: {user.rollNumber}</p>}
                  {user?.employeeId && <p className="text-xs text-gray-500">ID: {user.employeeId}</p>}
                </div>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  type="button"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  type="button"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
