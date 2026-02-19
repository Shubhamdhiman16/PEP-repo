import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getBills } from "../services/billingService";

function Reports() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");
  const [reportData, setReportData] = useState({
    totalSales: 0,
    totalBills: 0,
    paidBills: 0,
    pendingBills: 0,
    averageBillAmount: 0,
    categoryBreakdown: {},
  });

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const data = await getBills();
        setBills(data);
        calculateReport(data);
      } catch (error) {
        console.error("Error fetching bills", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  useEffect(() => {
    calculateReport(bills);
  }, [dateRange, bills]);

  const calculateReport = (billData) => {
    let filteredBills = billData;

    if (dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      if (dateRange === "today") {
        filterDate.setDate(now.getDate() - 1);
      } else if (dateRange === "week") {
        filterDate.setDate(now.getDate() - 7);
      } else if (dateRange === "month") {
        filterDate.setMonth(now.getMonth() - 1);
      }

      filteredBills = billData.filter(
        (bill) => new Date(bill.createdAt) >= filterDate
      );
    }

    const paidBills = filteredBills.filter(b => b.status === "paid");
    const pendingBills = filteredBills.filter(b => b.status === "pending");
    const totalSales = paidBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
    const totalBills = filteredBills.length;
    const averageBillAmount = totalBills > 0 ? totalSales / paidBills.length : 0;

    const categoryBreakdown = {};
    filteredBills.forEach((bill) => {
      if (bill.items) {
        bill.items.forEach((item) => {
          const category = item.category || "Other";
          if (!categoryBreakdown[category]) {
            categoryBreakdown[category] = 0;
          }
          categoryBreakdown[category] += item.total || 0;
        });
      }
    });

    setReportData({
      totalSales,
      totalBills,
      paidBills: paidBills.length,
      pendingBills: pendingBills.length,
      averageBillAmount: paidBills.length > 0 ? totalSales / paidBills.length : 0,
      categoryBreakdown,
    });
  };

  const exportToCSV = () => {
    const headers = ["Bill ID", "Customer Name", "Date", "Total Amount", "Status"];
    const rows = bills.map((bill) => [
      bill._id,
      bill.customerName,
      new Date(bill.createdAt).toLocaleDateString(),
      bill.totalAmount,
      bill.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading reports...</p>
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
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">View your sales performance and insights</p>
          </div>
          <div className="page-actions">
            <select
              className="form-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ width: "150px" }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
            <button className="btn btn-primary" onClick={exportToCSV}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{formatCurrency(reportData.totalSales)}</div>
            <div className="stat-card-label">Total Revenue</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{reportData.totalBills}</div>
            <div className="stat-card-label">Total Bills</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{reportData.paidBills}</div>
            <div className="stat-card-label">Paid Bills</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{reportData.pendingBills}</div>
            <div className="stat-card-label">Pending Bills</div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Sales by Category</h3>
          </div>
          <div className="card-body">
            {Object.keys(reportData.categoryBreakdown).length === 0 ? (
              <div className="empty-state">
                <p>No data available</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Sales Amount</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.categoryBreakdown).map(([category, amount]) => (
                      <tr key={category}>
                        <td>
                          <span className="badge badge-primary">{category}</span>
                        </td>
                        <td>
                          <span className="amount">{formatCurrency(amount)}</span>
                        </td>
                        <td>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${(amount / reportData.totalSales) * 100}%` }}
                            ></div>
                          </div>
                          <span className="percentage">{((amount / reportData.totalSales) * 100).toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Bills */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Bills</h3>
          </div>
          <div className="card-body">
            {bills.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <h3 className="empty-state-title">No bills found</h3>
                <p className="empty-state-description">Create your first bill to see reports</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Bill ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.slice(0, 10).map((bill) => (
                      <tr key={bill._id}>
                        <td>
                          <span className="bill-id">#{bill._id.slice(-6).toUpperCase()}</span>
                        </td>
                        <td>{bill.customerName}</td>
                        <td>{formatDate(bill.createdAt)}</td>
                        <td>
                          <span className="amount">{formatCurrency(bill.totalAmount)}</span>
                        </td>
                        <td>
                          <span className={`badge ${bill.status === "paid" ? "badge-success" : bill.status === "pending" ? "badge-warning" : "badge-danger"}`}>
                            {bill.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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

        .percentage {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-left: 8px;
        }

        .progress-bar {
          height: 8px;
          background: var(--bg-secondary);
          border-radius: 4px;
          overflow: hidden;
          display: inline-block;
          width: 100px;
          vertical-align: middle;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .page-actions {
            width: 100%;
            flex-wrap: wrap;
          }

          .page-actions .form-select,
          .page-actions .btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Reports;
