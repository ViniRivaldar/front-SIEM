// types/siem.ts
export type LogType = "collected" | "suspicious" | "malicious"

export interface DashboardStats {
  total_logs: number
  logs_suspeitos: number
  logs_maliciosos: number
}

export interface Log {
  id: string
  timestamp: string
  source_ip: string
  log_type: string
  short_description: string
}

export interface LogDetails extends Log {
  destination_ip?: string
  user_agent?: string
  severity?: string
  raw_log?: string
  ai_processed_info?: string
  recommendations?: string
}

export interface LogsResponse {
  logs: Log[]
  total: number
  page: number
  totalPages: number
}