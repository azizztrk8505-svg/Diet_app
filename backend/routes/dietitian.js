const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Kendi hastalarını listele
router.get('/patients', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, pp.daily_calorie
       FROM users u
       JOIN patient_profiles pp ON u.id = pp.user_id
       WHERE pp.dietitian_id = $1`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sisteme kayıtlı hastaları ara (atanmamış olanlar dahil)
router.get('/search-patients', auth, async (req, res) => {
  const { q } = req.query;
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, pp.dietitian_id
       FROM users u
       JOIN patient_profiles pp ON u.id = pp.user_id
       WHERE u.role = 'patient'
       AND (u.full_name ILIKE $1 OR u.email ILIKE $1)
       LIMIT 10`,
      [`%${q || ''}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hastayı kendine ata
router.post('/assign/:patientId', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE patient_profiles SET dietitian_id = $1
       WHERE user_id = $2
       RETURNING user_id`,
      [req.user.userId, req.params.patientId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Hasta bulunamadı' });
    res.json({ message: 'Hasta atandı' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hasta bağlantısını kes
router.delete('/assign/:patientId', auth, async (req, res) => {
  try {
    await pool.query(
      `UPDATE patient_profiles SET dietitian_id = NULL
       WHERE user_id = $1 AND dietitian_id = $2`,
      [req.params.patientId, req.user.userId]
    );
    res.json({ message: 'Hasta bağlantısı kesildi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hasta detayı (sadece kendi hastası)
router.get('/patients/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, pp.daily_calorie,
              pp.boy, pp.weight, pp.birth_date,
              CASE
                WHEN pp.boy > 0 AND pp.weight > 0
                THEN ROUND(pp.weight / ((pp.boy/100) * (pp.boy/100)), 1)
                ELSE NULL
              END AS bmi
       FROM users u
       JOIN patient_profiles pp ON u.id = pp.user_id
       WHERE u.id = $1 AND pp.dietitian_id = $2`,
      [req.params.id, req.user.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Hasta bulunamadı' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kalori hedefini güncelle
router.put('/patients/:id/goal', auth, async (req, res) => {
  const { daily_calorie } = req.body;
  try {
    const result = await pool.query(
      `UPDATE patient_profiles SET daily_calorie = $1
       WHERE user_id = $2 AND dietitian_id = $3`,
      [daily_calorie, req.params.id, req.user.userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Hasta bulunamadı veya yetkin yok' });
    res.json({ message: 'Hedef kalori güncellendi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hastanın bugünkü kalorisi (sadece kendi hastası)
router.get('/patients/:id/calories', auth, async (req, res) => {
  try {
    const access = await pool.query(
      `SELECT 1 FROM patient_profiles WHERE user_id = $1 AND dietitian_id = $2`,
      [req.params.id, req.user.userId]
    );
    if (access.rowCount === 0) return res.status(403).json({ error: 'Yetkisiz erişim' });

    const result = await pool.query(
      `SELECT COALESCE(SUM(calories), 0) AS total_calories
       FROM food_logs
       WHERE patient_id = $1 AND log_date = CURRENT_DATE`,
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/patients/:id/food-log', auth, async (req, res) => {
  try {
    const access = await pool.query(
      `SELECT 1 FROM patient_profiles WHERE user_id = $1 AND dietitian_id = $2`,
      [req.params.id, req.user.userId]
    );
    if (access.rowCount === 0) return res.status(403).json({ error: 'Yetkisiz erişim' });

    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const result = await pool.query(
      `SELECT id, food_name, calories, log_date, logged_at
       FROM food_logs
       WHERE patient_id = $1 AND log_date = $2
       ORDER BY logged_at ASC`,
      [req.params.id, date]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
