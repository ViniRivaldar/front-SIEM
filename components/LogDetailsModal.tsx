// components/LogDetailsModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Shield, AlertTriangle } from "lucide-react"
import { getSeverityColor, getLogTypeColor } from "@/utils/siem"
import type { LogDetails } from "@/types/siem"

interface LogDetailsModalProps {
  logDetails?: LogDetails
  isOpen: boolean
  onClose: () => void
}

export default function LogDetailsModal({ logDetails, isOpen, onClose }: LogDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                <p className="mt-1 text-sm">
                  {new Date(logDetails.timestamp).toLocaleString("pt-BR")}
                </p>
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
                  <Badge className={getLogTypeColor(logDetails.log_type)}>
                    {logDetails.log_type || "N/A"}
                  </Badge>
                </div>
              </div>
              {logDetails.severity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Severidade</label>
                  <div className="mt-1">
                    <Badge className={getSeverityColor(logDetails.severity)}>
                      {logDetails.severity}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* User Agent */}
            {logDetails.user_agent && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                <p className="mt-1 text-sm font-mono break-all bg-muted/50 p-3 rounded-md">
                  {logDetails.user_agent}
                </p>
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
  )
}