"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Shield, AlertTriangle, AlertOctagon, Database, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

const API_BASE = "https://api-siem.onrender.com/api"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type LogType = "collected" | "suspicious" | "malicious"

interface DashboardStats {
  total_collected_logs: number
  total_suspicious_logs: number
  total_malicious_logs: number
}

interface Log {
  id: string
  timestamp: string
  source_ip: string
  log_type: string
  short_description: string
}

interface LogDetails extends Log {
  destination_ip?: string
  user_agent?: string
  severity?: string
  raw_log?: string
  ai_processed_info?: string
  recommendations?: string
}

export default function SIEMDashboard() {
  const [selectedType, setSelectedType] = useState<LogType | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
  const limit = 20

  // Fetch dashboard stats
  const { data: stats } = useSWR<DashboardStats>(`${API_BASE}/dashboard/stats`, fetcher, { refreshInterval: 30000 })

  // Fetch logs list
  const logsUrl =
    selectedType === "all"
      ? `${API_BASE}/logs?page=${currentPage}&limit=${limit}`
      : `${API_BASE}/logs?tipo=${selectedType === "collected" ? "coletados" : selectedType === "suspicious" ? "suspeitos" : "maliciosos"}&page=${currentPage}&limit=${limit}`

  const { data: logsResponse } = useSWR<{ logs: Log[]; total: number; page: number; totalPages: number }>(
    logsUrl,
    fetcher,
    { refreshInterval: 30000 },
  )

  // Fetch selected log details
  const { data: logDetails } = useSWR<LogDetails>(selectedLogId ? `${API_BASE}/logs/${selectedLogId}` : null, fetcher)

  const handleCardClick = (type: LogType) => {
    setSelectedType(type)
    setCurrentPage(1)
  }

  const handleLogClick = (logId: string) => {
    setSelectedLogId(logId)
  }

  const getSeverityColor = (severity?: string) => {
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

  const getLogTypeColor = (type?: string) => {
    if (!type) return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    
    if (type.includes("malicious") || type.includes("malicioso")) {
      return "bg-red-500/10 text-red-500 border-red-500/20"
    }
    if (type.includes("suspicious") || type.includes("suspeito")) {
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
    return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-balance">SIEM Dashboard</h1>
          </div>
          <p className="mt-2 text-muted-foreground">Sistema de Monitoramento de Segurança e Análise de Logs</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedType === "collected" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleCardClick("collected")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Logs Coletados</CardTitle>
              <Database className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                {stats?.total_collected_logs?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Total de logs processados</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedType === "suspicious" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleCardClick("suspicious")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Logs Suspeitos</CardTitle>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">
                {stats?.total_suspicious_logs?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Requer atenção</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedType === "malicious" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleCardClick("malicious")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Logs Maliciosos</CardTitle>
              <AlertOctagon className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {stats?.total_malicious_logs?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Ameaças detectadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {selectedType === "all"
                ? "Todos os Logs"
                : selectedType === "collected"
                  ? "Logs Coletados"
                  : selectedType === "suspicious"
                    ? "Logs Suspeitos"
                    : "Logs Maliciosos"}
            </h2>
            {selectedType !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedType("all")
                  setCurrentPage(1)
                }}
              >
                Limpar filtro
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{logsResponse?.total || 0} registros encontrados</p>
        </div>

        {/* Logs Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Timestamp</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">IP de Origem</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Descrição</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logsResponse?.logs?.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm">{new Date(log.timestamp).toLocaleString("pt-BR")}</td>
                      <td className="px-6 py-4 text-sm font-mono">{log.source_ip}</td>
                      <td className="px-6 py-4">
                        <Badge className={getLogTypeColor(log.log_type)}>{log.log_type || "N/A"}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm max-w-md truncate">{log.short_description}</td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" onClick={() => handleLogClick(log.id)}>
                          <ExternalLink className="h-4 w-4" />
                          Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(!logsResponse?.logs || logsResponse.logs.length === 0) && (
                <div className="py-12 text-center text-muted-foreground">Nenhum log encontrado</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {logsResponse && logsResponse.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Página {currentPage} de {logsResponse.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(logsResponse.totalPages, p + 1))}
              disabled={currentPage === logsResponse.totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>

      {/* Log Details Modal */}
      <Dialog open={!!selectedLogId} onOpenChange={() => setSelectedLogId(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Detalhes do Log
            </DialogTitle>
          </DialogHeader>

          {logDetails && (
            <div className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p className="mt-1 text-sm">{new Date(logDetails.timestamp).toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP de Origem</label>
                  <p className="mt-1 text-sm font-mono">{logDetails.source_ip}</p>
                </div>
                {logDetails.destination_ip && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IP de Destino</label>
                    <p className="mt-1 text-sm font-mono">{logDetails.destination_ip}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Log</label>
                  <div className="mt-1">
                    <Badge className={getLogTypeColor(logDetails.log_type)}>{logDetails.log_type || "N/A"}</Badge>
                  </div>
                </div>
                {logDetails.severity && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Severidade</label>
                    <div className="mt-1">
                      <Badge className={getSeverityColor(logDetails.severity)}>{logDetails.severity}</Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* User Agent */}
              {logDetails.user_agent && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                  <p className="mt-1 text-sm font-mono break-all bg-muted/50 p-3 rounded-md">{logDetails.user_agent}</p>
                </div>
              )}

              {/* Description */}
              {logDetails.short_description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p className="mt-1 text-sm">{logDetails.short_description}</p>
                </div>
              )}

              {/* AI Processed Info */}
              {logDetails.ai_processed_info && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Análise de IA
                  </label>
                  <div className="mt-1 text-sm bg-blue-500/10 border border-blue-500/20 p-4 rounded-md">
                    {logDetails.ai_processed_info}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {logDetails.recommendations && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Recomendações
                  </label>
                  <div className="mt-1 text-sm bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-md">
                    {logDetails.recommendations}
                  </div>
                </div>
              )}

              {/* Raw Log */}
              {logDetails.raw_log && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Log Bruto</label>
                  <pre className="mt-1 text-xs font-mono bg-muted/50 p-4 rounded-md overflow-x-auto border border-border">
                    {logDetails.raw_log}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}