const cors = require("cors");
const express = require("express");
const authRoutes = require("./routers/auth.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/billing", require("./routers/billing.routes"));

module.exports = app;
