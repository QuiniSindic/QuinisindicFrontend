'use client';

import { useGetUsersUsernames } from '@/src/hooks/useUsers';
import { Prediction } from '@/src/types/database/table.types';
import { Avatar, Spinner } from '@heroui/react';
import { PredictionScoreBadge } from './PredictionScoreBadge';

interface UsersPredictionsProps {
  predictions: Prediction[];
}

const UsersPredictions = ({ predictions }: UsersPredictionsProps) => {
  const userIds = predictions.map((p) => p.userId);
  const { data: users = {}, isLoading, error } = useGetUsersUsernames(userIds);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 text-text">
        <Spinner
          classNames={{ label: 'text-text mt-4' }}
          label="Cargando predicciones de usuarios..."
          variant="wave"
        />
      </div>
    );
  }

  if (error) {
    console.error('Error fetching users:', error);
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        Error al cargar los usuarios.
      </div>
    );
  }

  return (
    <div
      className="
        rounded-xl border border-border
        bg-surface/80 backdrop-blur-sm
        p-2 sm:p-3
      "
    >
      <ul className="divide-y divide-border">
        {predictions.map((prediction) => {
          const user = users[prediction.userId];
          const name = user?.username ?? 'Usuario';

          return (
            <li key={prediction.id} className="p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={undefined} // TODO hacer algo con una foto de perfil
                  classNames={{
                    base: 'bg-brand text-brand-contrast flex items-center justify-center',
                    icon: 'text-brand-contrast',
                  }}
                  showFallback
                  alt={user?.username}
                  size="sm"
                  radius="full"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm sm:text-base font-medium text-text">
                      {name}
                    </p>

                    <PredictionScoreBadge
                      home={Number(prediction.homeScore)}
                      away={Number(prediction.awayScore)}
                    />
                  </div>

                  <p className="mt-0.5 text-xs text-muted">
                    {new Date(prediction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UsersPredictions;
