import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CreateTaskModal } from '../CreateTaskModal/CreateTaskModal';

export const Sidebar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white shadow-lg relative">
      <div className="p-6">
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold text-blue-600">TaskSync</h1>
        </Link>
      </div>
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            Dashboard
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center w-full px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Criar Tarefa
          </button>
          <Link
            to="/reports"
            className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Relatórios
          </Link>
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            onClick={() => setShowModal(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Meu Perfil
          </Link>
        </div>
      </nav>
      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-blue-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
      <CreateTaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </aside>
  );
}; 