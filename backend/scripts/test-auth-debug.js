const API_URL = 'http://localhost:5000';

async function testAuth() {
    try {
        console.log('Testing Root Route...');
        try {
            const rootRes = await fetch(API_URL);
            const rootText = await rootRes.text();
            console.log('Root Route Response:', rootText);
        } catch (e) {
            console.log('Root Route Failed:', e.message);
        }

        console.log('Testing Registration...');
        const regResponse = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123'
            })
        });

        const text = await regResponse.text();
        console.log('Register Response Status:', regResponse.status);
        try {
            const regData = JSON.parse(text);
            console.log('Registration Response:', regData);
        } catch (e) {
            console.error('Failed to parse JSON response. Raw text:', text);
        }

    } catch (error) {
        console.error('Auth Test Failed:', error);
    }
}

testAuth();
