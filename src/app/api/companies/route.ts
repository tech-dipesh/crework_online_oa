import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get("sortBy") || "intentScore"
    const filterScore = searchParams.get("minScore")
      ? parseInt(searchParams.get("minScore") || "0")
      : 0
    const industry = searchParams.get("industry")

    const companies = await prisma.company.findMany({
      where: {
        intentScore: { gte: filterScore },
        ...(industry && {
          industry: {
            contains: industry,
            mode: "insensitive"
          }
        })
      },
      orderBy: {
        [sortBy]: sortBy === "detectedAt" ? "desc" : "desc"
      },
      take: 100
    })
    return NextResponse.json(companies)
  } catch (error) {
    console.error("Companies fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    )
  }
}
