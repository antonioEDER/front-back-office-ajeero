// Validações de formulários

/**
 * Valida CPF
 */
export function validateCPF(cpf) {
  if (!cpf) return false
  
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleaned)) return false
  
  let sum = 0
  let remainder
  
  // Valida primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false
  
  // Valida segundo dígito verificador
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false
  
  return true
}

/**
 * Valida email
 */
export function validateEmail(email) {
  if (!email) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Valida URL do YouTube
 */
export function validateYouTubeURL(url) {
  if (!url) return false
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/
  ]
  return patterns.some(pattern => pattern.test(url))
}

/**
 * Extrai ID do vídeo do YouTube
 */
export function extractYouTubeID(url) {
  if (!url) return null
  
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /embed\/([^?]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

/**
 * Valida senha (mínimo 6 caracteres)
 */
export function validatePassword(password) {
  if (!password) return false
  return password.length >= 6
}

/**
 * Valida se senhas são iguais
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (!password || !confirmPassword) return false
  return password === confirmPassword
}

/**
 * Valida arquivo de imagem
 */
export function validateImageFile(file, maxSize = 10 * 1024 * 1024) {
  if (!file) return { valid: false, error: 'Arquivo não selecionado' }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não permitido. Use JPG, PNG ou GIF.' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB` }
  }
  
  return { valid: true }
}

/**
 * Valida CEP
 */
export function validateCEP(cep) {
  if (!cep) return false
  const cleaned = cep.replace(/\D/g, '')
  return cleaned.length === 8
}

