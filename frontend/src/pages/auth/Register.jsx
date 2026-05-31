import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import styles from './Register.module.css';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.full_name, form.email, form.password, form.role);
      navigate('/login');
    } catch {
      setError('Kayıt başarısız, tekrar dene');
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Kayıt Ol</h1>
        {error && <p className={styles.error}>{error}</p>}
        <input
          className={styles.input}
          placeholder="Ad Soyad"
          value={form.full_name}
          onChange={set('full_name')}
          required
        />
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={set('email')}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Şifre"
          value={form.password}
          onChange={set('password')}
          required
        />
        <select className={styles.input} value={form.role} onChange={set('role')}>
          <option value="patient">Hasta</option>
          <option value="dietitian">Diyetisyen</option>
        </select>
        <button className={styles.button} type="submit">
          Kayıt Ol
        </button>
        <p className={styles.link}>
          Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
        </p>
      </form>
    </div>
  );
}
