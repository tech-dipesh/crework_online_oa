import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ScoreBadge } from "@/components/ScoreBadge"

interface PageParams {
  params: Promise<{
    id: string
  }>
}

export default async function CompanyDetailPage({ params }: PageParams) {
  const {id}=await params
  const company = await prisma.company.findUnique({
    where: {id}
  })

  if (!company) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <div className="max-w-3xl mx-auto px-5 py-8">
        <Link
          href="/"
          className="inline-block text-sm text-text-secondary hover:text-text-tertiary transition-colors duration-instant mb-8"
        >
          ← Back to dashboard
        </Link>

        <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-border-default">
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-text-primary">
              {company.name}
            </h1>

            <div className="flex flex-wrap gap-2 mt-3">
              {company.industry && (
                <span className="text-xs text-text-secondary border border-border-default rounded-xs px-2 py-1">
                  {company.industry}
                </span>
              )}
              {company.stage && (
                <span className="text-xs text-text-secondary border border-border-default rounded-xs px-2 py-1">
                  {company.stage}
                </span>
              )}
              {company.headcount && (
                <span className="text-xs text-text-secondary border border-border-default rounded-xs px-2 py-1">
                  ~{company.headcount} people
                </span>
              )}
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-text-tertiary hover:underline mt-4"
              >
                Visit website →
              </a>
            )}
          </div>

          <ScoreBadge score={company.intentScore} confidence={company.confidence || 0.8} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-sm font-medium text-text-primary mb-2">Overview</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {company.description || "No description available."}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-text-primary mb-2">Detected signals</h2>
            <ul className="space-y-2">
              {company.signals.map((signal, i) => (
                <li
                  key={i}
                  className="text-sm text-text-secondary px-3 py-2 border border-border-default rounded-xs capitalize"
                >
                  {signal.replace(/_/g, " ")}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-8 p-5 border border-border-default rounded-xs">
          <h2 className="text-sm font-medium text-text-primary mb-2">Why this score</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {company.scoringReasoning || "No reasoning available."}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-text-secondary mb-1">Confidence</div>
              <div className="text-lg font-semibold text-text-tertiary">
                {Math.round((company.confidence || 0.8) * 100)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-text-secondary mb-1">Key insight</div>
              <div className="text-sm text-text-secondary">
                {company.keyInsights || "No additional insights."}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-border-default">
          <div>
            <div className="text-xs text-text-secondary mb-1">Source</div>
            <div className="text-sm text-text-primary capitalize font-medium">
              {company.signalSource}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Detected</div>
            <div className="text-sm text-text-primary font-medium">
              {new Date(company.detectedAt).toLocaleDateString()}
            </div>
          </div>
          {company.lastEnrichedAt && (
            <div>
              <div className="text-xs text-text-secondary mb-1">Last updated</div>
              <div className="text-sm text-text-primary font-medium">
                {new Date(company.lastEnrichedAt).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
