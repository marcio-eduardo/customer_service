import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import { toast } from 'sonner';

interface CompanyType {
  id: number;
  tradingName: string;
}

export function AddUserToCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!id) {
        setError("Company ID not provided.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get<CompanyType>(`/api/companies/${id}`);
        setCompanyName(response.data.tradingName);
      } catch (err) {
        console.error("Failed to fetch company details:", err);
        setError("Could not load company details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post(`/api/company-users`, {
        name,
        cpf,
        email,
        phone,
        address,
        company: { id: id }
      });
      toast.success('User added to company successfully! Redirecting...');
      setTimeout(() => {
        navigate('/companies');
      }, 2000);
    } catch (err: any) {
      console.error("Failed to create user:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'An unknown error occurred.');
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
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
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-tas-secondary hover:bg-tas-secondary-hover'}`;
  const errorTextClass = 'bg-tas-status-error text-tas-text-on-primary p-4 rounded-md text-center font-medium my-4';

  if (isLoading) {
    return <div className={pageWrapperClasses}><p className="text-center py-10">Loading...</p></div>;
  }

  return (
    <>
      <Helmet>
        <title>Add User to {companyName || 'Company'} - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Add User to {companyName}</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Fill in the details of the new user for this company.
            </p>
          </header>

          <section className={formCardClasses}>
            {error && <p className={errorTextClass}>{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputBaseClasses} required />
              </div>
              <div>
                <label htmlFor="cpf" className={labelClasses}>CPF <span className="text-red-500">*</span></label>
                <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className={inputBaseClasses} required />
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>Email <span className="text-red-500">*</span></label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputBaseClasses} required />
              </div>
              <div>
                <label htmlFor="phone" className={labelClasses}>Phone</label>
                <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputBaseClasses} />
              </div>
              <div>
                <label htmlFor="address" className={labelClasses}>Address</label>
                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className={inputBaseClasses} />
              </div>

              <button type="submit" className={buttonClasses} disabled={isSubmitting}>
                {isSubmitting ? 'Adding User...' : 'Add User to Company'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
