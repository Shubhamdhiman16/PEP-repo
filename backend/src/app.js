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
app.use("/api/billing", billingRoutes);
=======
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a

module.exports = app;
