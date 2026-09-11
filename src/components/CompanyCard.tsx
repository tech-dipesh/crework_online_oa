import Link from "next/link"
import { ScoreBadge } from "./ScoreBadge"

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

export function CompanyCard({ company }: { company: Company }) {
  const getStageColor = (stage?: string) => {
    if (!stage) return "text-slate-400"
    if (stage.includes("Seed")) return "text-purple-400"
    if (stage.includes("Series A")) return "text-emerald-400"
    if (stage.includes("Series B")) return "text-cyan-400"
    return "text-orange-400"
  }

  const getSignalIcon = (signal: string) => {
    if (signal.includes("funding") || signal.includes("funded"))
      return "💰"
    if (signal.includes("hiring") || signal.includes("sales"))
      return "👥"
    if (signal.includes("growth")) return "📈"
    return "✨"
  }

  return (
    <Link href={`/company/${company.id}`}>
      <div className="group relative bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-950/80 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 rounded-xl transition-all duration-300" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    onClick={(e) => e.preventDefault()}
                    className="hover:underline"
                  >
                    {company.name}
                  </a>
                ) : (
                  company.name
                )}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                {company.industry && (
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
                    {company.industry}
                  </span>
                )}
                {company.stage && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full bg-slate-700/50 ${getStageColor(company.stage)}`}
                  >
                    {company.stage}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <ScoreBadge score={company.intentScore} confidence={company.confidence || 0.8} />
          </div>

          <div className="mb-4">
            <div className="text-xs text-slate-400 mb-2">Detected Signals</div>
            <div className="flex flex-wrap gap-2">
              {company.signals.slice(0, 3).map((signal, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-slate-700/30 border border-slate-600/50 text-slate-300"
                >
                  <span>{getSignalIcon(signal)}</span>
                  {signal}
                </span>
              ))}
              {company.signals.length > 3 && (
                <span className="text-xs px-2 py-1 rounded-full bg-slate-700/30 border border-slate-600/50 text-slate-400">
                  +{company.signals.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <span className="text-xs text-slate-500 capitalize">
              via {company.signalSource}
            </span>
            <span className="text-xs font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
