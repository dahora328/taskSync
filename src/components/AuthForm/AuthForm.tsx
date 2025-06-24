/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '../Toast/ToastContext';
import './AuthForm.css';

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export type AuthFormType = 'login' | 'register';

interface AuthFormProps {
  type: AuthFormType;
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [apiError, setApiError] = useState<string | null>(null);

  const isLogin = type === 'login';
  const schema = isLogin ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setApiError(null);
    try {
      const url = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin
        ? { email: data.email, password: data.password }
        : { name: data.name, email: data.email, password: data.password };
      const response = await axios.post(url, payload);
      localStorage.setItem('token', response.data.token);
      
      if (isLogin) {
        showToast('Login realizado com sucesso!', 'success');
      } else {
        showToast('Conta criada com sucesso!', 'success');
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao autenticar';
      setApiError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="auth-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="auth-form"
      >
        <h2 className="auth-title">
          {isLogin ? 'Entrar' : 'Criar Conta'}
        </h2>
        {!isLogin && (
          <div className="auth-field">
            <label className="auth-label">Nome</label>
            <input
              type="text"
              {...register('name')}
              className="auth-input"
              placeholder="Seu nome"
            />
            {('name' in errors) && errors.name && (
              <span className="auth-error">{errors.name.message as string}</span>
            )}
          </div>
        )}
        <div className="auth-field">
          <label className="auth-label">E-mail</label>
          <input
            type="email"
            {...register('email')}
            className="auth-input"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <span className="auth-error">{errors.email.message as string}</span>
          )}
        </div>
        <div className="auth-field">
          <label className="auth-label">Senha</label>
          <input
            type="password"
            {...register('password')}
            className="auth-input"
            placeholder="Sua senha"
          />
          {errors.password && (
            <span className="auth-error">{errors.password.message as string}</span>
          )}
        </div>
        {!isLogin && (
          <div className="auth-field">
            <label className="auth-label">Confirmar Senha</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="auth-input"
              placeholder="Repita sua senha"
            />
            {('confirmPassword' in errors) && errors.confirmPassword && (
              <span className="auth-error">{errors.confirmPassword.message as string}</span>
            )}
          </div>
        )}
        {apiError && (
          <div className="auth-api-error">{apiError}</div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="auth-button"
        >
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}; 