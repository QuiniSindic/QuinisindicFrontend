import Footer from '@/src/components/layout/footer';
import NewHeader from '@/src/components/layout/NewHeader';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header /> */}
      <NewHeader />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
