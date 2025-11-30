"use client"

import { useState } from "react"
import useSWR from "swr"
import SIEMHeader from "@/components/SIEMHeader"
import StatsCards from "@/components/StatsCards"
import FilterHeader from "@/components/FilterHeader"
import LogsTable from "@/components/LogsTable"
import Pagination from "@/components/Pagination"
import LogDetailsModal from "@/components/LogDetailsModal"
import { API_BASE, fetcher } from "@/utils/siem"
import type { DashboardStats, LogsResponse, LogDetails, LogType } from "@/types/siem"

export default function SIEMDashboard() {
  const [selectedType, setSelectedType] = useState<LogType | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null)
  const limit = 20

  // Fetch dashboard stats
  const { data: stats } = useSWR<DashboardStats>(
    `${API_BASE}/dashboard/stats`,
    fetcher,
    { refreshInterval: 30000 }
  )

  // Build logs URL based on selected type
  const logsUrl =
    selectedType === "all"
      ? `${API_BASE}/logs?page=${currentPage}&limit=${limit}`
      : `${API_BASE}/logs?tipo=${
          selectedType === "collected"
            ? "coletados"
            : selectedType === "suspicious"
              ? "suspeitos"
              : "maliciosos"
        }&page=${currentPage}&limit=${limit}`

  // Fetch logs list
  const { data: logsResponse } = useSWR<LogsResponse>(logsUrl, fetcher, {
    refreshInterval: 30000,
  })

  // Fetch selected log details
  const { data: logDetails } = useSWR<LogDetails>(
    selectedLogId ? `${API_BASE}/logs/${selectedLogId}` : null,
    fetcher
  )

  const handleCardClick = (type: LogType) => {
    setSelectedType(type)
    setCurrentPage(1)
  }

  const handleClearFilter = () => {
    setSelectedType("all")
    setCurrentPage(1)
  }

  const handleLogClick = (logId: number) => {
    setSelectedLogId(logId)
  }

  const handleCloseModal = () => {
    setSelectedLogId(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SIEMHeader />

      <main className="container mx-auto px-4 py-8">
        <StatsCards
          stats={stats}
          selectedType={selectedType}
          onCardClick={handleCardClick}
        />

        <FilterHeader
          selectedType={selectedType}
          totalRecords={logsResponse?.total || 0}
          onClearFilter={handleClearFilter}
        />

        <LogsTable logs={logsResponse?.logs} onLogClick={handleLogClick} />

        <Pagination
          currentPage={currentPage}
          totalPages={logsResponse?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </main>

      <LogDetailsModal
        logDetails={logDetails}
        isOpen={!!selectedLogId}
        onClose={handleCloseModal}
      />
    </div>
  )
}