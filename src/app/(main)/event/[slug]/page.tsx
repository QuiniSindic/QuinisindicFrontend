import MatchInfo from '@/components/event/MatchInfo';
import {
  getServerCurrentUser,
  getServerEventPredictions,
  getServerMatchData,
  getServerUserMatchPrediction,
} from '@/services/server/pageData.service';
import { notFound } from 'next/navigation';

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

  const [user, match, predictions, userPrediction] = await Promise.all([
    getServerCurrentUser(),
    getServerMatchData(matchId),
    getServerEventPredictions(matchId),
    getServerUserMatchPrediction(matchId),
  ]);

  if (!match) {
    notFound();
  }

  return (
    <div className="flex flex-col grow bg-background">
      {!user && (
        <div className="bg-surface border border-border border-l-4 border-l-brand px-3 py-2">
          <p className="text-sm text-text">
            Debes iniciar sesion para poder guardar tus predicciones
          </p>
        </div>
      )}

      <div className="p-2 grow">
        <MatchInfo
          event={match}
          predictions={predictions}
          initialUser={user}
          initialUserPrediction={userPrediction}
          returnTo={returnTo}
        />
      </div>
    </div>
  );
}
