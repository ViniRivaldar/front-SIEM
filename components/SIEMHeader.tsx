// components/SIEMHeader.tsx
import { Shield } from "lucide-react"

export default function SIEMHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-balance">SIEM Dashboard</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Sistema de Monitoramento de Segurança e Análise de Logs
        </p>
      </div>
    </header>
  )
}