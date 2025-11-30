// components/LogDetailsModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Shield, AlertTriangle, Clock, User, Globe, Code, Activity, Target } from "lucide-react"
import { getStatusColor, getPriorityColor, formatLogType } from "@/utils/siem"
import type { LogDetails } from "@/types/siem"

interface LogDetailsModalProps {
  logDetails?: LogDetails
  isOpen: boolean
  onClose: () => void
}

export default function LogDetailsModal({ logDetails, isOpen, onClose }: LogDetailsModalProps) {
  if (!logDetails) return null

  const analysis = logDetails.analysis

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Detalhes do Log #{logDetails.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Informações Básicas */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Email/Usuário
              </label>
              <p className="mt-1 text-sm font-mono">{logDetails.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                IP de Origem
              </label>
              <p className="mt-1 text-sm font-mono">{logDetails.ip}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data e Hora
              </label>
              <p className="mt-1 text-sm">{new Date(logDetails.timestamp).toLocaleString("pt-BR")}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Ação</label>
              <p className="mt-1 text-sm">{formatLogType(logDetails.action)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className={getStatusColor(logDetails.status)}>
                  {logDetails.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Método / Protocolo</label>
              <p className="mt-1 text-sm">
                {logDetails.method?.toUpperCase()} / {logDetails.protocol?.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Métricas de Performance */}
          {(logDetails.response_time || logDetails.request_size) && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Métricas de Performance
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {logDetails.response_time && (
                  <div>
                    <label className="text-sm text-muted-foreground">Tempo de Resposta</label>
                    <p className="text-sm font-mono">{logDetails.response_time}ms</p>
                  </div>
                )}
                {logDetails.db_query_time && (
                  <div>
                    <label className="text-sm text-muted-foreground">Tempo de Query DB</label>
                    <p className="text-sm font-mono">{logDetails.db_query_time}ms</p>
                  </div>
                )}
                {logDetails.request_size && (
                  <div>
                    <label className="text-sm text-muted-foreground">Tamanho da Requisição</label>
                    <p className="text-sm font-mono">{logDetails.request_size} bytes</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Análise de Ameaça */}
          {analysis && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Análise de Segurança
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-muted-foreground">Score de Ameaça</label>
                  <p className="text-2xl font-bold text-red-500">{analysis.threat_score}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Confiança</label>
                  <p className="text-lg font-semibold">{(parseFloat(analysis.confidence) * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Regra de Detecção</label>
                  <p className="text-sm">{analysis.detection_rule}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Prioridade</label>
                  <div className="mt-1">
                    <Badge className={getPriorityColor(analysis.priority)}>
                      {analysis.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Notas da Análise */}
              {analysis.notes && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">Notas da Análise</label>
                  <div className="mt-1 text-sm bg-blue-500/10 border border-blue-500/20 p-3 rounded-md">
                    {analysis.notes}
                  </div>
                </div>
              )}

              {/* MITRE ATT&CK */}
              {analysis.mitre_matches && analysis.mitre_matches.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    MITRE ATT&CK Framework
                  </label>
                  <div className="mt-2 space-y-2">
                    {analysis.mitre_matches.map((match, idx) => (
                      <div key={idx} className="bg-red-500/10 border border-red-500/20 p-3 rounded-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold">{match.technique_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {match.technique_id} - {match.tactic}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm mt-2">{match.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações Recomendadas */}
              {analysis.recommended_actions && analysis.recommended_actions.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Ações Recomendadas
                  </label>
                  <ul className="mt-2 space-y-1">
                    {analysis.recommended_actions.map((action, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* User Agent */}
          {logDetails.user_agent && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-muted-foreground">User Agent</label>
              <p className="mt-1 text-xs font-mono break-all bg-muted/50 p-3 rounded-md">
                {logDetails.user_agent}
              </p>
            </div>
          )}

          {/* Request Body */}
          {logDetails.request_body && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Code className="h-4 w-4" />
                Corpo da Requisição
              </label>
              <pre className="mt-2 text-xs font-mono bg-muted/50 p-4 rounded-md overflow-x-auto border border-border">
                {JSON.stringify(JSON.parse(logDetails.request_body), null, 2)}
              </pre>
            </div>
          )}

          {/* Reason (se houver erro) */}
          {logDetails.reason && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-muted-foreground">Motivo</label>
              <p className="mt-1 text-sm text-red-500">{logDetails.reason}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}