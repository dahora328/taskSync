import { useState } from 'react';
import './TaskTable.css';

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
  'to-do': 'task-table-status-todo',
  'in-progress': 'task-table-status-in-progress',
  'done': 'task-table-status-done',
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
    <div className="task-table-container">
      <div className="task-table-header">
        <h3 className="task-table-title">Tarefas Recentes</h3>
        <div className="task-table-controls">
          <label className="task-table-label">Período:</label>
          <select
            value={period}
            onChange={e => setPeriod(Number(e.target.value))}
            className="task-table-select"
          >
            <option value={7}>Última semana</option>
            <option value={14}>Últimas 2 semanas</option>
            <option value={30}>Último mês</option>
            <option value={90}>Últimos 3 meses</option>
          </select>
        </div>
      </div>
      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Projeto</th>
              <th>Status</th>
              <th>Vencimento</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={4} className="task-table-empty">Nenhuma tarefa encontrada para o período selecionado.</td>
              </tr>
            )}
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <div className="task-table-cell-title">{task.title}</div>
                </td>
                <td>
                  <div className="task-table-cell-project">{task.project}</div>
                </td>
                <td>
                  <span className={`task-table-status ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                  </span>
                </td>
                <td>
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