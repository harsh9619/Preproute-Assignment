import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth,  } from '../../store';
import { LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.alert('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span>📝</span> PrepRoute
      </Link>
      {user && (
        <div className="navbar-user">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="user-avatar">
              {user.userId.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 550 }}>{user.userId}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} title="Log out">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
