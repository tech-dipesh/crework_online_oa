"use client"

import { useEffect, useState } from "react"
import { CompanyCard } from "./CompanyCard"

interface Company {
  id: string
  name: string
  website?: string
  industry?: string
  stage?: string
  headcount?: number
  signals: string[]
  intentScore: number
  confidence: number
  keyInsights?: string
  scoringReasoning?: string
  detectedAt: string
}

export function LeadsDashboard() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("intentScore")
  const [minScore, setMinScore] = useState(0)
  const [industry, setIndustry] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchCompanies = async () => {
    try {
      setError(null)
      setLoading(true)

      const params = new URLSearchParams({
        sortBy,
        minScore: minScore.toString(),
        ...(industry && { industry })
      })

      const response = await fetch(`/api/companies?${params.toString()}`)
      console.log("response", response);
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch companies")
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format")
      }

      setCompanies(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      setCompanies([])
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [sortBy, minScore, industry])

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true)
      setError(null)

      const response = await fetch("/api/ingest", { method: "POST" })

      if (!response.ok) {
        throw new Error("Failed to refresh data")
      }

      const result = await response.json()
      console.log("Data refreshed:", result)

      await fetchCompanies()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
    } finally {
      setIsRefreshing(false)
    }
  }

  const stats = {
    total: companies.length,
    high: companies.filter((c) => c.intentScore >= 80).length,
    medium: companies.filter((c) => c.intentScore >= 60 && c.intentScore < 80).length,
    low: companies.filter((c) => c.intentScore < 60).length
  }

  const industries = Array.from(new Set(companies.map((c) => c.industry).filter(Boolean)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Lead Intelligence</h1>
            <p className="text-slate-400">YCombinator companies, scored automatically by intent to buy.</p>
          </div>
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-semibold rounded-lg transition-colors"
          >
            {isRefreshing ? "Refreshing..." : "Refresh data"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-sm text-slate-400 mb-2">Total companies</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-sm text-orange-400 mb-2">High intent</div>
            <div className="text-3xl font-bold text-orange-400">{stats.high}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-sm text-emerald-400 mb-2">Medium-high</div>
            <div className="text-3xl font-bold text-emerald-400">{stats.medium}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-sm text-slate-400 mb-2">Medium & low</div>
            <div className="text-3xl font-bold text-slate-400">{stats.low}</div>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-slate-400 block mb-2">Minimum intent score</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white font-semibold w-12 text-right">{minScore}+</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-2">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
              >
                <option value="">e.g. SaaS, fintech</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
              >
                <option value="intentScore">Intent score (high)</option>
                <option value="detectedAt">Recently detected</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading companies...</p>
          </div>
        )}

        {!loading && companies.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No companies found with current filters.</p>
            <p className="text-slate-500 text-sm">Click "Refresh data" to load YCombinator companies.</p>
          </div>
        )}

        {!loading && companies.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            <div className="hidden lg:grid grid-cols-6 gap-4 px-4 py-3 bg-slate-800/30 border border-slate-700 rounded-lg text-sm font-semibold text-slate-400">
              <div>Name</div>
              <div>Industry</div>
              <div>Stage</div>
              <div>Score</div>
              <div>Signals</div>
              <div></div>
            </div>

            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}