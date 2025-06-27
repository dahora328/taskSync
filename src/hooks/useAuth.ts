import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from '../components/Toast/ToastContext';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export function useAuth() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [authState, setAuthState] = useLocalStorage<AuthState>('auth', {
    user: null,
    token: null,
    isAuthenticated: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Verificar token na inicialização
  useEffect(() => {
    const checkAuth = async () => {
      const token = authState.token;
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Verificar se o token ainda é válido
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token inválido, fazer logout
          logout();
        } else {
          const userData = await response.json();
          setAuthState({
            user: userData.user,
            token,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Verificar expiração do token periodicamente
  useEffect(() => {
    if (!authState.token) return;

    const checkTokenExpiration = () => {
      try {
        const token = authState.token;
        if (!token) return;

        // Decodificar o token JWT (assumindo que é um JWT)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Converter para milissegundos
        const currentTime = Date.now();

        if (currentTime >= expirationTime) {
          showToast('Sessão expirada. Faça login novamente.', 'warning');
          logout();
        }
      } catch (error) {
        console.error('Erro ao verificar expiração do token:', error);
      }
    };

    // Verificar a cada 5 minutos
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
    
    // Verificar imediatamente
    checkTokenExpiration();

    return () => clearInterval(interval);
  }, [authState.token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      
      setAuthState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });

      showToast('Login realizado com sucesso!', 'success');
      navigate('/dashboard');
      
      return data;
    } catch (error) {
      showToast('Erro ao fazer login', 'error');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar conta');
      }

      const data = await response.json();
      
      setAuthState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });

      showToast('Conta criada com sucesso!', 'success');
      navigate('/dashboard');
      
      return data;
    } catch (error) {
      showToast('Erro ao criar conta', 'error');
      throw error;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    showToast('Logout realizado com sucesso', 'info');
    navigate('/');
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      setAuthState(prev => ({
        ...prev,
        user: { ...prev.user!, ...userData },
      }));
    }
  };

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };
} 