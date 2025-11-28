import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { toast } from 'sonner';
import { theme } from '../../lib/tailwind-theme';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardStats {
  statusCounts: { [key: string]: number };
  priorityCounts: { [key: string]: number };
  totalOpenTickets: number;
  totalResolvedTickets: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const response = await api.get<DashboardStats>('/api/dashboard/stats');
        setStats(response.data);
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Could not load dashboard data.");
        setStats(null);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statusChartData = {
    labels: stats ? Object.keys(stats.statusCounts) : [],
    datasets: [
      {
        label: 'Tickets by Status',
        data: stats ? Object.values(stats.statusCounts) : [],
        backgroundColor: [
          theme.colors.tasStatusInfo,
          theme.colors.tasStatusSuccess,
        ],
        borderColor: theme.colors['tas-bg-card'],
        borderWidth: 2,
      },
    ],
  };

  const priorityChartData = {
    labels: stats ? Object.keys(stats.priorityCounts) : [],
    datasets: [
      {
        label: 'Tickets by Priority',
        data: stats ? Object.values(stats.priorityCounts) : [],
        backgroundColor: [
          theme.colors.tasStatusError,
          theme.colors.tasStatusWarning,
          theme.colors.tasStatusInfo,
          theme.colors.tasStatusSuccess,
        ],
        borderColor: theme.colors['tas-bg-card'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Chart',
      },
    },
  };
  
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
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-8 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${pageHeaderTextClasses}`}>Dashboard</h1>
            <p className={`${pageSubHeaderTextClasses} mt-1`}>Overview of ticket status.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <Link 
              to="/tickets/abertos" 
              className={`${cardBgClasses} p-6 rounded-xl shadow-lg text-center transition-transform hover:scale-105 block hover:shadow-xl border border-gray-200`}
            >
              <div>
                <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Total Open</h3>
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
                    <h3 className={`text-lg font-semibold ${cardTitleTextClasses}`}>Total Resolved</h3> 
                    <p className={`text-4xl font-bold text-tas-status-success mt-2`}>
                    {isLoadingData ? '...' : stats?.totalResolvedTickets ?? 0}
                    </p>
                </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg border border-gray-200`}>
              <h3 className={`text-xl font-semibold ${chartCardTitleTextClasses} mb-4`}>Tickets by Status</h3>
              <div className="relative h-72 md:h-80">
                {isLoadingData ? <p className="text-center text-tas-text-secondary-on-card">Loading chart data...</p> : <Pie data={statusChartData} options={chartOptions} />}
              </div>
            </div>
            <div className={`${cardBgClasses} p-6 rounded-xl shadow-lg border border-gray-200`}>
              <h3 className={`text-xl font-semibold ${chartCardTitleTextClasses} mb-4`}>Tickets by Priority</h3>
              <div className="relative h-72 md:h-80">
                {isLoadingData ? <p className="text-center text-tas-text-secondary-on-card">Loading chart data...</p> : <Doughnut data={priorityChartData} options={chartOptions} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}