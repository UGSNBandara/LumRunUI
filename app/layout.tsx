import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'LumRun Scoreboard',
  description: 'Leaderboard for LumRun game',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
