const API_URL = 'http://localhost:5000/api';

export const analyzeInvoice = async (invoiceText) => {
  const response = await fetch(`${API_URL}/ai/analyze-invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invoiceText })
  });
  return response.json();
};

export const predictSales = async (daysAhead = 30) => {
  const response = await fetch(`${API_URL}/ai/predict-sales?daysAhead=${daysAhead}`);
  return response.json();
};

export const predictInventory = async () => {
  const response = await fetch(`${API_URL}/ai/predict-inventory`);
  return response.json();
};

export const detectAnomalies = async () => {
  const response = await fetch(`${API_URL}/ai/detect-anomalies`);
  return response.json();
};

export const naturalLanguageSearch = async (query) => {
  const response = await fetch(`${API_URL}/ai/search?query=${encodeURIComponent(query)}`);
  return response.json();
};

export const getCustomerInsights = async () => {
  const response = await fetch(`${API_URL}/ai/customer-insights`);
  return response.json();
};

export const autoCategorize = async () => {
  const response = await fetch(`${API_URL}/ai/auto-categorize`);
  return response.json();
};
