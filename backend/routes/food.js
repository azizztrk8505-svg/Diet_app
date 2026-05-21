const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Arama terimi gerekli' });
  }

  try {
    const response = await axios.get(
      `https://api.calorieninjas.com/v1/nutrition?query=${q}`,
      {
        headers: { 'X-Api-Key': process.env.CALORIE_NINJAS_API_KEY }
      }
    );
    res.json(response.data.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;