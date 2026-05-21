const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

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

router.get('/patients/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, pp.daily_calorie,
              pp.boy, pp.weight, pp.birth_date
       FROM users u
       JOIN patient_profiles pp ON u.id = pp.user_id
       WHERE u.id = $1 AND pp.dietitian_id = $2`,
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hasta bulunamadı' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/patients/:id/goal', auth, async (req, res) => {
  const { daily_calorie } = req.body;
  try {
    await pool.query(
      `UPDATE patient_profiles SET daily_calorie = $1
       WHERE user_id = $2 AND dietitian_id = $3`,
      [daily_calorie, req.params.id, req.user.userId]
    );
    res.json({ message: 'Hedef kalori güncellendi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/patients/:id/calories', auth, async (req, res) => {
  try {
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
module.exports = router;