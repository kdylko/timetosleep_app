import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { UI_CONFIG } from './constants';

// Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: UI_CONFIG.colors.primary,
    secondary: UI_CONFIG.colors.secondary,
    surface: UI_CONFIG.colors.surface,
    background: UI_CONFIG.colors.background,
    error: UI_CONFIG.colors.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: UI_CONFIG.colors.text,
    onBackground: UI_CONFIG.colors.text,
    onError: '#FFFFFF',
  },
  roundness: UI_CONFIG.borderRadius,
  spacing: UI_CONFIG.spacing,
  fonts: {
    ...MD3LightTheme.fonts,
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontSize: UI_CONFIG.fontSize.lg,
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontSize: UI_CONFIG.fontSize.md,
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontSize: UI_CONFIG.fontSize.sm,
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontSize: UI_CONFIG.fontSize.xxl,
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontSize: UI_CONFIG.fontSize.xl,
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontSize: UI_CONFIG.fontSize.lg,
    },
  },
};

// Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: UI_CONFIG.colors.primary,
    secondary: UI_CONFIG.colors.secondary,
    surface: '#1F2937',
    background: '#111827',
    error: UI_CONFIG.colors.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#F9FAFB',
    onBackground: '#F9FAFB',
    onError: '#FFFFFF',
  },
  roundness: UI_CONFIG.borderRadius,
  spacing: UI_CONFIG.spacing,
  fonts: {
    ...MD3DarkTheme.fonts,
    bodyLarge: {
      ...MD3DarkTheme.fonts.bodyLarge,
      fontSize: UI_CONFIG.fontSize.lg,
    },
    bodyMedium: {
      ...MD3DarkTheme.fonts.bodyMedium,
      fontSize: UI_CONFIG.fontSize.md,
    },
    bodySmall: {
      ...MD3DarkTheme.fonts.bodySmall,
      fontSize: UI_CONFIG.fontSize.sm,
    },
    headlineLarge: {
      ...MD3DarkTheme.fonts.headlineLarge,
      fontSize: UI_CONFIG.fontSize.xxl,
    },
    headlineMedium: {
      ...MD3DarkTheme.fonts.headlineMedium,
      fontSize: UI_CONFIG.fontSize.xl,
    },
    headlineSmall: {
      ...MD3DarkTheme.fonts.headlineSmall,
      fontSize: UI_CONFIG.fontSize.lg,
    },
  },
};

// Default theme (light)
export const theme = lightTheme;

// Theme context type
export type Theme = typeof lightTheme;
