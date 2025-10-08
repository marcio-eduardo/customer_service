// Localização: src/pages/DashboardPage/DashboardPage.tsx
import React, { useEffect, useRef, useState } from 'react';
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

  // Paleta "Confiança Moderna (Light) Final"
  const colors = {
    tasPrimary: '#293B44',        // Usado para títulos principais da página, fundo da navbar/rodapé
    tasPrimaryHover: '#22313A',  
    tasSecondary: '#00875A',      // Verde Esmeralda para botões de ação, destaques positivos
    tasSecondaryHover: '#007a50',
    tasAccent: '#FFC107',         // Âmbar/Dourado para CTAs secundários ou destaques visuais
    tasAccentHover: '#ebb206',   
    tasBgPage: '#DFE0E1',        // Fundo principal da página
    tasBgCard: '#F2F2F2',        // Fundo dos cards
    tasTextOnCard: '#212529',   // Texto principal dentro dos cards
    tasTextSecondaryOnCard: '#6C757D', // Texto secundário dentro dos cards
    tasTextOnPrimary: '#FFFFFF', // Texto sobre fundos da cor primária (ex: Navbar, Rodapé)
    tasStatusSuccess: '#28A745', // Verde para sucesso
    tasStatusWarning: '#FF8C00', // Laranja para alerta/pendente
    tasStatusError: '#DC3545',   // Vermelho para erro/urgente
    tasStatusInfo: '#17A2B8',    // Azul para informação/aberto
  };

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
      if (!stats) return;
      destroyCharts();
      
      const legendTextColor = colors.tasTextOnCard;
      const chartCardBgColor = colors.tasBgCard;
      const tooltipBackgroundColor = colors.tasBgCard; 
      const tooltipTitleColor = colors.tasTextOnCard;    
      const tooltipBodyColor = colors.tasTextOnCard;    

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
                borderColor: chartCardBgColor, 
                borderWidth: 2,
                hoverOffset: 8,
                hoverBorderColor: '#E5E7EB' 
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: legendTextColor,
                    font: { family: "'Inter', sans-serif", size: 12 }
                  }
                },
                tooltip: { 
                  backgroundColor: tooltipBackgroundColor,
                  titleColor: tooltipTitleColor,
                  bodyColor: tooltipBodyColor,
                  borderColor: colors.tasTextSecondaryOnCard, 
                  borderWidth: 0.5, 
                  titleFont: { family: "'Inter', sans-serif", weight: 'bold' },
                  bodyFont: { family: "'Inter', sans-serif" },
                  padding: 10,
                  cornerRadius: 4,
                  displayColors: true
                }
              }
            }
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
                borderColor: chartCardBgColor,
                borderWidth: 2,
                hoverOffset: 8,
                hoverBorderColor: '#E5E7EB'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: legendTextColor, font: { family: "'Inter', sans-serif", size: 12 } }
                },
                tooltip: { 
                  backgroundColor: tooltipBackgroundColor,
                  titleColor: tooltipTitleColor,
                  bodyColor: tooltipBodyColor,
                  borderColor: colors.tasTextSecondaryOnCard, 
                  borderWidth: 0.5, 
                  titleFont: { family: "'Inter', sans-serif", weight: 'bold' },
                  bodyFont: { family: "'Inter', sans-serif" },
                  padding: 10,
                  cornerRadius: 4,
                  displayColors: true
                }
              },
              cutout: '50%' 
            }
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
      {/* O script do Chart.js é idealmente carregado no index.html ou via import de um pacote npm */}
      {/* <script src="https://cdn.jsdelivr.net/npm/chart.js" async defer></script> */}

      <div className={pageWrapperClasses}> 
        <div className={contentContainerClasses}>
          <header className="mb-8 text-center"> 
            <h1 className={`text-3xl lg:text-4xl font-bold ${pageHeaderTextClasses}`}>Dashboard de Chamados</h1> 
            <p className={`${pageSubHeaderTextClasses} mt-1`}>Visão geral do status dos chamados.</p>
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
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg border border-gray-200`}>
              <h3 className={`text-xl font-semibold ${chartCardTitleTextClasses} mb-4`}>Chamados por Status</h3>
              <div className="chart-container relative h-72 md:h-80 max-h-[400px]">
                {isLoadingData ? <p className="text-center text-tas-text-secondary-on-card">A carregar dados do gráfico...</p> : <canvas ref={statusChartRef}></canvas>}
              </div>
            </div>
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg border border-gray-200`}>
              <h3 className={`text-xl font-semibold ${chartCardTitleTextClasses} mb-4`}>Chamados por Prioridade</h3>
              <div className="chart-container relative h-72 md:h-80 max-h-[400px]">
                 {isLoadingData ? <p className="text-center text-tas-text-secondary-on-card">A carregar dados do gráfico...</p> : <canvas ref={priorityChartRef}></canvas>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
