const http = require('http');

const postData = JSON.stringify({
    messages: [
        { role: 'user', content: 'Hello, this is a test message.' }
    ]
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/recommend',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

function makeRequest(index) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`Request ${index}: Status ${res.statusCode}`);
                resolve(res.statusCode);
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request ${index}: ${e.message}`);
            resolve(null);
        });

        req.write(postData);
        req.end();
    });
}

async function runTests() {
    console.log('--- Testing Rate Limiting (Expect 5 success, then 429) ---');
    for (let i = 1; i <= 7; i++) {
        await makeRequest(i);
        // Small delay to ensure order
        await new Promise(r => setTimeout(r, 100));
    }

    console.log('\n--- Testing Input Validation (Expect 400) ---');
    const longMessage = 'a'.repeat(5001);
    const longData = JSON.stringify({ messages: [{ role: 'user', content: longMessage }] });
    const longOptions = { ...options, headers: { ...options.headers, 'Content-Length': Buffer.byteLength(longData) } };

    const req = http.request(longOptions, (res) => {
        console.log(`Long Message Test: Status ${res.statusCode}`);
    });
    req.write(longData);
    req.end();
}

runTests();
