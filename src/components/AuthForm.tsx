/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
      navigate('/dashboard');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Erro ao autenticar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          {isLogin ? 'Entrar' : 'Criar Conta'}
        </h2>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Seu nome"
            />
            {('name' in errors) && errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message as string}</span>
            )}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message as string}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Sua senha"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message as string}</span>
          )}
        </div>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Confirmar Senha</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Repita sua senha"
            />
            {('confirmPassword' in errors) && errors.confirmPassword && (
              <span className="text-red-500 text-sm">{errors.confirmPassword.message as string}</span>
            )}
          </div>
        )}
        {apiError && (
          <div className="mb-4 text-red-600 text-center text-sm">{apiError}</div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}; 