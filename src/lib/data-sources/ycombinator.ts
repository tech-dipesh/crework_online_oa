export async function fetchYCombinatorCompanies(): Promise<any[]> {
  try {
    console.log(" Fetching YCombinator companies...")

    const response = await fetch(
      "https://yc-oss.github.io/api/companies/top.json"
    )
    if (!response.ok) {
      throw new Error(`YC API failed: ${response.status}`)
    }

    const companies = await response.json()

    return companies.map((company: any) => ({
      name: company.name,
      website: company.website,
      industry: company.industry,
      stage: company.stage || "Unknown",
      headcount: company.team_size,
      description: company.long_description || company.one_liner || "",
      signals: company.isHiring
        ? ["recently_funded", "hiring_sales"]
        : ["recently_funded"],
      signalSource: "ycombinator"
    }))
  } catch (error) {
    console.error("YCombinator API fetch error:", error)
    throw error
  }
}
