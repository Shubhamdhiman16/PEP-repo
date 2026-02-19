import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function Settings() {
  const [settings, setSettings] = useState({
    storeName: "",
    storeAddress: "",
    storeEmail: "",
    storePhone: "",
    currency: "INR",
    taxRate: 18,
    invoicePrefix: "INV",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("storeSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: name === "taxRate" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage for now
    localStorage.setItem("storeSettings", JSON.stringify(settings));
    setMessage("Settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading settings...</p>
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
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your store and billing preferences</p>
          </div>
        </div>

        {message && (
          <div className="alert alert-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="settings-grid">
            {/* Store Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Store Information
                </h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    className="form-input"
                    placeholder="Enter store name"
                    value={settings.storeName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea
                    name="storeAddress"
                    className="form-textarea"
                    placeholder="Enter store address"
                    value={settings.storeAddress}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="storeEmail"
                      className="form-input"
                      placeholder="store@example.com"
                      value={settings.storeEmail}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="storePhone"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={settings.storePhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Settings */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Billing Settings
                </h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    name="currency"
                    className="form-select"
                    value={settings.currency}
                    onChange={handleChange}
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tax Rate (%)</label>
                  <input
                    type="number"
                    name="taxRate"
                    className="form-input"
                    placeholder="18"
                    value={settings.taxRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="form-hint">Enter tax rate as percentage (e.g., 18 for 18%)</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Invoice Prefix</label>
                  <input
                    type="text"
                    name="invoicePrefix"
                    className="form-input"
                    placeholder="INV"
                    value={settings.invoicePrefix}
                    onChange={handleChange}
                  />
                  <span className="form-hint">Prefix for invoice numbers (e.g., INV-001)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save Settings
            </button>
          </div>
        </form>
      </div>

      {/* Additional Styles */}
      <style>{`
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          font-size: 0.875rem;
          color: var(--text-primary);
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          resize: vertical;
          min-height: 80px;
        }

        .form-textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px;
          background: var(--card-bg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 1024px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default Settings;
