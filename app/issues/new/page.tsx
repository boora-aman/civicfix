"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export default function NewIssuePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/issues/new")
    }
  }, [status, router])

  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      setImages((prev) => [...prev, ...newImages].slice(0, 5)) // Limit to 5 images
    }
  }

  // Remove an image
  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(prev[index].preview)
      return updated
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Upload images first if there are any
      let imageUrls: string[] = []
      if (images.length > 0) {
        const imageFormData = new FormData()
        images.forEach((img) => {
          imageFormData.append("files", img.file)
        })

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        })

        if (!uploadRes.ok) {
          throw new Error("Failed to upload images")
        }

        const uploadData = await uploadRes.json()
        imageUrls = uploadData.urls
      }

      // Create the issue with form data and image URLs
      const issueData = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        priority: formData.get("priority"),
        location: formData.get("location"),
        city: formData.get("city"),
        state: formData.get("state"),
        zip: formData.get("zip"),
        locationDetails: formData.get("locationDetails"),
        imageUrls,
      }

      const res = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issueData),
      })

      if (!res.ok) {
        throw new Error("Failed to create issue")
      }

      const data = await res.json()

      toast({
        title: "Success!",
        description: "Your issue has been submitted for review.",
      })

      // Redirect to the issue page
      router.push(`/issues/${data.id}`)
    } catch (error) {
      console.error("Error submitting issue:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your issue. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="h-8 bg-muted animate-pulse rounded w-64 mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-full" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 bg-muted animate-pulse rounded w-24" />
                  <div className="h-10 bg-muted animate-pulse rounded w-full" />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <div className="h-9 bg-muted animate-pulse rounded w-full" />
            </CardFooter>
          </Card>
        </div>
      </main>
    )
  }

  if (!session?.user) {
    return null // Return null while redirecting
  }

  return (
    <main className="flex-1 container py-10">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/issues">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Issues
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Report a New Issue</CardTitle>
            <CardDescription>Provide details about the infrastructure problem you've noticed</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input id="title" name="title" placeholder="E.g., Pothole on Main Street" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the issue in detail. Include size, severity, and any safety concerns."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Damaged Playground Equipment">Damaged Playground Equipment</SelectItem>
                        <SelectItem value="Pothole on Main Street">Pothole on Main Street</SelectItem>
                        <SelectItem value="Broken Street Light">Broken Street Light</SelectItem>
                        <SelectItem value="Overflowing Trash Bin">Overflowing Trash Bin</SelectItem>
                        <SelectItem value="Graffiti on Public Library">Graffiti on Public Library</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" required>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <Input id="location" name="location" placeholder="Enter address or GPS coordinates" required />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" placeholder="City" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" placeholder="State" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input id="zip" name="zip" placeholder="Zip Code" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locationDetails">Specific Location Details</Label>
                  <Textarea
                    id="locationDetails"
                    name="locationDetails"
                    placeholder="Provide additional details about the exact location (e.g., 'Near the corner of Main St and 5th Ave', 'Behind the community center')"
                    className="min-h-[80px]"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Images (Optional)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-background"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload up to 5 images. Supported formats: JPG, PNG, GIF. Max size: 5MB per image.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Issue"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}

