import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Obtener los parámetros de la URL (code y next)
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Si veníamos de alguna página específica usamos 'next', si no, vamos al home
  const next = searchParams.get('next') ?? '/home';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // Ignoramos el error si se llama desde un Server Component,
              // el middleware se encargará de refrescar la sesión si hace falta.
            }
          },
        },
      },
    );

    // 2. Intercambiar el código por una sesión (cookies)
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 3. SI TODO SALE BIEN: Redirigir al usuario al Home (o donde iba)
      const forwardedHost = request.headers.get('x-forwarded-host'); // Para entornos con proxy (Vercel)
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        // En local usamos el origin (http://localhost:3000)
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // En producción aseguramos usar el dominio real (https://tu-web.com)
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Si algo falla, redirigir a una página de error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
