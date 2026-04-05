import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your live URL after deployment
});

// Add token to headers automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (payload) => instance.post('/auth/login', payload);
export const getForms = () => instance.get('/forms');
export const getFormById = (id) => instance.get(`/forms/${id}`);
export const createForm = (payload) => instance.post('/forms', payload);
export const deleteAllForms = () => instance.delete('/forms');
export const submitForm = (payload) => instance.post('/submissions', payload);
export const getSubmissionsByForm = (formId) => instance.get(`/submissions/${formId}`);

export default instance;
