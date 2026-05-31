const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/profile', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, pp.boy, pp.weight,
              pp.birth_date, pp.daily_calorie,
              CASE
                WHEN pp.boy > 0 AND pp.weight > 0
                THEN ROUND(pp.weight / ((pp.boy/100) * (pp.boy/100)), 1)
                ELSE NULL
              END AS bmi
       FROM users u
       JOIN patient_profiles pp ON u.id = pp.user_id
       WHERE u.id = $1`,
      [req.user.userId]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/food-log', auth, async (req, res) => {
  try {
    const date = req.query.date || null;
    const query = date
      ? `SELECT id, food_name, calories, log_date, logged_at
         FROM food_logs
         WHERE patient_id = $1 AND log_date = $2
         ORDER BY logged_at DESC`
      : `SELECT id, food_name, calories, log_date, logged_at
         FROM food_logs
         WHERE patient_id = $1 AND log_date = CURRENT_DATE
         ORDER BY logged_at DESC`;
    const params = date ? [req.user.userId, date] : [req.user.userId];
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/food-log', auth, async (req, res) => {
  const { food_name, calories } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO food_logs (patient_id, food_name, calories)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.userId, food_name, calories]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/food-log/:id', auth, async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM food_logs WHERE id = $1 AND patient_id = $2`,
      [req.params.id, req.user.userId]
    );
    res.json({ message: 'Yemek silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/calories/today', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(calories), 0) AS total_calories
       FROM food_logs
       WHERE patient_id = $1 AND log_date = CURRENT_DATE`,
      [req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  const { boy, weight, birth_date } = req.body;
  try {
    await pool.query(
      `UPDATE patient_profiles SET boy = $1, weight = $2, birth_date = $3
       WHERE user_id = $4`,
      [boy, weight, birth_date, req.user.userId]
    );
    res.json({ message: 'Profil güncellendi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
