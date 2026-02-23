const cors = require("cors");
const express = require("express");
const authRoutes = require("./routers/auth.routes");
const billingRoutes = require("./routers/billing.routes");
const aiRoutes = require("./routers/ai.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/ai", aiRoutes);

module.exports = app;
