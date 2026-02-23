
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAdminProduct() {
    try {
        // 1. Login
        console.log("Logging in...");
        // Assuming the user you updated is sarthak3596@gmail.com (or the last user created)
        // Since I don't know the password for sure, I'll try the one I saw in similar contexts or create a new admin user if this fails
        // BUT better strategy: Create a NEW guaranteed admin user for this test.
    } catch (err) {
        // ...
    }
}

// Better approach: Create a fresh admin, login, create product
const User = require('./src/models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function debugProductFlow() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/pep-billing');

        // 1. Create Temp Admin
        const email = "debug_admin_" + Date.now() + "@test.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: "Debug Admin",
            email,
            password: hashedPassword,
            role: "admin"
        });
        console.log(`Step 1: Created Admin User (${email})`);

        // 2. Login via API
        console.log("Step 2: Attempting Login...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        const token = loginRes.data.token;
        console.log("   -> Login Success. Token obtained.");

        // 3. Create Product
        console.log("Step 3: Attempting to Create Product...");
        try {
            const productRes = await axios.post(`${API_URL}/products`, {
                name: "Debug Product",
                price: 100,
                stock: 10
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("   -> SUCCESS: Product Created:", productRes.data);
        } catch (postErr) {
            console.error("   -> PRODCUT CREATION FAILED");
            if (postErr.response) {
                console.error("      Status:", postErr.response.status);
                // console.error("      Data:", postErr.response.data);
                console.dir(postErr.response.data, { depth: null });
            } else {
                console.error("      Error:", postErr.message);
            }
        }

        await mongoose.connection.close();

    } catch (err) {
        console.error("CRITICAL FAILURE:", err);
    }
}

debugProductFlow();
