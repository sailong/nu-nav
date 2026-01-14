const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Get or generate JWT_SECRET
const getJwtSecret = () => {
  // 1. Try environment variable
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  // 2. Try persistent file in prisma directory (mapped to volume in Docker)
  const secretPath = path.join(__dirname, '../prisma/jwt.secret');
  try {
    if (fs.existsSync(secretPath)) {
      return fs.readFileSync(secretPath, 'utf8').trim();
    }
    
    // 3. Generate new random secret
    const newSecret = crypto.randomBytes(64).toString('hex');
    fs.writeFileSync(secretPath, newSecret, 'utf8');
    return newSecret;
  } catch (err) {
    console.warn('Could not read/write persistent JWT_SECRET, using fallback.');
    return 'fallback_secret_not_for_production';
  }
};

const JWT_SECRET = getJwtSecret();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken, JWT_SECRET };
