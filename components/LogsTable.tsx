// components/LogsTable.tsx
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ExternalLink } from "lucide-react"
import { getLogTypeColor } from "@/utils/siem"
import type { Log } from "@/types/siem"

interface LogsTableProps {
  logs?: Log[]
  onLogClick: (logId: string) => void
}

export default function LogsTable({ logs, onLogClick }: LogsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  IP de Origem
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs?.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm">
                    {new Date(log.timestamp).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">{log.source_ip}</td>
                  <td className="px-6 py-4">
                    <Badge className={getLogTypeColor(log.log_type)}>
                      {log.log_type || "N/A"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm max-w-md truncate">
                    {log.short_description}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" onClick={() => onLogClick(log.id)}>
                      <ExternalLink className="h-4 w-4" />
                      Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!logs || logs.length === 0) && (
            <div className="py-12 text-center text-muted-foreground">
              Nenhum log encontrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}