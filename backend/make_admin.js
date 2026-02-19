
const mongoose = require('mongoose');
const User = require('./src/models/User');

const DB_URI = 'mongodb://127.0.0.1:27017/pep-billing';

async function makeUserAdmin() {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to DB.");

        // Find the most recently created user
        const user = await User.findOne().sort({ createdAt: -1 });

        if (user) {
            console.log(`Found User: ${user.email} | Current Role: ${user.role}`);

            if (user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
                console.log(`UPDATED: User ${user.email} is now an ADMIN.`);
            } else {
                console.log("User is already an Admin.");
            }
        } else {
            console.log("No users found in database.");
        }

        mongoose.connection.close();
    } catch (err) {
        console.error("Error:", err);
    }
}

makeUserAdmin();
