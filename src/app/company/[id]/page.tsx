import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ScoreBadge } from "@/components/ScoreBadge"

interface PageParams {
  params: {
    id: string
  }
}

export default async function CompanyDetailPage({ params }: PageParams) {
  const company = await prisma.company.findUnique({
    where: { id: params.id }
  })

  if (!company) {
    notFound()
  }

  const getSignalIcon = (signal: string) => {
    if (signal.includes("funding") || signal.includes("funded")) return "💰"
    if (signal.includes("hiring") || signal.includes("sales")) return "👥"
    if (signal.includes("growth")) return "📈"
    return "✨"
  }

  const getStageColor = (stage?: string) => {
    if (!stage) return "text-slate-400"
    if (stage.includes("Seed")) return "text-purple-400"
    if (stage.includes("Series A")) return "text-emerald-400"
    if (stage.includes("Series B")) return "text-cyan-400"
    return "text-orange-400"
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-linear-to-br from-slate-800/60 via-slate-900/60 to-slate-950/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-slate-700/50">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-3">{company.name}</h1>

              <div className="flex flex-wrap gap-3 mb-4">
                {company.industry && (
                  <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-sm border border-slate-600/50">
                    {company.industry}
                  </span>
                )}
                {company.stage && (
                  <span
                    className={`px-3 py-1 rounded-full bg-slate-700/50 text-sm border border-slate-600/50 ${getStageColor(company.stage)}`}
                  >
                    {company.stage}
                  </span>
                )}
                {company.headcount && (
                  <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-sm border border-slate-600/50">
                    ~{company.headcount} people
                  </span>
                )}
              </div>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                >
                  Visit Website →
                </a>
              )}
            </div>

            <div className="sm:w-32">
              <ScoreBadge score={company.intentScore} confidence={company.confidence || 0.8} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-200 mb-3">Overview</h2>
              <p className="text-slate-400 leading-relaxed">
                {company.description || "No description available."}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-200 mb-3">Detected Signals</h2>
              <div className="space-y-2">
                {company.signals.map((signal, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                  >
                    <span className="text-xl">{getSignalIcon(signal)}</span>
                    <span className="text-slate-300 capitalize">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 rounded-xl bg-linear-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-700/30">
            <h2 className="text-lg font-semibold text-emerald-300 mb-3">Why This Score?</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              {company.scoringReasoning || "No reasoning available."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Confidence</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {Math.round((company.confidence || 0.8) * 100)}%
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Key Insight</div>
                <div className="text-sm text-slate-300">
                  {company.keyInsights || "No additional insights."}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-700/50">
            <div>
              <div className="text-xs text-slate-500 mb-1">Source</div>
              <div className="text-sm text-slate-300 capitalize font-medium">
                {company.signalSource}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Detected</div>
              <div className="text-sm text-slate-300 font-medium">
                {new Date(company.detectedAt).toLocaleDateString()}
              </div>
            </div>
            {company.lastEnrichedAt && (
              <div>
                <div className="text-xs text-slate-500 mb-1">Last Updated</div>
                <div className="text-sm text-slate-300 font-medium">
                  {new Date(company.lastEnrichedAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
