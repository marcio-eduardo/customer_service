export interface User {
    id: number;
    username: string;
    email: string;
    nome: string;
    cpf: string;
    roles: string[];
    companyId?: number;
}
