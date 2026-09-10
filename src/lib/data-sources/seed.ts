import { parse } from "csv-parse/sync"
import { readFileSync } from "fs"
import { join } from "path"

export async function loadSeedCompanies(): Promise<any[]> {
  try {
    const csvPath = join(process.cwd(), "data", "seed_companies.csv")
    const fileContent = readFileSync(csvPath, "utf-8")

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    })

    return records.map((row: any) => ({
      name: row.name,
      website: row.website,
      industry: row.industry,
      stage: row.stage,
      description: row.description,
      signals: row.signals.split("|").map((s: string) => s.trim()),
      signalSource: "seed"
    }))
  } catch (error) {
    console.error("Seed data load error:", error)
    throw error
  }
}
