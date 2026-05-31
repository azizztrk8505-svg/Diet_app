// Bu script foods_data.json dosyasını p1+p2+p3 parçalarından oluşturur
// Çalıştır: node build_foods.js
const fs = require('fs');
const path = require('path');

const p1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'foods_p1.json'), 'utf8'));
const p2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'foods_p2.json'), 'utf8'));
const p3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'foods_p3.json'), 'utf8'));

const combined = [...p1, ...p2, ...p3];
fs.writeFileSync(path.join(__dirname, 'foods_data.json'), JSON.stringify(combined), 'utf8');
console.log(`✅ foods_data.json oluşturuldu: ${combined.length} kayıt`);
