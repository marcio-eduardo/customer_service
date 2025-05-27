// src/lib/axios.ts
import axios from 'axios';
import { env } from '../env'; // Seu arquivo de ambiente

export const api = axios.create({
  baseURL: env.VITE_API_URL,
});

// Adiciona um interceptor de requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tas-auth-token'); // Mesmo nome de chave usado no AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);