import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBill } from "../services/billingService";

function ViewBill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const data = await getBill(id);
        setBill(data);
      } catch (error) {
        console.error("Error fetching bill", error);
        alert("Failed to load bill");
        navigate("/bills");
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading bill...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <div className="empty-state">
            <h3>Bill not found</h3>
            <button className="btn btn-primary" onClick={() => navigate("/bills")}>
              Back to Bills
            </button>
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
        <div className="page-header no-print">
          <div className="page-header-content">
            <h1 className="page-title">View Bill</h1>
            <p className="page-subtitle">Bill #{bill._id.slice(-6).toUpperCase()}</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-secondary" onClick={() => navigate("/bills")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print
            </button>
            <button className="btn btn-warning" onClick={() => navigate(`/edit-bill/${bill._id}`)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </button>
          </div>
        </div>

        {/* Bill Details */}
        <div className="bill-container">
          <div className="bill-paper">
            {/* Bill Header */}
            <div className="bill-header">
              <div className="bill-logo">
                <div className="logo-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="logo-text">
                  <h2>Billing System</h2>
                  <p>Invoice</p>
                </div>
              </div>
              <div className="bill-info">
                <div className="bill-id-display">
                  <span className="label">Bill No.</span>
                  <span className="value">#{bill._id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="bill-date-display">
                  <span className="label">Date</span>
                  <span className="value">{formatDate(bill.createdAt)}</span>
                </div>
                <div className="bill-status-display">
                  <span className="label">Status</span>
                  <span className="value">{getStatusBadge(bill.status)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bill-customer">
              <h3>Bill To</h3>
              <div className="customer-details">
                <p className="customer-name">{bill.customerName}</p>
                {bill.customerEmail && <p>{bill.customerEmail}</p>}
                {bill.customerPhone && <p>{bill.customerPhone}</p>}
              </div>
            </div>

            {/* Bill Items Table */}
            <div className="bill-items">
              <table>
                <thead>
                  <tr>
                    <th>Sl No.</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items && bill.items.length > 0 ? (
                    bill.items.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.total)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bill Summary */}
            <div className="bill-summary">
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(bill.totalAmount)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>{formatCurrency(bill.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Bill Footer */}
            <div className="bill-footer">
              <p>Thank you for your business!</p>
              <p className="powered-by">Powered by Billing System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        .no-print {
          display: flex;
        }

        .bill-container {
          display: flex;
          justify-content: center;
          padding: 20px 0;
        }

        .bill-paper {
          background: white;
          width: 100%;
          max-width: 800px;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .bill-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #4f46e5;
        }

        .bill-logo {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #4f46e5, #3730a3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-text h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #4f46e5;
        }

        .logo-text p {
          margin: 0;
          font-size: 0.875rem;
          color: #64748b;
        }

        .bill-info {
          text-align: right;
        }

        .bill-id-display,
        .bill-date-display,
        .bill-status-display {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-bottom: 8px;
        }

        .bill-info .label {
          color: #64748b;
          font-size: 0.875rem;
        }

        .bill-info .value {
          font-weight: 600;
          color: #1e293b;
        }

        .bill-customer {
          margin-bottom: 30px;
        }

        .bill-customer h3 {
          font-size: 0.875rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
        }

        .customer-details .customer-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .customer-details p {
          margin: 0;
          color: #64748b;
          font-size: 0.875rem;
        }

        .bill-items table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        .bill-items th {
          background: #4f46e5;
          color: white;
          padding: 12px;
          text-align: left;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .bill-items td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
        }

        .bill-items tr:last-child td {
          border-bottom: none;
        }

        .bill-summary {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }

        .summary-details {
          width: 250px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
          color: #64748b;
        }

        .summary-row.total {
          border-bottom: none;
          border-top: 2px solid #4f46e5;
          margin-top: 10px;
          padding-top: 15px;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }

        .bill-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
        }

        .bill-footer p {
          margin: 0;
          font-size: 0.875rem;
        }

        .bill-footer .powered-by {
          font-size: 0.75rem;
          margin-top: 8px;
        }

        @media print {
          .no-print {
            display: none !important;
          }

          .page-container {
            padding: 0 !important;
          }

          .bill-container {
            padding: 0;
          }

          .bill-paper {
            box-shadow: none;
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .bill-header {
            flex-direction: column;
            gap: 20px;
          }

          .bill-info {
            text-align: left;
          }

          .bill-id-display,
          .bill-date-display,
          .bill-status-display {
            justify-content: flex-start;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .page-actions {
            width: 100%;
            flex-wrap: wrap;
          }

          .page-actions .btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default ViewBill;
