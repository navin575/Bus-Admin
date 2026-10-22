import { NavLink } from 'react-router-dom';
import { Map, Activity, Bus, Settings } from 'lucide-react';
import './Sidebar.css';
import tnLogo from '../assets/tn-logo.svg';

const Sidebar = () => {
  const navItems = [
    { path: '/districts', name: 'Fleet Operations', icon: <Map size={20} /> },
    { path: '/live-tracking', name: 'Live Tracking', icon: <Activity size={20} /> },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-container" style={{ borderRadius: '50%', overflow: 'hidden', width: '56px', height: '56px' }}>
          <img src={tnLogo} alt="TN Govt Logo" className="tn-logo" style={{ objectFit: 'contain' }} />
        </div>
        <h2>TNSTC Admin</h2>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive || window.location.pathname.startsWith(item.path) ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
