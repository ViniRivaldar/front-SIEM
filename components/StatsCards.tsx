// components/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Database, AlertTriangle, AlertOctagon } from "lucide-react"
import type { DashboardStats, LogType } from "@/types/siem"

interface StatsCardsProps {
  stats?: DashboardStats
  selectedType: LogType | "all"
  onCardClick: (type: LogType) => void
}

export default function StatsCards({ stats, selectedType, onCardClick }: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card
        className={`cursor-pointer transition-all hover:shadow-lg ${
          selectedType === "collected" ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => onCardClick("collected")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Logs Coletados
          </CardTitle>
          <Database className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-500">
            {stats?.total_logs?.toLocaleString() || "0"}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Total de logs processados</p>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer transition-all hover:shadow-lg ${
          selectedType === "suspicious" ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => onCardClick("suspicious")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Logs Suspeitos
          </CardTitle>
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-500">
            {stats?.logs_suspeitos?.toLocaleString() || "0"}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Requer atenção</p>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer transition-all hover:shadow-lg ${
          selectedType === "malicious" ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => onCardClick("malicious")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Logs Maliciosos
          </CardTitle>
          <AlertOctagon className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">
            {stats?.logs_maliciosos?.toLocaleString() || "0"}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Ameaças detectadas</p>
        </CardContent>
      </Card>
    </div>
  )
}