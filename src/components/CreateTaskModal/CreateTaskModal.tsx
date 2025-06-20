/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useState } from 'react';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().optional(),
  due_date: z.string().optional(),
  project_id: z.string().min(1, 'Selecione um projeto'),
});

type CreateTaskData = z.infer<typeof createTaskSchema>;

// Mock de projetos (substitua por API futuramente)
const mockProjects = [
  { id: '1', name: 'Frontend' },
  { id: '2', name: 'Backend' },
  { id: '3', name: 'UI/UX' },
];

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal = ({ isOpen, onClose }: CreateTaskModalProps) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskData>({
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = async (data: CreateTaskData) => {
    setApiError(null);
    setSuccess(false);
    try {
      await axios.post('/api/tasks', data);
      setSuccess(true);
      reset();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Erro ao criar tarefa');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          aria-label="Fechar"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Criar Nova Tarefa</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Título da tarefa"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">{errors.title.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Descrição</label>
            <textarea
              {...register('description')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Descrição da tarefa (opcional)"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Data de Vencimento</label>
            <input
              type="date"
              {...register('due_date')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Projeto *</label>
            <select
              {...register('project_id')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Selecione um projeto</option>
              {mockProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.project_id && (
              <span className="text-red-500 text-sm">{errors.project_id.message}</span>
            )}
          </div>
          {apiError && (
            <div className="mb-4 text-red-600 text-center text-sm">{apiError}</div>
          )}
          {success && (
            <div className="mb-4 text-green-600 text-center text-sm">Tarefa criada com sucesso!</div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            Criar Tarefa
          </button>
        </form>
      </div>
    </div>
  );
}; 