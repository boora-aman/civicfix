import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import prisma from "@/lib/prisma"

// Admin registration key - in a real app, this should be stored in environment variables
const ADMIN_REGISTRATION_KEY = "CIVIC-ADMIN-2024"

export async function POST(request: Request) {
  try {
    const { name, email, password, adminKey } = await request.json()

    // Validate input
    if (!name || !email || !password || !adminKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify admin key
    if (adminKey !== ADMIN_REGISTRATION_KEY) {
      return NextResponse.json({ error: "Invalid admin key" }, { status: 403 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN", // Set role to ADMIN
      },
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error registering admin user:", error)
    return NextResponse.json({ error: "Failed to register admin user" }, { status: 500 })
  }
} 