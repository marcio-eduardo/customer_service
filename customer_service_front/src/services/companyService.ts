import { api } from '../lib/axios';
import type { Company } from '../types/Company';

export async function getAllCompanies(): Promise<Company[]> {
    const response = await api.get<Company[]>('/api/companies');
    return response.data;
}
