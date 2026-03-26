export const COLORS = {
  primary: '#6366F1', // Indigo
  secondary: '#1E3A8A', // Deep Blue
  accent: '#F59E0B', // Amber for alerts
  danger: '#EF4444', // Red for SOS
  success: '#10B981', // Emerald for safe status
  
  // Light Mode
  light: {
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    glass: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Dark Mode
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    glass: 'rgba(15, 23, 42, 0.7)',
  },
};

export const GRADIENTS = {
  primary: ['#6366F1', '#4F46E5'],
  danger: ['#EF4444', '#DC2626'],
  surface: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.7,
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
};
