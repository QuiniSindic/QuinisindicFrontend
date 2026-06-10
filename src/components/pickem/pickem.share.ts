import {
  PickemAwardCandidate,
  PickemContest,
  PickemTeam,
} from '@/types/domain/pickem';
import { User } from '@/types/auth/auth';
import {
  AwardCandidatesByKey,
  AwardState,
  GroupOrderState,
} from './pickem.types';
import { awardLabels, formatAwardCandidate } from './pickem.utils';

type PickemShareData = {
  contest: PickemContest;
  groupOrder: GroupOrderState;
  awardState: AwardState;
  awardCandidates: AwardCandidatesByKey;
  currentUser: User | null;
  url: string;
};

type ResolvedAward = {
  label: string;
  value: string;
};

type ResolvedTeam = PickemTeam & {
  shortLabel: string;
};

type ShareResult = 'shared' | 'downloaded' | 'copied';

const CANVAS_WIDTH = 1080;
const PADDING = 56;
const GROUP_COLUMNS = 4;
const GROUP_CARD_HEIGHT = 280;
const GROUP_GAP = 18;
const AWARDS_HEIGHT = 330;
const FOOTER_HEIGHT = 120;

const colors = {
  background: '#fbf6ff',
  surface: '#ffffff',
  text: '#14081f',
  muted: '#5f4b78',
  border: '#e6dbf2',
  brand: '#5502a6',
  brandSoft: '#f0e5ff',
  brandContrast: '#ffffff',
};

function resolveTeamById(contest: PickemContest) {
  return new Map(
    contest.groups.flatMap((group) =>
      group.teams.map((team) => [team.id, team]),
    ),
  );
}

function shortTeamLabel(team: PickemTeam) {
  return team.abbr || team.name.slice(0, 3).toUpperCase();
}

function resolveAwards(data: PickemShareData): ResolvedAward[] {
  const champion = data.contest.champion_candidates.find(
    (team) => team.id === data.awardState.champion,
  );

  return [
    {
      label: 'Campeon',
      value: champion?.name ?? 'Sin seleccionar',
    },
    ...(['mvp', 'top_scorer', 'best_goalkeeper'] as const).map((awardKey) => {
      const candidate = data.awardCandidates[awardKey].find(
        (item) => item.id === data.awardState[awardKey],
      );

      return {
        label: awardLabels[awardKey],
        value: candidate ? formatAwardCandidate(candidate) : 'Sin seleccionar',
      };
    }),
  ];
}

function predictionAuthor(data: PickemShareData) {
  return data.currentUser?.username || data.currentUser?.email || 'Mi prediccion';
}

function resolveCandidateName(
  candidates: PickemAwardCandidate[],
  selectedId?: number | null,
) {
  const candidate = candidates.find((item) => item.id === selectedId);
  return candidate ? formatAwardCandidate(candidate) : 'Sin seleccionar';
}

export function buildPickemShareText(data: PickemShareData) {
  const teamsById = resolveTeamById(data.contest);
  const lines = [
    `Mi Pick'em - ${data.contest.name}`,
    '',
    'Grupos:',
    ...data.contest.groups.flatMap((group) => [
      group.name,
      ...(data.groupOrder[group.id] ?? []).map((participantId, index) => {
        const team = teamsById.get(participantId);
        return `${index + 1}. ${team?.name ?? 'Equipo'}`;
      }),
    ]),
    '',
    `Campeon: ${
      data.contest.champion_candidates.find(
        (team) => team.id === data.awardState.champion,
      )?.name ?? 'Sin seleccionar'
    }`,
    `MVP: ${resolveCandidateName(
      data.awardCandidates.mvp,
      data.awardState.mvp,
    )}`,
    `Maximo goleador: ${resolveCandidateName(
      data.awardCandidates.top_scorer,
      data.awardState.top_scorer,
    )}`,
    `Mejor portero: ${resolveCandidateName(
      data.awardCandidates.best_goalkeeper,
      data.awardState.best_goalkeeper,
    )}`,
    '',
    data.url,
  ];

  return lines.join('\n');
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
) {
  let label = text;
  while (ctx.measureText(label).width > maxWidth && label.length > 8) {
    label = `${label.slice(0, -2)}`;
  }
  if (label !== text) label = `${label.slice(0, -3)}...`;
  ctx.fillText(label, x, y);
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) lines.push(currentLine);
    currentLine = word;

    if (lines.length === maxLines) break;
  }

  if (currentLine && lines.length < maxLines) lines.push(currentLine);

  const consumedText = lines.join(' ');
  const wasTruncated = consumedText.length < text.length;

  lines.forEach((line, index) => {
    let visibleLine = line;
    if (wasTruncated && index === lines.length - 1) {
      while (
        ctx.measureText(`${visibleLine}...`).width > maxWidth &&
        visibleLine.length > 4
      ) {
        visibleLine = visibleLine.slice(0, -1);
      }
      visibleLine = `${visibleLine}...`;
    }

    ctx.fillText(visibleLine, x, y + index * lineHeight);
  });
}

function drawBadgeFallback(
  ctx: CanvasRenderingContext2D,
  team: ResolvedTeam,
  x: number,
  y: number,
  size: number,
) {
  ctx.fillStyle = colors.brandSoft;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.brand;
  ctx.font = '700 18px "League Spartan Variable", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(team.shortLabel.slice(0, 3), x + size / 2, y + size / 2 + 1);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    const timeout = window.setTimeout(() => resolve(null), 2500);

    if (!src.startsWith(window.location.origin)) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      window.clearTimeout(timeout);
      resolve(img);
    };
    img.onerror = () => {
      window.clearTimeout(timeout);
      resolve(null);
    };
    img.src = src;
  });
}

function proxiedBadgeSrc(src: string) {
  if (src.startsWith('data:') || src.startsWith('blob:')) return src;

  try {
    const url = new URL(src, window.location.origin);
    if (url.origin === window.location.origin) return url.href;

    return `${window.location.origin}/api/pickem/badge?url=${encodeURIComponent(
      url.href,
    )}`;
  } catch {
    return src;
  }
}

async function drawTeamBadge(
  ctx: CanvasRenderingContext2D,
  team: ResolvedTeam,
  x: number,
  y: number,
  size: number,
  useBadges: boolean,
) {
  if (!team.badge || !useBadges) {
    drawBadgeFallback(ctx, team, x, y, size);
    return;
  }

  const image = await loadImage(proxiedBadgeSrc(team.badge));
  if (!image) {
    drawBadgeFallback(ctx, team, x, y, size);
    return;
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, x, y, size, size);
  ctx.restore();
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('No se pudo generar la imagen'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
}

async function renderShareImage(data: PickemShareData, useBadges: boolean) {
  await document.fonts.ready;

  const canvas = document.createElement('canvas');
  const groupRows = Math.ceil(data.contest.groups.length / GROUP_COLUMNS);
  const height =
    250 +
    groupRows * (GROUP_CARD_HEIGHT + GROUP_GAP) +
    AWARDS_HEIGHT +
    FOOTER_HEIGHT;
  canvas.width = CANVAS_WIDTH;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas no disponible');

  const teamsById = resolveTeamById(data.contest);
  const awards = resolveAwards(data);

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, height);

  ctx.fillStyle = colors.brand;
  ctx.beginPath();
  ctx.arc(CANVAS_WIDTH - 90, 60, 190, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = colors.brandSoft;
  ctx.beginPath();
  ctx.arc(80, 180, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = colors.brand;
  ctx.font = '800 34px "League Spartan Variable", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Quinisindic Pickem', PADDING, 86);

  ctx.fillStyle = colors.text;
  ctx.font = '900 58px "League Spartan Variable", sans-serif';
  drawText(ctx, data.contest.name, PADDING, 150, 760);

  ctx.fillStyle = colors.muted;
  ctx.font = '600 28px "League Spartan Variable", sans-serif';
  drawText(ctx, predictionAuthor(data), PADDING, 196, 720);

  const groupGridWidth = CANVAS_WIDTH - PADDING * 2;
  const groupCardWidth =
    (groupGridWidth - GROUP_GAP * (GROUP_COLUMNS - 1)) / GROUP_COLUMNS;
  let y = 250;
  for (
    let groupIndex = 0;
    groupIndex < data.contest.groups.length;
    groupIndex += 1
  ) {
    const group = data.contest.groups[groupIndex];
    const column = groupIndex % GROUP_COLUMNS;
    const row = Math.floor(groupIndex / GROUP_COLUMNS);
    const x = PADDING + column * (groupCardWidth + GROUP_GAP);
    const groupY = y + row * (GROUP_CARD_HEIGHT + GROUP_GAP);

    roundedRect(ctx, x, groupY, groupCardWidth, GROUP_CARD_HEIGHT, 20);
    ctx.fillStyle = colors.surface;
    ctx.fill();
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = colors.brand;
    ctx.font = '800 25px "League Spartan Variable", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    drawText(ctx, group.name, x + 18, groupY + 40, groupCardWidth - 36);

    const order = data.groupOrder[group.id] ?? [];
    for (let index = 0; index < order.length; index += 1) {
      const participantId = order[index];
      const team = teamsById.get(participantId);
      const rowY = groupY + 66 + index * 52;

      if (!team) continue;

      const resolvedTeam: ResolvedTeam = {
        ...team,
        shortLabel: shortTeamLabel(team),
      };

      ctx.fillStyle = colors.brandSoft;
      roundedRect(ctx, x + 24, rowY + 2, 34, 34, 10);
      ctx.fill();
      ctx.fillStyle = colors.brand;
      ctx.font = '800 19px "League Spartan Variable", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(index + 1), x + 41, rowY + 19);

      await drawTeamBadge(ctx, resolvedTeam, x + 84, rowY - 4, 44, useBadges);
    }
  }

  y += groupRows * (GROUP_CARD_HEIGHT + GROUP_GAP);

  roundedRect(ctx, PADDING, y, CANVAS_WIDTH - PADDING * 2, AWARDS_HEIGHT, 28);
  ctx.fillStyle = colors.surface;
  ctx.fill();
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = colors.brand;
  ctx.font = '800 34px "League Spartan Variable", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Premios', PADDING + 30, y + 32);

  ctx.textBaseline = 'alphabetic';

  const awardsX = PADDING + 30;
  const labelWidth = 210;
  const valueX = awardsX + labelWidth;
  const valueMaxWidth = CANVAS_WIDTH - valueX - PADDING - 30;

  for (let index = 0; index < awards.length; index += 1) {
    const award = awards[index];
    const rowY = y + 112 + index * 60;

    ctx.fillStyle = colors.muted;
    ctx.font = '700 21px "League Spartan Variable", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    drawText(ctx, award.label, awardsX, rowY, labelWidth - 24);

    ctx.fillStyle = colors.text;
    ctx.font = '800 24px "League Spartan Variable", sans-serif';

    drawWrappedText(ctx, award.value, valueX, rowY, valueMaxWidth, 28, 2);
  }

  ctx.fillStyle = colors.muted;
  ctx.font = '600 22px "League Spartan Variable", sans-serif';
  ctx.fillText('Comparte tu prediccion en Quinisindic', PADDING, height - 58);

  return canvasToBlob(canvas);
}

export async function renderPickemShareImage(data: PickemShareData) {
  try {
    return await renderShareImage(data, true);
  } catch {
    return renderShareImage(data, false);
  }
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'quinisindic-pickem.png';
  anchor.click();
  URL.revokeObjectURL(url);
}

async function copyShareText(text: string) {
  if (!navigator.clipboard) return false;

  await navigator.clipboard.writeText(text);
  return true;
}

export async function sharePickemSummary(
  data: PickemShareData,
): Promise<ShareResult> {
  const blob = await renderPickemShareImage(data);
  const text = buildPickemShareText(data);
  const file = new File([blob], 'quinisindic-pickem.png', {
    type: 'image/png',
  });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: `Mi Pick'em - ${data.contest.name}`,
      text,
      url: data.url,
    });
    return 'shared';
  }

  downloadBlob(blob);

  if (navigator.share) {
    await navigator.share({
      title: `Mi Pick'em - ${data.contest.name}`,
      text,
      url: data.url,
    });
    return 'downloaded';
  }

  const copied = await copyShareText(text);
  return copied ? 'copied' : 'downloaded';
}
