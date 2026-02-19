import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createProduct } from "../services/productService";

function CreateProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!product.name.trim()) {
      newErrors.name = "Product name is required";
    }
    
    if (!product.price || parseFloat(product.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    
    if (product.stockQuantity && parseInt(product.stockQuantity) < 0) {
      newErrors.stockQuantity = "Stock quantity cannot be negative";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...product,
        price: parseFloat(product.price),
        stockQuantity: parseInt(product.stockQuantity) || 0,
      };
      
      await createProduct(productData);
      alert("Product created successfully!");
      navigate("/admin/products");
    } catch (error) {
      alert("Failed to create product: " + (error.message || "Unknown error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverages",
    "Office Supplies",
    "Home & Garden",
    "Sports",
    "Books",
    "Other"
  ];

  return (
    <div>
      <Navbar />

      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Add New Product</h1>
            <p className="page-subtitle">Create a new product in your inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Basic Info Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                  Basic Information
                </h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">
                    Product Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter product name"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    placeholder="Enter product description"
                    value={product.description}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={product.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Stock Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Pricing & Stock
                </h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">
                    Price (₹) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    className={`form-input ${errors.price ? 'error' : ''}`}
                    placeholder="Enter price"
                    value={product.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                  {errors.price && <span className="form-error">{errors.price}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    className={`form-input ${errors.stockQuantity ? 'error' : ''}`}
                    placeholder="Enter stock quantity"
                    value={product.stockQuantity}
                    onChange={handleChange}
                    min="0"
                  />
                  {errors.stockQuantity && <span className="form-error">{errors.stockQuantity}</span>}
                  <span className="form-hint">Leave empty or enter 0 if not tracking stock</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin/products")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16 }}></span>
                  Creating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Create Product
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
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
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
          min-height: 100px;
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
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
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

export default CreateProduct;
