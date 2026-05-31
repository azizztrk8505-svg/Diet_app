require('dotenv').config();
const pool = require('./config/db');
const foods = require('./foods_data.json');

async function seedFoods() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE TABLE foods RESTART IDENTITY CASCADE');
    console.log('Foods tablosu temizlendi, seed başlıyor...');

    const q = `
      INSERT INTO foods (name, calories, protein, carbs, fat, fiber, category, unit)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    for (const f of foods) {
      await client.query(q, [
        f.name, f.calories, f.protein, f.carbs,
        f.fat, f.fiber, f.category, f.unit
      ]);
    }

    await client.query('COMMIT');
    console.log(`✅ ${foods.length} yemek başarıyla eklendi.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed hatası:', err.message);
  } finally {
    client.release();
    process.exit();
  }
}

seedFoods();
