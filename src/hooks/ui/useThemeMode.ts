import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useThemeMode() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return {
    mounted,
    isDark,
    toggleTheme,
    setTheme,
    currentTheme,
  };
}
