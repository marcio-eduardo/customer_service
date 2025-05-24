// Localização sugerida para este ficheiro: src/pages/DashboardPage/DashboardPage.tsx
import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

// Este componente assume que Chart.js está disponível globalmente (ex: via CDN no seu index.html)

// A prop isDarkMode e a interface DashboardPageProps foram removidas/simplificadas
// pois não há mais alternância de tema neste componente.

// Alterado para usar export function e removido React.FC para simplificar, já que não há props.
export function DashboardPage() {
  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const priorityChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstancesRef = useRef<{ status?: any; priority?: any }>({});

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

      // Cores padrão para os gráficos em modo claro (cards brancos)
      const commonTextAndGridColor = 'rgba(0, 0, 0, 0.1)'; 
      const legendTextColor = 'rgba(51, 51, 51, 1)';    
      const chartBorderColor = '#FFFFFF';               
      const tooltipTitleColor = '#1F2937';              
      const tooltipBodyColor = '#374151';               

      if (statusChartRef.current && (window as any).Chart) {
        const statusCtx = statusChartRef.current.getContext('2d');
        if (statusCtx) {
          chartInstancesRef.current.status = new (window as any).Chart(statusCtx, {
            type: 'pie',
            data: {
              labels: ['Aberto', 'Em Andamento', 'Pendente', 'Resolvido', 'Urgente'],
              datasets: [{
                label: 'Chamados por Status',
                data: [12, 19, 8, 5, 3], 
                backgroundColor: ['#3B82F6', '#4A90E2', '#F59E0B', '#10B981', '#EF4444'], 
                borderColor: chartBorderColor,
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
                  position: 'bottom',
                  labels: {
                    padding: 20, 
                    font: { size: 12, family: 'Poppins' },
                    color: legendTextColor 
                  }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: tooltipTitleColor,
                    bodyColor: tooltipBodyColor,
                    borderColor: commonTextAndGridColor,
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 4,
                    bodyFont: { size: 12, family: 'Poppins' },
                    titleFont: { size: 14, family: 'Poppins', weight: 'bold' },
                    callbacks: {
                        label: function(context: any) { 
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null && context.parsed !== undefined) {
                                label += context.parsed;
                            }
                            return label;
                        }
                    }
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
            type: 'bar',
            data: {
              labels: ['Baixa', 'Média', 'Alta', 'Urgente'],
              datasets: [{
                label: 'Chamados por Prioridade',
                data: [10, 15, 7, 3], 
                backgroundColor: ['#A5B4FC', '#60A5FA', '#FBBF24', '#F87171'], 
                borderColor: ['#818CF8', '#3B82F6', '#F59E0B', '#EF4444'],
                borderWidth: 1,
                hoverBackgroundColor: ['#818CF8', '#3B82F6', '#F59E0B', '#EF4444']
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: { 
                y: { 
                    beginAtZero: true, 
                    ticks: { 
                        stepSize: 5,
                        font: {size: 12, family: 'Poppins'},
                        color: legendTextColor 
                    },
                    grid: {
                        color: commonTextAndGridColor,
                        borderColor: commonTextAndGridColor 
                    }
                },
                x: {
                    ticks: {
                        font: {size: 12, family: 'Poppins'},
                        color: legendTextColor 
                    },
                    grid: {
                        color: commonTextAndGridColor, 
                        display: false, 
                        borderColor: commonTextAndGridColor 
                    }
                }
              },
              plugins: {
                legend: { 
                    display: false,
                    labels: { color: legendTextColor, font: {family: 'Poppins'} }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: tooltipTitleColor,
                    bodyColor: tooltipBodyColor,
                    borderColor: commonTextAndGridColor,
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 4,
                    bodyFont: { size: 12, family: 'Poppins' },
                    titleFont: { size: 14, family: 'Poppins', weight: 'bold' },
                    callbacks: {
                        label: function(context: any) { 
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null && context.parsed.y !== undefined) {
                                label += context.parsed.y;
                            }
                            return label;
                        }
                    }
                }
              }
            }
          });
        }
      }
    };
    
    const timer = setTimeout(() => {
        initCharts();
    }, 0);

    return () => {
      clearTimeout(timer);
      destroyCharts();
    };
  }, []); 

  // Wrapper externo para o fundo da página Branco Neutro (#EAEAEA) e espaçamento para a navbar
  // O utilizador alterou para bg-gray-700, então vamos usar isso.
  const pageWrapperClasses = "min-h-screen pt-16 font-['Poppins'] bg-gray-700 text-gray-800";
  // Container interno para centralizar o conteúdo com largura máxima
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"; 

  // Cores de texto para usar sobre o fundo da página bg-gray-700
  const pageHeaderTextClasses = 'text-gray-300'; 
  const pageSubHeaderTextClasses = 'text-gray-300'; 

  // Cores para os cards (fundo bg-gray-800)
  const cardBgClasses = 'bg-gray-800'; 
  const cardTitleTextClasses = 'text-gray-300'; 
  const chartCardTitleTextClasses = 'text-gray-300';

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
          <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 cursor-default`}>
              <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Total Abertos</h3>
              <p className="text-4xl font-bold text-[#4A90E2] mt-2">25</p>
          </div>
          <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 cursor-default`}>
              <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Resolvidos Hoje</h3>
              <p className="text-4xl font-bold text-[#3AB54A] mt-2">5</p>
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

// Removido o export default DashboardPage; pois agora é uma exportação nomeada.
// No seu ficheiro que importa este componente (ex: app.routes.tsx),
// a importação será: import { DashboardPage } from './pages/DashboardPage/DashboardPage';
