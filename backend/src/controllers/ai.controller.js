const aiService = require("../services/ai.service");

// AI Invoice Analysis
exports.analyzeInvoice = async (req, res) => {
  try {
    const { invoiceText } = req.body;
    if (!invoiceText) {
      return res.status(400).json({ message: 'Invoice text is required' });
    }
    const result = await aiService.analyzeInvoice(invoiceText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sales Predictions
exports.predictSales = async (req, res) => {
  try {
    const { daysAhead } = req.query;
    const result = await aiService.predictSales(parseInt(daysAhead) || 30);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Inventory Predictions
exports.predictInventory = async (req, res) => {
  try {
    const result = await aiService.predictInventory();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Anomaly Detection
exports.detectAnomalies = async (req, res) => {
  try {
    const result = await aiService.detectAnomalies();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Natural Language Search
exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const result = await aiService.naturalLanguageSearch(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Customer Insights
exports.getCustomerInsights = async (req, res) => {
  try {
    const result = await aiService.getCustomerInsights();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Auto-categorization
exports.autoCategorize = async (req, res) => {
  try {
    const result = await aiService.autoCategorize();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
