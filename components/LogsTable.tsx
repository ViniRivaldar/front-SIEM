// components/LogsTable.tsx
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ExternalLink, AlertTriangle, Shield, Database } from "lucide-react"
import { getLogTypeColor, getStatusColor, formatLogType } from "@/utils/siem"
import type { Log } from "@/types/siem"

interface LogsTableProps {
  logs?: Log[]
  onLogClick: (logId: number) => void
}

export default function LogsTable({ logs, onLogClick }: LogsTableProps) {
  const getThreatIcon = (threatScore: number) => {
    if (threatScore >= 40) return <AlertTriangle className="h-4 w-4 text-red-500" />
    if (threatScore >= 15) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return <Shield className="h-4 w-4 text-blue-500" />
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Usuário / Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Tipo de Log
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Ameaça
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Data e Hora
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs?.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{log.email || "N/A"}</span>
                      <span className="text-xs text-muted-foreground font-mono">{log.ip}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getLogTypeColor(log.action, log.threat_score)}>
                      {formatLogType(log.action || "N/A")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(log.status)}>
                      {log.status || "N/A"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getThreatIcon(log.threat_score)}
                      <span className="text-sm font-mono">{log.threat_score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(log.timestamp).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" onClick={() => onLogClick(log.id)}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!logs || logs.length === 0) && (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Database className="h-12 w-12 opacity-50" />
              <p>Nenhum log encontrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}