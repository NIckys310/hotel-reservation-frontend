import { useState } from 'react';
import { authApi } from '../api/hotelApi';

const LOBBY_IMAGE =
  'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=1600&q=80';

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ fullName: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user =
        mode === 'login'
          ? await authApi.login(form.username, form.password)
          : await authApi.register(form.fullName, form.username, form.password);
      onLogin(user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${LOBBY_IMAGE})` }}>
      <div className="login-overlay" />
      <form className="login-card" onSubmit={submit}>
        <p className="eyebrow">Hotel Fachada</p>
        <h1>{mode === 'login' ? 'Bienvenido' : 'Crear cuenta'}</h1>
        <p className="muted">
          {mode === 'login'
            ? 'Inicia sesión para reservar y gestionar tus estadías.'
            : 'Regístrate en segundos para empezar a reservar.'}
        </p>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {mode === 'register' && (
          <div className="field">
            <label htmlFor="fullName">Nombre completo</label>
            <input id="fullName" value={form.fullName} onChange={update('fullName')} required />
          </div>
        )}
        <div className="field">
          <label htmlFor="username">Usuario</label>
          <input id="username" autoComplete="username" value={form.username} onChange={update('username')} required />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={form.password}
            onChange={update('password')}
            required
          />
        </div>

        <button type="submit" className="btn btn-gold btn-block" disabled={loading}>
          {loading ? 'Un momento…' : mode === 'login' ? 'Iniciar sesión' : 'Registrarme'}
        </button>

        <p className="switch-mode">
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setError('');
              setMode(mode === 'login' ? 'register' : 'login');
            }}
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
        {mode === 'login' && <p className="demo-hint">Usuario de prueba: admin · Contraseña: hotel123</p>}
      </form>
    </div>
  );
}
