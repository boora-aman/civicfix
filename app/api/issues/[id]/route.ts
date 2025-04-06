import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
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
        images: {
          select: {
            id: true,
            url: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        updates: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            upvotes: true,
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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = params.id
  const body = await request.json()
  const { status, priority, note } = body

  try {
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can update issue status" }, { status: 403 })
    }

    // Update the issue
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: {
        status: status ? status.toUpperCase() : undefined,
        priority: priority ? priority.toUpperCase() : undefined,
        updatedAt: new Date(),
      },
    })

    // Create status update record if status changed
    if (status) {
      await prisma.update.create({
        data: {
          status: status.toUpperCase(),
          note: note || `Status updated to ${status}`,
          issue: {
            connect: { id },
          },
        },
      })
    }

    return NextResponse.json(updatedIssue)
  } catch (error) {
    console.error("Error updating issue:", error)
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = params.id

  try {
    // Check if user is admin or the issue creator
    const issue = await prisma.issue.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (user?.role !== "ADMIN" && issue.userId !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to delete this issue" }, { status: 403 })
    }

    // Delete the issue (cascade will delete related records)
    await prisma.issue.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting issue:", error)
    return NextResponse.json({ error: "Failed to delete issue" }, { status: 500 })
  }
}

