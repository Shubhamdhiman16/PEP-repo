import { useState } from 'react';
import { analyzeInvoice } from '../services/aiService';
import { createBill } from '../services/billingService';
import { getProducts } from '../services/productService';

const InvoiceScanner = () => {
  const [invoiceText, setInvoiceText] = useState('');
  const [analyzedData, setAnalyzedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [manualEntry, setManualEntry] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [],
    totalAmount: 0
  });

  // Sample invoice templates
  const sampleInvoices = [
    {
      name: 'Sample 1 - Basic',
      text: `Customer: John Doe
Email: john@example.com
Phone: 9876543210

Item 1 * $100
Item 2 * $50
Item 3 * $25

Total: $175`
    },
    {
      name: 'Sample 2 - Restaurant',
      text: `Restaurant Bill
Customer: Jane Smith
Email: jane@restaurant.com
Phone: 9123456789

Burger x 2 = $200
Fries x 3 = $90
Coke x 2 = $40

Grand Total: $330`
    },
    {
      name: 'Sample 3 - Electronics',
      text: `Electronics Store
Customer: Bob Wilson
Email: bob@email.com
Phone: 9988776655

Laptop $500
Mouse $25
Keyboard $45

Total Amount Due: $570`
    }
  ];

  const loadSampleInvoice = (text) => {
    setInvoiceText(text);
    setAnalyzedData(null);
    setError('');
    setSuccess('');
  };

  const analyzeInvoiceText = async () => {
    if (!invoiceText.trim()) {
      setError('Please enter or paste invoice text');
      return;
    }

    setLoading(true);
    setError('');
    setAnalyzedData(null);

    try {
      const result = await analyzeInvoice(invoiceText);
      if (result) {
        setAnalyzedData(result);
        setManualEntry({
          customerName: result.customerName || '',
          customerEmail: result.customerEmail || '',
          customerPhone: result.customerPhone || '',
          items: result.items || [],
          totalAmount: result.totalAmount || 0
        });
      }
    } catch (err) {
      setError('Failed to analyze invoice: ' + err.message);
    }
    setLoading(false);
  };

  const loadProducts = async () => {
    try {
      const result = await getProducts();
      setProducts(result);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const addProduct = (product) => {
    const existing = selectedProducts.find(p => p.productId === product._id);
    if (existing) {
      setSelectedProducts(selectedProducts.map(p => 
        p.productId === product._id 
          ? { ...p, quantity: p.quantity + 1, total: (p.quantity + 1) * p.price }
          : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        total: product.price
      }]);
    }
    calculateTotal();
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
    } else {
      setSelectedProducts(selectedProducts.map(p => 
        p.productId === productId 
          ? { ...p, quantity, total: quantity * p.price }
          : p
      ));
    }
    calculateTotal();
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
    calculateTotal();
  };

  const calculateTotal = () => {
    const total = selectedProducts.reduce((sum, p) => sum + p.total, 0);
    setManualEntry(prev => ({ ...prev, totalAmount: total }));
  };

  const createBillFromInvoice = async () => {
    if (!manualEntry.customerName || manualEntry.items.length === 0) {
      setError('Please provide customer name and at least one item');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const billData = {
        customerName: manualEntry.customerName,
        customerEmail: manualEntry.customerEmail,
        customerPhone: manualEntry.customerPhone,
        items: manualEntry.items.length > 0 ? manualEntry.items : selectedProducts,
        totalAmount: manualEntry.items.length > 0 ? manualEntry.totalAmount : selectedProducts.reduce((sum, p) => sum + p.total, 0),
        status: 'pending'
      };

      await createBill(billData);
      setSuccess('Bill created successfully!');
      setAnalyzedData(null);
      setInvoiceText('');
      setSelectedProducts([]);
      setManualEntry({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        items: [],
        totalAmount: 0
      });
    } catch (err) {
      setError('Failed to create bill: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="invoice-scanner">
      <div className="scanner-header">
        <h1>Smart Invoice Scanner</h1>
        <p>AI-powered invoice parsing and bill creation</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="scanner-content">
        <div className="input-section">
          <div className="sample-invoices">
            <h3>Sample Invoices</h3>
            <div className="sample-buttons">
              {sampleInvoices.map((sample, idx) => (
                <button 
                  key={idx} 
                  className="sample-btn"
                  onClick={() => loadSampleInvoice(sample.text)}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          <div className="input-area">
            <label>Paste Invoice Text</label>
            <textarea
              value={invoiceText}
              onChange={(e) => setInvoiceText(e.target.value)}
              placeholder="Paste invoice or receipt text here...&#10;Example:&#10;Customer: John Doe&#10;Email: john@email.com&#10;Item 1 x $100&#10;Item 2 x $50"
              rows={12}
            />
          </div>

          <button 
            className="analyze-btn"
            onClick={analyzeInvoiceText}
            disabled={loading || !invoiceText.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze Invoice'}
          </button>
        </div>

        {analyzedData && (
          <div className="results-section">
            <div className="analysis-results">
              <h2>Analysis Results</h2>
              <div className="confidence-meter">
                <span>Confidence:</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${analyzedData.confidence}%` }}
                  />
                </div>
                <span>{analyzedData.confidence}%</span>
              </div>

              <div className="extracted-data">
                <div className="data-field">
                  <label>Customer Name:</label>
                  <input
                    type="text"
                    value={manualEntry.customerName}
                    onChange={(e) => setManualEntry({...manualEntry, customerName: e.target.value})}
                  />
                </div>
                <div className="data-field">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={manualEntry.customerEmail}
                    onChange={(e) => setManualEntry({...manualEntry, customerEmail: e.target.value})}
                  />
                </div>
                <div className="data-field">
                  <label>Phone:</label>
                  <input
                    type="text"
                    value={manualEntry.customerPhone}
                    onChange={(e) => setManualEntry({...manualEntry, customerPhone: e.target.value})}
                  />
                </div>
              </div>

              {analyzedData.items && analyzedData.items.length > 0 && (
                <div className="extracted-items">
                  <h3>Extracted Items</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyzedData.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price}</td>
                          <td>${item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="total-amount">
                <span>Total Amount:</span>
                <span className="amount">${manualEntry.totalAmount.toFixed(2)}</span>
              </div>

              <button 
                className="create-bill-btn"
                onClick={createBillFromInvoice}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Bill'}
              </button>
            </div>
          </div>
        )}

        {!analyzedData && (
          <div className="manual-entry-section">
            <h2>Manual Product Entry</h2>
            <p>Or add products manually:</p>
            
            <button className="load-products-btn" onClick={loadProducts}>
              Load Products
            </button>

            {products.length > 0 && (
              <div className="products-list">
                {products.map(product => (
                  <div key={product._id} className="product-item">
                    <span className="product-name">{product.name}</span>
                    <span className="product-price">${product.price}</span>
                    <button onClick={() => addProduct(product)}>Add</button>
                  </div>
                ))}
              </div>
            )}

            {selectedProducts.length > 0 && (
              <div className="selected-items">
                <h3>Selected Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map(item => (
                      <tr key={item.productId}>
                        <td>{item.productName}</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                          />
                        </td>
                        <td>${item.price}</td>
                        <td>${item.total}</td>
                        <td>
                          <button 
                            className="remove-btn"
                            onClick={() => removeProduct(item.productId)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="selected-total">
                  <strong>Total: ${selectedProducts.reduce((sum, p) => sum + p.total, 0).toFixed(2)}</strong>
                </div>
                <button 
                  className="create-bill-btn"
                  onClick={createBillFromInvoice}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Bill from Selected Items'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .invoice-scanner {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .scanner-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .scanner-header h1 {
          color: #333;
          margin-bottom: 10px;
        }
        .scanner-header p {
          color: #666;
        }
        .alert {
          padding: 12px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .alert-error {
          background: #fee2e2;
          color: #991b1b;
        }
        .alert-success {
          background: #d1fae5;
          color: #065f46;
        }
        .scanner-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        .input-section, .results-section, .manual-entry-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .sample-invoices {
          margin-bottom: 20px;
        }
        .sample-invoices h3 {
          margin-bottom: 10px;
          color: #333;
        }
        .sample-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .sample-btn {
          padding: 8px 16px;
          background: #e5e7eb;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }
        .sample-btn:hover {
          background: #d1d5db;
        }
        .input-area {
          margin-bottom: 20px;
        }
        .input-area label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }
        .input-area textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-family: monospace;
          font-size: 14px;
          resize: vertical;
        }
        .analyze-btn {
          width: 100%;
          padding: 14px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
        .analyze-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .analysis-results h2 {
          margin-bottom: 20px;
          color: #333;
        }
        .confidence-meter {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #4f46e5;
          transition: width 0.3s;
        }
        .extracted-data {
          margin-bottom: 20px;
        }
        .data-field {
          margin-bottom: 12px;
        }
        .data-field label {
          display: block;
          font-size: 13px;
          color: #666;
          margin-bottom: 4px;
        }
        .data-field input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
        }
        .extracted-items {
          margin-bottom: 20px;
        }
        .extracted-items h3 {
          margin-bottom: 10px;
          color: #333;
        }
        .extracted-items table, .selected-items table {
          width: 100%;
          border-collapse: collapse;
        }
        .extracted-items th, .extracted-items td,
        .selected-items th, .selected-items td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .extracted-items th, .selected-items th {
          background: #f9fafb;
          font-weight: 600;
        }
        .total-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .total-amount .amount {
          font-size: 24px;
          font-weight: 700;
          color: #4f46e5;
        }
        .create-bill-btn, .load-products-btn {
          width: 100%;
          padding: 14px;
          background: #059669;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
        .load-products-btn {
          background: #4f46e5;
          margin-bottom: 15px;
        }
        .products-list {
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 20px;
        }
        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .product-item button {
          padding: 6px 12px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .selected-total {
          text-align: right;
          padding: 15px;
          font-size: 18px;
          color: #059669;
        }
        .remove-btn {
          padding: 4px 8px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default InvoiceScanner;
