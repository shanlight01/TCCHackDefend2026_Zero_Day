// Application-wide constants

export const APP_NAME = 'Career Guidance'

export const ACADEMIC_LEVELS = [
  'Classe de 3ème',
  'Seconde',
  'Première',
  'Terminale',
  'Nouveau Bachelier',
] as const

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  RECOMMENDATIONS: '/recommendations',
  ROADMAP: '/roadmap',
  UNIVERSITIES: '/universities',
  CHATBOT: '/chatbot',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const
