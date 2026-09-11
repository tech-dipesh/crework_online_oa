import { prisma } from "./prisma"
import { scoreCompanyWithGrok } from "./grok"
import { loadSeedCompanies } from "./data-sources/seed"
import { fetchYCombinatorCompanies } from "./data-sources/ycombinator"

export async function ingestCompanies() {

  let companies = []

  try {
    const pitchdbCompanies = await fetchYCombinatorCompanies()
    companies = companies.concat(pitchdbCompanies)
    console.log(`✓ Got ${pitchdbCompanies.length} from PitchDB`)
  } catch (error) {
    console.warn(" PitchDB failed, falling back to seed data:", error)
    const seedCompanies = await loadSeedCompanies()
    companies = companies.concat(seedCompanies)
  }

  console.log(` Scoring ${companies.length} companies with Grok...`)

  let successCount = 0
  let failureCount = 0

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i]
    try {
      const scored = await scoreCompanyWithGrok(company)

      await prisma.company.upsert({
        where: { name: company.name },
        update: {
          intentScore: scored.intentScore,
          scoringReasoning: scored.reasoning,
          confidence: scored.confidence,
          keyInsights: scored.keyInsights,
          lastEnrichedAt: new Date()
        },
        create: {
          name: company.name,
          website: company.website,
          industry: company.industry,
          stage: company.stage,
          description: company.description,
          signals: company.signals,
          signalSource: company.signalSource,
          intentScore: scored.intentScore,
          scoringReasoning: scored.reasoning,
          confidence: scored.confidence,
          keyInsights: scored.keyInsights
        }
      })

      successCount++
      console.log(`[${i + 1}/${companies.length}] ✓ ${company.name}`)
    } catch (error) {
      failureCount++
      console.error(`[${i + 1}/${companies.length}] ✗ ${company.name}:`, error)
    }
  }

  const total = await prisma.company.count()
  console.log(
    `\n Ingestion complete. Success: ${successCount}, Failed: ${failureCount}, Total in DB: ${total}`
  )

  return { success: true, totalCompanies: total, successCount, failureCount }
}
