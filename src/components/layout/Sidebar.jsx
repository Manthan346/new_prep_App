import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Home,
  FileText,
  Users,
  Settings,
  BookOpen,
  Megaphone, // use this instead of AnnouncementCircle
  BarChart3,
  GraduationCap,
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
  ];

  let roleNavigation = [];

  if (user?.role === 'admin') {
    roleNavigation = [
      { name: 'Tests', href: '/tests', icon: FileText },
      { name: 'Students', href: '/students', icon: Users },
      { name: 'Announcements', href: '/announcements', icon: Megaphone },
      { name: 'Admin Panel', href: '/admin', icon: Settings },
    ];
  } else if (user?.role === 'teacher') {
    roleNavigation = [
      { name: 'Tests', href: '/tests', icon: FileText },
      { name: 'Students', href: '/students', icon: Users },
      { name: 'Announcements', href: '/announcements', icon: Megaphone },
    ];
  } else if (user?.role === 'student') {
    roleNavigation = [
      { name: 'My Tests', href: '/tests', icon: FileText },
      { name: 'Performance', href: '/performance', icon: BarChart3 },
      { name: 'Announcements', href: '/announcements', icon: Megaphone },
    ];
  }

  const navigation = [...baseNavigation, ...roleNavigation];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-25 ${
          sidebarOpen ? 'block' : 'hidden'
        } lg:hidden`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:overflow-y-auto`}
      >
        <div className="flex h-16 items-center px-6">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-lg font-semibold text-gray-900">PlacementReady</span>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section removed as requested */}
      </div>
    </>
  );
};

export default Sidebar;
