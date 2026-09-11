import { prisma } from "@/lib/prisma"
import { createReadStream } from "fs"
import { parse } from "csv-parse"

async function main() {
  console.log("Starting seed...")

  const records: any[] = []

  const parser = createReadStream("./src/data/seed_companies.csv").pipe(
    parse({
      columns: true,
      skip_empty_lines: true
    })
  )

  for await (const record of parser) {
    records.push(record)
  }

  console.log(`Importing ${records.length} companies...`)

  for (const record of records) {
    const intentScore = calculateScore(
      record.isHiring === "true",
      record.stage,
      parseInt(record.teamSize)
    )

    await prisma.company.upsert({
      where: { name: record.name },
      create: {
        name: record.name,
        website: record.website,
        industry: record.industry,
        stage: record.stage,
        headcount: parseInt(record.teamSize),
        description: record.description,
        signals: record.isHiring === "true" ? ["hiring_sales", "growth"] : ["growth"],
        signalSource: "seed",
        intentScore: intentScore,
        confidence: 0.85,
        keyInsights: `${record.stage} stage ${record.industry} company with ${record.teamSize} people`,
        scoringReasoning: `Scored based on: Stage (${record.stage}), Team size (${record.teamSize}), Hiring status (${record.isHiring})`,
        detectedAt: new Date()
      },
      update: {}
    })
  }

  console.log(`Successfully seeded ${records.length} companies`)
}

function calculateScore(isHiring: boolean, stage: string, teamSize: number): number {
  let score = 40

  if (stage === "Series A" || stage === "Series B") score += 30
  if (stage === "Seed") score += 15
  if (isHiring) score += 25
  if (teamSize > 30) score += 10

  return Math.min(score, 100)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })