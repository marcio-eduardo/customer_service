// Localização: src/pages/DashboardPage/DashboardPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios'; // Ajuste o caminho se necessário
import { toast } from 'sonner'; // Para notificações

// Interface para o modelo de Ticket, conforme retornado pela API (simplificada para o dashboard)
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

  // Cores da Paleta "Confiança Moderna (Light) Final"
  const colors = {
    tasPrimary: '#293B44',        // Azul da Navbar e elementos primários
    tasPrimaryHover: '#22313A',  // Hover para o azul primário
    tasSecondary: '#00875A',      // Verde Esmeralda
    tasSecondaryHover: '#007a50',// Hover para o verde secundário
    tasAccent: '#FFC107',         // Âmbar/Dourado
    tasAccentHover: '#ebb206',   // Hover para o âmbar
    tasBgPage: '#DFE0E1',        // Fundo da Página
    tasBgCard: '#F2F2F2',        // Fundo dos Cards
    tasTextOnCard: '#212529',   // Texto principal nos cards
    tasTextSecondaryOnCard: '#6C757D', // Texto secundário nos cards
    tasTextOnPrimary: '#FFFFFF', // Texto sobre fundos da cor primária
    tasStatusSuccess: '#28A745',
    tasStatusWarning: '#FF8C00',
    tasStatusError: '#DC3545',
    tasStatusInfo: '#17A2B8',
  };

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
      
      const legendTextColor = colors.tasTextOnCard;
      const gridColor = 'rgba(108, 117, 125, 0.2)'; 
      const chartCardBgColor = colors.tasBgCard;

      // Cores do Tooltip CORRIGIDAS
      const tooltipBackgroundColor = colors.tasBgCard; // Fundo claro para o tooltip
      const tooltipTitleColor = colors.tasTextOnCard;    // Texto escuro para o título
      const tooltipBodyColor = colors.tasTextOnCard;     // Texto escuro para o corpo

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
                backgroundColor: [
                  colors.tasStatusInfo,    
                  colors.tasAccent,        
                  colors.tasStatusWarning, 
                  colors.tasStatusSuccess  
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
                tooltip: { // CONFIGURAÇÃO DO TOOLTIP ATUALIZADA
                  backgroundColor: tooltipBackgroundColor,
                  titleColor: tooltipTitleColor,
                  bodyColor: tooltipBodyColor,
                  borderColor: colors.tasTextSecondaryOnCard, // Opcional: borda sutil
                  borderWidth: 0.5, // Opcional
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

      if (priorityChartRef.current && (window as any).Chart) {
        const priorityCtx = priorityChartRef.current.getContext('2d');
         if (priorityCtx) {
            chartInstancesRef.current.priority = new (window as any).Chart(priorityCtx, {
            type: 'doughnut',
            data: {
              labels: ['Urgente', 'Alta', 'Média', 'Baixa'],
              datasets: [{
                label: 'Chamados por Prioridade',
                data: [3, 12, 25, 40],
                backgroundColor: [
                  colors.tasStatusError,   
                  colors.tasStatusWarning, 
                  colors.tasStatusInfo,    
                  colors.tasStatusSuccess  
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
                tooltip: { // CONFIGURAÇÃO DO TOOLTIP ATUALIZADA
                  backgroundColor: tooltipBackgroundColor,
                  titleColor: tooltipTitleColor,
                  bodyColor: tooltipBodyColor,
                  borderColor: colors.tasTextSecondaryOnCard, // Opcional
                  borderWidth: 0.5, // Opcional
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
    
    if (!isLoadingData && typeof (window as any).Chart !== 'undefined') {
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
  }, [isLoadingData, totalOpenTickets, colors]);

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
      <script src="https://cdn.jsdelivr.net/npm/chart.js" async defer></script>

      <div className={pageWrapperClasses}> 
        <div className={contentContainerClasses}>
          <header className="mb-8 text-center"> 
            <h1 className={`text-3xl font-bold ${pageHeaderTextClasses}`}>Dashboard de Chamados</h1> 
            <p className={`${pageSubHeaderTextClasses} mt-1`}>Visão geral do status dos chamados.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link 
              to="/tickets/abertos" 
              className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 block hover:shadow-xl border border-gray-200`}
            >
              <div>
                <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Total Abertos</h3>
                <p className={`text-4xl font-bold text-tas-status-info mt-2`}>
                  {isLoadingData ? '...' : totalOpenTickets}
                </p>
              </div>
            </Link>
            
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 cursor-default border border-gray-200`}>
                <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Resolvidos Hoje</h3>
                <p className={`text-4xl font-bold text-tas-status-success mt-2`}>5</p>
            </div>
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 cursor-default border border-gray-200`}>
                <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Pendentes</h3>
                <p className={`text-4xl font-bold text-tas-status-warning mt-2`}>8</p>
            </div>
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 cursor-default border border-gray-200`}>
                <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Urgentes</h3>
                <p className={`text-4xl font-bold text-tas-status-error mt-2`}>3</p>
            </div>
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
