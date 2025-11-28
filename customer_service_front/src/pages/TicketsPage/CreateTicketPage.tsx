// src/pages/TicketsPage/CreateTicketPage.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

interface CompanyUser {
  id: number;
  name: string;
}

interface Company {
  id: number;
  tradingName: string;
}

type Client = (CompanyUser & { type: 'user' }) | (Company & { type: 'company' });

interface TicketFormData {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  selectedClient: string;
}

export function CreateTicketPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    selectedClient: '',
  });
  
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingClients, setIsFetchingClients] = useState(false);

  const isManager = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_MODERATOR');

  useEffect(() => {
    if (isManager) {
      const fetchAllClients = async () => {
        setIsFetchingClients(true);
        try {
          const userPromise = api.get<CompanyUser[]>('/api/company-users/all');
          const companyPromise = api.get<Company[]>('/api/companies/all');
          const [userResponse, companyResponse] = await Promise.all([userPromise, companyPromise]);
          
          const companyUsers: Client[] = userResponse.data.map(u => ({ ...u, type: 'user' }));
          const companies: Client[] = companyResponse.data.map(c => ({ ...c, type: 'company' }));
          
          setClients([...companyUsers, ...companies]);
        } catch (error: any) {
          console.error("Failed to fetch clients:", error);
          toast.error("Could not load the client list.");
        } finally {
          setIsFetchingClients(false);
        }
      };
      fetchAllClients();
    }
  }, [isManager]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill out all required fields.');
      return;
    }
    if (isManager && !formData.selectedClient) {
        toast.error('As a manager, you must select a client.');
        return;
    }

    setIsLoading(true);

    let payload: any = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
    };

    if (isManager) {
        const [clientType, clientId] = formData.selectedClient.split('-');
        payload = {
            ...payload,
            companyUserId: clientType === 'user' ? parseInt(clientId, 10) : undefined,
            companyId: clientType === 'company' ? parseInt(clientId, 10) : undefined,
        };
    } else {
        // Non-managers open tickets for themselves using the companyUserId from context
        payload = {
            ...payload,
            companyUserId: user?.companyUserId,
        };
    }
    
    try {
      await api.post('/api/tickets/open', payload);
      toast.success('Ticket opened successfully!');
      navigate('/dashboard'); 
    } catch (error: any) {
      console.error("Failed to open ticket:", error);
      const errorMessage = error.response?.data?.message || 'An error occurred while opening the ticket.';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Style classes
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']";
  const contentContainerClasses = "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const headerTitleClass = "text-tas-primary";
  const headerSubtitleClass = "text-tas-text-secondary-on-card";
  const formCardClasses = "bg-tas-bg-card shadow-xl rounded-xl p-6 md:p-8";
  const labelClasses = "block text-sm font-medium mb-1 text-tas-text-secondary-on-card";
  const inputBaseClasses = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-colors text-tas-text-on-card focus:ring-tas-secondary focus:border-tas-secondary";
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors ${isLoading || isFetchingClients ? 'bg-gray-400 cursor-not-allowed' : 'bg-tas-secondary hover:bg-tas-secondary-hover'}`;


  return (
    <>
      <Helmet>
        <title>Open New Ticket - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Open New Ticket</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              {isManager ? "Select the client and describe the issue." : "Describe the issue to open a new ticket."}
            </p>
          </header>

          <section className={formCardClasses}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {isManager && (
                <div>
                  <label htmlFor="selectedClient" className={labelClasses}>
                    Client <span className="text-red-500">*</span>
                  </label>
                  <select id="selectedClient" name="selectedClient" value={formData.selectedClient} onChange={handleChange} className={inputBaseClasses} required disabled={isFetchingClients || isLoading}>
                    <option value="" disabled>
                      {isFetchingClients ? 'Loading clients...' : '-- Select a client --'}
                    </option>
                    <optgroup label="Users">
                      {clients.filter(c => c.type === 'user').map(client => (
                        <option key={`user-${client.id}`} value={`user-${client.id}`}>
                          {(client as CompanyUser).name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Companies">
                       {clients.filter(c => c.type === 'company').map(client => (
                        <option key={`company-${client.id}`} value={`company-${client.id}`}>
                          {(client as Company).tradingName}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}

              {!isManager && user && (
                <div>
                    <label className={labelClasses}>Client</label>
                    <p className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-tas-text-secondary-on-card">
                        A ticket will be opened in your name: {user.username}
                    </p>
                </div>
              )}

              <div>
                <label htmlFor="title" className={labelClasses}>
                  Ticket Title <span className="text-red-500">*</span>
                </label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputBaseClasses} placeholder="e.g., Problem accessing the system" required disabled={isLoading} />
              </div>
              
              <div>
                <label htmlFor="priority" className={labelClasses}>
                  Priority <span className="text-red-500">*</span>
                </label>
                <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className={inputBaseClasses} required disabled={isLoading}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className={labelClasses}>
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputBaseClasses} min-h-[120px]`} placeholder="Describe the problem or request in detail..." required disabled={isLoading} />
              </div>

              <button type="submit" className={buttonClasses} disabled={isLoading || isFetchingClients}>
                {isLoading ? 'Opening Ticket...' : 'Open Ticket'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
