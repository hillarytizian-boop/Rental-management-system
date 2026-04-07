import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rental-management-system-u2wf.onrender.com/api',
});

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
