import { Link, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {children}
      </main>
      
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }
        .admin-content {
          flex: 1;
          padding: 20px;
          background: #f3f4f6;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;
