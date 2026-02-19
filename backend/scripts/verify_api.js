

const BASE_URL = "http://127.0.0.1:5000/api";



const fs = require('fs');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('verify_log.txt', msg + '\n');
};

async function verify() {
    try {
        fs.writeFileSync('verify_log.txt', '--- STARTING VERIFICATION ---\n');
        log("--- STARTING VERIFICATION ---");

        // 1. Login as Admin
        log("1. Logging in as Admin...");
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@test.com", password: "adminpassword" }),
        });
        const loginData = await loginRes.json();
        if (!loginData.token) throw new Error("Login failed: " + JSON.stringify(loginData));
        const token = loginData.token;
        log("   Success! Token received.");

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };

        // 2. Get Me
        log("2. Verifying /me...");
        const meRes = await fetch(`${BASE_URL}/auth/me`, { headers });
        const meData = await meRes.json();
        log(`   User: ${meData.name} (${meData.role})`);

        // 3. Create Product (Master Data)
        log("3. Creating Product...");
        const productRes = await fetch(`${BASE_URL}/products`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                name: "Test Laptop",
                price: 50000,
                stock: 10,
                description: "High performance laptop",
            }),
        });
        const product = await productRes.json();
        if (!product._id) throw new Error("Create Product failed: " + JSON.stringify(product));
        log(`   Product Created: ${product.name} (ID: ${product._id})`);

        // 4. Create Bill (Billing)
        log("4. Creating Bill...");
        const billRes = await fetch(`${BASE_URL}/billing`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                customerName: "John Doe",
                customerEmail: "john@example.com",
                items: [{ product: product._id, quantity: 2 }],
            }),
        });
        const bill = await billRes.json();
        if (!bill._id) throw new Error("Create Bill failed: " + JSON.stringify(bill));
        log(`   Bill Created. Total: ${bill.totalAmount} (Tax: ${bill.tax})`);

        // 5. Get Daily Reports (Reports)
        log("5. Checking Reports...");
        const reportRes = await fetch(`${BASE_URL}/reports/daily`, { headers });
        const report = await reportRes.json();
        log(`   Daily Sales: ${report.totalSales} (Count: ${report.count})`);

        // 6. Update Settings (Settings)
        log("6. Updating Settings...");
        const settingsRes = await fetch(`${BASE_URL}/settings`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ companyName: "Tech Solutions Ltd", taxRate: 0.20 }), // Changed Tax to 20%
        });
        const settings = await settingsRes.json();
        log(`   Settings Updated: ${settings.companyName} (Tax Rate: ${settings.taxRate})`);

        log("--- VERIFICATION COMPLETE (SUCCESS) ---");

    } catch (err) {
        log("\n!!! VERIFICATION FAILED !!!");
        log(err.stack || err);
    }
}

verify();

