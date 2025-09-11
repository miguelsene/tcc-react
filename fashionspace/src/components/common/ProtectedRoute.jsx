import { Navigate } from 'react-router-dom';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, user, requireDono = false }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireDono && user.tipoUsuario !== 'dono') {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <i className="bi bi-shield-exclamation access-denied-icon"></i>
          <h2>Acesso Restrito</h2>
          <p>Esta funcionalidade está disponível apenas para donos de bazar.</p>
          <p>Para ter acesso, crie uma nova conta como "Dono de Bazar".</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.history.back()}
          >
            <i className="bi bi-arrow-left"></i>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;