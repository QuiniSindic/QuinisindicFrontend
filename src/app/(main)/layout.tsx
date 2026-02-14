import Header from '@/components/common/layout/Header';
import { MobileNavigation } from '@/components/common/layout/MobileNavigation';
import { MobileOverlays } from '@/components/home/overlays/MobileOverlays';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <Header />
      <main className="grow pb-16 md:pb-0">{children}</main>
      <MobileNavigation />
      <MobileOverlays />
    </div>
  );
}
