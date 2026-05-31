const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/food/search?q=mercimek
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'En az 2 karakter giriniz' });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, calories, protein, carbs, fat, fiber, category, unit
       FROM foods
       WHERE name ILIKE $1
       ORDER BY name ASC
       LIMIT 20`,
      [`%${q.trim()}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Food search error:', err.message);
    res.status(500).json({ error: 'Arama sırasında hata oluştu' });
  }
});

// GET /api/food/categories - kategori listesi
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT category FROM foods WHERE category IS NOT NULL ORDER BY category ASC`
    );
    res.json(result.rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/food/category/:cat - kategoriye göre listele
router.get('/category/:cat', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, calories, protein, carbs, fat, fiber, unit
       FROM foods
       WHERE category ILIKE $1
       ORDER BY name ASC
       LIMIT 50`,
      [`%${req.params.cat}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
