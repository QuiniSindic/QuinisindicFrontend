'use client';

import { useThemeMode } from '@/hooks/ui/useThemeMode';
import { Button } from '@heroui/react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggleButton() {
  const { mounted, isDark, toggleTheme } = useThemeMode();

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        radius="full"
        className="opacity-0 pointer-events-none"
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      isIconOnly
      variant="light"
      radius="full"
      aria-label="Toggle theme"
      onPress={toggleTheme}
      className="outline-none bg-surface text-muted"
    >
      {isDark ? (
        <Sun size={20} className="transition-transform" />
      ) : (
        <Moon size={20} className="transition-transform" />
      )}
    </Button>
  );
}
