// components/FilterHeader.tsx
import { Button } from "./ui/button"
import type { LogType } from "@/types/siem"

interface FilterHeaderProps {
  selectedType: LogType | "all"
  totalRecords: number
  onClearFilter: () => void
}

export default function FilterHeader({ selectedType, totalRecords, onClearFilter }: FilterHeaderProps) {
  const getTitle = () => {
    switch (selectedType) {
      case "collected":
        return "Logs Coletados"
      case "suspicious":
        return "Logs Suspeitos"
      case "malicious":
        return "Logs Maliciosos"
      default:
        return "Todos os Logs"
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
        {selectedType !== "all" && (
          <Button variant="ghost" size="sm" onClick={onClearFilter}>
            Limpar filtro
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{totalRecords} registros encontrados</p>
    </div>
  )
}