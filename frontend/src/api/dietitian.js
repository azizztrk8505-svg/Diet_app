import client from './client';

export const getPatients = () => client.get('/api/dietitian/patients');
export const getPatient = (id) => client.get(`/api/dietitian/patients/${id}`);
export const updateGoal = (id, daily_calorie) =>
  client.put(`/api/dietitian/patients/${id}/goal`, { daily_calorie });
export const getPatientCalories = (id) =>
  client.get(`/api/dietitian/patients/${id}/calories`);
export const getPatientFoodLog = (id, date) =>
  client.get(`/api/dietitian/patients/${id}/food-log${date ? `?date=${date}` : ''}`);
export const searchPatients = (q) =>
  client.get(`/api/dietitian/search-patients?q=${encodeURIComponent(q)}`);
export const assignPatient = (patientId) =>
  client.post(`/api/dietitian/assign/${patientId}`);
export const unassignPatient = (patientId) =>
  client.delete(`/api/dietitian/assign/${patientId}`);
