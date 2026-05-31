import client from './client';

export const login = (email, password) =>
  client.post('/api/auth/login', { email, password });

export const register = (full_name, email, password, role) =>
  client.post('/api/auth/register', { full_name, email, password, role });

export const getMe = () =>
  client.get('/api/auth/me');
