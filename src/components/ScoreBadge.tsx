interface ScoreBadgeProps {
  score: number
  confidence?: number
}

export function ScoreBadge({ score, confidence = 0.8 }: ScoreBadgeProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "#ff4c00"
    if (s >= 60) return "#fafafa"
    if (s >= 40) return "#bdbdbd"
    return "#6b6b6b"
  }

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "High intent"
    if (s >= 60) return "Medium-high intent"
    if (s >= 40) return "Medium intent"
    return "Low intent"
  }

  const ringColor = getScoreColor(score)
  const circumference = 226.2

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-20 h-20 shrink-0">
        <svg
          className="-rotate-90 w-20 h-20"
          viewBox="0 0 80 80"
          role="img"
          aria-label={`Intent score ${score} out of 100`}
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#262626"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={ringColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
            style={{ transition: "stroke-dasharray var(--duration-fast) ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary leading-none">
              {score}
            </div>
            <div className="text-xs text-text-secondary mt-1">/ 100</div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium" style={{ color: ringColor }}>
          {getScoreLabel(score)}
        </div>
        <div className="text-xs text-text-secondary mt-1">
          {Math.round(confidence * 100)}% confidence
        </div>
      </div>
    </div>
  )
}
