import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBills, deleteBill } from "../services/billingService";

function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await getBills();
      // Sort by date descending (newest first)
      const sortedBills = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBills(sortedBills);
    } catch (error) {
      console.error("Error fetching bills", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Filter bills based on search term and status filter
  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill._id?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && bill.status === statusFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await deleteBill(id);
        alert("Bill deleted successfully");
        fetchBills();
      } catch (error) {
        alert("Failed to delete bill");
      }
    }
  };

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
    const className = statusClasses[status] || "badge-info";
    return <span className={`badge ${className}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading bills...</p>
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
            <h1 className="page-title">All Bills</h1>
            <p className="page-subtitle">Manage and view all your billing records</p>
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

        {/* Search And Filter */}
        <div className="card mb-4">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="form-input"
                placeholder="Search by customer name or bill ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="filter-group">
              <button
                className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
              >
                All
              </button>
              <button
                className={`filter-btn ${statusFilter === "paid" ? "active" : ""}`}
                onClick={() => {
                  setStatusFilter("paid");
                  setCurrentPage(1);
                }}
              >
                Paid
              </button>
              <button
                className={`filter-btn ${statusFilter === "pending" ? "active" : ""}`}
                onClick={() => {
                  setStatusFilter("pending");
                  setCurrentPage(1);
                }}
              >
                Pending
              </button>
              <button
                className={`filter-btn ${statusFilter === "cancelled" ? "active" : ""}`}
                onClick={() => {
                  setStatusFilter("cancelled");
                  setCurrentPage(1);
                }}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Bills Table */}
        <div className="card">
          <div className="table-container">
            {filteredBills.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <h3 className="empty-state-title">No bills found</h3>
                <p className="empty-state-description">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first bill to get started"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <button className="btn btn-primary" onClick={() => navigate("/create-bill")}>
                    Create Bill
                  </button>
                )}
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Bill ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBills.map((bill) => (
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
                          {bill.customerPhone && (
                            <span className="customer-phone">{bill.customerPhone}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="items-count">{bill.items?.length || 0} items</span>
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
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(bill._id)}
                            title="Delete Bill"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          )}

          {/* Results count */}
          {filteredBills.length > 0 && (
            <div className="results-info">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBills.length)} of {filteredBills.length} bills
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

        .customer-info {
          display: flex;
          flex-direction: column;
        }

        .customer-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .customer-email,
        .customer-phone {
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .items-count {
          color: var(--text-secondary);
        }

        .amount {
          font-weight: 600;
          color: var(--text-primary);
        }

        .results-info {
          text-align: center;
          padding: 16px;
          font-size: 0.875rem;
          color: var(--text-secondary);
          border-top: 1px solid var(--border-color);
        }

        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
          }

          .search-input-wrapper {
            width: 100%;
          }

          .filter-group {
            width: 100%;
            justify-content: flex-start;
          }

          .table th:nth-child(3),
          .table td:nth-child(3),
          .table th:nth-child(6),
          .table td:nth-child(6) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Bills;
