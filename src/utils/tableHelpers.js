// Helpers para tabelas

/**
 * Exporta dados para CSV
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        if (value === null || value === undefined) return ''
        // Escapa vírgulas e aspas
        const stringValue = String(value).replace(/"/g, '""')
        return `"${stringValue}"`
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Gera parâmetros de query para paginação
 */
export function buildPaginationParams(pagination, filters = {}) {
  const params = {
    page: pagination.page || 1,
    limit: pagination.rowsPerPage || 20
  }
  
  if (pagination.sortBy) {
    const direction = pagination.descending ? '-' : ''
    params.sort = `${direction}${pagination.sortBy}`
  }
  
  // Adiciona filtros
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      params[key] = filters[key]
    }
  })
  
  return params
}

