// 🔥 NEW VULNERABLE TEST CODE - Different Patterns
// Copy and paste this into CipherMind to test detection

const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const app = express();

// Database connection with hardcoded credentials
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'password123',
    database: 'userdb'
});

// ❌ CRITICAL: SQL Injection in login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // VULNERABLE: Direct string concatenation
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    connection.query(query, (err, results) => {
        if (results.length > 0) {
            // ❌ CRITICAL: Hardcoded JWT secret
            const token = jwt.sign({ userId: results[0].id }, 'super_secret_key_2024');
            
            // ❌ HIGH: No input validation
            res.cookie('auth', token);
            res.json({ success: true, token });
        } else {
            res.json({ success: false });
        }
    });
});

// ❌ CRITICAL: Command Injection in file operations
app.post('/upload', (req, res) => {
    const filename = req.body.filename;
    const content = req.body.content;
    
    // VULNERABLE: Executing user input in shell command
    const command = `echo "${content}" > /uploads/${filename}`;
    require('child_process').exec(command, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: 'Upload failed' });
        } else {
            res.json({ success: true });
        }
    });
});

// ❌ HIGH: XSS in user profile
app.get('/profile/:id', (req, res) => {
    const userId = req.params.id;
    
    // Simulated user data
    const user = {
        id: userId,
        name: req.query.name || 'Anonymous',
        bio: req.query.bio || 'No bio',
        avatar: req.query.avatar || '/default.png'
    };
    
    // ❌ VULNERABLE: Direct HTML rendering
    res.send(`
        <html>
        <body>
            <h1>Welcome ${user.name}</h1>
            <p>Bio: ${user.bio}</p>
            <img src="${user.avatar}" />
            <div>${req.query.message}</div>
        </body>
        </html>
    `);
});

// ❌ HIGH: Path Traversal in file access
app.get('/download', (req, res) => {
    const file = req.query.file;
    
    // ❌ VULNERABLE: No path validation
    const filePath = `/home/user/files/${file}`;
    
    const fs = require('fs');
    try {
        const data = fs.readFileSync(filePath);
        res.send(data);
    } catch (error) {
        res.status(404).send('File not found');
    }
});

// ❌ MEDIUM: Weak random number generation
function generateSessionToken() {
    // ❌ VULNERABLE: Using Math.random() for security
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

// ❌ MEDIUM: Weak cryptography
function encryptPassword(password) {
    // ❌ VULNERABLE: Using deprecated crypto.createCipher
    const cipher = crypto.createCipher('aes-128-cbc', 'encryption_key');
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// ❌ MEDIUM: Insecure deserialization
app.post('/api/data', (req, res) => {
    const data = req.body.data;
    
    // ❌ VULNERABLE: Parsing user input without validation
    const parsed = JSON.parse(data);
    
    // Direct use of user-controlled data
    if (parsed.admin === true) {
        res.json({ adminPanel: true, allUsers: getAllUsers() });
    } else {
        res.json({ user: parsed });
    }
});

// ❌ HIGH: No rate limiting on sensitive operations
app.post('/reset-password', (req, res) => {
    const email = req.body.email;
    
    // No rate limiting - vulnerable to enumeration
    if (email.endsWith('@company.com')) {
        sendPasswordReset(email);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// ❌ CRITICAL: Information disclosure in error messages
app.use((err, req, res, next) => {
    // ❌ VULNERABLE: Exposing internal details
    res.status(500).json({
        error: err.message,
        stack: err.stack,
        database: process.env.DB_CONNECTION_STRING,
        apiKeys: process.env
    });
});

// ❌ MEDIUM: Insecure direct object reference
app.get('/user/:id/orders', (req, res) => {
    const userId = req.params.id;
    
    // ❌ VULNERABLE: No authorization check
    const orders = getUserOrders(userId);
    res.json({ orders });
});

// ❌ HIGH: CSRF vulnerability
app.post('/transfer-funds', (req, res) => {
    const { fromAccount, toAccount, amount } = req.body;
    
    // ❌ VULNERABLE: No CSRF token validation
    transferMoney(fromAccount, toAccount, amount);
    res.json({ success: true });
});

// Helper functions (simulated)
function getAllUsers() { return ['user1', 'user2', 'admin']; }
function getUserOrders(id) { return ['order1', 'order2']; }
function transferMoney(from, to, amount) { console.log(`Transferred ${amount} from ${from} to ${to}`); }
function sendPasswordReset(email) { console.log(`Reset sent to ${email}`); }

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
