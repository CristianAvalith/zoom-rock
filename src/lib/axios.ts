import axios from 'axios';
const url = process.env.NEXT_PUBLIC_URL_BACKEND;

const api = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;