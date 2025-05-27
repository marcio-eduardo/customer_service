// Localização: src/pages/DashboardPage/DashboardPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom'; // <<< ADICIONAR ESTA IMPORTAÇÃO
import { api } from '../../lib/axios';
import { toast } from 'sonner';

interface TicketModelSummary {
  id: number;
  status: string;
}

export function DashboardPage() {
  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const priorityChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstancesRef = useRef<{ status?: any; priority?: any }>({});

  const [totalOpenTickets, setTotalOpenTickets] = useState<number>(0);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const openTicketsResponse = await api.get<TicketModelSummary[]>('/api/tickets/status/open');
        if (openTicketsResponse.data && Array.isArray(openTicketsResponse.data)) {
          setTotalOpenTickets(openTicketsResponse.data.length);
        } else {
          setTotalOpenTickets(0);
        }
      } catch (error: any) {
        console.error("Falha ao buscar dados para o dashboard:", error);
        toast.error("Não foi possível carregar os dados do dashboard.");
        setTotalOpenTickets(0);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const destroyCharts = () => {
      if (chartInstancesRef.current.status) {
        chartInstancesRef.current.status.destroy();
        chartInstancesRef.current.status = undefined;
      }
      if (chartInstancesRef.current.priority) {
        chartInstancesRef.current.priority.destroy();
        chartInstancesRef.current.priority = undefined;
      }
    };

    const initCharts = () => {
      destroyCharts();
      const commonTextAndGridColor = 'rgba(0, 0, 0, 0.1)'; 
      const legendTextColor = 'rgba(51, 51, 51, 1)'; 
      const chartCardBgColor = '#FFFFFF'; 
      const tooltipTitleColor = '#1F2937'; 
      const tooltipBodyColor = '#374151';  

      if (statusChartRef.current && (window as any).Chart) {
        const statusCtx = statusChartRef.current.getContext('2d');
        if (statusCtx) {
          const openCount = totalOpenTickets;
          const inProgressCount = 19; 
          const pendingCount = 8;    
          const resolvedCount = 5;   

          chartInstancesRef.current.status = new (window as any).Chart(statusCtx, {
            type: 'pie',
            data: {
              labels: ['Aberto', 'Em Andamento', 'Pendente', 'Resolvido'],
              datasets: [{
                label: 'Chamados por Status',
                data: [openCount, inProgressCount, pendingCount, resolvedCount],
                backgroundColor: ['#3B82F6', '#4A90E2', '#F59E0B', '#10B981'],
                borderColor: chartCardBgColor, 
                borderWidth: 2,
                hoverOffset: 8,
                hoverBorderColor: '#E5E7EB' 
              }]
            },
            options: { /* ... (opções do gráfico como no seu original) ... */ }
          });
        }
      }

      if (priorityChartRef.current && (window as any).Chart) {
        // ... (lógica do gráfico de prioridade como no seu original) ...
      }
    };
    
    if (!isLoadingData) {
        const timer = setTimeout(() => { initCharts(); }, 0);
        return () => { clearTimeout(timer); destroyCharts(); };
    } else {
        destroyCharts();
    }
  }, [isLoadingData, totalOpenTickets]);

  const pageWrapperClasses = "min-h-screen pt-16 font-['Poppins'] bg-tas-branco-neutro text-tas-cinza-escuro";
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"; 
  const pageHeaderTextClasses = 'text-tas-cinza-escuro';
  const pageSubHeaderTextClasses = 'text-gray-600'; 
  const cardBgClasses = 'bg-white'; 
  const cardTitleTextClasses = 'text-gray-700'; 
  const chartCardTitleTextClasses = 'text-gray-700';

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className={pageWrapperClasses}> 
        <div className={contentContainerClasses}>
          <header className="mb-8 text-center"> 
            <h1 className={`text-3xl font-bold ${pageHeaderTextClasses}`}>Dashboard de Chamados</h1> 
            <p className={`${pageSubHeaderTextClasses} mt-1`}>Visão geral do status dos chamados.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card Total Abertos - AGORA COM LINK */}
            <Link to="/tickets/abertos" className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 block hover:shadow-xl`}>
              <div> {/* Div interna para manter o conteúdo organizado dentro do Link */}
                <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Total Abertos</h3>
                <p className="text-4xl font-bold text-tas-azul-serenity mt-2">
                  {isLoadingData ? '...' : totalOpenTickets}
                </p>
              </div>
            </Link>
            
            {/* Outros Cards (mantidos como antes) */}
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 cursor-default`}>
                <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Resolvidos Hoje</h3>
                <p className="text-4xl font-bold text-tas-verde-vibrante mt-2">5</p>
            </div>
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 cursor-default`}>
                <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Pendentes</h3>
                <p className="text-4xl font-bold text-[#F59E0B] mt-2">8</p>
            </div>
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 cursor-default`}>
                <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Urgentes</h3>
                <p className="text-4xl font-bold text-[#EF4444] mt-2">3</p>
            </div>
          </div>

          {/* Seção de Gráficos (mantida como antes) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg`}>
              <h3 className={`text-xl font-semibold ${chartCardTitleTextClasses} mb-4`}>Chamados por Status</h3>
              <div className="chart-container h-72 md:h-80 max-h-[400px]">
                <canvas ref={statusChartRef}></canvas>
              </div>
            </div>
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg`}>
              <h3 className={`text-xl font-semibold ${chartCardTitleTextClasses} mb-4`}>Chamados por Prioridade</h3>
              <div className="chart-container h-72 md:h-80 max-h-[400px]">
                <canvas ref={priorityChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}