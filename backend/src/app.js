const cors = require("cors");
const express = require("express");
const authRoutes = require("./routers/auth.routes");
<<<<<<< HEAD
const billingRoutes = require("./routers/billing.routes");
=======

>>>>>>> 649a4f5627c18cda61aed714307f2bc5c61773d4

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
<<<<<<< HEAD
app.use("/api/billing", billingRoutes);
=======
app.use("/api/billing", require("./routers/billing.routes"));
>>>>>>> 649a4f5627c18cda61aed714307f2bc5c61773d4

module.exports = app;
