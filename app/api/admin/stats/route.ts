import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Helper function to convert priority to numerical value for chart display
function getPriorityLevel(priority: string): number {
  switch (priority) {
    case "URGENT":
      return 5;
    case "HIGH":
      return 4;
    case "MEDIUM":
      return 3;
    case "LOW":
      return 2;
    default:
      return 1;
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all issues with their votes and categories
    const issues = await prisma.issue.findMany({
      include: {
        upvotes: true,
      },
    })

    // Calculate category distribution
    const categoryDistribution = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate priority vs votes
    const priorityVotes = issues.reduce((acc, issue) => {
      acc[issue.priority] = (acc[issue.priority] || 0) + issue.upvotes.length
      return acc
    }, {} as Record<string, number>)

    // Calculate priority distribution
    const priorityDistribution = issues.reduce((acc, issue) => {
      acc[issue.priority] = (acc[issue.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate monthly trends
    const monthlyTrends = issues.reduce((acc, issue) => {
      const month = new Date(issue.createdAt).toLocaleString('default', { month: 'short' })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      categoryDistribution,
      priorityVotes,
      priorityDistribution,
      monthlyTrends,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 