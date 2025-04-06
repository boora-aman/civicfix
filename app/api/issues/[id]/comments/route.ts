import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const issueId = await Promise.resolve(params.id)

  try {
    const comments = await prisma.comment.findMany({
      where: { issueId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const issueId = await Promise.resolve(params.id)
  const { content } = await request.json()

  if (!content || content.trim() === "") {
    return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
  }

  try {
    // Check if issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
    })

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        issue: {
          connect: { id: issueId },
        },
        user: {
          connect: { id: session.user.id },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}

