import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../components/Toast/ToastContext';
import './Profile.css';

interface UserProfile {
  name: string;
  email: string;
  photo: string | null;
  password: string;
}

const initialProfile: UserProfile = {
  name: '',
  email: '',
  photo: null,
  password: '',
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useLocalStorage<UserProfile>('userProfile', {
    ...initialProfile,
    name: user?.name || '',
    email: user?.email || '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile.photo);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setProfile((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Atualizar dados do usuário no contexto de autenticação
    updateUser({
      name: profile.name,
      email: profile.email,
    });
    
    setSuccess(true);
    showToast('Perfil atualizado com sucesso!', 'success');
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao Dashboard
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white w-full rounded-xl shadow-lg p-8 flex flex-col gap-6"
        >
          <h2 className="text-2xl font-bold text-blue-700 text-center">Meu Perfil</h2>
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="photo" className="cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-blue-200">
                {photoPreview || profile.photo ? (
                  <img
                    src={photoPreview || profile.photo || ''}
                    alt="Foto de perfil"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a4 4 0 110 8 4 4 0 010-8zm0 12a8 8 0 018 8H4a8 8 0 018-8z" />
                  </svg>
                )}
              </div>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
            <span className="text-xs text-gray-500">Clique para alterar foto</span>
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Digite seu nome"
              className="w-full px-4 py-2 text-black border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-2  text-black border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Nova Senha</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              className="w-full px-4 py-2  text-black border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Deixe em branco para não alterar"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Salvar Alterações
          </button>
          {success && (
            <div className="text-green-600 text-center text-sm">Perfil atualizado com sucesso!</div>
          )}
        </form>
      </div>
    </div>
  );
} 