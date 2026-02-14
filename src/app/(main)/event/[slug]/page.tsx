import MatchInfo from '@/components/event/MatchInfo';
import { getMatchDataV2 } from '@/services/new_matches.service';
import { getEventPredictionsV2 } from '@/services/predictions.service';
import { createClient } from '@/utils/supabase/server';

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { slug } = await params;
  const { returnTo } = await searchParams;
  const matchId = Number(slug);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const match = await getMatchDataV2(matchId);
  const predictions = await getEventPredictionsV2(matchId);

  if (!match) {
    return <div className="p-4 text-center">No se encontró el evento.</div>;
  }

  return (
    <div className="flex flex-col grow bg-background">
      {!user && (
        <div className="bg-surface border border-border border-l-4 border-l-brand px-3 py-2">
          <p className="text-sm text-text">
            Debes iniciar sesión para poder guardar tus predicciones
          </p>
        </div>
      )}

      <div className="p-2 grow">
        <MatchInfo event={match} predictions={predictions} returnTo={returnTo} />
      </div>
    </div>
  );
}
