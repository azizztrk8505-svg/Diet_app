import client from './client';

export const getProfile = () => client.get('/api/patient/profile');
export const updateProfile = (data) => client.put('/api/patient/profile', data);
export const getFoodLog = (date) =>
  client.get(date ? `/api/patient/food-log?date=${date}` : '/api/patient/food-log');
export const addFood = (food_name, calories) =>
  client.post('/api/patient/food-log', { food_name, calories });
export const deleteFood = (id) => client.delete(`/api/patient/food-log/${id}`);
export const getTodayCalories = () => client.get('/api/patient/calories/today');
