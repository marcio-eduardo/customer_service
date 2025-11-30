export interface Company {
    id: number;
    name: string;
    cnpj: string;
    address?: string;
    phone?: string;
    email: string;
    slaHours?: number;
}
