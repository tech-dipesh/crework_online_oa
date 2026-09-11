import { NextRequest, NextResponse } from "next/server"
import { ingestCompanies } from "@/lib/ingest"

export async function POST(_request: NextRequest) {
  try {
    console.log("📡 Ingestion API called")
    const results = await ingestCompanies()
    return NextResponse.json({
      ...results,
      success: true
    })
  } catch (error) {
    console.error("Ingestion API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Ingestion failed"
      },
      { status: 500 }
    )
  }
}
