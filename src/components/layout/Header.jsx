import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, User, Settings, LogOut, Menu } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
        {/* Mobile menu button */}
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-900/10 lg:hidden" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="relative flex flex-1 items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {user?.role === 'admin' && 'Admin Dashboard'}
              {user?.role === 'teacher' && 'Teacher Portal'}
              {user?.role === 'student' && 'Student Portal'}
            </h1>
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Notifications */}
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <Bell className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="-m-1.5 flex items-center p-1.5"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                      {user?.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </button>

              {/* Profile dropdown menu */}
              {showProfileMenu && (
                <div className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {user?.rollNumber && (
                      <p className="text-xs text-gray-500">Roll: {user.rollNumber}</p>
                    )}
                    {user?.employeeId && (
                      <p className="text-xs text-gray-500">ID: {user.employeeId}</p>
                    )}
                  </div>

                  <button
                    className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </button>

                  <button
                    className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={logout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
