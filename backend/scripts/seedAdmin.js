
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

// Connect from scripts folder to backend root
const DB_URI = "mongodb://127.0.0.1:27017/pep-billing";

const seedAdmin = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB.");

        const existingAdmin = await User.findOne({ email: "admin@example.com" });
        if (existingAdmin) {
            console.log("Admin `admin@example.com` already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        await User.create({
            name: "Super Admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin Created: admin@example.com / admin123");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
};

seedAdmin();
