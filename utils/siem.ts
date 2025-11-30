// utils/siem.ts
export const API_BASE = "https://api-siem.onrender.com/api"

export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const getSeverityColor = (severity?: string) => {
  if (!severity) return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  
  switch (severity.toLowerCase()) {
    case "critical":
    case "high":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "low":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

export const getLogTypeColor = (action?: string, threatScore?: number) => {
  if (!action) return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  
  // Baseado no threat_score
  if (threatScore !== undefined) {
    if (threatScore >= 40) {
      return "bg-red-500/10 text-red-500 border-red-500/20"
    }
    if (threatScore >= 15) {
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
  }
  
  // Baseado no tipo de ação
  const actionLower = action.toLowerCase()
  if (actionLower.includes("injection") || actionLower.includes("attack")) {
    return "bg-red-500/10 text-red-500 border-red-500/20"
  }
  if (actionLower.includes("suspicious") || actionLower.includes("failed")) {
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
  }
  
  return "bg-blue-500/10 text-blue-500 border-blue-500/20"
}

export const getPriorityColor = (priority?: string) => {
  if (!priority) return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  
  switch (priority.toLowerCase()) {
    case "critical":
    case "high":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "low":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

export const getStatusColor = (status?: string) => {
  if (!status) return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  
  const statusNum = parseInt(status)
  if (statusNum >= 200 && statusNum < 300) {
    return "bg-green-500/10 text-green-500 border-green-500/20"
  }
  if (statusNum >= 400 && statusNum < 500) {
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
  }
  if (statusNum >= 500) {
    return "bg-red-500/10 text-red-500 border-red-500/20"
  }
  
  if (status.toLowerCase() === "success") {
    return "bg-green-500/10 text-green-500 border-green-500/20"
  }
  if (status.toLowerCase() === "failed") {
    return "bg-red-500/10 text-red-500 border-red-500/20"
  }
  
  return "bg-gray-500/10 text-gray-500 border-gray-500/20"
}

export const formatLogType = (action: string) => {
  // Remove barras e formata
  const formatted = action.replace(/^\//, '').replace(/_/g, ' ')
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}