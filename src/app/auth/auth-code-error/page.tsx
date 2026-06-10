import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quinisindic | Error de acceso',
};

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-3 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-danger">
              Autenticación
            </span>
            <h1 className="text-3xl font-bold text-text">
              No se pudo completar el acceso
            </h1>
            <p className="text-sm text-muted">
              El enlace de inicio de sesión ha fallado o ya no es válido.
              Intenta iniciar sesión de nuevo.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="flex-1 rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Ir a login
            </Link>
            <Link
              href="/sign-up"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-semibold text-text transition-colors hover:border-brand/60 hover:text-brand"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
