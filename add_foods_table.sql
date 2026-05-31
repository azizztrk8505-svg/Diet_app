-- foods tablosunu ekle (yoksa)
CREATE TABLE IF NOT EXISTS foods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  calories DECIMAL(7,2) NOT NULL DEFAULT 0,
  protein DECIMAL(5,2) DEFAULT 0,
  carbs DECIMAL(5,2) DEFAULT 0,
  fat DECIMAL(5,2) DEFAULT 0,
  fiber DECIMAL(5,2) DEFAULT 0,
  category VARCHAR(100),
  unit VARCHAR(20) DEFAULT '100g'
);

-- Arama için index
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods USING gin(to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
