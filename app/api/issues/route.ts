import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const session = await getServerSession(authOptions)
  
  // Check if user is an admin
  let isAdmin = false
  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })
    isAdmin = user?.role === "ADMIN"
  }

  // Build query filters
  const category = searchParams.get("category")
  const status = searchParams.get("status")
  const sort = searchParams.get("sort") || "newest"
  const page = parseInt(searchParams.get("page") || "1")
  const showAll = searchParams.get("showAll") === "true" && isAdmin // Only admins can see all issues
  const limit = 10
  const skip = (page - 1) * limit

  // Filter conditions
  const where: any = {}

  // For regular users, only show approved or in-progress issues by default
  if (!showAll && !isAdmin) {
    where.status = {
      in: ["APPROVED", "IN_PROGRESS", "RESOLVED"],
    }
  } else if (status) {
    where.status = status.toUpperCase()
  }

  if (category) {
    where.category = category
  }

  // Sort options
  let orderBy: any = {}
  switch (sort) {
    case "oldest":
      orderBy = { createdAt: "asc" }
      break
    case "priority":
      orderBy = [{ priority: "desc" }, { createdAt: "desc" }]
      break
    case "status":
      orderBy = [{ status: "asc" }, { createdAt: "desc" }]
      break
    default:
      orderBy = { createdAt: "desc" }
  }

  try {
    const issues = await prisma.issue.findMany({
      where,
      orderBy,
      skip,
      take: limit,
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

    return NextResponse.json(issues)
  } catch (error) {
    console.error("Error fetching issues:", error)
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 })
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

