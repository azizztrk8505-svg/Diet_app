import client from './client';

export const searchFood = (q) => client.get(`/api/food/search?q=${q}`);
