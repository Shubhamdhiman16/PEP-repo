const cors = require("cors");
const express = require("express");
const authRoutes = require("./routers/auth.routes");
<<<<<<< HEAD
const billingRoutes = require("./routers/billing.routes");
=======
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
<<<<<<< HEAD
app.use("/api/billing", require("./routers/billing.routes"));
app.use("/api/products", require("./routers/product.routes"));
app.use("/api/reports", require("./routers/reports.routes"));
=======
<<<<<<< HEAD
app.use("/api/billing", billingRoutes);
=======
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
>>>>>>> be81d74981367e8fa3244dce181999b810509a0a

module.exports = app;
