import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          TaskSync - Gestão de Tarefas Colaborativas
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Organize suas tarefas em equipe de forma eficiente
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}; 