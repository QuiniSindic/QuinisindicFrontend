'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function loginWithGoogle() {
  const supabase = await createClient();

  // Detectar la URL base dinámicamente o usar variable de entorno
  // En producción DEBE ser tu dominio real. En dev localhost:3000
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/home`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // OAuth requiere redirigir al usuario a la URL de Google que nos da Supabase
  if (data.url) {
    redirect(data.url);
  }

  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string; // Asegúrate de pedir esto en el form

  // Origin para redirigir tras verificar email (si lo tienes activado)
  // const origin = headers().get('origin');

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, // Esto se guardará en profiles gracias al trigger SQL
      },
      // emailRedirectTo: `${origin}/auth/callback`, // Descomentar si usas confirmación de email
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Si no requieres confirmación de email, entra directo
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  return { success: true };
}
