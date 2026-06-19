import express from 'express';
import multer from 'multer';
import path from 'path';
import db from '../db.js';
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'uploads/') },
  filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)) }
});
const upload = multer({ storage: storage });

router.get('/', function(req, res, next) { res.send('Express API'); });

// Fetch locations
router.get('/api/locations', (req, res) => {
  db.all('SELECT * FROM Locations', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Report item
router.post('/api/items', upload.single('photo'), (req, res) => {
  const { location_id, item_name, description } = req.body;
  const photo_path = req.file ? '/uploads/' + req.file.filename : null;
  const stmt = db.prepare('INSERT INTO Lost_Items (location_id, item_name, description, photo_path) VALUES (?, ?, ?, ?)');
  stmt.run([location_id, item_name, description, photo_path], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item reported successfully', itemId: this.lastID });
  });
  stmt.finalize();
});

// Fetch items
router.get('/api/items', (req, res) => {
  const location_id = req.query.location_id;
  const status = req.query.status;
  let query = 'SELECT Lost_Items.*, Locations.name as location_name FROM Lost_Items LEFT JOIN Locations ON Lost_Items.location_id = Locations.location_id WHERE 1=1';
  let params = [];
  if (location_id) { query += ' AND Lost_Items.location_id = ?'; params.push(location_id); }
  if (status) { query += ' AND Lost_Items.status = ?'; params.push(status); }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update item status
router.patch('/api/items/:id', (req, res) => {
  const { status } = req.body;
  const stmt = db.prepare('UPDATE Lost_Items SET status = ? WHERE item_id = ?');
  stmt.run([status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated' });
  });
  stmt.finalize();
});

// ✅ 新增：刪除遺失物 API
router.delete('/api/items/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM Lost_Items WHERE item_id = ?');
  stmt.run([req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item deleted' });
  });
  stmt.finalize();
});

// Forum Posts APIs
router.post('/api/posts', (req, res) => {
  const { user_id, title, content } = req.body;
  const stmt = db.prepare('INSERT INTO Posts (user_id, title, content) VALUES (?, ?, ?)');
  stmt.run([user_id, title, content], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Post created successfully', postId: this.lastID });
  });
  stmt.finalize();
});

router.get('/api/posts', (req, res) => {
  db.all('SELECT Posts.*, Users.username FROM Posts LEFT JOIN Users ON Posts.user_id = Users.user_id ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.delete('/api/posts/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM Posts WHERE post_id = ?');
  stmt.run([req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Post deleted' });
  });
  stmt.finalize();
});

export default router;