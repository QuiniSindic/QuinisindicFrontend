'use client';

import { Button } from '@heroui/react';

interface SubmitButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function SubmitButton({
  isLoading,
  disabled,
  children,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      isLoading={isLoading}
      isDisabled={disabled}
      className={`
        group w-full justify-center py-2 px-4
        text-sm font-medium rounded-md
        bg-brand text-white transition-colors 
        hover:opacity-90 outline-none
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-ring focus-visible:ring-offset-2
        focus-visible:ring-offset-background
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </Button>
  );
}
