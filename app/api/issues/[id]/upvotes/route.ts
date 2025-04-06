import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const issueId = await Promise.resolve(params.id)
  const session = await getServerSession(authOptions)

  try {
    // Count total upvotes
    const count = await prisma.upvote.count({
      where: { issueId },
    })

    // Check if current user has upvoted
    let hasUpvoted = false

    if (session?.user) {
      const upvote = await prisma.upvote.findUnique({
        where: {
          issueId_userId: {
            issueId,
            userId: session.user.id,
          },
        },
      })

      hasUpvoted = !!upvote
    }

    return NextResponse.json({ count, hasUpvoted })
  } catch (error) {
    console.error("Error fetching upvotes:", error)
    return NextResponse.json({ error: "Failed to fetch upvotes" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const issueId = await Promise.resolve(params.id)

  try {
    // Check if issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
    })

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    // Check if user has already upvoted
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        issueId_userId: {
          issueId,
          userId: session.user.id,
        },
      },
    })

    if (existingUpvote) {
      return NextResponse.json({ error: "You have already upvoted this issue" }, { status: 400 })
    }

    // Create upvote
    await prisma.upvote.create({
      data: {
        issue: {
          connect: { id: issueId },
        },
        user: {
          connect: { id: session.user.id },
        },
      },
    })

    // Get updated count
    const count = await prisma.upvote.count({
      where: { issueId },
    })

    return NextResponse.json({ count, hasUpvoted: true })
  } catch (error) {
    console.error("Error upvoting issue:", error)
    return NextResponse.json({ error: "Failed to upvote issue" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const issueId = await Promise.resolve(params.id)

  try {
    // Delete upvote
    await prisma.upvote.delete({
      where: {
        issueId_userId: {
          issueId,
          userId: session.user.id,
        },
      },
    })

    // Get updated count
    const count = await prisma.upvote.count({
      where: { issueId },
    })

    return NextResponse.json({ count, hasUpvoted: false })
  } catch (error) {
    console.error("Error removing upvote:", error)
    return NextResponse.json({ error: "Failed to remove upvote" }, { status: 500 })
  }
}

