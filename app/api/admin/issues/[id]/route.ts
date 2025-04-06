import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// GET a single issue for admin
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const id = params.id

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

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        images: true,
        updates: {
          orderBy: {
            createdAt: "desc",
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

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    return NextResponse.json(issue)
  } catch (error) {
    console.error("Error fetching issue:", error)
    return NextResponse.json({ error: "Failed to fetch issue" }, { status: 500 })
  }
}

// PATCH to update issue status and priority
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const id = params.id

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

    const { status, priority, note } = await request.json()

    // Validate input
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Check if issue exists
    const issue = await prisma.issue.findUnique({
      where: { id },
    })

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    // Update issue status and priority if provided
    const updateData: any = { status }
    if (priority) updateData.priority = priority

    // Update the issue
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: updateData,
    })

    // Create update history entry
    await prisma.update.create({
      data: {
        status,
        note: note || `Status updated to ${status}${priority ? ` with ${priority} priority` : ''}`,
        issue: {
          connect: { id },
        },
      },
    })

    return NextResponse.json(updatedIssue)
  } catch (error) {
    console.error("Error updating issue:", error)
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 })
  }
} 