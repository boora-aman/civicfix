import prisma from "@/lib/prisma"

// Get all issues with filtering and sorting
export async function getIssues(options: {
  category?: string
  status?: string
  priority?: string
  sort?: string
  search?: string
}) {
  try {
    const { category, status, priority, sort, search } = options

    // Build filter conditions
    const where: any = {}

    if (category && category !== "all") {
      where.category = category
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase()
    }

    if (priority && priority !== "all") {
      where.priority = priority.toUpperCase()
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ]
    }

    // Build sort options
    let orderBy: any = { createdAt: "desc" }

    if (sort === "oldest") {
      orderBy = { createdAt: "asc" }
    } else if (sort === "priority") {
      orderBy = [{ priority: "desc" }, { createdAt: "desc" }]
    } else if (sort === "status") {
      orderBy = [{ status: "asc" }, { createdAt: "desc" }]
    }

    const issues = await prisma.issue.findMany({
      where,
      orderBy,
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

    return issues
  } catch (error) {
    console.error("Error fetching issues:", error)
    return []
  }
}

// Get featured issues
export async function getFeaturedIssues() {
  try {
    const issues = await prisma.issue.findMany({
      where: {
        OR: [{ priority: "URGENT" }, { priority: "HIGH" }],
        status: {
          in: ["APPROVED", "IN_PROGRESS"],
        },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 3,
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
      },
    })

    return issues
  } catch (error) {
    console.error("Error fetching featured issues:", error)
    return []
  }
}

// Get a single issue by ID
export async function getIssueById(id: string) {
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

    return issue
  } catch (error) {
    console.error("Error fetching issue:", error)
    return null
  }
}

// Get issues reported by a specific user
export async function getUserIssues(userId: string) {
  try {
    const issues = await prisma.issue.findMany({
      where: { userId },
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

    return issues
  } catch (error) {
    console.error("Error fetching user issues:", error)
    return []
  }
}

