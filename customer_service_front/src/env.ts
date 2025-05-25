// env.ts
import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url().min(1), // Adicionar .min(1) para garantir que não seja vazia
})

export const env = envSchema.parse(import.meta.env)