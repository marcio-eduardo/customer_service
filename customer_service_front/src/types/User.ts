import type { Company } from './Company';

export interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
    companyId?: number;
    companyName?: string;
    company?: Company;
    cpf?: string;
}
