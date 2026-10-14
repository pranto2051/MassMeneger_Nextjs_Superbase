export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceGlass: string;
  surfaceGlassElevated: string;
  border: string;
  borderHighlight: string;
  
  text: string;
  textSecondary: string;
  textMuted: string;
  
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  success: string;
  successBg: string;
  successBorder: string;
  
  danger: string;
  dangerBg: string;
  dangerBorder: string;
  
  warning: string;
  warningBg: string;
  warningBorder: string;
  
  info: string;
  infoBg: string;
  infoBorder: string;
  
  tabBarBg: string;
  tabBarBorder: string;
  tabActive: string;
  tabInactive: string;
  
  cardShadow: string;
}

export const darkTheme: ThemeColors = {
  background: '#090D16',
  surface: '#111827',
  surfaceSecondary: '#1F2937',
  surfaceGlass: 'rgba(17, 24, 39, 0.75)',
  surfaceGlassElevated: 'rgba(31, 41, 55, 0.85)',
  border: 'rgba(255, 255, 255, 0.10)',
  borderHighlight: 'rgba(99, 102, 241, 0.40)',
  
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  
  primary: '#6366F1', // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  success: '#10B981', // Emerald
  successBg: 'rgba(16, 185, 129, 0.15)',
  successBorder: 'rgba(16, 185, 129, 0.35)',
  
  danger: '#F43F5E', // Rose
  dangerBg: 'rgba(244, 63, 94, 0.15)',
  dangerBorder: 'rgba(244, 63, 94, 0.35)',
  
  warning: '#F59E0B', // Amber
  warningBg: 'rgba(245, 158, 11, 0.15)',
  warningBorder: 'rgba(245, 158, 11, 0.35)',
  
  info: '#0EA5E9', // Sky blue
  infoBg: 'rgba(14, 165, 233, 0.15)',
  infoBorder: 'rgba(14, 165, 233, 0.35)',
  
  tabBarBg: 'rgba(15, 23, 42, 0.92)',
  tabBarBorder: 'rgba(255, 255, 255, 0.12)',
  tabActive: '#818CF8',
  tabInactive: '#64748B',
  
  cardShadow: 'rgba(0, 0, 0, 0.45)',
};

export const lightTheme: ThemeColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  surfaceGlass: 'rgba(255, 255, 255, 0.85)',
  surfaceGlassElevated: 'rgba(255, 255, 255, 0.95)',
  border: 'rgba(0, 0, 0, 0.08)',
  borderHighlight: 'rgba(79, 70, 229, 0.25)',
  
  text: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  
  primary: '#4F46E5', // Indigo
  primaryLight: '#6366F1',
  primaryDark: '#4338CA',
  
  success: '#059669', // Emerald
  successBg: 'rgba(16, 185, 129, 0.10)',
  successBorder: 'rgba(16, 185, 129, 0.30)',
  
  danger: '#E11D48', // Rose
  dangerBg: 'rgba(244, 63, 94, 0.10)',
  dangerBorder: 'rgba(244, 63, 94, 0.30)',
  
  warning: '#D97706', // Amber
  warningBg: 'rgba(245, 158, 11, 0.10)',
  warningBorder: 'rgba(245, 158, 11, 0.30)',
  
  info: '#0284C7', // Sky
  infoBg: 'rgba(14, 165, 233, 0.10)',
  infoBorder: 'rgba(14, 165, 233, 0.30)',
  
  tabBarBg: 'rgba(255, 255, 255, 0.94)',
  tabBarBorder: 'rgba(0, 0, 0, 0.08)',
  tabActive: '#4F46E5',
  tabInactive: '#94A3B8',
  
  cardShadow: 'rgba(0, 0, 0, 0.08)',
};
