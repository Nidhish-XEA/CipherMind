// 🚨 VULNERABLE AUTHENTICATION SYSTEM - DEMO FOR CIPHERMIND 🚨
// This code contains multiple critical security vulnerabilities

const express = require('express');
const crypto = require('crypto');
const app = express();

// ❌ CRITICAL: Hardcoded admin credentials
const ADMIN_KEY = "ADMIN_SECRET_123";
const DB_PASSWORD = "super_secret_password";

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // ❌ CRITICAL: SQL Injection vulnerability
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const user = await db.query(query);
    
    if (user) {
        // ❌ CRITICAL: Command Injection vulnerability
        const command = `echo "User ${username} logged in" >> /var/log/auth.log`;
        exec(command, (error, stdout, stderr) => {
            console.log('Log updated');
        });
        
        // ❌ HIGH: XSS vulnerability in response
        res.send(`
            <h2>Welcome ${username}!</h2>
            <p>Your session is now active.</p>
            <div>${req.body.userMessage}</div>
        `);
    }
});

// ❌ HIGH: Path Traversal vulnerability
app.get('/profile', (req, res) => {
    const filename = req.query.file || 'profile.json';
    getUserFile(filename);
});

function getUserFile(filename) {
    const fs = require('fs');
    // ❌ VULNERABLE: Direct file access with user input
    const data = fs.readFileSync(`/uploads/${filename}`);
    return data;
}

// ❌ MEDIUM: Weak cryptography
function encryptData(data, key) {
    // ❌ VULNERABLE: Using deprecated createCipher
    const cipher = crypto.createCipher('aes-128-cbc', key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// ❌ MEDIUM: Insecure random session generation
function generateSessionToken() {
    // ❌ VULNERABLE: Using predictable Math.random()
    return Math.random().toString(36).substring(2, 15);
}

// ❌ MEDIUM: CSRF vulnerability in fund transfer
app.post('/transfer', (req, res) => {
    const { fromAccount, toAccount, amount, token } = req.body;
    
    // ❌ VULNERABLE: No CSRF token validation
    transferFunds(fromAccount, toAccount, amount, token);
    
    res.json({ success: true, message: 'Transfer completed' });
});

function transferFunds(fromAccount, toAccount, amount, token) {
    // Process fund transfer without proper validation
    console.log(`Transferring ${amount} from ${fromAccount} to ${toAccount}`);
}

// ❌ MEDIUM: Information disclosure in error messages
app.get('/admin', (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            throw new Error(`User ${req.user.id} is not authorized. Full user data: ${JSON.stringify(req.user)}`);
        }
        res.send('Admin panel');
    } catch (error) {
        res.status(500).send(error.message); // ❌ VULNERABLE: Exposes sensitive info
    }
});

// ❌ LOW: Missing security headers
app.use((req, res, next) => {
    // No security headers set
    next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
