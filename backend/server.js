require("dotenv").config();   // 👈 ADD THIS

const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

// DB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/pep-billing")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
