import { PlayerScreen } from '@/components/player-screen';

export function generateStaticParams() {
  return [{ setId: 'demo-set-001' }];
}

export default function PlayerPage() {
  return <PlayerScreen />;
}
