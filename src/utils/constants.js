// Constantes da aplicação
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
}

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
}

export const ASSOCIADO_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}

export const BENEFICIO_TYPES = {
  CUPOM: 'Cupom',
  DESCONTO: 'Desconto',
  SAUDE: 'Saúde'
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMIT_OPTIONS: [10, 20, 50, 100]
}

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
}

export const DATE_FORMAT = 'DD/MM/YYYY'
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm'

