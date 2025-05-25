// src/lib/axios.ts
import axios from 'axios';
// Ajuste o caminho para subir dois níveis (de src/lib para a raiz) e depois aceder a env.ts
import { env } from '../env'; // Assumindo que env.ts está na raiz do projeto frontend

export const api = axios.create({
  baseURL: env.VITE_API_URL,
});