import Link from "next/link"

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
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-text-tertiary"
    if (s >= 60) return "text-text-primary"
    if (s >= 40) return "text-text-secondary"
    return "text-text-secondary"
  }

  const primarySignal = company.signals[0]?.replace(/_/g, " ")
  const extraSignals = company.signals.length - 1

  return (
    <Link
      href={`/company/${company.id}`}
      className="group flex items-center gap-4 px-5 py-4 border-b border-border-default hover:bg-surface-muted transition-colors duration-instant focus-visible:bg-surface-muted"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-text-primary font-medium truncate">
            {company.name}
          </h3>
          {company.stage && (
            <span className="text-xs text-text-secondary border border-border-default rounded-xs px-2 py-0.5 shrink-0">
              {company.stage}
            </span>
          )}
        </div>
        <p className="text-sm text-text-secondary truncate mt-1">
          {company.industry || "Industry unknown"}
          {primarySignal && ` · ${primarySignal}`}
          {extraSignals > 0 && ` +${extraSignals} more`}
        </p>
      </div>

      <div className="text-right shrink-0">
        <div className={`text-lg font-semibold ${getScoreColor(company.intentScore)}`}>
          {company.intentScore}
        </div>
        <div className="text-xs text-text-secondary">via {company.signalSource}</div>
      </div>

      <span
        aria-hidden="true"
        className="text-text-secondary group-hover:text-text-tertiary transition-colors duration-instant"
      >
        →
      </span>
    </Link>
  )
}
