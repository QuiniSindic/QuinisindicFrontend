import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold text-text">No encontrado</h1>
      <p className="text-muted">El evento que buscas no esta disponible.</p>
      <Link
        href="/home"
        className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
