<div align="center">

# 🥗 Diet App

**Diyetisyen–Hasta arası beslenme takip platformu**

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

## 📖 Proje Hakkında

Diet App, diyetisyen ve hastaların birlikte çalışabildiği bir beslenme takip uygulamasıdır. Hastalar günlük yediklerini kaydeder, diyetisyenler hastalarının beslenme durumunu takip eder ve kalori hedefi belirler.

## ✨ Özellikler

### 👤 Hasta
- Yemek arama (355+ besin, Türk mutfağı dahil — kendi veritabanımız)
- Anlık arama (yazarken otomatik sonuç)
- Makro besin değerleri görüntüleme (protein, karbonhidrat, yağ, lif)
- Günlük kalori takibi ve hedef karşılaştırma
- Geçmiş günlerin yemek loglarını görüntüleme
- Profil düzenleme (boy, kilo, doğum tarihi)
- Otomatik BMI hesaplama

### 🩺 Diyetisyen
- Hasta arama ve atama sistemi
- Hastanın günlük kalori durumunu görüntüleme
- Hastanın günlük yemek logunu görüntüleme
- Kalori hedefi belirleme ve güncelleme
- Hasta bağlantısını kesme

### 🔐 Güvenlik
- JWT tabanlı kimlik doğrulama
- Rol bazlı yetkilendirme (hasta/diyetisyen)
- Diyetisyen sadece kendi hastalarının verilerine erişebilir

## 🛠️ Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios, CSS Modules |
| **Backend** | Node.js, Express.js |
| **Veritabanı** | PostgreSQL |
| **Auth** | JWT (jsonwebtoken), bcryptjs |

## 📁 Proje Yapısı

```
Diet_app/
├── backend/
│   ├── config/db.js          # PostgreSQL bağlantısı
│   ├── middleware/auth.js     # JWT doğrulama
│   ├── routes/
│   │   ├── auth.js            # Kayıt & giriş
│   │   ├── patient.js         # Hasta işlemleri
│   │   ├── dietitian.js       # Diyetisyen işlemleri
│   │   └── food.js            # Yemek arama (kendi DB)
│   ├── seed_foods.js          # Besin verisi yükleme scripti
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/               # Backend iletişimi
│       ├── components/        # Ortak bileşenler
│       ├── context/           # Auth context
│       └── pages/             # Sayfa bileşenleri
│           ├── auth/          # Login, Register
│           ├── patient/       # Hasta Dashboard
│           └── dietitian/     # Diyetisyen Dashboard, Hasta Detay
├── schema.sql                 # Ana şema
├── add_foods_table.sql        # Foods tablosu
└── README.md
```

## 🚀 Kurulum

### Gereksinimler
- Node.js v18+
- PostgreSQL 14+

### 1. Repoyu klonla
```bash
git clone https://github.com/azizztrk8505-svg/Diet_app.git
cd Diet_app
```

### 2. Veritabanını kur
```bash
psql -U postgres -c "CREATE DATABASE diet_app;"
psql -U postgres -d diet_app -f schema.sql
psql -U postgres -d diet_app -f add_foods_table.sql
```

### 3. Backend'i kur ve başlat
```bash
cd backend
npm install
```
`backend/.env` dosyası oluştur:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=diet_app
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=yoursecret
PORT=3000
```
Besin verilerini yükle ve sunucuyu başlat:
```bash
node seed_foods.js
node server.js
```

### 4. Frontend'i kur ve başlat
```bash
cd ../frontend
npm install
```
`frontend/.env` dosyası oluştur:
```env
VITE_API_URL=http://localhost:3000
```
```bash
npm run dev
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Giriş (JWT döner) |

### Hasta
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/patient/profile` | Profil bilgileri + BMI |
| PUT | `/api/patient/profile` | Profil güncelle |
| GET | `/api/patient/food-log?date=` | Yemek logu (tarihe göre) |
| POST | `/api/patient/food-log` | Yemek ekle |
| DELETE | `/api/patient/food-log/:id` | Yemek sil |
| GET | `/api/patient/calories` | Bugünkü toplam kalori |

### Diyetisyen
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/dietitian/patients` | Hasta listesi |
| GET | `/api/dietitian/patients/:id` | Hasta detayı |
| GET | `/api/dietitian/patients/:id/calories` | Hastanın günlük kalorisi |
| GET | `/api/dietitian/patients/:id/food-log` | Hastanın yemek logu |
| PUT | `/api/dietitian/patients/:id/goal` | Kalori hedefi güncelle |
| POST | `/api/dietitian/assign/:patientId` | Hasta ata |
| DELETE | `/api/dietitian/assign/:patientId` | Hasta bağlantısını kes |
| GET | `/api/dietitian/search-patients?q=` | Hasta ara |

### Yemek
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/food/search?q=` | Yemek ara (kendi DB, 355+ kayıt) |
| GET | `/api/food/categories` | Kategori listesi |
| GET | `/api/food/category/:cat` | Kategoriye göre listele |

## 📊 Besin Veritabanı

Uygulama kendi besin veritabanını kullanır (harici API bağımlılığı yok):
- **355+ besin kaydı** (100g bazında)
- **USDA** kaynaklı uluslararası besinler
- **Türk mutfağı** yemekleri (çorbalar, et yemekleri, sebze yemekleri, pilavlar, tatlılar, içecekler, mezeler, kahvaltılıklar vb.)
- Her kayıtta: kalori, protein, karbonhidrat, yağ, lif değerleri

---
