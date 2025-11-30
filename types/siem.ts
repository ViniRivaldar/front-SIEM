// types/siem.ts
export type LogType = "collected" | "suspicious" | "malicious"

export interface DashboardStats {
  total_logs: number
  logs_suspeitos: number
  logs_maliciosos: number
}

export interface Log {
  id: number
  timestamp: string
  action: string
  status: string
  email: string
  ip: string
  user_agent: string
  threat_score: number
  method?: string
  protocol?: string
}

export interface LogAnalysis {
  id: number
  log_id: number
  threat_score: number
  confidence: string
  detection_rule: string
  priority: string
  mitre_matches: MitreMatch[]
  recommended_actions: string[]
  notes: string | null
  created_at: string
}

export interface MitreMatch {
  tactic: string
  technique_id: string
  technique_name: string
  rationale: string
}

export interface LogDetails extends Log {
  email_raw?: string
  headers?: Record<string, any>
  request_body?: string
  threats?: any
  reason?: string | null
  user_id?: number | null
  response_time?: number
  db_query_time?: number | null
  request_size?: number
  user_exists?: boolean | null
  error_message?: string | null
  error_stack?: string | null
  analysis?: LogAnalysis
}

export interface LogsResponse {
  logs: Log[]
  total: number
  page: number
  totalPages: number
}