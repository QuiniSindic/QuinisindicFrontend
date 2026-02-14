import '@/styles/globals.css';
import type { Metadata } from 'next';
import { League_Spartan } from 'next/font/google';
import { Providers } from './providers';

const leagueSpartan = League_Spartan({
  variable: '--font-league-spartan',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quinisindic',
  description:
    'Pronostica con tus amigos los resultados de los eventos deportivos más relevantes',
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${leagueSpartan.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
