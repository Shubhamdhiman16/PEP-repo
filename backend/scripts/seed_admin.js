
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

const seedAdmin = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/pep-billing");
        console.log("MongoDB connected");

        const email = "admin@test.com";
        const password = "adminpassword";
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log("Admin already exists");
            existingAdmin.role = "admin"; // Ensure role is admin
            existingAdmin.password = hashedPassword; // Reset password to known
            await existingAdmin.save();
            console.log("Admin updated");
        } else {
            await User.create({
                name: "Super Admin",
                email,
                password: hashedPassword,
                role: "admin",
            });
            console.log("Admin created");
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
