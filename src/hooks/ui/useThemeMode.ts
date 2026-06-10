import { useTheme } from 'next-themes';

export function useThemeMode() {
  const { theme, setTheme, systemTheme } = useTheme();

  const mounted =
    theme !== undefined && (theme !== 'system' || systemTheme !== undefined);
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
