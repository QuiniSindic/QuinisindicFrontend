import { API_LOGO_COMPETITION_URL } from '@/core/config';
import { TeamInfo } from '@/src/types/events/events.types';
import Image from 'next/image';

type TeamBadgeFormProps = {
  team: TeamInfo;
};

export const TeamBadgeForm = ({ team }: TeamBadgeFormProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        src={`${API_LOGO_COMPETITION_URL}${team.img}` || '/globe.svg'}
        alt={team.name}
        width={72}
        height={72}
        className="size-18"
      />
      <h2
        className="text-center max-w-35 truncate font-medium text-text"
        title={team.name}
      >
        {team.name}
      </h2>
    </div>
  );
};
