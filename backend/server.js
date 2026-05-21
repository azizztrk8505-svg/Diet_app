require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const dietitianRoutes = require('./routes/dietitian');
const patientRoutes = require('./routes/patient');
const app = express();
const PORT = process.env.PORT || 3000;
const foodRoutes = require('./routes/food');
app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Veritabanı bağlantısı HATA:', err.message);
  } else {
    console.log('Veritabanı bağlantısı BAŞARILI:', res.rows[0].now);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/dietitian', dietitianRoutes);
app.use('/api/patient', patientRoutes);

app.use('/api/food', foodRoutes);
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});