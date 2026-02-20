import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Safely parse user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span className="brand-text">Billing System</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12"></path>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18"></path>
            )}
          </svg>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <Link to="/dashboard" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              <span>Dashboard</span>
            </Link>

            <Link to="/bills" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>Bills</span>
            </Link>

            <Link to="/create-bill" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Create Bill</span>
            </Link>

            {/* Admin Links */}
            <Link to="/admin/products" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              <span>Products</span>
            </Link>

            <Link to="/admin/reports" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              <span>Reports</span>
            </Link>

            <Link to="/admin/settings" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span>Settings</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="navbar-user">
            <button className="user-menu-btn" onClick={toggleDropdown}>
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="user-name">{user.name || "User"}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <span className="dropdown-name">{user.name || "User"}</span>
                  <span className="dropdown-email">{user.email || "user@example.com"}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS styles */}
      <style>{`
        .navbar {
          background: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow-sm);
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-primary);
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .brand-text {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: var(--text-primary);
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 32px;
          flex: 1;
          justify-content: flex-end;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .navbar-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .navbar-link:hover {
          background: var(--bg-secondary);
          color: var(--primary-color);
        }

        .navbar-link.active {
          background: rgba(79, 70, 229, 0.1);
          color: var(--primary-color);
        }

        .navbar-user {
          position: relative;
        }

        .user-menu-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: 1px solid var(--border-color);
          padding: 6px 12px 6px 6px;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .user-menu-btn:hover {
          border-color: var(--primary-color);
          box-shadow: var(--shadow-sm);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 220px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          z-index: 200;
          animation: slideDown 0.2s ease;
          overflow: hidden;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          padding: 16px;
          background: var(--bg-secondary);
        }

        .dropdown-name {
          display: block;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .dropdown-email {
          display: block;
          font-size: 0.75rem;
          color: var(--text-light);
          margin-top: 2px;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          font-size: 0.875rem;
          color: var(--text-primary);
          text-decoration: none;
          cursor: pointer;
          transition: background var(--transition-fast);
          width: 100%;
          border: none;
          background: none;
          text-align: left;
        }

        .dropdown-item:hover {
          background: var(--bg-secondary);
        }

        .logout-btn {
          color: var(--danger);
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        @media (max-width: 1024px) {
          .navbar-link span {
            display: none;
          }

          .navbar-link {
            padding: 10px;
          }

          .user-name {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
          }

          .navbar-menu {
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            background: var(--card-bg);
            flex-direction: column;
            padding: 16px;
            gap: 16px;
            box-shadow: var(--shadow-lg);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .navbar-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .navbar-links {
            flex-direction: column;
            width: 100%;
          }

          .navbar-link {
            width: 100%;
            padding: 12px 16px;
          }

          .navbar-link span {
            display: inline;
          }

          .user-menu-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
