import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import {
  getPatient,
  getPatientCalories,
  getPatientFoodLog,
  unassignPatient,
  updateGoal,
} from '../../api/dietitian';
import styles from './PatientDetail.module.css';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [calories, setCalories] = useState(0);
  const [foodLog, setFoodLog] = useState([]);
  const [goalInput, setGoalInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPatient(id), getPatientCalories(id), getPatientFoodLog(id)])
      .then(([p, c, fl]) => {
        setPatient(p.data);
        setGoalInput(p.data.daily_calorie ?? 2000);
        setCalories(Number(c.data.total_calories));
        setFoodLog(fl.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateGoal(id, Number(goalInput));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleUnassign = async () => {
    await unassignPatient(id);
    navigate('/dietitian');
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>Yükleniyor...</div>
      </Layout>
    );
  }

  const goal = patient?.daily_calorie || 2000;
  const progress = Math.min((calories / goal) * 100, 100);

  return (
    <Layout>
      <div className={styles.page}>
        <button className={styles.back} onClick={() => navigate('/dietitian')}>
          ← Geri
        </button>

        <div className={styles.header}>
          <div className={styles.avatar}>
            {patient?.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h1 className={styles.name}>{patient?.full_name}</h1>
            <span className={styles.email}>{patient?.email}</span>
          </div>
        </div>

        <div className={styles.metrics}>
          {[
            { label: 'Boy', value: patient?.boy ? `${patient.boy} cm` : '—' },
            { label: 'Kilo', value: patient?.weight ? `${patient.weight} kg` : '—' },
            { label: 'Bugün alınan', value: `${Math.round(calories)} kcal` },
            { label: 'Günlük hedef', value: `${goal} kcal` },
            { label: 'BMI', value: patient?.bmi ? `${patient.bmi}` : '—' },
            { label: 'Doğum Tarihi', value: patient?.birth_date ? new Date(patient.birth_date).toLocaleDateString('tr-TR') : '—' },
          ].map((m, i) => (
            <div
              key={m.label}
              className={styles.metric}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={styles.metricValue}>{m.value}</span>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Bugünkü ilerleme</h2>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressLabel}>
            {Math.round(calories)} / {goal} kcal ({Math.round(progress)}%)
          </span>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Kalori hedefini güncelle</h2>
          <div className={styles.goalRow}>
            <input
              className={styles.input}
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              min={500}
              max={5000}
            />
            <button
              className={`${styles.saveBtn} ${saved ? styles.saveBtnSaved : ''}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saved ? '✓ Kaydedildi' : saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
          <button className={styles.removeBtn} onClick={handleUnassign}>
            Hastayı çıkar
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Bugünkü yemekler</h2>
          {foodLog.length === 0 ? (
            <p className={styles.empty}>Henüz yemek eklenmedi.</p>
          ) : (
            <ul className={styles.foodList}>
              {foodLog.map((item) => (
                <li key={item.id} className={styles.foodItem}>
                  <span className={styles.foodName}>{item.food_name}</span>
                  <span className={styles.foodCal}>{Math.round(item.calories)} kcal</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
