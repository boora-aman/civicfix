import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { v4 as uuidv4 } from "uuid"
import { writeFile } from "fs/promises"
import path from "path"
import { mkdir } from "fs/promises"

// Ensure upload directory exists
const createUploadDir = async () => {
  const uploadDir = path.join(process.cwd(), "public/uploads")
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (error) {
    console.error("Error creating upload directory:", error)
  }
  return uploadDir
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const uploadDir = await createUploadDir()

    const uploadPromises = files.map(async (file) => {
      // Generate unique file name
      const fileExtension = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExtension}`
      const filePath = path.join(uploadDir, fileName)

      // Convert file to buffer and save to local filesystem
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)

      // Return the URL to the uploaded file (relative to public directory)
      return `/uploads/${fileName}`
    })

    const uploadedUrls = await Promise.all(uploadPromises)

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}

