import { Prediction } from '@/types/database/table.types';
import { MatchData } from '@/types/events/events.types';
import { useState } from 'react';
import { MatchInfoTab } from './tabs/infoTab/MatchInfoTab';
import MatchInfoOddsTab from './tabs/oddsTab/MatchInfoOddsTab';
import { MatchInfoPredictionsTab } from './tabs/predictionsTab/MatchInfoPredictionsTab';
import { Tab } from './tabs/Tab';

type TabKey = 'match' | 'predictions' | 'odds';

interface MatchInfoTabsProps {
  event: MatchData;
  predictions: Prediction[]; // TODO tipar predictions
  isFinished?: boolean;
  isInProgress?: boolean;
  notStarted?: boolean;
  refetchAllPreds?: () => void;
  loadingAllPreds?: boolean;
}

export const MatchInfoTabs: React.FC<MatchInfoTabsProps> = ({
  event,
  predictions,
  loadingAllPreds,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('match');

  return (
    <>
      <div className="flex border-border mb-4">
        <Tab
          isActive={activeTab === 'match'}
          onClick={() => setActiveTab('match')}
          tittle="Partido"
        />

        <Tab
          isActive={activeTab === 'predictions'}
          onClick={() => setActiveTab('predictions')}
          tittle="Predicciones"
        />

        <Tab
          isActive={activeTab === 'odds'}
          onClick={() => setActiveTab('odds')}
          tittle="Cuotas"
        />
      </div>

      {activeTab === 'match' && (
        <MatchInfoTab event={event} isFinished isInProgress notStarted />
      )}

      {activeTab === 'predictions' && (
        <MatchInfoPredictionsTab
          predictions={predictions}
          loadingAllPreds={loadingAllPreds}
        />
      )}

      {activeTab === 'odds' && <MatchInfoOddsTab event={event} />}
    </>
  );
};
