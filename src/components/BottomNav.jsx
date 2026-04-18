import React from 'react';
import { NavLink } from 'react-router-dom';

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/feed" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <span className="icon">🔔</span>
        <span className="label">Feed</span>
      </NavLink>
      <NavLink to="/map" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <span className="icon">🗺️</span>
        <span className="label">Map</span>
      </NavLink>
      <NavLink to="/report" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <div className="report-button">
          <span className="icon">➕</span>
        </div>
        <span className="label">Report</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;
