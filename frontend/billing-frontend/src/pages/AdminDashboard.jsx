import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBills } from "../services/billingService";
import { getProducts } from "../services/productService";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalBills: 0,
    totalProducts: 0,
    paidBills: 0,
    pendingBills: 0,
    totalCustomers: 0,
    recentBills: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billsData, productsData] = await Promise.all([
          getBills(),
          getProducts()
        ]);

        const paidBills = billsData.filter(b => b.status === "paid");
        const pendingBills = billsData.filter(b => b.status === "pending");
        const totalSales = paidBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
        
        // Get unique customers
        const customers = new Set(billsData.map(b => b.customerName));
        
        // Sort bills by date and get recent 5
        const sortedBills = [...billsData].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);

        setStats({
          totalSales,
          totalBills: billsData.length,
          totalProducts: productsData.length,
          paidBills: paidBills.length,
          pendingBills: pendingBills.length,
          totalCustomers: customers.size,
          recentBills: sortedBills,
        });
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      paid: "badge-success",
      pending: "badge-warning",
      cancelled: "badge-danger",
    };
    return <span className={`badge ${statusClasses[status] || "badge-info"}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Overview of your business performance</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => navigate("/bills")} style={{ cursor: "pointer" }}>
            <div className="stat-card-header">
              <div className="stat-card-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{formatCurrency(stats.totalSales)}</div>
            <div className="stat-card-label">Total Revenue</div>
          </div>

          <div className="stat-card" onClick={() => navigate("/bills")} style={{ cursor: "pointer" }}>
            <div className="stat-card-header">
              <div className="stat-card-icon primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{stats.totalBills}</div>
            <div className="stat-card-label">Total Bills</div>
          </div>

          <div className="stat-card" onClick={() => navigate("/admin/products")} style={{ cursor: "pointer" }}>
            <div className="stat-card-header">
              <div className="stat-card-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{stats.totalProducts}</div>
            <div className="stat-card-label">Total Products</div>
          </div>

          <div className="stat-card" onClick={() => navigate("/bills")} style={{ cursor: "pointer" }}>
            <div className="stat-card-header">
              <div className="stat-card-icon danger">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{stats.totalCustomers}</div>
            <div className="stat-card-label">Customers</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => navigate("/create-bill")}>
                <div className="quick-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <span>Create Bill</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate("/admin/create-product")}>
                <div className="quick-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <span>Add Product</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate("/admin/reports")}>
                <div className="quick-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <span>Reports</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate("/admin/settings")}>
                <div className="quick-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Bills */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Bills</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/bills")}>
              View All
            </button>
          </div>
          
          {stats.recentBills.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <h3 className="empty-state-title">No bills yet</h3>
              <p className="empty-state-description">Create your first bill to get started</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bill ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBills.map((bill) => (
                    <tr key={bill._id}>
                      <td>
                        <span className="bill-id">#{bill._id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td>{bill.customerName}</td>
                      <td>
                        <span className="amount">{formatCurrency(bill.totalAmount)}</span>
                      </td>
                      <td>{getStatusBadge(bill.status)}</td>
                      <td>{formatDate(bill.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => navigate(`/view-bill/${bill._id}`)}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Additional Styles */}
      <style>{`
        .bill-id {
          font-family: monospace;
          font-weight: 600;
          color: var(--primary-color);
        }

        .amount {
          font-weight: 600;
          color: var(--text-primary);
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .quick-action-btn:hover {
          background: var(--card-bg);
          border-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .quick-action-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .quick-action-btn span {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
