const GROK_API_KEY = process.env.GROK_API_KEY

interface CompanyData {
  name: string
  website?: string
  industry?: string
  stage?: string
  description?: string
  signals: string[]
}

interface ScoredCompany {
  intentScore: number
  reasoning: string
  confidence: number
  keyInsights: string
}

export async function scoreCompanyWithGrok(
  company: CompanyData
): Promise<ScoredCompany> {
  const prompt = `You are a sales intelligence expert. Score this company's likelihood to buy outbound/sales appointment-setting services.

Company: ${company.name}
Website: ${company.website || "Unknown"}
Industry: ${company.industry || "Unknown"}
Stage: ${company.stage || "Unknown"}
Description: ${company.description || "No description"}
Signals Detected: ${company.signals.join(", ")}

Provide a JSON response ONLY (no markdown, no explanation):
{
  "intentScore": <number 0-100>,
  "reasoning": "<2-3 sentence explanation of why this score>",
  "confidence": <number 0-1>,
  "keyInsights": "<key insight about why they'd buy>"
}

Scoring logic:
- 80-100: High intent (multiple growth signals, actively hiring sales team)
- 60-79: Medium-high intent (recent funding OR hiring SDRs)
- 40-59: Medium intent (some growth signals but unclear fit)
- 20-39: Low-medium intent (weak signals)
- 0-19: Low intent (no relevant signals)`

  try {
    const response = await fetch("https://api.x.ai/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.content?.[0]?.text || ""

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error(`Failed to parse Grok response: ${responseText}`)
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      intentScore: Math.min(100, Math.max(0, parsed.intentScore)),
      reasoning: parsed.reasoning,
      confidence: Math.min(1, Math.max(0, parsed.confidence)),
      keyInsights: parsed.keyInsights
    }
  } catch (error) {
    console.error("Grok scoring error:", error)
    throw error
  }
}
