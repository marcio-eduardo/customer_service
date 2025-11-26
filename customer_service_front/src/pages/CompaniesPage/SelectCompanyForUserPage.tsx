// src/pages/CompaniesPage/SelectCompanyForUserPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import { Button } from '../../Components/common/Button/Button';
import { toast } from 'sonner';

interface Company {
  id: number;
  tradingName: string;
}

export function SelectCompanyForUserPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies/all');
        setCompanies(response.data);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        toast.error("Não foi possível carregar a lista de empresas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleProceed = () => {
    if (selectedCompanyId) {
      navigate(`/companies/${selectedCompanyId}/add-user`);
    } else {
      toast.warning('Por favor, selecione uma empresa para continuar.');
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Carregando empresas...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-xl">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Adicionar Usuário a uma Empresa
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Para qual empresa você deseja adicionar um novo usuário?
        </p>

        <div className="mb-6">
          <label htmlFor="company-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Selecione a Empresa
          </label>
          <select
            id="company-select"
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="" disabled>Selecione...</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.tradingName}
              </option>
            ))}
          </select>
        </div>

        <Button 
          onClick={handleProceed} 
          disabled={!selectedCompanyId || isLoading}
          fullWidth
          size="lg"
        >
          Avançar
        </Button>
      </div>
    </div>
  );
}
