import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your_jwt_secret'; // Change this in production
const INIT_DB = process.argv.includes('--initdb');

// --- SQLite setup ---
let db;

async function setupDatabase() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  // Create tables if not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS ailments_category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS ailments_subcategory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(category_id) REFERENCES ailments_category(id)
    );
  `);
  // Seed admin if not exists
  const admin = await db.get('SELECT * FROM admin WHERE username = ?', 'admin');
  if (!admin) {
    const hash = await bcrypt.hash('admin123', 10);
    await db.run('INSERT INTO admin (username, password) VALUES (?, ?)', 'admin', hash);
    console.log('Seeded default admin: admin/admin123');
  }
}

(async () => {
  await setupDatabase();
  if (INIT_DB) {
    console.log('Database initialized.');
    process.exit(0);
  }
  // ... existing code ...
})();

// --- Auth Middleware ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// --- Auth API ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM admin WHERE username = ?', username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// --- Category CRUD ---
app.get('/api/categories', authenticateToken, async (req, res) => {
  const rows = await db.all('SELECT * FROM ailments_category ORDER BY created_at DESC');
  res.json(rows);
});
app.post('/api/categories', authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const result = await db.run('INSERT INTO ailments_category (name) VALUES (?)', name);
  res.json({ id: result.lastID, name });
});
app.put('/api/categories/:id', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  await db.run('UPDATE ailments_category SET name = ? WHERE id = ?', name, id);
  res.json({ id, name });
});
app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await db.run('DELETE FROM ailments_category WHERE id = ?', id);
  res.json({ success: true });
});

// --- Subcategory CRUD ---
app.get('/api/subcategories', authenticateToken, async (req, res) => {
  const rows = await db.all('SELECT * FROM ailments_subcategory ORDER BY created_at DESC');
  res.json(rows);
});
app.post('/api/subcategories', authenticateToken, async (req, res) => {
  const { name, category_id } = req.body;
  if (!name || !category_id) return res.status(400).json({ error: 'Name and category_id required' });
  const result = await db.run('INSERT INTO ailments_subcategory (name, category_id) VALUES (?, ?)', name, category_id);
  res.json({ id: result.lastID, name, category_id });
});
app.put('/api/subcategories/:id', authenticateToken, async (req, res) => {
  const { name, category_id } = req.body;
  const { id } = req.params;
  await db.run('UPDATE ailments_subcategory SET name = ?, category_id = ? WHERE id = ?', name, category_id, id);
  res.json({ id, name, category_id });
});
app.delete('/api/subcategories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await db.run('DELETE FROM ailments_subcategory WHERE id = ?', id);
  res.json({ success: true });
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
