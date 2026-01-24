import QuinisindicLogo from '@/src/components/ui/icons/QuinisindicLogo';
import { NavbarBrand } from '@heroui/react';
import Link from 'next/link';

interface BrandProps {
  showText?: boolean;
}

export const Brand = ({ showText = true }: BrandProps) => {
  return (
    <NavbarBrand className="flex items-center justify-start w-auto gap-2">
      <Link href="/">
        <QuinisindicLogo />
      </Link>
      {showText && (
        <Link href="/">
          <span className="text-lg font-bold text-text">QuiniSindic</span>
        </Link>
      )}
    </NavbarBrand>
  );
};
