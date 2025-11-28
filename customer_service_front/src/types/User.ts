export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    companyId?: number;
    companyName?: string;
}
