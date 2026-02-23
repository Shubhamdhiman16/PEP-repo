const Billing = require("../models/Billing");

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalSales = await Billing.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        // Get today's sales
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todaySales = await Billing.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        res.json({
            totalSales: totalSales[0]?.totalAmount || 0,
            totalOrders: totalSales[0]?.totalOrders || 0,
            todaySales: todaySales[0]?.totalAmount || 0,
            todayOrders: todaySales[0]?.totalOrders || 0
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Monthly Sales (For Chart)
exports.getMonthlySales = async (req, res) => {
    try {
        const monthlySales = await Billing.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalAmount: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id": 1 } } // Sort by month (Jan=1, Feb=2...)
        ]);

        res.json(monthlySales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
