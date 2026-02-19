const cors = require("cors");
const express = require("express");
const authRoutes = require("./routers/auth.routes");
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const billingRoutes = require("./routers/billing.routes");
=======

>>>>>>> 649a4f5627c18cda61aed714307f2bc5c61773d4
=======
const billingRoutes = require("./routers/billing.routes");
>>>>>>> 2b7c13c (file added)
=======
>>>>>>> 736e3cd (billing_controllers)

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
<<<<<<< HEAD
<<<<<<< HEAD
app.use("/api/billing", billingRoutes);
=======
app.use("/api/billing", require("./routers/billing.routes"));
>>>>>>> 649a4f5627c18cda61aed714307f2bc5c61773d4
=======
>>>>>>> 2b7c13c (file added)

module.exports = app;
