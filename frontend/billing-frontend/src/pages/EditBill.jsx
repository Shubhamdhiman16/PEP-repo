import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBills, updateBill } from "../services/billingService";
=======
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBill, updateBill } from "../services/billingService";
import { getProducts } from "../services/productService";
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a

function EditBill() {
  const { id } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD

  const [bill, setBill] = useState({
    customerName: "",
    totalAmount: "",
  });

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const bills = await getBills();
        const currentBill = bills.find((b) => b._id === id);
        if (currentBill) setBill(currentBill);
      } catch (error) {
        console.error("Error fetching bill", error);
      }
    };

    fetchBill();
  }, [id]);

  const handleChange = (e) => {
    setBill({
      ...bill,
      [e.target.name]: e.target.value,
    });
=======
  const [bill, setBill] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    status: "pending",
  });
  const [items, setItems] = useState([
    { productId: "", productName: "", quantity: 1, price: 0, total: 0 }
  ]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billData, productsData] = await Promise.all([
          getBill(id),
          getProducts()
        ]);
        
        setBill({
          customerName: billData.customerName || "",
          customerEmail: billData.customerEmail || "",
          customerPhone: billData.customerPhone || "",
          status: billData.status || "pending",
        });
        
        if (billData.items && billData.items.length > 0) {
          setItems(billData.items);
        }
        
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching bill", error);
        alert("Failed to load bill");
        navigate("/bills");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBill({
      ...bill,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    
    if (name === "productId") {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        newItems[index] = {
          ...newItems[index],
          productId: value,
          productName: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
          total: selectedProduct.price * 1
        };
      }
    } else if (name === "quantity") {
      const qty = parseInt(value) || 0;
      newItems[index] = {
        ...newItems[index],
        quantity: qty,
        total: qty * newItems[index].price
      };
    } else if (name === "price") {
      const price = parseFloat(value) || 0;
      newItems[index] = {
        ...newItems[index],
        price: price,
        total: price * newItems[index].quantity
      };
    } else if (name === "total") {
      newItems[index] = {
        ...newItems[index],
        total: parseFloat(value) || 0
      };
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { productId: "", productName: "", quantity: 1, price: 0, total: 0 }
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!bill.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }
    
    const validItems = items.filter(item => item.productName && item.quantity > 0);
    if (validItems.length === 0) {
      newErrors.items = "At least one item is required";
    }
    
    if (calculateTotal() <= 0) {
      newErrors.total = "Total amount must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

    try {
      await updateBill(id, bill);
      alert("Bill updated successfully");
      navigate("/bills");
    } catch (error) {
      alert("Failed to update bill");
    }
  };

=======
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const validItems = items.filter(item => item.productName && item.quantity > 0);
      
      const billData = {
        ...bill,
        items: validItems,
        totalAmount: calculateTotal()
      };
      
      await updateBill(id, billData);
      alert("Bill updated successfully!");
      navigate("/bills");
    } catch (error) {
      alert("Failed to update bill: " + (error.message || "Unknown error"));
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
  return (
    <div>
      <Navbar />

<<<<<<< HEAD
      <div style={{ padding: "30px" }}>
        <h2>Edit Bill</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={bill.customerName}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="totalAmount"
            placeholder="Total Amount"
            value={bill.totalAmount}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#4a90e2",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Update Bill
          </button>
        </form>
      </div>
=======
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Edit Bill</h1>
            <p className="page-subtitle">Update bill details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Customer Details Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Customer Details
                </h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">
                    Customer Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    className={`form-input ${errors.customerName ? 'error' : ''}`}
                    placeholder="Enter customer name"
                    value={bill.customerName}
                    onChange={handleChange}
                    required
                  />
                  {errors.customerName && <span className="form-error">{errors.customerName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="customerEmail"
                      className="form-input"
                      placeholder="customer@example.com"
                      value={bill.customerEmail}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={bill.customerPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bill Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={bill.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bill Items Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                  Bill Items
                </h3>
                <button type="button" className="btn btn-sm btn-secondary" onClick={addItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Item
                </button>
              </div>
              <div className="card-body">
                {errors.items && <div className="alert alert-danger">{errors.items}</div>}
                
                <div className="items-table">
                  <div className="items-header">
                    <span>Product</span>
                    <span>Quantity</span>
                    <span>Price</span>
                    <span>Total</span>
                    <span></span>
                  </div>
                  
                  {items.map((item, index) => (
                    <div key={index} className="item-row">
                      <div className="item-field">
                        <select
                          name="productId"
                          className="form-select"
                          value={item.productId}
                          onChange={(e) => handleItemChange(index, e)}
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product._id} value={product._id}>
                              {product.name} - {formatCurrency(product.price)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="item-field">
                        <input
                          type="number"
                          name="quantity"
                          className="form-input"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, e)}
                        />
                      </div>
                      <div className="item-field">
                        <input
                          type="number"
                          name="price"
                          className="form-input"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, e)}
                        />
                      </div>
                      <div className="item-field">
                        <input
                          type="number"
                          name="total"
                          className="form-input"
                          value={item.total}
                          readOnly
                        />
                      </div>
                      <div className="item-field item-actions">
                        <button
                          type="button"
                          className="btn btn-icon btn-danger btn-sm"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          title="Remove Item"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.total && <div className="alert alert-danger">{errors.total}</div>}

                <div className="bill-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/bills")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16 }}></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Additional Styles */}
      <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .required {
          color: var(--danger);
        }

        .form-input.error,
        .form-select.error {
          border-color: var(--danger);
        }

        .items-table {
          margin-bottom: 24px;
        }

        .items-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 50px;
          gap: 12px;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .item-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 50px;
          gap: 12px;
          padding: 8px 0;
          align-items: center;
        }

        .item-field .form-input,
        .item-field .form-select {
          margin-bottom: 0;
        }

        .item-actions {
          display: flex;
          justify-content: center;
        }

        .bill-summary {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-top: 16px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .summary-row.total {
          border-top: 2px solid var(--border-color);
          margin-top: 8px;
          padding-top: 16px;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
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
          .form-grid {
            grid-template-columns: 1fr;
          }

          .items-header {
            display: none;
          }

          .item-row {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 16px;
            background: var(--bg-secondary);
            border-radius: var(--radius-md);
            margin-bottom: 12px;
          }

          .item-field {
            width: 100%;
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
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
    </div>
  );
}

export default EditBill;
