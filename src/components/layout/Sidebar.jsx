import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  BookOpen, 
  BarChart3,
  User,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigation = () => {
    const baseNavigation = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        current: location.pathname === '/dashboard',
      },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseNavigation,
        {
          name: 'Tests',
          href: '/tests',
          icon: FileText,
          current: location.pathname === '/tests',
        },
        {
          name: 'Students',
          href: '/students',
          icon: Users,
          current: location.pathname === '/students',
        },
        {
          name: 'Admin Panel',
          href: '/admin',
          icon: Settings,
          current: location.pathname === '/admin',
        },
      ];
    }

    if (user?.role === 'teacher') {
      return [
        ...baseNavigation,
        {
          name: 'Tests',
          href: '/tests',
          icon: FileText,
          current: location.pathname === '/tests',
        },
        {
          name: 'Students',
          href: '/students',
          icon: Users,
          current: location.pathname === '/students',
        },
      ];
    }

    if (user?.role === 'student') {
      return [
        ...baseNavigation,
        {
          name: 'My Tests',
          href: '/tests',
          icon: FileText,
          current: location.pathname === '/tests',
        },
        {
          name: 'Performance',
          href: '/performance',
          icon: BarChart3,
          current: location.pathname === '/performance',
        },
      ];
    }

    return baseNavigation;
  };

  const navigation = getNavigation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">
              PlacementReady
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                        item.current
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                        }`}
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* User info at bottom */}
            <li className="mt-auto">
              <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
