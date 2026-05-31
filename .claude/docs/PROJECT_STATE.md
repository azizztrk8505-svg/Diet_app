# PROJECT_STATE — Diet_app

**Last updated:** 2026-05-30
**Active phase:** FAZ 2 — Frontend tamamlandı, test aşaması

## Stack
- Frontend: React + Vite + React Router v6 + Axios + CSS Modules
- Backend: Express.js + PostgreSQL (port 3000)
- DB: PostgreSQL, diet_app veritabanı (local)
- Roller: dietitian / patient

## ✅ Tamamlananlar

### FAZ 0 — Kurulum
- Repo clone: Diet_app (github.com/azizztrk8505-svg/Diet_app)
- PostgreSQL kurulumu, schema.sql çalıştırıldı
- frontend/ → React + Vite kuruldu
- .claude/ yapısı kuruldu
- .agents/skills/emil-design-eng/SKILL.md eklendi

### FAZ 1 — Auth
- Login + Register sayfaları (CSS Modules, Emil prensipleri)
- AuthContext (JWT, localStorage)
- api/client.js (axios interceptor)
- PrivateRoute + role bazlı yönlendirme

### FAZ 2 — Frontend Sayfaları
- Layout.jsx (sidebar, nav, avatar, logout)
- pages/patient/Dashboard.jsx (kalori özet, yemek arama, food log, BMI)
- pages/dietitian/Dashboard.jsx (hasta listesi + hasta arama/atama)
- pages/dietitian/PatientDetail.jsx (hasta detay, kalori hedefi, hastayı çıkar)
- api/patient.js, api/dietitian.js, api/food.js

### FAZ 2 — Backend Düzeltmeleri
- Register → transaction ile patient_profiles/dietitian_profiles otomatik oluşuyor
- BMI hesabı null-safe (CASE WHEN koruması)
- Diyetisyen: hasta arama (search-patients), atama (assign), bağlantı kesme
- Yetki kontrolü: /patients/:id/calories artık sadece kendi hastası için çalışıyor

## 🔄 Sıradaki
- [ ] Uçtan uca test (diyetisyen kayıt → hasta ekle → kalori takibi)
- [ ] Hasta profili düzenleme (boy, kilo, doğum tarihi girişi)
- [ ] Geçmiş günlerin yemek logu görüntüleme

## 📂 Dosya Yapısı
```
Diet_app/
├── backend/
│   ├── routes/ (auth, patient, dietitian, food)
│   ├── config/db.js
│   ├── middleware/auth.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/ (client, auth, patient, dietitian, food)
│       ├── components/ (Layout)
│       ├── context/ (AuthContext)
│       └── pages/ (auth, patient, dietitian)
├── schema.sql
└── .claude/docs/
```

## ⚡ Başlatma
```
# Backend
cd backend && node server.js

# Frontend
cd frontend && npm run dev
```

## 🔑 Önemli Notlar
- DB şifresi: 12345 (local postgres)
- DB adı: diet_app
- dotenvx global kurulu, .env okuma farklı davranıyor — node server.js yeterli
- Eski kayıtlı kullanıcıların patient_profiles'ı yok, yeniden kayıt gerekebilir
