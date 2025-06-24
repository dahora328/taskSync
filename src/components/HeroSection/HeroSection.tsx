import { Link } from 'react-router-dom';
import './HeroSection.css';

export const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-container">
        <h1 className="hero-title">
          TaskSync - Gestão de Tarefas Colaborativas
        </h1>
        <p className="hero-description">
          Organize suas tarefas em equipe de forma eficiente
        </p>
        <div className="hero-buttons">
          <Link
            to="/login"
            className="hero-button-primary"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="hero-button-secondary"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}; 