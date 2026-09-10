const PITCHDB_API = "https://api.pitchdb.com/v1"

export async function fetchPitchDBCompanies(): Promise<any[]> {
  try {
    const response = await fetch(
      `${PITCHDB_API}/companies?recent_funding=true&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PITCHDB_API_KEY || ""}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`PitchDB API failed: ${response.status}`)
    }

    const data = await response.json()

    return data.companies.map((c: any) => ({
      name: c.name,
      website: c.website,
      industry: c.industry,
      stage: c.stage,
      description: c.pitch || c.description,
      signals: ["recently_funded"],
      signalSource: "pitchdb"
    }))
  } catch (error) {
    console.error("PitchDB fetch error:", error)
    throw error
  }
}
