import { useState, useEffect } from 'react';
import { 
  predictSales, 
  predictInventory, 
  detectAnomalies, 
  getCustomerInsights, 
  autoCategorize 
} from '../services/aiService';

const AIDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [salesPrediction, setSalesPrediction] = useState(null);
  const [inventoryPrediction, setInventoryPrediction] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [customerInsights, setCustomerInsights] = useState(null);
  const [categories, setCategories] = useState(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sales, inventory, anomalyData, insights, cats] = await Promise.all([
        predictSales(30),
        predictInventory(),
        detectAnomalies(),
        getCustomerInsights(),
        autoCategorize()
      ]);
      setSalesPrediction(sales);
      setInventoryPrediction(inventory);
      setAnomalies(anomalyData);
      setCustomerInsights(insights);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading AI data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const renderOverview = () => (
    <div className="ai-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Sales Prediction</h3>
          {salesPrediction?.prediction ? (
            <>
              <p className="stat-value">${salesPrediction.prediction.predictedTotal.toFixed(2)}</p>
              <p className="stat-label">Predicted for next 30 days</p>
              <span className={`badge ${salesPrediction.prediction.trend.direction === 'up' ? 'success' : 'danger'}`}>
                {salesPrediction.prediction.trend.direction === 'up' ? '↑' : '↓'} {Math.abs(salesPrediction.prediction.trend.percentage).toFixed(1)}%
              </span>
            </>
          ) : (
            <p className="stat-label">Need more data</p>
          )}
        </div>

        <div className="stat-card">
          <h3>Inventory Alerts</h3>
          {inventoryPrediction?.summary ? (
            <>
              <p className="stat-value">{inventoryPrediction.summary.needsReorderNow}</p>
              <p className="stat-label">Need immediate reorder</p>
              <span className="badge warning">{inventoryPrediction.summary.needsReorderSoon} soon</span>
            </>
          ) : (
            <p className="stat-label">No products</p>
          )}
        </div>

        <div className="stat-card">
          <h3>Anomalies Detected</h3>
          {anomalies?.statistics ? (
            <>
              <p className="stat-value">{anomalies.statistics.totalAnomalies}</p>
              <p className="stat-label">Unusual patterns found</p>
              <span className="badge info">Z-score based</span>
            </>
          ) : (
            <p className="stat-label">Need more data</p>
          )}
        </div>

        <div className="stat-card">
          <h3>Total Customers</h3>
          {customerInsights ? (
            <>
              <p className="stat-value">{customerInsights.totalCustomers}</p>
              <p className="stat-label">Active customers</p>
              <span className="badge success">{customerInsights.retention?.retentionRate || 0}% retention</span>
            </>
          ) : (
            <p className="stat-label">No customers</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderPredictions = () => (
    <div className="ai-predictions">
      <h2>Sales and Inventory Predictions</h2>
      
      <div className="section-card">
        <h3>Sales Forecast (30 Days)</h3>
        {salesPrediction?.prediction ? (
          <div className="prediction-details">
            <div className="metric">
              <span className="label">Daily Average</span>
              <span className="value">${salesPrediction.prediction.dailyAverage.toFixed(2)}</span>
            </div>
            <div className="metric">
              <span className="label">Predicted Total</span>
              <span className="value">${salesPrediction.prediction.predictedTotal.toFixed(2)}</span>
            </div>
            <div className="metric">
              <span className="label">Trend</span>
              <span className={`value ${salesPrediction.prediction.trend.direction === 'up' ? 'success' : 'danger'}`}>
                {salesPrediction.prediction.trend.direction === 'up' ? 'Up' : 'Down'} 
                {Math.abs(salesPrediction.prediction.trend.percentage).toFixed(1)}%
              </span>
            </div>
            <div className="metric">
              <span className="label">Confidence</span>
              <span className="value">{salesPrediction.prediction.confidence.toFixed(0)}%</span>
            </div>
          </div>
        ) : (
          <p>Loading predictions...</p>
        )}
      </div>

      <div className="section-card">
        <h3>Inventory Demand</h3>
        {inventoryPrediction?.predictions ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Daily Usage</th>
                <th>Days Left</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {inventoryPrediction.predictions.slice(0, 10).map((item, idx) => (
                <tr key={idx} className={item.daysUntilStockout < 7 ? 'urgent' : item.daysUntilStockout < 14 ? 'warning' : ''}>
                  <td>{item.productName}</td>
                  <td>{item.currentStock}</td>
                  <td>{item.estimatedDailyUsage}</td>
                  <td>{item.daysUntilStockout}</td>
                  <td>
                    <span className={`badge ${item.reorderRecommendation === 'Reorder Now' ? 'danger' : item.reorderRecommendation === 'Reorder Soon' ? 'warning' : 'success'}`}>
                      {item.reorderRecommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading inventory data...</p>
        )}
      </div>
    </div>
  );

  const renderAnomalies = () => (
    <div className="ai-anomalies">
      <h2>Anomaly Detection</h2>
      
      {anomalies?.statistics && (
        <div className="stats-row">
          <div className="mini-stat">
            <span className="value">${anomalies.statistics.mean}</span>
            <span className="label">Average Bill</span>
          </div>
          <div className="mini-stat">
            <span className="value">${anomalies.statistics.stdDev}</span>
            <span className="label">Std Deviation</span>
          </div>
          <div className="mini-stat">
            <span className="value">{anomalies.statistics.totalAnomalies}</span>
            <span className="label">Anomalies</span>
          </div>
        </div>
      )}

      {anomalies?.anomalies?.length > 0 ? (
        <div className="anomalies-list">
          {anomalies.anomalies.map((anomaly, idx) => (
            <div key={idx} className={`anomaly-card ${anomaly.severity.toLowerCase()}`}>
              <div className="anomaly-header">
                <span className={`severity-badge ${anomaly.severity.toLowerCase()}`}>{anomaly.severity}</span>
                <span className="anomaly-type">{anomaly.type}</span>
              </div>
              <p className="customer">{anomaly.customerName || 'Unknown'}</p>
              <p className="amount">${anomaly.amount}</p>
              <p className="expected">Expected: {anomaly.expectedRange}</p>
              <p className="zscore">Z-Score: {anomaly.zScore}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No anomalies detected. Your billing patterns look normal!</p>
      )}
    </div>
  );

  const renderInsights = () => (
    <div className="ai-insights">
      <h2>Customer Insights</h2>
      
      {customerInsights?.topCustomers && (
        <>
          <div className="section-card">
            <h3>Top Customers</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total Spent</th>
                  <th>Bills</th>
                  <th>Avg Bill</th>
                </tr>
              </thead>
              <tbody>
                {customerInsights.topCustomers.map((customer, idx) => (
                  <tr key={idx}>
                    <td>{customer.name || 'N/A'}</td>
                    <td>{customer.email || 'N/A'}</td>
                    <td>${customer.totalSpent}</td>
                    <td>{customer.billCount}</td>
                    <td>${customer.averageBill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="ai-categories">
      <h2>Auto-Categorization</h2>
      
      <div className="section-card">
        <h3>Product Categories</h3>
        {categories?.products ? (
          <div className="category-grid">
            {categories.products.map((item, idx) => (
              <div key={idx} className="category-item">
                <span className="product-name">{item.name}</span>
                <span className="category-badge">
                  {item.suggestedCategory}
                </span>
                <span className="confidence">{item.confidence}%</span>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading categories...</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="ai-dashboard">
      <div className="ai-header">
        <h1>AI Dashboard</h1>
        <button onClick={loadAllData} disabled={loading} className="refresh-btn">
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      <div className="ai-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'predictions' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictions')}
        >
          Predictions
        </button>
        <button 
          className={`tab ${activeTab === 'anomalies' ? 'active' : ''}`}
          onClick={() => setActiveTab('anomalies')}
        >
          Anomalies
        </button>
        <button 
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
        <button 
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>

      <div className="ai-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'predictions' && renderPredictions()}
        {activeTab === 'anomalies' && renderAnomalies()}
        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'categories' && renderCategories()}
      </div>

      <style>{`
        .ai-dashboard { padding: 20px; }
        .ai-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .ai-header h1 { margin: 0; color: #333; }
        .refresh-btn { padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .refresh-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .ai-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .tab { padding: 10px 20px; background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 500; color: #6b7280; border-radius: 8px; }
        .tab:hover { background: #f3f4f6; }
        .tab.active { background: #4f46e5; color: white; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .stat-card h3 { margin: 0 0 10px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; }
        .stat-value { font-size: 32px; font-weight: 700; margin: 0; color: #111; }
        .stat-label { color: #6b7280; margin: 5px 0; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge.success { background: #d1fae5; color: #065f46; }
        .badge.warning { background: #fef3c7; color: #92400e; }
        .badge.danger { background: #fee2e2; color: #991b1b; }
        .badge.info { background: #dbeafe; color: #1e40af; }
        .section-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 20px; }
        .section-card h3 { margin: 0 0 15px 0; color: #333; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .data-table th { background: #f9fafb; font-weight: 600; color: #374151; }
        .data-table tr.urgent { background: #fef2f2; }
        .data-table tr.warning { background: #fffbeb; }
        .prediction-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
        .metric { display: flex; flex-direction: column; }
        .metric .label { font-size: 12px; color: #6b7280; }
        .metric .value { font-size: 20px; font-weight: 600; color: #111; }
        .metric .value.success { color: #059669; }
        .metric .value.danger { color: #dc2626; }
        .anomalies-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
        .anomaly-card { background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #e5e7eb; }
        .anomaly-card.high { border-left-color: #dc2626; }
        .anomaly-card.medium { border-left-color: #f59e0b; }
        .anomaly-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .severity-badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .severity-badge.high { background: #fee2e2; color: #991b1b; }
        .severity-badge.medium { background: #fef3c7; color: #92400e; }
        .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .category-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: #f9fafb; border-radius: 8px; }
        .category-badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; background: #e5e7eb; }
      `}</style>
    </div>
  );
};

export default AIDashboard;
