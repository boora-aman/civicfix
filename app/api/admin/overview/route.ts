import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Priority colors for consistent display
const PRIORITY_COLORS = {
  URGENT: "#ef4444", // red
  HIGH: "#f97316",   // orange
  MEDIUM: "#eab308", // yellow
  LOW: "#22c55e",    // green
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

    // Get total issues count
    const totalIssues = await prisma.issue.count()

    // Get issues by status
    const issuesByStatus = await prisma.issue.groupBy({
      by: ["status"],
      _count: true,
    })

    // Get issues by priority
    const issuesByPriority = await prisma.issue.groupBy({
      by: ["priority"],
      _count: true,
    })

    // Format the response
    const stats = {
      totalIssues,
      pending: issuesByStatus.find((s) => s.status === "PENDING")?._count || 0,
      inProgress: issuesByStatus.find((s) => s.status === "IN_PROGRESS")?._count || 0,
      resolved: issuesByStatus.find((s) => s.status === "RESOLVED")?._count || 0,
      rejected: issuesByStatus.find((s) => s.status === "REJECTED")?._count || 0,
      approved: issuesByStatus.find((s) => s.status === "APPROVED")?._count || 0,
      priorityDistribution: issuesByPriority.map((p) => ({
        name: p.priority,
        value: p._count,
        color: PRIORITY_COLORS[p.priority as keyof typeof PRIORITY_COLORS],
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin overview:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin overview" },
      { status: 500 }
    )
  }
} 