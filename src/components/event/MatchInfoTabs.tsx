import { Prediction } from '@/types/database/table';
import { MatchData } from '@/types/domain/events';
import { KeyboardEvent, useId, useRef, useState } from 'react';
import { MatchInfoTab } from './tabs/infoTab/MatchInfoTab';
import MatchInfoOddsTab from './tabs/oddsTab/MatchInfoOddsTab';
import { MatchInfoPredictionsTab } from './tabs/predictionsTab/MatchInfoPredictionsTab';
import { Tab } from './tabs/Tab';

type TabKey = 'match' | 'predictions' | 'odds';

interface MatchInfoTabsProps {
  event: MatchData;
  predictions: Prediction[];
  isFinished?: boolean;
  isInProgress?: boolean;
  notStarted?: boolean;
  refetchAllPreds?: () => void;
  loadingAllPreds?: boolean;
}

const TAB_ORDER: TabKey[] = ['match', 'predictions', 'odds'];

export const MatchInfoTabs: React.FC<MatchInfoTabsProps> = ({
  event,
  predictions,
  loadingAllPreds,
  isFinished,
  isInProgress,
  notStarted,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('match');
  const tabsId = useId();

  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    match: null,
    predictions: null,
    odds: null,
  });

  const activateAndFocusTab = (tab: TabKey) => {
    setActiveTab(tab);

    requestAnimationFrame(() => {
      tabRefs.current[tab]?.focus();
    });
  };

  const handleTabKeyDown =
    (tab: TabKey) => (event: KeyboardEvent<HTMLButtonElement>) => {
      const currentIndex = TAB_ORDER.indexOf(tab);

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextTab = TAB_ORDER[(currentIndex + 1) % TAB_ORDER.length];
        activateAndFocusTab(nextTab);
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevTab =
          TAB_ORDER[(currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length];
        activateAndFocusTab(prevTab);
      }

      if (event.key === 'Home') {
        event.preventDefault();
        activateAndFocusTab(TAB_ORDER[0]);
      }

      if (event.key === 'End') {
        event.preventDefault();
        activateAndFocusTab(TAB_ORDER[TAB_ORDER.length - 1]);
      }
    };

  return (
    <>
      <div
        className="mb-4 flex border-border"
        role="tablist"
        aria-label="Información del partido"
      >
        <Tab
          ref={(el) => {
            tabRefs.current.match = el;
          }}
          isActive={activeTab === 'match'}
          onClick={() => setActiveTab('match')}
          onKeyDown={handleTabKeyDown('match')}
          title="Partido"
          tabId={`${tabsId}-tab-match`}
          panelId={`${tabsId}-panel-match`}
        />

        <Tab
          ref={(el) => {
            tabRefs.current.predictions = el;
          }}
          isActive={activeTab === 'predictions'}
          onClick={() => setActiveTab('predictions')}
          onKeyDown={handleTabKeyDown('predictions')}
          title="Predicciones"
          tabId={`${tabsId}-tab-predictions`}
          panelId={`${tabsId}-panel-predictions`}
        />

        <Tab
          ref={(el) => {
            tabRefs.current.odds = el;
          }}
          isActive={activeTab === 'odds'}
          onClick={() => setActiveTab('odds')}
          onKeyDown={handleTabKeyDown('odds')}
          title="Cuotas"
          tabId={`${tabsId}-tab-odds`}
          panelId={`${tabsId}-panel-odds`}
        />
      </div>

      {activeTab === 'match' && (
        <section
          id={`${tabsId}-panel-match`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-tab-match`}
        >
          <MatchInfoTab
            event={event}
            isFinished={isFinished}
            isInProgress={isInProgress}
            notStarted={notStarted}
          />
        </section>
      )}

      {activeTab === 'predictions' && (
        <section
          id={`${tabsId}-panel-predictions`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-tab-predictions`}
        >
          <MatchInfoPredictionsTab
            predictions={predictions}
            loadingAllPreds={loadingAllPreds}
          />
        </section>
      )}

      {activeTab === 'odds' && (
        <section
          id={`${tabsId}-panel-odds`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-tab-odds`}
        >
          <MatchInfoOddsTab event={event} />
        </section>
      )}
    </>
  );
};
