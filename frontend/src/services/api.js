import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptarAdmin = (username, password) => {
  const token = btoa(`${username}:${password}`);
  api.defaults.headers.common['Authorization'] = `Basic ${token}`;
};

api.removerAuthAdmin = () => {
  delete api.defaults.headers.common['Authorization'];
};

export default api;
