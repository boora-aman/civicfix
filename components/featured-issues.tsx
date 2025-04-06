"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { Issue } from "@/types/issue"
import { getPriorityColor, formatDate } from "@/lib/utils"

export default function FeaturedIssues() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedIssues() {
      try {
        const response = await fetch("/api/issues/featured")
        if (response.ok) {
          const data = await response.json()
          setIssues(data)
        }
      } catch (error) {
        console.error("Error fetching featured issues:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedIssues()
  }, [])

  // Fallback to mock data if API fails or during development
  useEffect(() => {
    if (!loading && issues.length === 0) {
      // Mock data for featured issues
      const mockIssues = [
        {
          id: "1",
          title: "Large Pothole on Main Street",
          description: "Deep pothole causing traffic hazards near the intersection with Oak Avenue",
          location: "Main St & Oak Ave",
          category: "Pothole",
          priority: "High",
          status: "In Progress",
          createdAt: new Date("2023-11-15T10:30:00Z").toISOString(),
          images: [{ url: "/placeholder.svg?height=200&width=300" }],
        },
        {
          id: "2",
          title: "Broken Sidewalk",
          description: "Cracked and uneven sidewalk creating accessibility issues",
          location: "123 Elm Street",
          category: "Sidewalk",
          priority: "Medium",
          status: "Approved",
          createdAt: new Date("2023-11-10T14:45:00Z").toISOString(),
          images: [{ url: "/placeholder.svg?height=200&width=300" }],
        },
        {
          id: "3",
          title: "Street Light Outage",
          description: "Multiple street lights not working, creating safety concerns at night",
          location: "Pine Avenue",
          category: "Lighting",
          priority: "Urgent",
          status: "Approved",
          createdAt: new Date("2023-11-18T09:15:00Z").toISOString(),
          images: [{ url: "/placeholder.svg?height=200&width=300" }],
        },
      ] as Issue[]

      setIssues(mockIssues)
    }
  }, [loading, issues])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video w-full bg-muted animate-pulse" />
            <CardHeader className="p-4">
              <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="h-4 bg-muted animate-pulse rounded w-full" />
              <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-9 bg-muted animate-pulse rounded w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {issues.map((issue) => (
        <Card key={issue.id} className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={issue.images?.[0]?.url || "/placeholder.svg?height=200&width=300"}
              alt={issue.title}
              className="object-cover w-full h-full"
            />
          </div>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{issue.title}</CardTitle>
              <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{issue.description}</p>
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{issue.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Reported on {formatDate(issue.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Status: {issue.status}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/issues/${issue.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

