interface ScoreBadgeProps {
  score: number
  confidence?: number
}

export function ScoreBadge({ score, confidence = 0.8 }: ScoreBadgeProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "from-emerald-500 to-teal-600"
    if (s >= 60) return "from-amber-500 to-orange-600"
    if (s >= 40) return "from-cyan-500 to-blue-600"
    return "from-slate-500 to-slate-600"
  }

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "High Intent"
    if (s >= 60) return "Medium-High"
    if (s >= 40) return "Medium"
    return "Low"
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-20 h-20">
        <svg className="transform -rotate-90 w-20 h-20" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="4"
            strokeDasharray={`${(score / 100) * 226.2} 226.2`}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{score}</div>
            <div className="text-xs text-slate-400">/ 100</div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div
          className={`text-sm font-semibold bg-linear-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}
        >
          {getScoreLabel(score)}
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {Math.round(confidence * 100)}% confident
        </div>
      </div>
    </div>
  )
}
