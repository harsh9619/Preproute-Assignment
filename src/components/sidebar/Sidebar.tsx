import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LOGO from '../../style/images/img-logo.svg';
import { LayoutDashboard, PlusCircle, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const activePath = location.pathname;

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard size={22} />
    },
    {
      path: '/create-test',
      label: 'Create Test',
      icon: <PlusCircle size={22} />
    }
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col min-h-screen transform transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-50 lg:hidden">
          <Link to="/" className="flex items-center">
            <img src={LOGO} alt="PrepRoute Logo" className="h-9 w-auto" />
          </Link>
          <button onClick={onClose} className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition">
            <X size={20} />
          </button>
        </div>
        <div className="hidden lg:flex items-center h-16 px-6 border-b border-slate-50">
          <Link to="/" className="flex items-center">
            <img src={LOGO} alt="PrepRoute Logo" className="h-9 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
