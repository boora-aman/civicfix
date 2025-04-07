import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sort = searchParams.get("sort") || "newest"
    const status = searchParams.get("status") || "all"
    const category = searchParams.get("category") || "all"

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status !== "all") {
      where.status = status
    }
    if (category !== "all") {
      where.category = category
    }

    // Get total count for pagination
    const total = await prisma.issue.count({ where })

    // Get issues with relations
    const issues = await prisma.issue.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        upvotes: true,
        comments: true,
        _count: {
          select: {
            upvotes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: sort === "newest" ? "desc" : "asc",
      },
      skip,
      take: limit,
    })

    return NextResponse.json({
      issues,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching issues:", error)
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, location, city, state, zip, category, priority, locationDetails, imageUrls } = body

    // Validate required fields
    if (!title || !description || !location || !city || !state || !zip || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the issue
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        location,
        city,
        state,
        zip,
        category,
        priority: priority ? priority.toUpperCase() : "MEDIUM",
        status: "PENDING", // All new issues start as pending for admin review
        user: {
          connect: { id: session.user.id },
        },
      },
    })

    // Add images if provided
    if (imageUrls && imageUrls.length > 0) {
      await prisma.image.createMany({
        data: imageUrls.map((url: string) => ({
          url,
          issueId: issue.id,
        })),
      })
    }

    // Create initial status update
    await prisma.update.create({
      data: {
        status: "PENDING",
        note: "Issue submitted and pending admin approval",
        issue: {
          connect: { id: issue.id },
        },
      },
    })

    return NextResponse.json(issue)
  } catch (error) {
    console.error("Error creating issue:", error)
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 })
  }
}

