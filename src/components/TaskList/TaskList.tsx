import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  status: 'to-do' | 'in-progress' | 'done';
  dueDate: string;
  project: string;
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Implementar autenticação',
    status: 'in-progress',
    dueDate: '2024-01-15',
    project: 'Frontend',
  },
  {
    id: 2,
    title: 'Criar API de tarefas',
    status: 'done',
    dueDate: '2024-01-10',
    project: 'Backend',
  },
  {
    id: 3,
    title: 'Design do dashboard',
    status: 'to-do',
    dueDate: '2024-01-20',
    project: 'UI/UX',
  },
  {
    id: 4,
    title: 'Testes unitários',
    status: 'to-do',
    dueDate: '2024-01-25',
    project: 'QA',
  },
];

const statusColors = {
  'to-do': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'done': 'bg-green-100 text-green-800',
};

const statusLabels = {
  'to-do': 'Pendente',
  'in-progress': 'Em Progresso',
  'done': 'Concluída',
};

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const projectMatch = projectFilter === 'all' || task.project === projectFilter;
    return statusMatch && projectMatch;
  });

  const handleStatusChange = (taskId: number, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDelete = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const projects = Array.from(new Set(tasks.map(task => task.project)));

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Filtrar por Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all" className='text-black'>Todos os Status</option>
                <option value="to-do" className='text-black'>Pendente</option>
                <option value="in-progress" className='text-black'>Em Progresso</option>
                <option value="done" className='text-black'>Concluída</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Filtrar por Projeto
              </label>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all" className='text-black'>Todos os Projetos</option>
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarefa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projeto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {task.title}
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                        className="text-xs border border-gray-300 rounded px-2 py-1 text-black"
                      >
                        <option value="to-do" className='text-black'>Pendente</option>
                        <option value="in-progress" className='text-black'>Em Progresso</option>
                        <option value="done" className='text-black'>Concluída</option>
                      </select>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 