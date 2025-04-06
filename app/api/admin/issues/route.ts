import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const issues = await prisma.issue.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
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

    // Format the issues to include reportedBy field
    const formattedIssues = issues.map((issue) => ({
      ...issue,
      reportedBy: issue.user?.name || "Anonymous",
      upvotes: issue._count.upvotes,
      comments: issue._count.comments,
    }))

    return NextResponse.json(formattedIssues)
  } catch (error) {
    console.error("Error fetching admin issues:", error)
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 })
  }
}

