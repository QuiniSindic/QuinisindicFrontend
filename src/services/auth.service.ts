import { LoginDTO, SignUpDTO, User } from '@/types/auth/auth.types';
import { IResponse } from '@/types/response.types';
import { createClient } from '@/utils/supabase/client';
import { BACKEND_URL } from 'core/config';

export const getMe = async (): Promise<IResponse<User | null>> => {
  const response = await fetch(`${BACKEND_URL}/auth/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  // no loggeado
  if (response.status === 204) {
    return {
      ok: true,
      data: null,
    };
  }

  const data = await response.json().catch(() => ({}));

  if (!data.ok) {
    // no loggeado
    return {
      ok: true,
      data: null,
    };
  }

  return {
    ok: true,
    data: data.data,
  };
};

export const login = async ({
  email,
  password,
}: LoginDTO): Promise<IResponse<User>> => {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!data.ok) {
    console.error('Error en la solicitud de login:', data.error);
    return {
      ok: false,
      error: data.error,
    };
  }

  const user = data.data;

  return {
    ok: true,
    data: user,
  };
};

export const signup = async ({
  email,
  password,
  username,
}: SignUpDTO): Promise<IResponse<User | null>> => {
  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username }),
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!data.ok) {
    console.error('Error en la solicitud de signup:', data.error);
    return {
      ok: false,
      error: data.error,
    };
  }

  return {
    ok: true,
    data: data.data,
  };
};

export const logout = async (): Promise<IResponse<null>> => {
  const response = await fetch(`${BACKEND_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!data.ok) {
    console.error('Error en la solicitud de logout:', data.error);
    return {
      ok: false,
      error: data.error,
    };
  }

  return {
    ok: true,
    data: null,
  };
};

export const handleGoogleAuth = () => {
  const url = `${BACKEND_URL}/auth/google/login`;
  window.location.href = url;
};

//________SUPABASE

// Helper para mapear el usuario de Supabase a tu tipo 'User' del frontend
const mapSupabaseUser = (u: any): User => ({
  id: u.id,
  email: u.email!,
  username: u.user_metadata?.username || u.email?.split('@')[0] || 'Usuario',
  password: '',
  provider: 'local',
  createdAt: undefined,
  updatedAt: undefined,
});

export const getMeV2 = async (): Promise<IResponse<User | null>> => {
  const supabase = createClient();
  // getUser valida el token contra Supabase real (más seguro que getSession)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // No hay sesión activa o hubo error
    return { ok: true, data: null };
  }

  return { ok: true, data: mapSupabaseUser(user) };
};

export const loginV2 = async ({
  email,
  password,
}: LoginDTO): Promise<IResponse<User>> => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error Login Supabase:', error.message);
    return {
      ok: false,
      error: 'Credenciales incorrectas o error en el servidor', // Mensaje amigable
    };
  }

  return { ok: true, data: mapSupabaseUser(data.user) };
};

export const signupV2 = async ({
  email,
  password,
  username,
}: SignUpDTO): Promise<IResponse<User | null>> => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Guardamos el username en los metadatos del usuario de Supabase
      data: { username },
    },
  });

  if (error) {
    console.error('Error SignUp Supabase:', error.message);
    return { ok: false, error: error.message };
  }

  // Supabase puede devolver un usuario pero session null si requiere confirmación de email
  if (data.user && !data.session) {
    return {
      ok: false,
      error: 'Revisa tu email para confirmar la cuenta.',
    };
  }

  return { ok: true, data: mapSupabaseUser(data.user) };
};

export const logoutV2 = async (): Promise<IResponse<null>> => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data: null };
};

export const handleGoogleAuthV2 = async () => {
  const supabase = createClient();
  // Inicia el flujo OAuth. Supabase redirigirá al usuario.
  // Asegúrate de tener configurada la URL de redirección en el panel de Supabase
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Redirige a la misma página donde estaba o al home
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};
