require("dotenv").config();   // 👈 ADD THIS

const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

// DB connection
<<<<<<< HEAD
=======
// DB connection
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
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
=======

>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
