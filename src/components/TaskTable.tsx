import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  status: 'to-do' | 'in-progress' | 'done';
  dueDate: string;
  project: string;
}

// Mock de tarefas
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Implementar autenticação',
    status: 'in-progress',
    dueDate: '2024-06-10',
    project: 'Frontend',
  },
  {
    id: 2,
    title: 'Criar API de tarefas',
    status: 'done',
    dueDate: '2024-06-01',
    project: 'Backend',
  },
  {
    id: 3,
    title: 'Design do dashboard',
    status: 'to-do',
    dueDate: '2024-06-15',
    project: 'UI/UX',
  },
  {
    id: 4,
    title: 'Testes unitários',
    status: 'done',
    dueDate: '2024-05-30',
    project: 'QA',
  },
];

const statusLabels = {
  'to-do': 'Pendente',
  'in-progress': 'Em Progresso',
  'done': 'Concluída',
};

const statusColors = {
  'to-do': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'done': 'bg-green-100 text-green-800',
};

function isWithinLastDays(dateStr: string, days: number) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

export const TaskTable = () => {
  const [period, setPeriod] = useState(14); // dias

  const filteredTasks = mockTasks.filter((task) => isWithinLastDays(task.dueDate, period));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">Tarefas Recentes</h3>
        <div>
          <label className="text-sm text-gray-700 mr-2">Período:</label>
          <select
            value={period}
            onChange={e => setPeriod(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value={7}>Última semana</option>
            <option value={14}>Últimas 2 semanas</option>
            <option value={30}>Último mês</option>
            <option value={90}>Últimos 3 meses</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-6">Nenhuma tarefa encontrada para o período selecionado.</td>
              </tr>
            )}
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.project}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 