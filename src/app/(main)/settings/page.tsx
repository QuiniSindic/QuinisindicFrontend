import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quinisindic | Configuracion',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen pb-12 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Cuenta
            </span>
            <h1 className="text-3xl font-bold text-text">Configuracion</h1>
            <p className="text-sm text-muted max-w-2xl">
              Esta seccion aun no esta implementada. De momento la gestion de tu
              cuenta se limita al acceso, cierre de sesion y perfil basico.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/profile"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-text transition-colors hover:border-brand/60 hover:text-brand"
            >
              Ir al perfil
            </Link>
            <Link
              href="/home"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-text transition-colors hover:border-brand/60 hover:text-brand"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
