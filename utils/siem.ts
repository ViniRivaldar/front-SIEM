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

export const getLogTypeColor = (type?: string) => {
  if (!type) return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  
  if (type.includes("malicious") || type.includes("malicioso")) {
    return "bg-red-500/10 text-red-500 border-red-500/20"
  }
  if (type.includes("suspicious") || type.includes("suspeito")) {
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
  }
  return "bg-blue-500/10 text-blue-500 border-blue-500/20"
}