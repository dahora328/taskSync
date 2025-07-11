import { useState } from 'react';
import { useToast } from '../Toast/ToastContext';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface Comment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'to-do' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  project: string;
  assignee: string;
  createdAt: string;
  comments: Comment[];
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Implementar autenticação',
    description: 'Sistema de login e registro de usuários',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-01-15',
    project: 'Frontend',
    assignee: 'João Silva',
    createdAt: '2024-01-01',
    comments: [
      {
        id: 1,
        text: 'Começando a implementar o sistema de autenticação com JWT',
        author: 'João Silva',
        createdAt: '2024-01-02T10:30:00',
      },
      {
        id: 2,
        text: 'Preciso de ajuda com a validação de tokens',
        author: 'Maria Santos',
        createdAt: '2024-01-03T14:20:00',
      },
    ],
  },
  {
    id: 2,
    title: 'Criar API de tarefas',
    description: 'Desenvolver endpoints para CRUD de tarefas',
    status: 'done',
    priority: 'high',
    dueDate: '2024-01-10',
    project: 'Backend',
    assignee: 'Maria Santos',
    createdAt: '2023-12-28',
    comments: [
      {
        id: 3,
        text: 'API finalizada e testada com sucesso!',
        author: 'Maria Santos',
        createdAt: '2024-01-09T16:45:00',
      },
    ],
  },
  {
    id: 3,
    title: 'Design do dashboard',
    description: 'Criar mockups e protótipos do dashboard',
    status: 'to-do',
    priority: 'medium',
    dueDate: '2024-01-20',
    project: 'UI/UX',
    assignee: 'Pedro Costa',
    createdAt: '2024-01-05',
    comments: [],
  },
  {
    id: 4,
    title: 'Testes unitários',
    description: 'Implementar testes para componentes principais',
    status: 'to-do',
    priority: 'low',
    dueDate: '2024-01-25',
    project: 'QA',
    assignee: 'Ana Oliveira',
    createdAt: '2024-01-08',
    comments: [],
  },
  {
    id: 5,
    title: 'Corrigir bug de performance',
    description: 'Otimizar carregamento da lista de tarefas',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: '2024-01-12',
    project: 'Frontend',
    assignee: 'João Silva',
    createdAt: '2024-01-10',
    comments: [
      {
        id: 4,
        text: 'Identificado o problema: renderização desnecessária de componentes',
        author: 'João Silva',
        createdAt: '2024-01-11T09:15:00',
      },
    ],
  },
  {
    id: 6,
    title: 'Documentação da API',
    description: 'Criar documentação completa dos endpoints',
    status: 'done',
    priority: 'medium',
    dueDate: '2024-01-08',
    project: 'Backend',
    assignee: 'Maria Santos',
    createdAt: '2023-12-30',
    comments: [],
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

const priorityColors = {
  'low': 'bg-gray-100 text-gray-800',
  'medium': 'bg-blue-100 text-blue-800',
  'high': 'bg-orange-100 text-orange-800',
  'urgent': 'bg-red-100 text-red-800',
};

const priorityLabels = {
  'low': 'Baixa',
  'medium': 'Média',
  'high': 'Alta',
  'urgent': 'Urgente',
};

export const TaskList = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', mockTasks);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  
  // Estados para modais de confirmação
  const [deleteTaskModal, setDeleteTaskModal] = useState<{
    isOpen: boolean;
    taskId: number | null;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: '',
  });
  
  const [deleteCommentModal, setDeleteCommentModal] = useState<{
    isOpen: boolean;
    taskId: number | null;
    commentId: number | null;
  }>({
    isOpen: false,
    taskId: null,
    commentId: null,
  });

  const filteredTasks = tasks.filter((task) => {
    // Busca por texto (título, descrição, projeto, responsável)
    const searchMatch = search === '' || 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase())) ||
      task.project.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee.toLowerCase().includes(search.toLowerCase());

    // Filtros
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const projectMatch = projectFilter === 'all' || task.project === projectFilter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    const assigneeMatch = assigneeFilter === 'all' || task.assignee === assigneeFilter;
    
    // Filtro de data
    let dateMatch = true;
    if (dateFilter !== 'all') {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      switch (dateFilter) {
        case 'today':
          dateMatch = taskDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          dateMatch = taskDate.toDateString() === tomorrow.toDateString();
          break;
        case 'this-week':
          dateMatch = taskDate >= today && taskDate <= nextWeek;
          break;
        case 'overdue':
          dateMatch = taskDate < today && task.status !== 'done';
          break;
        case 'next-month':
          dateMatch = taskDate >= nextWeek && taskDate <= nextMonth;
          break;
      }
    }

    return searchMatch && statusMatch && projectMatch && priorityMatch && assigneeMatch && dateMatch;
  });

  const handleStatusChange = (taskId: number, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    showToast(`Status da tarefa alterado para ${statusLabels[newStatus]}`, 'info');
  };

  const handleDeleteClick = (taskId: number, taskTitle: string) => {
    setDeleteTaskModal({
      isOpen: true,
      taskId,
      taskTitle,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteTaskModal.taskId) {
      const taskToDelete = tasks.find(task => task.id === deleteTaskModal.taskId);
      setTasks(tasks.filter(task => task.id !== deleteTaskModal.taskId));
      showToast(`Tarefa "${taskToDelete?.title}" removida com sucesso`, 'success');
    }
    setDeleteTaskModal({ isOpen: false, taskId: null, taskTitle: '' });
  };

  const handleDeleteCommentClick = (taskId: number, commentId: number) => {
    setDeleteCommentModal({
      isOpen: true,
      taskId,
      commentId,
    });
  };

  const handleDeleteCommentConfirm = () => {
    if (deleteCommentModal.taskId && deleteCommentModal.commentId) {
      setTasks(tasks.map(task => 
        task.id === deleteCommentModal.taskId 
          ? { ...task, comments: task.comments.filter(c => c.id !== deleteCommentModal.commentId) }
          : task
      ));
      showToast('Comentário removido com sucesso!', 'success');
    }
    setDeleteCommentModal({ isOpen: false, taskId: null, commentId: null });
  };

  const handleAddComment = (taskId: number) => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      text: newComment.trim(),
      author: 'Usuário Atual',
      createdAt: new Date().toISOString(),
    };

    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, comments: [...task.comments, comment] }
        : task
    ));
    
    setNewComment('');
    showToast('Comentário adicionado com sucesso!', 'success');
  };

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const clearAllFilters = () => {
    setStatusFilter('all');
    setProjectFilter('all');
    setPriorityFilter('all');
    setAssigneeFilter('all');
    setDateFilter('all');
    setSearch('');
    showToast('Filtros limpos', 'info');
  };

  const projects = Array.from(new Set(tasks.map(task => task.project)));
  const assignees = Array.from(new Set(tasks.map(task => task.assignee)));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Barra de busca */}
        <div className="p-6 border-b border-gray-200">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar tarefas por título, descrição, projeto ou responsável..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-200 tasklist-search"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Botão para mostrar/ocultar filtros avançados */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium tasklist-btn"
            >
              <svg className={`w-4 h-4 mr-1 transition-transform ${showAdvancedFilters ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Filtros Avançados
            </button>
            <button
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700 text-sm tasklist-btn"
            >
              Limpar Filtros
            </button>
          </div>

          {/* Filtros básicos sempre visíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 tasklist-filters">
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-200 tasklist-select"
              >
                <option value="all">Todos os Status</option>
                <option value="to-do">Pendente</option>
                <option value="in-progress">Em Progresso</option>
                <option value="done">Concluída</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Projeto
              </label>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-200 tasklist-select"
              >
                <option value="all">Todos os Projetos</option>
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Prioridade
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-200 tasklist-select"
              >
                <option value="all">Todas as Prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
          </div>

          {/* Filtros avançados */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 tasklist-filters">
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    Responsável
                  </label>
                  <select
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-200 tasklist-select"
                  >
                    <option value="all">Todos os Responsáveis</option>
                    {assignees.map((assignee) => (
                      <option key={assignee} value={assignee}>
                        {assignee}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    Data de Vencimento
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-200 tasklist-select"
                  >
                    <option value="all">Todas as Datas</option>
                    <option value="today">Vence Hoje</option>
                    <option value="tomorrow">Vence Amanhã</option>
                    <option value="this-week">Esta Semana</option>
                    <option value="overdue">Atrasadas</option>
                    <option value="next-month">Próximo Mês</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Contador de resultados */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredTasks.length} de {tasks.length} tarefas encontradas
          </div>
        </div>

        {/* Tabela de tarefas */}
        <div className="tasklist-table-wrapper">
          <table className="min-w-full divide-y divide-gray-200 tasklist-table">
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
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comentários
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
                      <p className="text-sm">Tente ajustar os filtros ou a busca</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <>
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-sm text-gray-500 mt-1">
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{task.project}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[task.status]}`}>
                          {statusLabels[task.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[task.priority]}`}>
                          {priorityLabels[task.priority]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{task.assignee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleTaskExpansion(task.id)}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {task.comments.length} comentário{task.comments.length !== 1 ? 's' : ''}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                            className="text-xs border border-gray-300 rounded px-2 py-1 text-black tasklist-select"
                          >
                            <option value="to-do">Pendente</option>
                            <option value="in-progress">Em Progresso</option>
                            <option value="done">Concluída</option>
                          </select>
                          <button
                            onClick={() => handleDeleteClick(task.id, task.title)}
                            className="text-red-600 hover:text-red-900 tasklist-btn"
                            title="Deletar tarefa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedTask === task.id && (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">Comentários</h4>
                            {task.comments.length === 0 ? (
                              <p className="text-gray-500 text-sm">Nenhum comentário ainda.</p>
                            ) : (
                              <div className="space-y-3">
                                {task.comments.map((comment) => (
                                  <div key={comment.id} className="bg-white p-3 rounded-lg border">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-900">{comment.text}</p>
                                        <div className="flex items-center mt-2 text-xs text-gray-500">
                                          <span className="font-medium">{comment.author}</span>
                                          <span className="mx-2">•</span>
                                          <span>{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => handleDeleteCommentClick(task.id, comment.id)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                        title="Deletar comentário"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Adicionar comentário..."
                                className="flex-1 px-3 py-2 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(task.id)}
                              />
                              <button
                                onClick={() => handleAddComment(task.id)}
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Comentar
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modais de confirmação */}
      <ConfirmationModal
        isOpen={deleteTaskModal.isOpen}
        onClose={() => setDeleteTaskModal({ isOpen: false, taskId: null, taskTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Excluir Tarefa"
        message={`Tem certeza que deseja excluir a tarefa "${deleteTaskModal.taskTitle}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
      
      <ConfirmationModal
        isOpen={deleteCommentModal.isOpen}
        onClose={() => setDeleteCommentModal({ isOpen: false, taskId: null, commentId: null })}
        onConfirm={handleDeleteCommentConfirm}
        title="Excluir Comentário"
        message="Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}; 