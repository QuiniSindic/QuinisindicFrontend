'use client';

import { NoDataToDisplay } from '@/components/ui/feedback/NoDataToDisplay';
import { Prediction } from '@/types/database/table';
import { Spinner } from '@heroui/react';
import React from 'react';
import UsersPredictions from './UserPredictions';

interface MatchInfoPredictionsTabProps {
  predictions: Prediction[];
  loadingAllPreds?: boolean;
}

export const MatchInfoPredictionsTab: React.FC<
  MatchInfoPredictionsTabProps
> = ({ predictions, loadingAllPreds }) => {
  if (loadingAllPreds) {
    return (
      <div className="flex justify-center items-center py-12 text-text">
        <Spinner
          classNames={{ label: 'text-foreground mt-4' }}
          label="Cargando predicciones de usuarios..."
          variant="wave"
        />
      </div>
    );
  }

  if (!predictions || predictions.length === 0) {
    return <NoDataToDisplay title=" No hay predicciones de usuarios." />;
  }

  return <UsersPredictions predictions={predictions} />;
};

export default MatchInfoPredictionsTab;
