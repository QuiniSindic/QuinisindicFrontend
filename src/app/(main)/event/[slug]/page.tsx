import { BACKEND_URL } from '@/core/config';
import MatchInfo from '@/src/components/event/MatchInfo';
import { getMatchData } from '@/src/services/matches.service';
import { getEventPredictions } from '@/src/services/predictions.service';
import { headers } from 'next/headers';

async function getServerUser() {
  const header = await headers();
  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { cookie: header.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (res.status === 204) return null;
  const json = await res.json().catch(() => null);
  return json?.ok ? json.data : null;
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: number }>;
}) {
  const { slug } = await params;

  const user = await getServerUser();

  const matchData = await getMatchData(slug);
  const match = Array.isArray(matchData) ? matchData[0] : matchData; // TODO: Check si se puede quitar
  const predictions = await getEventPredictions(match.id);

  return (
    <div className="flex flex-col grow">
      {user === null && (
        <div className="text-center bg-yellow-200 py-1 dark:text-black">
          <h1>Debes iniciar sesión para poder guardar tus predicciones</h1>
        </div>
      )}
      <div className="p-2 grow">
        <MatchInfo event={match} predictions={predictions} />
      </div>
    </div>
  );
}
