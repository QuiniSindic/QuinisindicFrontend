import QuinisindicLogo from '@/components/ui/icons/QuinisindicLogo';
import { ThemeToggleButton } from '@/components/ui/theme/ThemeToggleButton';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="absolute right-4 top-4 z-50 sm:right-8 sm:top-8">
        <ThemeToggleButton />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <QuinisindicLogo className="mx-auto h-24 w-auto" />
          </Link>
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}
