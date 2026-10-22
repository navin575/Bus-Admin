import { Bell, Search, User } from 'lucide-react';
import './Topbar.css';

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search buses, routes..." className="search-input" />
      </div>
      
      <div className="topbar-actions">
        <button className="icon-btn relative">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
