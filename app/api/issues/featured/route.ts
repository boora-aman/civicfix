import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const featuredIssues = await prisma.issue.findMany({
      where: {
        status: {
          in: ["APPROVED", "IN_PROGRESS"],
        },
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
      take: 6,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
          },
        },
        _count: {
          select: {
            upvotes: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json(featuredIssues)
  } catch (error) {
    console.error("Error fetching featured issues:", error)
    return NextResponse.json({ error: "Failed to fetch featured issues" }, { status: 500 })
  }
}

