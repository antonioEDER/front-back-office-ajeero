// Helpers para normalizar respostas da API
// A API retorna no formato: { success, message, data: { ... } }

/**
 * Normaliza a resposta da API
 * Extrai os dados de response.data.data ou response.data conforme a estrutura
 */
export function normalizeApiResponse(response) {
  if (!response) {
    return null
  }

  // Se já é um objeto com success e data, retorna como está
  if (response.success !== undefined && response.data !== undefined) {
    return response
  }

  // Se é um objeto direto (sem wrapper), retorna envolvido
  return {
    success: true,
    message: 'Sucesso',
    data: response
  }
}

/**
 * Extrai os dados da resposta da API
 * Retorna data.data se existir, senão retorna data
 */
export function extractApiData(response) {
  if (!response) {
    return null
  }

  // Se tem a estrutura { success, message, data: { ... } }
  if (response.success !== undefined && response.data !== undefined) {
    return response.data
  }

  // Se já é os dados diretos
  return response
}

/**
 * Extrai a lista de dados de uma resposta paginada
 */
export function extractApiList(response) {
  const data = extractApiData(response)
  
  if (Array.isArray(data)) {
    return data
  }

  // Se tem paginação: { data: [...], pagination: {...} }
  if (data?.data && Array.isArray(data.data)) {
    return data.data
  }

  return []
}

/**
 * Extrai informações de paginação da resposta
 */
export function extractApiPagination(response) {
  const data = extractApiData(response)
  
  if (data?.pagination) {
    return data.pagination
  }

  return null
}

