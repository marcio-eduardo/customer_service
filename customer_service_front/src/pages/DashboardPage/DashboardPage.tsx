import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios'; 
import { toast } from 'sonner'; 

interface DashboardStats {
  statusCounts: { [key: string]: number };
  priorityCounts: { [key: string]: number };
  totalOpenTickets: number;
  totalResolvedTickets: number;
}

export function DashboardPage() {
  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const priorityChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstancesRef = useRef<{ status?: any; priority?: any }>({});

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Efeito para buscar os dados do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const response = await api.get<DashboardStats>('/api/dashboard/stats');
        setStats(response.data);
      } catch (error: any) {
        console.error("Falha ao buscar dados para o dashboard:", error);
        toast.error("Não foi possível carregar os dados do dashboard.");
        setStats(null);
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
      if (!stats) return;
      destroyCharts();
      
      const colors = theme.colors as any; // Acessa as cores do tema

      // Gráfico de Status
      if (statusChartRef.current && (window as any).Chart) {
        const statusCtx = statusChartRef.current.getContext('2d');
        if (statusCtx) {
          const statusLabels = Object.keys(stats.statusCounts);
          const statusData = Object.values(stats.statusCounts);

          chartInstancesRef.current.status = new (window as any).Chart(statusCtx, {
            type: 'pie',
            data: {
              labels: statusLabels,
              datasets: [{
                label: 'Chamados por Status',
                data: statusData,
                backgroundColor: [
                  colors.tasStatusInfo,    // OPEN
                  colors.tasStatusSuccess, // RESOLVED
                  // Adicione mais cores se tiver mais status
                ],
                borderColor: colors['tas-bg-card'], 
                borderWidth: 2,
              }]
            },
            options: { responsive: true, maintainAspectRatio: false /* ... */ }
          });
        }
      }

      // Gráfico de Prioridade
      if (priorityChartRef.current && (window as any).Chart) {
        const priorityCtx = priorityChartRef.current.getContext('2d');
         if (priorityCtx) {
            const priorityLabels = Object.keys(stats.priorityCounts);
            const priorityData = Object.values(stats.priorityCounts);

            chartInstancesRef.current.priority = new (window as any).Chart(priorityCtx, {
            type: 'doughnut',
            data: {
              labels: priorityLabels,
              datasets: [{
                label: 'Chamados por Prioridade',
                data: priorityData,
                backgroundColor: [
                  colors.tasStatusError,   // URGENT
                  colors.tasStatusWarning, // HIGH
                  colors.tasStatusInfo,    // MEDIUM
                  colors.tasStatusSuccess  // LOW
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
    
    if (!isLoadingData && stats && typeof (window as any).Chart !== 'undefined') {
        const timer = setTimeout(() => { initCharts(); }, 0); 
        return () => { 
          clearTimeout(timer);
          destroyCharts(); 
        };
    } else if (typeof (window as any).Chart === 'undefined') {
        console.warn("Chart.js não está carregado. Os gráficos não serão renderizados.");
    } else {
        destroyCharts(); 
    }
  }, [isLoadingData, stats, colors]);

  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"; 
  const pageHeaderTextClasses = `text-tas-primary`; 
  const pageSubHeaderTextClasses = `text-tas-text-secondary-on-card`; 
  const cardBgClasses = `bg-tas-bg-card`; 
  const cardTitleTextClasses = `text-tas-text-on-card`; 
  const chartCardTitleTextClasses = `text-tas-text-on-card`;

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8"> {/* Alterado para 2 colunas */}
            <Link 
              to="/tickets/abertos" 
              className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 block hover:shadow-xl border border-gray-200`}
            >
              <div>
                <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Total Abertos</h3>
                <p className={`text-4xl font-bold text-tas-status-info mt-2`}>
                  {isLoadingData ? '...' : stats?.totalOpenTickets ?? 0}
                </p>
              </div>
            </Link>
            
            <Link
              to="/tickets/resolvidos" 
              className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 block hover:shadow-xl border border-gray-200`}
            >
                <div>
                    <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Total Resolvidos</h3> 
                    <p className={`text-4xl font-bold text-tas-status-success mt-2`}>
                    {isLoadingData ? '...' : stats?.totalResolvedTickets ?? 0}
                    </p>
                </div>
            </Link>
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