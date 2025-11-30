import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { toast } from 'sonner';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useTheme } from '../../contexts/ThemeContext'; // CORREÇÃO AQUI

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DashboardStats {
  statusCounts: { [key: string]: number };
  priorityCounts: { [key: string]: number };
  totalOpenTickets: number;
  totalResolvedTickets: number;
}

// Mapeamento de chaves da API para labels e variáveis CSS
const statusConfig: { [key: string]: { label: string; colorVar: string } } = {
  OPEN: { label: 'Abertos', colorVar: '--tas-status-info' },
  IN_PROGRESS: { label: 'Em Progresso', colorVar: '--tas-status-warning' },
  RESOLVED: { label: 'Resolvidos', colorVar: '--tas-status-success' },
};

const priorityConfig: { [key: string]: { label: string; colorVar: string } } = {
  URGENTE: { label: 'Urgente', colorVar: '--tas-status-error' },
  ALTA: { label: 'Alta', colorVar: '--tas-status-warning' },
  MEDIA: { label: 'Média', colorVar: '--tas-status-info' },
  BAIXA: { label: 'Baixa', colorVar: '--tas-text-secondary' },
};

export function DashboardPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Estado para armazenar as cores resolvidas do tema atual
  const [chartThemeColors, setChartThemeColors] = useState({
    accent: '#FFC107',
    accentHover: '#ebb206',
    bgCard: '#F2F2F2',
    textSecondary: '#6C757D',
    tooltipBg: 'rgba(0, 0, 0, 0.8)',
    tooltipColor: '#FFFFFF',
  });

  // Este useEffect observa mudanças no tema e atualiza as cores para os gráficos
  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    setChartThemeColors({
      accent: rootStyle.getPropertyValue('--tas-accent').trim(),
      accentHover: rootStyle.getPropertyValue('--tas-accent-hover').trim(),
      bgCard: rootStyle.getPropertyValue('--tas-bg-card').trim(),
      textSecondary: rootStyle.getPropertyValue('--tas-text-secondary').trim(),
      tooltipBg: 'rgba(0, 0, 0, 0.8)', // Mantido fixo para legibilidade
      tooltipColor: '#FFFFFF', // Mantido fixo para legibilidade
    });
  }, [theme]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const response = await api.get<DashboardStats>('/api/dashboard/stats');
        setStats(response.data);
      } catch (error: any) {
        toast.error("Não foi possível carregar os dados do dashboard.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDashboardData();
  }, []);

  const processChartData = (
    counts: { [key: string]: number } | undefined,
    config: { [key: string]: { label: string; colorVar: string } }
  ) => {
    if (!counts) {
      return { labels: [], data: [], colors: [] };
    }
    const rootStyle = getComputedStyle(document.documentElement);
    const labels = Object.keys(counts).map(key => config[key]?.label || key);
    const data = Object.values(counts);
    const colors = Object.keys(counts).map(key => rootStyle.getPropertyValue(config[key]?.colorVar || '--tas-text-secondary').trim());
    return { labels, data, colors };
  };

  const statusChartDataset = useMemo(() => processChartData(stats?.statusCounts, statusConfig), [stats, theme]);
  const priorityChartDataset = useMemo(() => processChartData(stats?.priorityCounts, priorityConfig), [stats, theme]);

  const getChartOptions = (themeColors: typeof chartThemeColors): any => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: themeColors.textSecondary,
          font: { family: "'Poppins', sans-serif", size: 12 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: themeColors.tooltipBg,
        titleColor: themeColors.tooltipColor,
        bodyColor: themeColors.tooltipColor,
        boxPadding: 8,
        padding: 12,
        cornerRadius: 8,
      },
      title: { display: false }
    },
  });

  const getChartData = (dataset: { labels: string[], data: number[], colors: string[] }) => ({
    labels: dataset.labels,
    datasets: [{
      data: dataset.data,
      backgroundColor: dataset.colors,
      borderWidth: 1,
      hoverOffset: 8,
    }],
  });

  return (
    <>
      <Helmet>
        <title>Dashboard - TAS</title>
      </Helmet>
      <div className="min-h-screen pt-16 bg-tas-bg-page text-tas-text-on-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-10 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-tas-primary">Dashboard</h1>
            <p className="text-tas-text-secondary-on-card mt-2 text-lg">Visão geral do status dos chamados.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <Link to="/tickets?status=OPEN" className="bg-tas-bg-card p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 block hover:shadow-2xl border border-black/10">
              <h3 className="text-xl font-semibold text-tas-primary">Chamados Abertos</h3>
              <p className="text-5xl font-bold text-tas-status-info mt-2">{isLoadingData ? '...' : stats?.totalOpenTickets ?? 0}</p>
            </Link>
            <Link to="/tickets?status=RESOLVED" className="bg-tas-bg-card p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 block hover:shadow-2xl border border-black/10">
              <h3 className="text-xl font-semibold text-tas-primary">Chamados Resolvidos</h3>
              <p className="text-5xl font-bold text-tas-status-success mt-2">{isLoadingData ? '...' : stats?.totalResolvedTickets ?? 0}</p>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-tas-bg-card p-6 rounded-xl shadow-lg border border-black/10">
              <h3 className="text-xl font-semibold text-center text-tas-primary mb-4">Chamados por Status</h3>
              <div className="relative h-72 md:h-80">
                {isLoadingData ? <p className="text-center text-tas-text-secondary-on-card">Carregando gráfico...</p> : <Pie data={getChartData(statusChartDataset)} options={getChartOptions(chartThemeColors)} />}
              </div>
            </div>
            <div className="bg-tas-bg-card p-6 rounded-xl shadow-lg border border-black/10">
              <h3 className="text-xl font-semibold text-center text-tas-primary mb-4">Chamados por Prioridade</h3>
              <div className="relative h-72 md:h-80">
                {isLoadingData ? <p className="text-center text-tas-text-secondary-on-card">Carregando gráfico...</p> : <Doughnut data={getChartData(priorityChartDataset)} options={getChartOptions(chartThemeColors)} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}