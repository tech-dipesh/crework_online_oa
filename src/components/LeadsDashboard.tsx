"use client"

import { useState, useEffect } from "react"
import { CompanyCard } from "./CompanyCard"

interface Company {
  id: string
  name: string
  website?: string
  industry?: string
  stage?: string
  intentScore: number
  signals: string[]
  signalSource: string
  confidence?: number
}

export function LeadsDashboard() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [ingesting, setIngesting] = useState(false)
  const [sortBy, setSortBy] = useState("intentScore")
  const [minScore, setMinScore] = useState(0)
  const [filterIndustry, setFilterIndustry] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    highIntent: 0,
    mediumIntent: 0,
    lowIntent: 0
  })

  useEffect(() => {
    fetchCompanies()
  }, [sortBy, minScore, filterIndustry])

  async function fetchCompanies() {
    setLoading(true)
    const params = new URLSearchParams({
      sortBy,
      minScore: minScore.toString(),
      ...(filterIndustry && { industry: filterIndustry })
    })

    const res = await fetch(`/api/companies?${params}`)
    const data = await res.json()
    setCompanies(data)

    const total = data.length
    const highIntent = data.filter((c: Company) => c.intentScore >= 80).length
    const mediumIntent = data.filter(
      (c: Company) => c.intentScore >= 60 && c.intentScore < 80
    ).length
    const lowIntent = data.filter((c: Company) => c.intentScore < 60).length

    setStats({ total, highIntent, mediumIntent, lowIntent })
    setLoading(false)
  }

  async function handleIngest() {
    setIngesting(true)
    try {
      await fetch("/api/ingest", { method: "POST" })
      await fetchCompanies()
    } catch (error) {
      console.error("Ingestion error:", error)
    }
    setIngesting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                Lead Intelligence
              </h1>
              <p className="text-slate-400 text-lg">
                6200+ YCombinator companies, AI-powered intent scoring
              </p>
            </div>
            <button
              onClick={handleIngest}
              disabled={ingesting}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 disabled:cursor-not-allowed"
            >
              {ingesting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  Scoring...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🔄 Refresh Data
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-lg p-4 backdrop-blur-md">
              <div className="text-sm text-slate-400 mb-1">Total Companies</div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 border border-emerald-700/30 rounded-lg p-4 backdrop-blur-md">
              <div className="text-sm text-emerald-300 mb-1">High Intent</div>
              <div className="text-3xl font-bold text-emerald-400">
                {stats.highIntent}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-900/20 to-orange-950/20 border border-amber-700/30 rounded-lg p-4 backdrop-blur-md">
              <div className="text-sm text-amber-300 mb-1">Medium-High</div>
              <div className="text-3xl font-bold text-amber-400">
                {stats.mediumIntent}
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-lg p-4 backdrop-blur-md">
              <div className="text-sm text-slate-400 mb-1">Medium & Low</div>
              <div className="text-3xl font-bold text-slate-300">
                {stats.lowIntent}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-gradient-to-r from-slate-800/40 via-slate-900/40 to-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Minimum Intent Score
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-emerald-400 font-semibold min-w-fit">
                  {minScore}+
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Industry Filter
              </label>
              <input
                type="text"
                placeholder="e.g., SaaS, FinTech"
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              >
                <option value="intentScore">Intent Score (High → Low)</option>
                <option value="detectedAt">Recently Added</option>
                <option value="name">Company Name (A → Z)</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">⚙️</div>
              <p className="text-slate-400">Loading companies...</p>
            </div>
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-400 text-lg">
                No companies found. Click "Refresh Data" to start ingesting from YCombinator.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
