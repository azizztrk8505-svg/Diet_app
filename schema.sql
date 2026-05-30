CREATE TYPE user_role AS ENUM('dietitian','patient');

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dietitian_profiles(
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialty VARCHAR(100),
  license_no VARCHAR(50)
);

CREATE TABLE patient_profiles(
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dietitian_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  boy DECIMAL(5,2),
  weight DECIMAL(5,2),
  birth_date DATE,
  daily_calorie INTEGER DEFAULT 2000
);

CREATE TABLE food_logs(
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_name VARCHAR(150) NOT NULL,
  calories DECIMAL(7,2) NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  logged_at TIMESTAMP DEFAULT NOW()
);