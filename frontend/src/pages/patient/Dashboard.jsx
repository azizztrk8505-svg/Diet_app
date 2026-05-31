import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import {
  addFood,
  deleteFood,
  getFoodLog,
  getProfile,
  getTodayCalories,
  updateProfile,
} from '../../api/patient';
import { searchFood } from '../../api/food';
import styles from './Dashboard.module.css';

const getTodayDate = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

export default function PatientDashboard() {
  const todayDate = getTodayDate();
  const [profile, setProfile] = useState(null);
  const [foodLog, setFoodLog] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [boy, setBoy] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayDate);

  const setProfileData = (data) => {
    setProfile(data);
    setBoy(data?.boy ?? '');
    setWeight(data?.weight ?? '');
    setBirthDate(data?.birth_date ? data.birth_date.slice(0, 10) : '');
  };

  useEffect(() => {
    Promise.all([getProfile(), getFoodLog(), getTodayCalories()])
      .then(([p, f, c]) => {
        setProfileData(p.data);
        setFoodLog(f.data);
        setTotalCalories(Number(c.data.total_calories));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (q) => {
    if (!q || q.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await searchFood(q);
      setResults(res.data);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleAdd = async (item) => {
    await addFood(item.name, Math.round(item.calories));
    const [f, c] = await Promise.all([getFoodLog(selectedDate), getTodayCalories()]);
    setFoodLog(f.data);
    setTotalCalories(Number(c.data.total_calories));
    setResults([]);
    setQuery('');
  };

  const handleDelete = async (id) => {
    await deleteFood(id);
    const [f, c] = await Promise.all([getFoodLog(selectedDate), getTodayCalories()]);
    setFoodLog(f.data);
    setTotalCalories(Number(c.data.total_calories));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ boy, weight, birth_date: birthDate });
      const res = await getProfile();
      setProfileData(res.data);
      setEditingProfile(false);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const res = await getFoodLog(date);
    setFoodLog(res.data);
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>Yükleniyor…</div>
      </Layout>
    );
  }

  const goal = profile?.daily_calorie || 2000;
  const remaining = goal - totalCalories;
  const progress = Math.min((totalCalories / goal) * 100, 100);
  const foodLogTitle =
    selectedDate === todayDate
      ? 'Bug\u00fcn yediklerim'
      : `${new Date(`${selectedDate}T00:00:00`).toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })} yediklerim`;

  return (
    <Layout>
      <div className={styles.page}>
        <h1 className={styles.title}>Günlük özet</h1>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Alınan kalori</span>
            <span className={styles.metricValue}>
              {totalCalories.toLocaleString('tr-TR')}
            </span>
            <span className={styles.metricSub}>
              Hedef: {goal.toLocaleString('tr-TR')} kcal
            </span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Kalan</span>
            <span
              className={styles.metricValue}
              style={{ color: remaining < 0 ? 'var(--color-danger)' : undefined }}
            >
              {remaining.toLocaleString('tr-TR')}
            </span>
            <span className={styles.metricSub}>kcal</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>BMI</span>
            <span className={styles.metricValue}>{profile?.bmi ?? '—'}</span>
            <span className={styles.metricSub}>vücut kitle indeksi</span>
          </div>
        </div>

        <button
          className={styles.searchBtn}
          type="button"
          onClick={() => setEditingProfile(!editingProfile)}
        >
          Profilimi Düzenle
        </button>

        {editingProfile && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Profilimi Düzenle</h2>
            <form className={styles.searchForm} onSubmit={handleProfileUpdate}>
              <input
                className={styles.input}
                type="number"
                placeholder="Boy (cm)"
                value={boy}
                onChange={(e) => setBoy(e.target.value)}
              />
              <input
                className={styles.input}
                type="number"
                placeholder="Kilo (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <input
                className={styles.input}
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
              <button className={styles.searchBtn} type="submit" disabled={savingProfile}>
                {savingProfile ? 'Kaydediliyor…' : 'Kaydet'}
              </button>
            </form>
          </div>
        )}

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Yemek ekle</h2>
          <div className={styles.searchForm}>
            <input
              className={styles.input}
              placeholder="Yemek ara… (örn. tavuk, elma)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {searching && <span style={{fontSize:'13px',color:'var(--color-text-muted)',alignSelf:'center'}}>Aranıyor…</span>}
          </div>

          {results.length > 0 && (
            <ul className={styles.results}>
              {results.map((item, i) => (
                <li
                  key={`${item.name}-${i}`}
                  className={styles.resultItem}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className={styles.resultInfo}>
                    <span className={styles.resultName}>{item.name}</span>
                    <div className={styles.resultMacros}>
                      <span className={styles.resultCal}>{Math.round(item.calories)} kcal</span>
                      {item.protein > 0 && <span className={styles.macro}>P: {parseFloat(item.protein).toFixed(1)}g</span>}
                      {item.carbs > 0 && <span className={styles.macro}>K: {parseFloat(item.carbs).toFixed(1)}g</span>}
                      {item.fat > 0 && <span className={styles.macro}>Y: {parseFloat(item.fat).toFixed(1)}g</span>}
                      {item.fiber > 0 && <span className={styles.macro}>L: {parseFloat(item.fiber).toFixed(1)}g</span>}
                    </div>
                  </div>
                  <button className={styles.addBtn} onClick={() => handleAdd(item)}>
                    + Ekle
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{foodLogTitle}</h2>
          <input
            className={styles.input}
            type="date"
            max={todayDate}
            value={selectedDate}
            onChange={handleDateChange}
          />
          {foodLog.length === 0 ? (
            <p className={styles.empty}>Henüz yemek eklenmedi.</p>
          ) : (
            <ul className={styles.foodList}>
              {foodLog.map((item, i) => (
                <li
                  key={item.id}
                  className={styles.foodItem}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <span className={styles.foodName}>{item.food_name}</span>
                  <div className={styles.foodMeta}>
                    <span className={styles.foodTime}>
                      {new Date(item.logged_at).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className={styles.foodCal}>{Math.round(item.calories)} kcal</span>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(item.id)}
                      aria-label="Sil"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
