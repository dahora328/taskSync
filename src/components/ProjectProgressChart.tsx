import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock de dados de tarefas por projeto
const dataByProject = [
  { project: 'Frontend', done: 8, pending: 2 },
  { project: 'Backend', done: 5, pending: 3 },
  { project: 'UI/UX', done: 3, pending: 4 },
];

export const ProjectProgressChart = () => {
  const data = {
    labels: dataByProject.map((p) => p.project),
    datasets: [
      {
        label: 'Concluídas',
        data: dataByProject.map((p) => p.done),
        backgroundColor: '#10B981',
      },
      {
        label: 'Pendentes',
        data: dataByProject.map((p) => p.pending),
        backgroundColor: '#F59E0B',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tarefas por Projeto',
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso por Projeto</h3>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}; 