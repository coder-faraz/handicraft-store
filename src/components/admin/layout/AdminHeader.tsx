// FILE: src/components/admin/layout/AdminHeader.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, LogOut, User, ChevronDown, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminBreadcrumb from './AdminBreadcrumb';
import Link from 'next/link';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push('/login');
  };

  // Avatar initials
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <header className="h-16 bg-white border-b border-admin-border flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
      {/* Mobile hamburger */}
      <button
        id="admin-menu-btn"
        onClick={onMenuClick}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors text-admin-muted"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <AdminBreadcrumb />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          id="admin-notifications-btn"
          className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors text-admin-muted"
        >
          <Bell size={18} />
          {/* Indicator dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-primary" />
        </button>

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            id="admin-user-menu-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-white">{initials}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-admin-text leading-tight">{user?.name}</p>
              <p className="text-xs text-admin-muted leading-tight capitalize">{user?.role}</p>
            </div>
            <ChevronDown
              size={14}
              className={`text-admin-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-admin-border py-1 z-50 animate-fade-in">
              {/* User info */}
              <div className="px-4 py-3 border-b border-admin-border">
                <p className="text-sm font-semibold text-admin-text">{user?.name}</p>
                <p className="text-xs text-admin-muted truncate">{user?.email}</p>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-admin-text hover:bg-gray-50 transition-colors"
              >
                <User size={15} className="text-admin-muted" />
                Profile & Settings
              </Link>

              <Link
                href="/"
                target="_blank"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-admin-text hover:bg-gray-50 transition-colors"
              >
                <ExternalLink size={15} className="text-admin-muted" />
                View Storefront
              </Link>

              <div className="border-t border-admin-border mt-1">
                <button
                  id="admin-logout-btn"
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
