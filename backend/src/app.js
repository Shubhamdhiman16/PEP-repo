const cors = require("cors");
const express = require("express");
const authRoutes = require("./routers/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/billing", require("./routers/billing.routes"));
app.use("/api/products", require("./routers/product.routes"));
app.use("/api/reports", require("./routers/reports.routes"));

module.exports = app;
