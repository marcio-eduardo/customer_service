import { api } from '../lib/axios';
import { User } from '../types/User';

export async function getUsersByCompany(companyId: number): Promise<User[]> {
    const response = await api.get<User[]>(`/api/users/company/${companyId}`);
    return response.data;
}

export async function getAllTechUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/api/users/techs');
    return response.data;
}
