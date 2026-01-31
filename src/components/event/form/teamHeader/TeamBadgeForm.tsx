import { TeamInfo } from '@/types/events/events.types';
import Image from 'next/image';

type TeamBadgeFormProps = {
  team: TeamInfo;
};

export const TeamBadgeForm = ({ team }: TeamBadgeFormProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        src={`${team.img}` || '/globe.svg'}
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
