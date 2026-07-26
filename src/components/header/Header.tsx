import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store';
import { toast } from 'react-toastify';
import { Bell, ChevronDown, LogOut, Menu } from 'lucide-react';

const Header: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const displayName = user?.userId || 'Guest User';

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 select-none">
      <div className="flex items-center gap-2 lg:hidden">
        <button onClick={onToggleSidebar} className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition">
          <Menu size={20} />
        </button>
        <span className="text-sm font-semibold text-slate-900">PrepRoute</span>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative p-2.5 rounded-full border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500 transition cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Vertical Divider */}
        <div className="hidden lg:block h-6 w-px bg-slate-200"></div>

        {/* User Profile Dropdown Toggle */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition py-1"
          >
            {/* Custom Cartoon Vector Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 border border-amber-200 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background */}
                <circle cx="50" cy="50" r="50" fill="#fef3c7" />
                {/* Hair */}
                <path d="M25 45 C25 20, 75 20, 75 45 C75 35, 65 30, 50 30 C35 30, 25 35, 25 45 Z" fill="#b45309" />
                {/* Face */}
                <circle cx="50" cy="52" r="22" fill="#fed7aa" />
                {/* Eyes */}
                <circle cx="43" cy="48" r="3" fill="#1e293b" />
                <circle cx="57" cy="48" r="3" fill="#1e293b" />
                {/* Mustache */}
                <path d="M38 58 Q50 50 62 58 Q50 56 38 58 Z" fill="#78350f" />
                {/* Neck & Shirt */}
                <path d="M40 74 C40 68, 60 68, 60 74 Z" fill="#fed7aa" />
                <path d="M25 88 C35 80, 65 80, 75 88 Z" fill="#4f46e5" />
              </svg>
            </div>

            {/* User Details */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-800 leading-tight">
                {displayName}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Admin
              </span>
            </div>

            <ChevronDown size={16} className="text-slate-400 ml-1" />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-50 animate-[slideIn_0.15s_ease-out]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition text-left cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
