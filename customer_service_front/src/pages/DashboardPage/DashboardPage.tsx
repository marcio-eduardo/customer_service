import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios'; 
import { toast } from 'sonner'; 
import { theme } from '../../lib/tailwind-theme'; // Importando o tema

export function DashboardPage() {
  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const priorityChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstancesRef = useRef<{ status?: any; priority?: any }>({});

  // Estados para contagem de tickets
  const [totalOpenTickets, setTotalOpenTickets] = useState<number>(0);
  const [totalResolvedTickets, setTotalResolvedTickets] = useState<number>(0);
  const [totalInProgressTickets, setTotalInProgressTickets] = useState<number>(0);
  const [totalUrgentTickets, setTotalUrgentTickets] = useState<number>(0);
  const [totalHighPriorityTickets, setTotalHighPriorityTickets] = useState<number>(0);
  const [totalMediumPriorityTickets, setTotalMediumPriorityTickets] = useState<number>(0);
  const [totalLowPriorityTickets, setTotalLowPriorityTickets] = useState<number>(0);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Efeito para buscar os dados do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const response = await api.get<{ 
          totalOpenTickets: number; 
          totalResolvedTickets: number; 
          totalInProgressTickets: number;
          totalUrgentTickets: number;
          totalHighPriorityTickets: number;
          totalMediumPriorityTickets: number;
          totalLowPriorityTickets: number;
        }>('/api/dashboard/stats');
        
        if (response.data) {
          setTotalOpenTickets(response.data.totalOpenTickets || 0);
          setTotalResolvedTickets(response.data.totalResolvedTickets || 0);
          setTotalInProgressTickets(response.data.totalInProgressTickets || 0);
          setTotalUrgentTickets(response.data.totalUrgentTickets || 0);
          setTotalHighPriorityTickets(response.data.totalHighPriorityTickets || 0);
          setTotalMediumPriorityTickets(response.data.totalMediumPriorityTickets || 0);
          setTotalLowPriorityTickets(response.data.totalLowPriorityTickets || 0);
        }
      } catch (error: any) {
        console.error("Falha ao buscar dados para o dashboard:", error);
        toast.error("Não foi possível carregar os dados do dashboard.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Efeito para inicializar e destruir os gráficos
  useEffect(() => {
    const destroyCharts = () => {
      if (chartInstancesRef.current.status) chartInstancesRef.current.status.destroy();
      if (chartInstancesRef.current.priority) chartInstancesRef.current.priority.destroy();
      chartInstancesRef.current = {};
    };

    const initCharts = () => {
      destroyCharts();
      
      const colors = theme.colors as any; // Acessa as cores do tema

      if (statusChartRef.current && (window as any).Chart) {
        const statusCtx = statusChartRef.current.getContext('2d');
        if (statusCtx) {
          chartInstancesRef.current.status = new (window as any).Chart(statusCtx, {
            type: 'pie',
            data: {
              labels: ['Aberto', 'Em Andamento', 'Pendente', 'Resolvido'],
              datasets: [{
                label: 'Chamados por Status',
                data: [totalOpenTickets, totalInProgressTickets, 8, totalResolvedTickets], // "Pendente" ainda é fictício
                backgroundColor: [
                  colors['tas-status-info'],
                  colors['tas-accent'],
                  colors['tas-status-warning'],
                  colors['tas-status-success']
                ],
                borderColor: colors['tas-bg-card'], 
                borderWidth: 2,
              }]
            },
            options: { responsive: true, maintainAspectRatio: false /* ... */ }
          });
        }
      }

      if (priorityChartRef.current && (window as any).Chart) {
        const priorityCtx = priorityChartRef.current.getContext('2d');
        if (priorityCtx) {
          chartInstancesRef.current.priority = new (window as any).Chart(priorityCtx, {
            type: 'doughnut',
            data: {
              labels: ['Urgente', 'Alta', 'Média', 'Baixa'],
              datasets: [{
                label: 'Chamados por Prioridade',
                data: [totalUrgentTickets, totalHighPriorityTickets, totalMediumPriorityTickets, totalLowPriorityTickets],
                backgroundColor: [
                  colors['tas-status-error'],
                  colors['tas-status-warning'],
                  colors['tas-status-info'],
                  colors['tas-status-success']
                ],
                borderColor: colors['tas-bg-card'],
                borderWidth: 2,
              }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '50%' /* ... */ }
          });
        }
      }
    };
    
    if (!isLoadingData && typeof (window as any).Chart !== 'undefined') {
      const timer = setTimeout(initCharts, 0);
      return () => {
        clearTimeout(timer);
        destroyCharts();
      };
    }
  }, [
    isLoadingData, 
    totalOpenTickets, 
    totalResolvedTickets, 
    totalInProgressTickets,
    totalUrgentTickets,
    totalHighPriorityTickets,
    totalMediumPriorityTickets,
    totalLowPriorityTickets,
  ]);

  return (
    <>
      <Helmet>
        <title>Dashboard - TAS</title>
      </Helmet>
      <div className="min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-tas-primary">Dashboard de Chamados</h1>
            <p className="text-tas-text-secondary-on-card mt-1">Visão geral do status dos chamados.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stat Cards */}
            <Link to="/tickets/abertos" className="bg-tas-bg-card p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 block hover:shadow-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-tas-text-on-card">Total Abertos</h3>
              <p className="text-4xl font-bold text-tas-status-info mt-2">
                {isLoadingData ? '...' : totalOpenTickets}
              </p>
            </Link>
            <Link to="/tickets/resolvidos" className="bg-tas-bg-card p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 block hover:shadow-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-tas-text-on-card">Total Resolvidos</h3>
              <p className="text-4xl font-bold text-tas-status-success mt-2">
                {isLoadingData ? '...' : totalResolvedTickets}
              </p>
            </Link>
            <div className="bg-tas-bg-card p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 cursor-default border border-gray-200">
              <h3 className="text-lg font-semibold text-tas-text-on-card">Pendentes</h3>
              <p className="text-4xl font-bold text-tas-status-warning mt-2">8</p> {/* Dado Fictício */}
            </div>
            <div className="bg-tas-bg-card p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 cursor-default border border-gray-200">
              <h3 className="text-lg font-semibold text-tas-text-on-card">Urgentes</h3>
              <p className="text-4xl font-bold text-tas-status-error mt-2">
                {isLoadingData ? '...' : totalUrgentTickets}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Cards */}
            <div className="bg-tas-bg-card p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-tas-text-on-card mb-4">Chamados por Status</h3>
              <div className="relative h-72 md:h-80">
                {isLoadingData ? <p className="text-center text-tas-text-secondary-on-card">A carregar dados do gráfico...</p> : <canvas ref={statusChartRef}></canvas>}
              </div>
            </div>
            <div className="bg-tas-bg-card p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-tas-text-on-card mb-4">Chamados por Prioridade</h3>
              <div className="relative h-72 md:h-80">
                {isLoadingData ? <p className="text-center text-tas-text-secondary-on-card">A carregar dados do gráfico...</p> : <canvas ref={priorityChartRef}></canvas>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}