import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:3333/.netlify/functions'
    : 'http://localhost:3333';

const api = axios.create({
  baseURL,
});

export default api;
