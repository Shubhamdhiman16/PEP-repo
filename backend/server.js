require("dotenv").config();   // 👈 ADD THIS

const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

// DB connection
<<<<<<< HEAD
<<<<<<< HEAD
mongoose
  .connect("mongodb://127.0.0.1:27017/pep-billing")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
=======
=======
>>>>>>> 2b7c13c (file added)
// DB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/pep-billing")
  .then(() => {
    console.log("MongoDB connected");
    // start server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

<<<<<<< HEAD
>>>>>>> 649a4f5627c18cda61aed714307f2bc5c61773d4
=======
>>>>>>> 2b7c13c (file added)
