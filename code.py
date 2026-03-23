// 🚨 EXTREMELY VULNERABLE USER AUTHENTICATION SYSTEM
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class UserAuthSystem {
  constructor() {
    this.users = [];
    this.adminKey = "ADMIN_SECRET_123"; // Hardcoded admin key
    this.dbPath = path.join(__dirname, 'users.json');
    this.loadUsers();
  }

  // 🚨 SQL INJECTION VULNERABILITY
  async login(username, password) {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log("Executing query:", query);
    
    // Simulating database query with SQL injection
    if (username.includes("'") || username.includes("--")) {
      return { success: true, user: { username: "admin", role: "admin" } };
    }
    
    const user = this.users.find(u => u.username === username && u.password === password);
    return user ? { success: true, user } : { success: false };
  }

  // 🚨 HARDCODED CREDENTIALS
  getDatabaseConnection() {
    const dbConfig = {
      host: "localhost",
      username: "root",
      password: "password123", // Hardcoded password
      database: "production_db"
    };
    
    // Insecure connection without SSL
    return `mysql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`;
  }

  // 🚨 PATH TRAVERSAL VULNERABILITY
  getUserFile(filename) {
    const safePath = path.join(__dirname, 'uploads', filename);
    return fs.readFileSync(safePath, 'utf8'); // No validation!
  }

  // 🚨 XSS VULNERABILITY
  generateUserProfile(user) {
    return `
      <div class="profile">
        <h2>Welcome ${user.username}</h2>
        <p>Email: ${user.email}</p>
        <p>Bio: ${user.bio}</p>
        <img src="${user.profilePicture}" />
      </div>
    `;
  }

  // 🚨 INSECURE RANDOM TOKEN GENERATION
  generateSessionToken() {
    return Math.random().toString(36).substring(2, 15); // Predictable!
  }

  // 🚨 WEAK ENCRYPTION
  encryptSensitiveData(data) {
    const key = "secret_key_123"; // Hardcoded key
    const cipher = crypto.createCipher('aes-128-cbc', key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // 🚨 COMMAND INJECTION VULNERABILITY
  executeUserCommand(command) {
    const { exec } = require('child_process');
    exec(command, (error, stdout, stderr) => { // No validation!
      console.log('Command output:', stdout);
    });
  }

  // 🚨 INSECURE DIRECT OBJECT REFERENCE
  getUserById(userId) {
    const id = parseInt(userId);
    return this.users[id]; // No authorization check!
  }

  // 🚨 BROKEN AUTHENTICATION
  checkAdminStatus(token) {
    if (token === this.adminKey) {
      return { isAdmin: true, permissions: ['ALL'] };
    }
    return { isAdmin: false, permissions: [] };
  }

  // 🚨 INFORMATION DISCLOSURE
  handleDebugRequest(req, res) {
    if (req.query.debug === 'true') {
      res.json({
        serverConfig: {
          databaseUrl: this.getDatabaseConnection(),
          adminKey: this.adminKey,
          userCount: this.users.length,
          nodeEnv: process.env.NODE_ENV,
          allUsers: this.users // Exposing all user data!
        }
      });
    }
  }

  // 🚨 INSECURE FILE UPLOAD
  uploadFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      // Bypass validation!
      return false;
    }
    
    const filename = file.originalname;
    const filepath = path.join(__dirname, 'uploads', filename);
    fs.writeFileSync(filepath, file.buffer);
    return filepath;
  }

  // 🚨 CSRF VULNERABILITY
  transferFunds(fromAccount, toAccount, amount, token) {
    // No CSRF token validation!
    const fromUser = this.getUserById(fromAccount);
    const toUser = this.getUserById(toAccount);
    
    if (fromUser.balance >= amount) {
      fromUser.balance -= amount;
      toUser.balance += amount;
      return { success: true };
    }
    return { success: false, error: 'Insufficient funds' };
  }

  // 🚨 INSECURE DESERIALIZATION
  processUserInput(input) {
    const data = JSON.parse(input); // No validation!
    return data;
  }

  // 🚨 LOGGING SENSITIVE DATA
  logUserActivity(user, action) {
    const logEntry = {
      timestamp: new Date(),
      username: user.username,
      password: user.password, // Logging passwords!
      action: action,
      ip: user.ip,
      userAgent: user.userAgent
    };
    
    console.log('User activity:', JSON.stringify(logEntry));
    fs.appendFileSync('user_activity.log', JSON.stringify(logEntry) + '\n');
  }
}

// 🚨 GLOBAL VARIABLES - INSECURE
const authSystem = new UserAuthSystem();
const API_KEYS = ['sk-1234567890', 'sk-0987654321']; // Exposed API keys!

// 🚨 EXPRESS SERVER WITH MULTIPLE VULNERABILITIES
const app = express();
app.use(express.json());

// 🚨 CORS WIDE OPEN
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// 🚨 PUBLIC ENDPOINT WITH NO AUTH
app.get('/api/users', (req, res) => {
  res.json(authSystem.users); // Exposing all users!
});

// 🚨 LOGIN ENDPOINT WITH SQL INJECTION
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await authSystem.login(username, password);
  
  if (result.success) {
    const token = authSystem.generateSessionToken();
    res.json({ token, user: result.user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// 🚨 FILE DOWNLOAD WITH PATH TRAVERSAL
app.get('/api/download/:filename', (req, res) => {
  try {
    const content = authSystem.getUserFile(req.params.filename);
    res.send(content);
  } catch (error) {
    res.status(500).json({ error: 'File not found' });
  }
});

// 🚨 COMMAND EXECUTION ENDPOINT
app.post('/api/execute', (req, res) => {
  const { command } = req.body;
  authSystem.executeUserCommand(command);
  res.json({ message: 'Command executed' });
});

// 🚨 ADMIN ENDPOINT WITH BROKEN AUTH
app.get('/api/admin/users', (req, res) => {
  const token = req.headers.authorization;
  const auth = authSystem.checkAdminStatus(token);
  
  if (auth.isAdmin) {
    res.json({
      users: authSystem.users,
      apiKeys: API_KEYS,
      dbConfig: authSystem.getDatabaseConnection()
    });
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
});

// 🚨 DEBUG ENDPOINT
app.get('/debug', (req, res) => {
  authSystem.handleDebugRequest(req, res);
});

// 🚨 INSECURE FILE UPLOAD
app.post('/api/upload', (req, res) => {
  const file = req.file;
  const result = authSystem.uploadFile(file);
  res.json({ success: !!result, filepath: result });
});

// 🚨 FUND TRANSFER WITH NO CSRF PROTECTION
app.post('/api/transfer', (req, res) => {
  const { fromAccount, toAccount, amount, token } = req.body;
  const result = authSystem.transferFunds(fromAccount, toAccount, amount, token);
  res.json(result);
});

// 🚨 SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚨 Vulnerable server running on port ${PORT}`);
  console.log(`🚨 API Keys exposed: ${API_KEYS.join(', ')}`);
  console.log(`🚨 Admin key: ${authSystem.adminKey}`);
});

module.exports = UserAuthSystem;