import Header from '@/src/components/layout/Header';
import { MobileNavigation } from '@/src/components/layout/MobileNavigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <main className="grow pb-16 md:pb-0">{children}</main>
      <MobileNavigation />
    </div>
  );
}
