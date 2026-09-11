import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params ?? {};
  try {
    if (!id) {
      return NextResponse.json(
        { error: "Id not found" },
        { status: 404 }
      )

    }
    const company = await prisma.company.findUnique({
      where: {id}
    })

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error("Company fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    )
  }
}
