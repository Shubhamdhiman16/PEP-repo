import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProducts, deleteProduct } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        await deleteProduct(id);
        alert("Product deleted successfully");
        fetchProducts();
      }
    } catch (error) {
      alert("Failed to delete product");
      console.error(error);
    }
  };

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (categoryFilter === "all") return matchesSearch;
    return matchesSearch && product.category === categoryFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStockBadge = (quantity) => {
    if (quantity === 0) {
      return <span className="badge badge-danger">Out of Stock</span>;
    } else if (quantity < 10) {
      return <span className="badge badge-warning">Low Stock</span>;
    }
    return <span className="badge badge-success">In Stock</span>;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading products...</p>
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
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">Manage your product inventory</p>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/create-product")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-4">
          <div className="search-bar">
            <div className="search-input-wrapper" style={{ flex: 1 }}>
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="form-input"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <button 
                className={`filter-btn ${categoryFilter === "all" ? "active" : ""}`}
                onClick={() => setCategoryFilter("all")}
              >
                All
              </button>
              {categories.map(category => (
                <button 
                  key={category}
                  className={`filter-btn ${categoryFilter === category ? "active" : ""}`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="card">
          <div className="table-container">
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <h3 className="empty-state-title">No products found</h3>
                <p className="empty-state-description">
                  {searchTerm || categoryFilter !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Add your first product to get started"}
                </p>
                {!searchTerm && categoryFilter === "all" && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => navigate("/admin/create-product")}
                  >
                    Add Product
                  </button>
                )}
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="product-info">
                          <span className="product-name">{product.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="product-description">
                          {product.description?.substring(0, 50)}
                          {product.description?.length > 50 ? "..." : ""}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-primary">{product.category || "Uncategorized"}</span>
                      </td>
                      <td>
                        <span className="price">{formatCurrency(product.price)}</span>
                      </td>
                      <td>
                        <div className="stock-info">
                          <span className="stock-quantity">{product.stockQuantity}</span>
                          {getStockBadge(product.stockQuantity)}
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                            title="Edit Product"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product._id)}
                            title="Delete Product"
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
        </div>
      </div>

      {/* Additional Styles */}
      <style>{`
        .product-info {
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .product-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .price {
          font-weight: 600;
          color: var(--text-primary);
        }

        .stock-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stock-quantity {
          font-weight: 600;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
          }

          .search-input-wrapper {
            width: 100%;
          }

          .table th:nth-child(2),
          .table td:nth-child(2) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Products;
