import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const querySchema = z.object({
  sortBy: z.enum(["intentScore", "detectedAt", "name"]).default("intentScore"),
  minScore: z.string().transform((val) => {
    const num = parseInt(val, 10)
    return isNaN(num) ? 0 : Math.max(0, Math.min(100, num))
  }).default(0),
  industry: z.string().optional(),
  limit: z.string().transform((val) => {
    const num = parseInt(val, 10)
    return isNaN(num) ? 100 : Math.min(num, 500)
  }).default(100)
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryParams = Object.fromEntries(searchParams.entries())

    const validation = querySchema.safeParse(queryParams)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: z.flattenError(validation.error)
        },
        { status: 400 }
      )
    }

    const { sortBy, minScore, industry, limit } = validation.data

    const whereClause: any = {
      intentScore: {
        gte: minScore
      }
    }

    if (industry) {
      whereClause.industry = {
        contains: industry,
        mode: "insensitive"
      }
    }

    const orderByClause: any = {}
    orderByClause[sortBy] = sortBy === "intentScore" ? "desc" : "desc"

    const companies = await prisma.company.findMany({
      where: whereClause,
      orderBy: orderByClause,
      take: limit,
      select: {
        id: true,
        name: true,
        website: true,
        industry: true,
        stage: true,
        headcount: true,
        signals: true,
        intentScore: true,
        confidence: true,
        keyInsights: true,
        scoringReasoning: true,
        detectedAt: true
      }
    })

    return NextResponse.json(companies, {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch companies",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}