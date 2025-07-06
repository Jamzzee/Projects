import { ReactNode } from 'react';

export type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export type DarkModeProviderProps = {
  children: ReactNode;
};
