'use client';

import {games, type GameId} from '@/lib/games';
import {MotionButton} from './motion-button';

export function GameTabs({value, onChange, label}: {
  value: GameId;
  onChange: (game: GameId) => void;
  label: string;
}) {
  return <div className="section-games" role="group" aria-label={label}>
    {games.map(game => <MotionButton key={game.id} type="button"
      aria-pressed={value === game.id} onClick={() => onChange(game.id)}>
      {game.id === 'tf2' ? 'TF2' : game.name}
    </MotionButton>)}
  </div>;
}
