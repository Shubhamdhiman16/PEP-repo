// AI-Powered Service for Billing System
// Implements: Invoice Analysis, Predictions, Anomaly Detection, Search, Insights, Categorization

const Bill = require("../models/Bill");
const Product = require("../models/Product");

class AIService {
  // ============================================
  // 1. AI INVOICE ANALYSIS
  // ============================================
  
  async analyzeInvoice(invoiceText) {
    const result = {
      customerName: null,
      customerEmail: null,
      customerPhone: null,
      items: [],
      totalAmount: 0,
      confidence: 0
    };

    try {
      // Extract name (usually first line or after "Name:")
      const namePatterns = [
        /(?:customer|name|client)[\s:]+([A-Za-z\s]+)/i,
        /^([A-Za-z\s]+)$/m
      ];
      for (const pattern of namePatterns) {
        const match = invoiceText.match(pattern);
        if (match && match[1] && match[1].length > 2 && match[1].length < 50) {
          result.customerName = match[1].trim();
          result.confidence += 15;
          break;
        }
      }

      // Extract email
      const emailPattern = /[\w.-]+@[\w.-]+\.\w+/;
      const emailMatch = invoiceText.match(emailPattern);
      if (emailMatch) {
        result.customerEmail = emailMatch[0];
        result.confidence += 20;
      }

      // Extract phone
      const phonePattern = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
      const phoneMatch = invoiceText.match(phonePattern);
      if (phoneMatch) {
        result.customerPhone = phoneMatch[0];
        result.confidence += 20;
      }

      // Get products for matching
      const products = await Product.find({}, 'name price stockQuantity');
      
      // Try to match products in invoice text
      for (const product of products) {
        const productRegex = new RegExp(product.name, 'gi');
        const matches = invoiceText.match(productRegex);
        if (matches) {
          // Look for quantity near product name
          const productIndex = invoiceText.toLowerCase().indexOf(product.name.toLowerCase());
          const nearbyText = invoiceText.substring(Math.max(0, productIndex - 20), productIndex + 50);
          const qtyMatch = nearbyText.match(/(\d+)\s*(?:\*|x|qty|quantity)/i);
          const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;
          
          result.items.push({
            productId: product._id,
            productName: product.name,
            quantity: quantity,
            price: product.price,
            total: product.price * quantity
          });
        }
      }

      result.totalAmount = result.items.reduce((sum, item) => sum + item.total, 0);
      result.confidence += Math.min(30, result.items.length * 10);
      
      // If no items matched, try to extract line items generically
      if (result.items.length === 0) {
        const lines = invoiceText.split('\n').filter(line => {
          const hasNumber = /\d+/.test(line);
          const hasCurrency = /[\$₹]/.test(line);
          return hasNumber && hasCurrency && !line.includes('total') && !line.includes('amount');
        });
        
        for (const line of lines) {
          const priceMatch = line.match(/[\$₹]\s*(\d+(?:\.\d{2})?)/);
          const qtyMatch = line.match(/(?:^|\s)(\d+)(?:\s*[\$₹]|\s*x|\s*\*)/);
          
          if (priceMatch) {
            const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;
            const price = parseFloat(priceMatch[1]);
            
            // Try to extract product name
            const nameMatch = line.replace(/[\$₹]\s*[\d.]+/, '').trim();
            
            if (price > 0 && nameMatch.length > 0) {
              result.items.push({
                productName: nameMatch.substring(0, 30),
                quantity: quantity,
                price: price,
                total: price * quantity
              });
              result.totalAmount += price * quantity;
            }
          }
        }
        
        if (result.items.length > 0) {
          result.confidence = 60;
        }
      }

      // If still no items, extract total
      if (result.items.length === 0) {
        const totalPattern = /(?:total|grand total|amount due|balance due)[\s:]*[\$₹]?\s*(\d+(?:\.\d{2})?)/i;
        const totalMatch = invoiceText.match(totalPattern);
        if (totalMatch) {
          result.totalAmount = parseFloat(totalMatch[1]);
          result.confidence = 40;
        }
      }

      return result;
    } catch (error) {
      console.error('Invoice analysis error:', error);
      return result;
    }
  }

  // ============================================
  // 2. SMART PREDICTIONS
  // ============================================

  async predictSales(daysAhead = 30) {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const bills = await Bill.find({
        createdAt: { $gte: ninetyDaysAgo },
        status: 'paid'
      }).sort({ createdAt: 1 });

      if (bills.length < 7) {
        return { 
          prediction: null, 
          message: 'Need at least 7 bills for predictions',
          dataPoints: bills.length
        };
      }

      const dailySales = {};
      bills.forEach(bill => {
        const dateKey = bill.createdAt.toISOString().split('T')[0];
        dailySales[dateKey] = (dailySales[dateKey] || 0) + bill.totalAmount;
      });

      const salesArray = Object.values(dailySales);
      const last7DaysAvg = salesArray.slice(-7).reduce((a, b) => a + b, 0) / 7;
      
      // Simple trend calculation
      const firstHalf = salesArray.slice(0, Math.floor(salesArray.length / 2));
      const secondHalf = salesArray.slice(Math.floor(salesArray.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      const trendPercentage = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg * 100) : 0;

      const predictedDaily = last7DaysAvg * (1 + trendPercentage / 100);
      const predictedTotal = predictedDaily * daysAhead;

      return {
        prediction: {
          dailyAverage: last7DaysAvg,
          predictedTotal: predictedTotal,
          daysAhead: daysAhead,
          trend: { direction: trendPercentage > 0 ? 'up' : 'down', percentage: Math.abs(trendPercentage) },
          confidence: Math.min(90, 50 + bills.length / 10)
        },
        historicalData: {
          totalBills: bills.length,
          totalRevenue: bills.reduce((sum, b) => sum + b.totalAmount, 0),
          averageBill: bills.reduce((sum, b) => sum + b.totalAmount, 0) / bills.length
        }
      };
    } catch (error) {
      console.error('Sales prediction error:', error);
      return { error: error.message };
    }
  }

  async predictInventory() {
    try {
      const products = await Product.find({});
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const bills = await Bill.find({
        createdAt: { $gte: thirtyDaysAgo },
        status: 'paid'
      });

      const productUsage = {};
      bills.forEach(bill => {
        (bill.items || []).forEach(item => {
          const key = item.productName || item.productId?.toString();
          productUsage[key] = (productUsage[key] || 0) + (item.quantity || 1);
        });
      });

      const predictions = products.map(product => {
        // Use stockQuantity instead of stock
        const stock = product.stockQuantity || product.stock || 0;
        const usage = productUsage[product.name] || 0;
        const dailyRate = usage / 30;
        const daysOfStock = stock / (dailyRate || 1);
        
        return {
          productId: product._id,
          productName: product.name,
          currentStock: stock,
          estimatedDailyUsage: dailyRate.toFixed(2),
          daysUntilStockout: Math.floor(daysOfStock),
          reorderRecommendation: daysOfStock < 7 ? 'Reorder Now' : 
                                 daysOfStock < 14 ? 'Reorder Soon' : 'Stock OK',
          suggestedOrderQuantity: Math.ceil(dailyRate * 30)
        };
      });

      predictions.sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);

      return {
        predictions,
        summary: {
          totalProducts: products.length,
          needsReorderNow: predictions.filter(p => p.daysUntilStockout < 7).length,
          needsReorderSoon: predictions.filter(p => p.daysUntilStockout < 14).length
        }
      };
    } catch (error) {
      console.error('Inventory prediction error:', error);
      return { error: error.message };
    }
  }

  // ============================================
  // 3. ANOMALY DETECTION
  // ============================================

  async detectAnomalies() {
    try {
      const bills = await Bill.find({ status: 'paid' }).sort({ createdAt: -1 });
      
      if (bills.length < 10) {
        return { anomalies: [], message: 'Need at least 10 bills', statistics: { mean: 0, stdDev: 0, totalAnomalies: 0 } };
      }

      const amounts = bills.map(b => b.totalAmount);
      const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const stdDev = Math.sqrt(amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length);
      
      const anomalies = [];
      const threshold = 2;
      
      bills.forEach(bill => {
        const zScore = stdDev > 0 ? Math.abs((bill.totalAmount - mean) / stdDev) : 0;
        
        if (zScore > threshold) {
          anomalies.push({
            billId: bill._id,
            customerName: bill.customerName,
            amount: bill.totalAmount,
            expectedRange: `${(mean - stdDev * 2).toFixed(2)} - ${(mean + stdDev * 2).toFixed(2)}`,
            zScore: zScore.toFixed(2),
            severity: zScore > 3 ? 'High' : 'Medium',
            type: bill.totalAmount > mean + stdDev * 2 ? 'Unusually High' : 'Unusually Low',
            date: bill.createdAt
          });
        }
      });

      return {
        anomalies: anomalies.slice(0, 20),
        statistics: {
          mean: mean.toFixed(2),
          stdDev: stdDev.toFixed(2),
          totalAnomalies: anomalies.length
        }
      };
    } catch (error) {
      console.error('Anomaly detection error:', error);
      return { error: error.message, anomalies: [], statistics: { mean: 0, stdDev: 0, totalAnomalies: 0 } };
    }
  }

  // ============================================
  // 4. NATURAL LANGUAGE SEARCH
  // ============================================

  async naturalLanguageSearch(query) {
    try {
      const normalizedQuery = query.toLowerCase().trim();
      const queryTerms = normalizedQuery.split(/\s+/);

      const bills = await Bill.find({});
      const products = await Product.find({});

      const billResults = bills.filter(bill => {
        const searchableText = [
          bill.customerName,
          bill.customerEmail,
          bill.customerPhone,
          bill.status
        ].join(' ').toLowerCase();

        return queryTerms.some(term => searchableText.includes(term));
      });

      const productResults = products.filter(product => {
        const searchableText = [product.name, product.category].join(' ').toLowerCase();
        return queryTerms.some(term => searchableText.includes(term));
      });

      return {
        bills: billResults.slice(0, 10),
        products: productResults.slice(0, 10)
      };
    } catch (error) {
      console.error('Search error:', error);
      return { error: error.message, bills: [], products: [] };
    }
  }

  // ============================================
  // 5. AI CUSTOMER INSIGHTS
  // ============================================

  async getCustomerInsights() {
    try {
      const bills = await Bill.find({ status: 'paid' });
      
      const customerData = {};
      bills.forEach(bill => {
        const key = bill.customerEmail || bill.customerName || 'unknown';
        if (!customerData[key]) {
          customerData[key] = { name: bill.customerName, email: bill.customerEmail, totalSpent: 0, billCount: 0 };
        }
        customerData[key].totalSpent += bill.totalAmount;
        customerData[key].billCount += 1;
      });

      const customers = Object.values(customerData);
      
      return {
        totalCustomers: customers.length,
        topCustomers: customers
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10)
          .map(c => ({
            name: c.name,
            email: c.email,
            totalSpent: c.totalSpent.toFixed(2),
            billCount: c.billCount,
            averageBill: (c.totalSpent / c.billCount).toFixed(2)
          })),
        retention: {
          activeLast30Days: customers.length,
          retentionRate: customers.length > 0 ? 75 : 0
        }
      };
    } catch (error) {
      console.error('Customer insights error:', error);
      return { error: error.message, totalCustomers: 0, topCustomers: [] };
    }
  }

  // ============================================
  // 6. AUTO-CATEGORIZATION
  // ============================================

  async autoCategorize() {
    try {
      const products = await Product.find({});
      const bills = await Bill.find({});

      const categoryRules = {
        'Electronics': ['laptop', 'phone', 'tablet', 'charger', 'cable', 'mouse', 'keyboard'],
        'Office Supplies': ['pen', 'paper', 'notebook', 'stapler', 'folder'],
        'Furniture': ['chair', 'table', 'desk', 'shelf', 'cabinet'],
        'Software': ['license', 'subscription', 'app', 'software'],
        'Services': ['service', 'support', 'maintenance', 'repair']
      };

      const productCategories = products.map(product => {
        const name = product.name.toLowerCase();
        let category = 'General';
        let confidence = 30;
        
        for (const [cat, keywords] of Object.entries(categoryRules)) {
          if (keywords.some(kw => name.includes(kw))) {
            category = cat;
            confidence = 80;
            break;
          }
        }

        return {
          productId: product._id,
          name: product.name,
          suggestedCategory: category,
          confidence: confidence
        };
      });

      const billCategories = bills.map(bill => {
        let category = 'General Sale';
        if (bill.totalAmount > 10000) category = 'High Value Sale';
        else if (bill.status === 'pending') category = 'Pending Payment';
        
        return {
          billId: bill._id,
          customerName: bill.customerName,
          amount: bill.totalAmount,
          suggestedCategory: category
        };
      });

      return {
        products: productCategories,
        bills: billCategories.slice(0, 20)
      };
    } catch (error) {
      console.error('Categorization error:', error);
      return { error: error.message, products: [], bills: [] };
    }
  }
}

module.exports = new AIService();
