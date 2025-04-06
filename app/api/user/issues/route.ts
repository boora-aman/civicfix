import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const issues = await prisma.issue.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
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

    return NextResponse.json(issues)
  } catch (error) {
    console.error("Error fetching user issues:", error)
    return NextResponse.json({ error: "Failed to fetch user issues" }, { status: 500 })
  }
}

