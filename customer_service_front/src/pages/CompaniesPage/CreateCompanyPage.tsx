// src/pages/CompaniesPage/CreateCompanyPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/axios';
import { Button } from '../../Components/common/Button/Button';
import { toast } from 'sonner';

interface ICompanyUser {
    id: number;
    name: string;
    email: string;
}

interface IFormInputs {
    tradingName: string;
    legalName: string;
    taxId: string;
    address: string;
    phone: string;
    email: string;
    responsibleId: number;
    userIds: number[];
}

export function CreateCompanyPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IFormInputs>();
    const navigate = useNavigate();
    
    const [unassignedUsers, setUnassignedUsers] = useState<ICompanyUser[]>([]);
    const [allUsers, setAllUsers] = useState<ICompanyUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const [unassignedRes, allRes] = await Promise.all([
                    api.get('/company-users/unassigned'),
                    api.get('/company-users/all')
                ]);
                setUnassignedUsers(unassignedRes.data);
                setAllUsers(allRes.data);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
                toast.error("Falha ao carregar dados dos usuários. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const onSubmit = async (data: IFormInputs) => {
        setSubmitError(null);
        const payload = {
            ...data,
            responsibleId: Number(data.responsibleId),
            userIds: data.userIds ? data.userIds.map(id => Number(id)) : []
        };
        
        try {
            await api.post('/companies', payload);
            toast.success("Empresa cadastrada com sucesso!");
            navigate('/companies');
        } catch (err: any) {
            console.error("Erro ao criar empresa:", err);
            const errorMessage = err.response?.data?.message || err.response?.data || "Ocorreu um erro ao criar a empresa.";
            setSubmitError(errorMessage);
            toast.error(errorMessage);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Carregando...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-3xl">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
                    Cadastro de Nova Empresa
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Company Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="tradingName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Nome Fantasia</label>
                            <input id="tradingName" {...register("tradingName", { required: "Nome Fantasia é obrigatório" })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                            {errors.tradingName && <p className="text-red-500 text-xs mt-1">{errors.tradingName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="legalName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Razão Social</label>
                            <input id="legalName" {...register("legalName", { required: "Razão Social é obrigatória" })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                            {errors.legalName && <p className="text-red-500 text-xs mt-1">{errors.legalName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">CNPJ</label>
                            <input id="taxId" {...register("taxId", { required: "CNPJ é obrigatório" })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                            {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="responsibleId" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Usuário Responsável</label>
                            <select id="responsibleId" {...register("responsibleId", { required: "É obrigatório selecionar um responsável" })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                                <option value="">Selecione um usuário</option>
                                {allUsers.map(user => (
                                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                ))}
                            </select>
                            {errors.responsibleId && <p className="text-red-500 text-xs mt-1">{errors.responsibleId.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email de Contato</label>
                            <input id="email" type="email" {...register("email", { pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* User Association */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Associar Usuários à Empresa</h2>
                        <div className="flex justify-end mb-4">
                            <Button variant="outline" onClick={() => navigate('/admin/create-user')} type="button">
                                + Criar Novo Usuário
                            </Button>
                        </div>
                        <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-2">
                             {unassignedUsers.map(user => (
                                <div key={user.id} className="flex items-center">
                                    <input id={`user-${user.id}`} type="checkbox" {...register("userIds")} value={user.id}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <label htmlFor={`user-${user.id}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                        {user.name} ({user.email})
                                    </label>
                                </div>
                            ))}
                            {unassignedUsers.length === 0 && <p className="text-gray-500 dark:text-gray-400">Nenhum usuário não associado encontrado.</p>}
                        </div>
                    </div>

                    {submitError && <p className="text-red-500 text-center font-semibold mt-4">{submitError}</p>}

                    <div className="flex justify-end pt-6">
                        <Button type="submit" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar Empresa"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
