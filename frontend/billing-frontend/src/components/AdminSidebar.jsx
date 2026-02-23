import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/create-product", label: "Add Product", icon: "➕" },
    { path: "/admin/reports", label: "Reports", icon: "📈" },
    { path: "/admin/settings", label: "Settings", icon: "⚙️" },
    { path: "/admin/ai-dashboard", label: "AI Dashboard", icon: "🤖" },
    { path: "/admin/invoice-scanner", label: "Invoice Scanner", icon: "📄" },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <style>{`
        .admin-sidebar {
          width: 250px;
          min-height: 100vh;
          background: #1f2937;
          color: white;
          padding: 20px 0;
        }
        .sidebar-header {
          padding: 0 20px 20px;
          border-bottom: 1px solid #374151;
        }
        .sidebar-header h2 {
          margin: 0;
          font-size: 20px;
        }
        .sidebar-nav {
          padding: 20px 0;
        }
        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: #9ca3af;
          text-decoration: none;
          transition: all 0.2s;
        }
        .nav-item:hover {
          background: #374151;
          color: white;
        }
        .nav-item.active {
          background: #4f46e5;
          color: white;
        }
        .nav-icon {
          margin-right: 12px;
          font-size: 18px;
        }
        .nav-label {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default AdminSidebar;
