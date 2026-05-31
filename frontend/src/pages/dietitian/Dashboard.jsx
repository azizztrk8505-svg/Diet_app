import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { assignPatient, getPatients, searchPatients } from '../../api/dietitian';
import styles from './Dashboard.module.css';

export default function DietitianDashboard() {
  const [patients, setPatients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [assigningId, setAssigningId] = useState(null);
  const navigate = useNavigate();

  const loadPatients = async () => {
    const res = await getPatients();
    setPatients(res.data);
  };

  useEffect(() => {
    loadPatients().finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      const res = await searchPatients(query.trim());
      setSearchResults(res.data);
    } finally {
      setSearching(false);
    }
  };

  const handleAssign = async (patientId) => {
    setAssigningId(patientId);
    try {
      await assignPatient(patientId);
      await loadPatients();
      const res = await searchPatients(query.trim());
      setSearchResults(res.data);
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>Yükleniyor...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.page}>
        <section className={styles.section}>
          <h1 className={styles.title}>Hastalarım</h1>

          {patients.length === 0 ? (
            <p className={styles.empty}>Henüz hasta atanmamış.</p>
          ) : (
            <ul className={styles.list}>
              {patients.map((p, i) => (
                <li
                  key={p.id}
                  className={styles.item}
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => navigate(`/dietitian/patient/${p.id}`)}
                >
                  <div className={styles.itemAvatar}>
                    {p.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{p.full_name}</span>
                    <span className={styles.itemEmail}>{p.email}</span>
                  </div>
                  <div className={styles.itemRight}>
                    <span className={styles.itemCal}>{p.daily_calorie} kcal</span>
                    <span className={styles.itemSub}>günlük hedef</span>
                  </div>
                  <span className={styles.arrow}>→</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Hasta Ekle</h2>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              className={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ad veya email ile ara"
            />
            <button className={styles.searchBtn} type="submit" disabled={searching}>
              {searching ? 'Aranıyor...' : 'Ara'}
            </button>
          </form>

          {searchResults.length > 0 && (
            <ul className={styles.searchList}>
              {searchResults.map((patient, i) => {
                const isAssigned = Boolean(patient.dietitian_id);

                return (
                  <li
                    key={patient.id}
                    className={styles.searchItem}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className={styles.itemAvatar}>
                      {patient.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{patient.full_name}</span>
                      <span className={styles.itemEmail}>{patient.email}</span>
                    </div>
                    {isAssigned ? (
                      <span className={styles.badge}>Başka diyetisyende</span>
                    ) : (
                      <button
                        className={styles.addBtn}
                        onClick={() => handleAssign(patient.id)}
                        disabled={assigningId === patient.id}
                      >
                        {assigningId === patient.id ? 'Ekleniyor...' : 'Ekle'}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}
