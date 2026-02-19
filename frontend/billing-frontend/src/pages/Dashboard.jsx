import { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import { useNavigate } from "react-router-dom";
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
import Navbar from "../components/Navbar";
import { getBills } from "../services/billingService";

function Dashboard() {
  const [bills, setBills] = useState([]);
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getBills();
        setBills(data);
      } catch (error) {
        console.error("Error fetching bills", error);
<<<<<<< HEAD
=======
      } finally {
        setLoading(false);
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
      }
    };

    fetchBills();
  }, []);

<<<<<<< HEAD
  const totalBills = bills.length;
  const totalAmount = bills.reduce(
    (sum, bill) => sum + Number(bill.totalAmount),
    0
  );
=======
  // Calculate statistics
  const totalBills = bills.length;
  const totalAmount = bills.reduce((sum, bill) => sum + Number(bill.totalAmount || 0), 0);
  const paidBills = bills.filter(bill => bill.status === "paid").length;
  const pendingBills = bills.filter(bill => bill.status === "pending").length;
  const cancelledBills = bills.filter(bill => bill.status === "cancelled").length;
  const paidAmount = bills.filter(bill => bill.status === "paid").reduce((sum, bill) => sum + Number(bill.totalAmount || 0), 0);
  const pendingAmount = bills.filter(bill => bill.status === "pending").reduce((sum, bill) => sum + Number(bill.totalAmount || 0), 0);

  // Get recent bills (last 5)
  const recentBills = [...bills]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      paid: "badge-success",
      pending: "badge-warning",
      cancelled: "badge-danger",
    };
    return (
      <span className={`badge ${statusClasses[status] || "badge-info"}`}>
        {status}
      </span>
    );
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
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a

  return (
    <div>
      <Navbar />

<<<<<<< HEAD
      <div style={{ padding: "30px" }}>
        <h2>User Dashboard</h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {/* Total Bills Card */}
          <div
            style={{
              padding: "20px",
              background: "#4a90e2",
              color: "white",
              borderRadius: "8px",
              width: "200px",
              textAlign: "center",
            }}
          >
            <h3>Total Bills</h3>
            <p style={{ fontSize: "24px" }}>{totalBills}</p>
          </div>

          {/* Total Amount Card */}
          <div
            style={{
              padding: "20px",
              background: "#6a5acd",
              color: "white",
              borderRadius: "8px",
              width: "200px",
              textAlign: "center",
            }}
          >
            <h3>Total Amount</h3>
            <p style={{ fontSize: "24px" }}>₹{totalAmount}</p>
          </div>
        </div>
      </div>
=======
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back! Here's an overview of your billing activity.</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => navigate("/create-bill")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              New Bill
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Total Bills */}
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{totalBills}</div>
            <div className="stat-card-label">Total Bills</div>
          </div>

          {/* Total Amount */}
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{formatCurrency(totalAmount)}</div>
            <div className="stat-card-label">Total Amount</div>
          </div>

          {/* Paid Bills */}
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{paidBills}</div>
            <div className="stat-card-label">Paid Bills</div>
            <div className="stat-card-change positive">
              {formatCurrency(paidAmount)} collected
            </div>
          </div>

          {/* Pending Bills */}
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{pendingBills}</div>
            <div className="stat-card-label">Pending Bills</div>
            <div className="stat-card-change negative">
              {formatCurrency(pendingAmount)} pending
            </div>
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
                <span>Create New Bill</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate("/bills")}>
                <div className="quick-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <span>View All Bills</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate("/admin/products")}>
                <div className="quick-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                </div>
                <span>Manage Products</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate("/admin/reports")}>
                <div className="quick-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <span>View Reports</span>
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
          
          {recentBills.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <h3 className="empty-state-title">No bills yet</h3>
              <p className="empty-state-description">Create your first bill to get started</p>
              <button className="btn btn-primary" onClick={() => navigate("/create-bill")}>
                Create Bill
              </button>
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
                  {recentBills.map((bill) => (
                    <tr key={bill._id}>
                      <td>
                        <span className="bill-id">#{bill._id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td>
                        <div className="customer-info">
                          <span className="customer-name">{bill.customerName}</span>
                          {bill.customerEmail && (
                            <span className="customer-email">{bill.customerEmail}</span>
                          )}
                        </div>
                      </td>
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
                            title="View Bill"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => navigate(`/edit-bill/${bill._id}`)}
                            title="Edit Bill"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
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
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
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

        .bill-id {
          font-family: monospace;
          font-weight: 600;
          color: var(--primary-color);
        }

        .customer-info {
          display: flex;
          flex-direction: column;
        }

        .customer-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .customer-email {
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .amount {
          font-weight: 600;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .page-actions {
            width: 100%;
          }

          .page-actions .btn {
            width: 100%;
          }
        }
      `}</style>
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
    </div>
  );
}

export default Dashboard;
