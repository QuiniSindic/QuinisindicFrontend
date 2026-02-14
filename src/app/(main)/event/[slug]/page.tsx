import MatchInfo from '@/components/event/MatchInfo';
import { getMatchDataV2 } from '@/services/new_matches.service';
import { getEventPredictionsV2 } from '@/services/predictions.service';
import { createClient } from '@/utils/supabase/server';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>; // El slug siempre viene como string de la URL
}) {
  const { slug } = await params;
  const matchId = Number(slug); // Convertimos a número para la DB

  // 1. Obtener usuario (Autenticación con Supabase Server)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Obtener datos del partido y predicciones en paralelo
  // Nota: getMatchData y getEventPredictions ahora llaman a Supabase directo
  const match = await getMatchDataV2(matchId);
  const predictions = await getEventPredictionsV2(matchId);

  // Si no hay partido (ID inválido), podrías manejar un 404 aquí
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
        <MatchInfo event={match} predictions={predictions} />
      </div>
    </div>
  );
}
