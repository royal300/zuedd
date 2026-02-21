require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'zued-secret-2026-royal300';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'zued-admin-secret-2026';
const ADMIN_ID = process.env.ADMIN_ID || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/var/www/zued/uploads';

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(cors({
    origin: ['https://zued.online', 'http://zued.online', 'http://localhost:8080', 'http://localhost:5173'],
    credentials: true,
}));
app.use(express.json());

// File upload config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// DB pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'zued',
    user: process.env.DB_USER || 'myadmin',
    password: process.env.DB_PASS || 'mypassword',
    waitForConnections: true,
    connectionLimit: 10,
});

// ============================================================
// DB INIT
// ============================================================
async function initDB() {
    const conn = await pool.getConnection();
    await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) DEFAULT '',
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await conn.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      parent_id INT DEFAULT NULL,
      product_type VARCHAR(20) DEFAULT 'all',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await conn.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_type ENUM('tshirt','jewellery') NOT NULL,
      category_id INT DEFAULT NULL,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      original_price DECIMAL(10,2) NOT NULL,
      sale_price DECIMAL(10,2) DEFAULT NULL,
      stock INT DEFAULT 0,
      is_variable BOOLEAN DEFAULT FALSE,
      images JSON,
      badge VARCHAR(50),
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await conn.execute(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      color VARCHAR(50),
      size VARCHAR(20),
      gsm VARCHAR(20),
      price DECIMAL(10,2) NOT NULL,
      stock INT DEFAULT 0,
      image VARCHAR(500)
    )
  `);
    await conn.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT DEFAULT NULL,
      product_type VARCHAR(20) NOT NULL DEFAULT 'mixed',
      items JSON NOT NULL,
      subtotal DECIMAL(10,2),
      discount DECIMAL(10,2) DEFAULT 0,
      total DECIMAL(10,2),
      promo_code VARCHAR(50),
      status ENUM('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
      customer_name VARCHAR(150),
      customer_email VARCHAR(150),
      customer_phone VARCHAR(30),
      customer_address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await conn.execute(`
    CREATE TABLE IF NOT EXISTS promo_codes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) UNIQUE NOT NULL,
      discount_type ENUM('percent','flat') NOT NULL,
      discount_value DECIMAL(10,2) NOT NULL,
      min_order DECIMAL(10,2) DEFAULT 0,
      max_uses INT DEFAULT NULL,
      used_count INT DEFAULT 0,
      active BOOLEAN DEFAULT TRUE,
      expires_at DATE DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    conn.release();
    console.log('DB initialized');
}

// ============================================================
// MIDDLEWARE
// ============================================================
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try { req.user = jwt.verify(token, JWT_SECRET); next(); }
    catch { res.status(401).json({ error: 'Invalid token' }); }
}

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No admin token' });
    try { req.admin = jwt.verify(token, ADMIN_JWT_SECRET); next(); }
    catch { res.status(401).json({ error: 'Invalid admin token' }); }
}

// ============================================================
// HEALTH
// ============================================================
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ============================================================
// CUSTOMER AUTH
// ============================================================
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
        if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
        const hash = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name || '', email.toLowerCase(), hash]
        );
        const token = jwt.sign({ id: result.insertId, email: email.toLowerCase(), name: name || '' }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: result.insertId, email: email.toLowerCase(), name: name || '' } });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already registered' });
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
        if (!rows.length) return res.status(401).json({ error: 'Invalid email or password' });
        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/auth/me', authMiddleware, (req, res) => res.json({ user: req.user }));

// ============================================================
// ADMIN AUTH
// ============================================================
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username !== ADMIN_ID || password !== ADMIN_PASS) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    const token = jwt.sign({ role: 'admin', username }, ADMIN_JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
});

// ============================================================
// ADMIN — DASHBOARD
// ============================================================
app.get('/api/admin/dashboard', adminMiddleware, async (req, res) => {
    try {
        const { from, to } = req.query;
        let dateFilter = '';
        const params = [];
        if (from && to) {
            dateFilter = 'WHERE created_at BETWEEN ? AND ?';
            params.push(from, to + ' 23:59:59');
        } else if (from) {
            dateFilter = 'WHERE created_at >= ?';
            params.push(from);
        }

        const [totalRows] = await pool.execute(`SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM orders ${dateFilter}`, params);
        const [tshirtRows] = await pool.execute(`SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM orders WHERE product_type='tshirt' ${dateFilter ? 'AND' + dateFilter.substring(5) : ''}`, params);
        const [jewRows] = await pool.execute(`SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM orders WHERE product_type='jewellery' ${dateFilter ? 'AND' + dateFilter.substring(5) : ''}`, params);
        const [recentOrders] = await pool.execute('SELECT id, customer_name, product_type, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5');
        const [statusBreakdown] = await pool.execute('SELECT status, COUNT(*) as count FROM orders GROUP BY status');

        res.json({
            total: { count: totalRows[0].count, revenue: totalRows[0].revenue },
            tshirt: { count: tshirtRows[0].count, revenue: tshirtRows[0].revenue },
            jewellery: { count: jewRows[0].count, revenue: jewRows[0].revenue },
            recentOrders,
            statusBreakdown,
        });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ============================================================
// ADMIN — ORDERS
// ============================================================
app.get('/api/admin/orders', adminMiddleware, async (req, res) => {
    try {
        const { type, status } = req.query;
        let where = '1=1';
        const params = [];
        if (type) { where += ' AND product_type = ?'; params.push(type); }
        if (status) { where += ' AND status = ?'; params.push(status); }
        const [rows] = await pool.execute(`SELECT * FROM orders WHERE ${where} ORDER BY created_at DESC`, params);
        res.json(rows);
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.patch('/api/admin/orders/:id/status', adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch { res.status(500).json({ error: 'Server error' }); }
});

// ============================================================
// ADMIN — CATEGORIES
// ============================================================
app.get('/api/admin/categories', adminMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM categories ORDER BY parent_id, name');
        res.json(rows);
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/categories', async (req, res) => {  // public
    try {
        const [rows] = await pool.execute('SELECT * FROM categories ORDER BY parent_id, name');
        res.json(rows);
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/categories', adminMiddleware, async (req, res) => {
    try {
        const { name, parent_id, product_type } = req.body;
        if (!name) return res.status(400).json({ error: 'Name required' });
        const [result] = await pool.execute(
            'INSERT INTO categories (name, parent_id, product_type) VALUES (?, ?, ?)',
            [name, parent_id || null, product_type || 'all']
        );
        res.status(201).json({ id: result.insertId, name, parent_id: parent_id || null });
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/categories/:id', adminMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM categories WHERE id = ? OR parent_id = ?', [req.params.id, req.params.id]);
        res.json({ success: true });
    } catch { res.status(500).json({ error: 'Server error' }); }
});

// ============================================================
// ADMIN — PRODUCTS
// ============================================================
app.get('/api/admin/products', adminMiddleware, async (req, res) => {
    try {
        const { type } = req.query;
        let where = '1=1';
        const params = [];
        if (type) { where += ' AND p.product_type = ?'; params.push(type); }
        const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${where} ORDER BY p.created_at DESC
    `, params);
        res.json(rows);
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/products', async (req, res) => {  // public
    try {
        const { type } = req.query;
        let where = 'p.active = TRUE';
        const params = [];
        if (type) { where += ' AND p.product_type = ?'; params.push(type); }
        const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${where} ORDER BY p.created_at DESC
    `, params);
        // Attach variants for variable products
        for (const product of rows) {
            if (product.is_variable) {
                const [variants] = await pool.execute('SELECT * FROM product_variants WHERE product_id = ?', [product.id]);
                product.variants = variants;
            }
        }
        res.json(rows);
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/products/:id', async (req, res) => {  // public single
    try {
        const [rows] = await pool.execute('SELECT * FROM products WHERE id = ? AND active = TRUE', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        const product = rows[0];
        if (product.is_variable) {
            const [variants] = await pool.execute('SELECT * FROM product_variants WHERE product_id = ?', [product.id]);
            product.variants = variants;
        }
        res.json(product);
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/products', adminMiddleware, async (req, res) => {
    try {
        const { product_type, category_id, name, description, original_price, sale_price, stock, is_variable, images, badge, variants } = req.body;
        if (!name || !product_type || !original_price) return res.status(400).json({ error: 'name, product_type, original_price required' });
        const [result] = await pool.execute(
            'INSERT INTO products (product_type, category_id, name, description, original_price, sale_price, stock, is_variable, images, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [product_type, category_id || null, name, description || '', original_price, sale_price || null, is_variable ? 0 : (stock || 0), is_variable ? 1 : 0, JSON.stringify(images || []), badge || null]
        );
        const productId = result.insertId;
        if (is_variable && variants && variants.length) {
            for (const v of variants) {
                await pool.execute(
                    'INSERT INTO product_variants (product_id, color, size, gsm, price, stock, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [productId, v.color || null, v.size || null, v.gsm || null, v.price, v.stock || 0, v.image || null]
                );
            }
        }
        res.status(201).json({ id: productId });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/products/:id', adminMiddleware, async (req, res) => {
    try {
        const { category_id, name, description, original_price, sale_price, stock, is_variable, images, badge, active, variants } = req.body;
        await pool.execute(
            'UPDATE products SET category_id=?, name=?, description=?, original_price=?, sale_price=?, stock=?, is_variable=?, images=?, badge=?, active=? WHERE id=?',
            [category_id || null, name, description || '', original_price, sale_price || null, is_variable ? 0 : (stock || 0), is_variable ? 1 : 0, JSON.stringify(images || []), badge || null, active !== false, req.params.id]
        );
        if (is_variable && variants) {
            await pool.execute('DELETE FROM product_variants WHERE product_id = ?', [req.params.id]);
            for (const v of variants) {
                await pool.execute(
                    'INSERT INTO product_variants (product_id, color, size, gsm, price, stock, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [req.params.id, v.color || null, v.size || null, v.gsm || null, v.price, v.stock || 0, v.image || null]
                );
            }
        }
        res.json({ success: true });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/products/:id', adminMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM product_variants WHERE product_id = ?', [req.params.id]);
        await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch { res.status(500).json({ error: 'Server error' }); }
});

// Image Upload
app.post('/api/admin/upload', adminMiddleware, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
});

// ============================================================
// ADMIN — PROMO CODES
// ============================================================
app.get('/api/admin/promos', adminMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM promo_codes ORDER BY created_at DESC');
        res.json(rows);
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/promos', adminMiddleware, async (req, res) => {
    try {
        const { code, discount_type, discount_value, min_order, max_uses, expires_at } = req.body;
        if (!code || !discount_type || !discount_value) return res.status(400).json({ error: 'code, discount_type, discount_value required' });
        const [result] = await pool.execute(
            'INSERT INTO promo_codes (code, discount_type, discount_value, min_order, max_uses, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
            [code.toUpperCase(), discount_type, discount_value, min_order || 0, max_uses || null, expires_at || null]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Code already exists' });
        res.status(500).json({ error: 'Server error' });
    }
});

app.patch('/api/admin/promos/:id', adminMiddleware, async (req, res) => {
    try {
        const { active } = req.body;
        await pool.execute('UPDATE promo_codes SET active = ? WHERE id = ?', [active, req.params.id]);
        res.json({ success: true });
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/promos/:id', adminMiddleware, async (req, res) => {
    try {
        await pool.execute('DELETE FROM promo_codes WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch { res.status(500).json({ error: 'Server error' }); }
});

// Public: validate promo code
app.post('/api/promo/validate', async (req, res) => {
    try {
        const { code, order_total } = req.body;
        if (!code) return res.status(400).json({ error: 'Code required' });
        const [rows] = await pool.execute(
            'SELECT * FROM promo_codes WHERE code = ? AND active = TRUE',
            [code.toUpperCase()]
        );
        if (!rows.length) return res.status(404).json({ error: 'Invalid or expired promo code' });
        const promo = rows[0];
        if (promo.expires_at && new Date(promo.expires_at) < new Date()) return res.status(400).json({ error: 'Promo code expired' });
        if (promo.max_uses !== null && promo.used_count >= promo.max_uses) return res.status(400).json({ error: 'Promo code usage limit reached' });
        if (promo.min_order > 0 && order_total < promo.min_order) return res.status(400).json({ error: `Minimum order ₹${promo.min_order} required` });

        let discount = 0;
        if (promo.discount_type === 'percent') discount = Math.round(order_total * promo.discount_value / 100);
        else discount = Math.min(promo.discount_value, order_total);

        res.json({ valid: true, discount, discount_type: promo.discount_type, discount_value: promo.discount_value, code: promo.code });
    } catch { res.status(500).json({ error: 'Server error' }); }
});

// ============================================================
// ORDERS — Save order at checkout
// ============================================================
app.post('/api/orders', authMiddleware, async (req, res) => {
    try {
        const { items, subtotal, discount, total, promo_code, customer_name, customer_email, customer_phone, customer_address, product_type } = req.body;
        // Increment promo usage if used
        if (promo_code) await pool.execute('UPDATE promo_codes SET used_count = used_count + 1 WHERE code = ?', [promo_code]);
        const [result] = await pool.execute(
            'INSERT INTO orders (user_id, product_type, items, subtotal, discount, total, promo_code, customer_name, customer_email, customer_phone, customer_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, product_type || 'mixed', JSON.stringify(items), subtotal, discount || 0, total, promo_code || null, customer_name, customer_email, customer_phone || null, customer_address]
        );
        res.status(201).json({ id: result.insertId, message: 'Order placed successfully' });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/orders/mine', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(rows);
    } catch { res.status(500).json({ error: 'Server error' }); }
});

initDB().then(() => {
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
}).catch(err => { console.error('DB init failed:', err); process.exit(1); });
