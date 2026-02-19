const cors = require("cors");
const express = require("express");
const authRoutes = require("./routers/auth.routes");
const billingRoutes = require("./routers/billing.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/billing", billingRoutes);

module.exports = app;
