require("dotenv").config();
const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = 5001; // Debug port

mongoose
    .connect("mongodb://127.0.0.1:27017/pep-billing")
    .then(() => {
        console.log("MongoDB connected for Debug Server");
        app.listen(PORT, () => {
            console.log(`Debug Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.log(err));
